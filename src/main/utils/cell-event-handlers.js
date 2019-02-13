import focusOnCell from './focus-on-cell';

export { generateCellInputHandler, generateCellKeydownHandler };

function generateCellInputHandler(row, col) {
  return function handleInput() {

    const input = this.value;
    const inputNum = +this.value;

    // input is bad if it doesn't evaluate to an integer between 1 and 9
    const inputIsBad =
      !Number.isInteger(inputNum)
      || inputNum < 1
      || inputNum > 9;

    // if input is bad, clear input
    if (inputIsBad) {
      this.value = '';
    }

    // if input is good, make sure it has right format and move to next cell
    else {

      // reformat to plain integer (in case something like " 3.0" or "2e0" was copy-pasted)
      this.value = input.trim().slice(0, 1);

      // in case changing a "solution" cell from a prior solve
      this.classList.remove('generated');

      // move to next cell
      if (col !== 8) {
        focusOnCell(row, col + 1);
      }
      else if (row !== 8) {
        focusOnCell(row + 1, 0);
      }
      else {
        focusOnCell(0, 0);
      }
    }
  };
}

function generateCellKeydownHandler(row, col) {
  return function handleKeydown(event) {

    // board navigation controls (and submit if pushed enter)
    switch (event.key) {
      case 'ArrowRight':
      case 'Right':
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
      case 'Backspace':
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
        // prevent browser from incrementing number value
        event.preventDefault();

        if (row !== 0) {
          focusOnCell(row - 1, col);
        } else {
          focusOnCell(8, col);
        }
        break;

      case 'ArrowDown':
      case 'Down':
        // prevent browser from decrementing number value
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
