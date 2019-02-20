import focusOnCell from './focus-on-cell';

export { generateCellInputHandler, generateCellKeydownHandler, generateCellKeyupHandler };

function generateCellInputHandler(row, col) {
  return function handleInput() {

    const input = this.value;
    const inputNum = +this.value;

    const inputIsBad =
      !Number.isInteger(inputNum)
      || inputNum < 1
      || inputNum > 9;

    if (inputIsBad) {
      this.value = '';
      return;
    }

    // reformat to plain integer (in case something like " 3.0" or "2e0" was copy-pasted)
    this.value = input.trim().slice(0, 1);

    // in case changing a "solution" cell from a prior solve
    this.classList.remove('generated');

    if (col !== 8) {
      focusOnCell(row, col + 1);
    }
    else if (row !== 8) {
      focusOnCell(row + 1, 0);
    }
    else {
      focusOnCell(0, 0);
    }
  };
}

function generateCellKeydownHandler(row, col) {
  return function handleKeydown(event) {

    switch (event.key) {
      case 'ArrowRight':
      case 'Right':
        event.preventDefault();

        if (col !== 8) {
          focusOnCell(row, col + 1);
        }
        else if (row !== 8) {
          focusOnCell(row + 1, 0);
        }
        else {
          focusOnCell(0, 0);
        }
        break;

      case 'ArrowLeft':
      case 'Left':
        event.preventDefault();

        if (col !== 0) {
          focusOnCell(row, col - 1);
        }
        else if (row !== 0) {
          focusOnCell(row - 1, 8);
        }
        else {
          focusOnCell(8, 8);
        }
        break;

      case 'ArrowUp':
      case 'Up':
        event.preventDefault();

        if (row !== 0) {
          focusOnCell(row - 1, col);
        } else {
          focusOnCell(8, col);
        }
        break;

      case 'ArrowDown':
      case 'Down':
        event.preventDefault();

        if (row !== 8) {
          focusOnCell(row + 1, col);
        } else {
          focusOnCell(0, col);
        }
        break;

      case 'Enter': {
        const submit = document.querySelector('#submit');
        submit.click();
        break;
      }
    }
  };
}

function generateCellKeyupHandler(row, col) {
  return function handleKeyup(event) {
    if (event.key === 'Backspace') {
      if (col !== 0) {
        focusOnCell(row, col - 1);
      }
      else if (row !== 0) {
        focusOnCell(row - 1, 8);
      }
      else {
        focusOnCell(8, 8);
      }
    }
  };
}
