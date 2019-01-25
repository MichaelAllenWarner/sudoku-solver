setUpBoard();
setUpBadInputWarning();
setUpClearButton();
setUpSubmitButton();
setUpStringEntry();
setUpPermalinkButton();


function setUpBoard() {
  const board = document.querySelector('table');
  for (let i = 0; i < 9; i++) {
    const currRow = board.insertRow(-1);
    for (let j = 0; j < 9; j++) {
      const currCell = currRow.insertCell(-1);
      const rowClass = (i % 3 === 0) ? 'top' : (i % 3 === 2) ? 'bottom' : null;
      const colClass = (j % 3 === 0) ? 'left' : (j % 3 === 2) ? 'right' : null;
      if (rowClass) {
        currCell.classList.add(rowClass);
      }
      if (colClass) {
        currCell.classList.add(colClass);
      }
      const inputBox = document.createElement('input');
      inputBox.classList.add('manualInput');
      inputBox.id = `row${i}col${j}input`;

      // following commented out b/c select() may be problematic on mobile
      // inputBox.addEventListener('focus', function() {
      //   this.select();
      // });
      // inputBox.addEventListener('click', function() {
      //   this.select();
      // });

      // force input to be integer between 1 and 9, move to next cell if good input is entered
      inputBox.addEventListener('input', function () {
        if (!this.value) {
          return;
        }
        if (!Number.isInteger(+this.value) || +this.value < 1 || +this.value > 9) {
          this.value = '';
          this.classList.add('warning');
          return;
        }
        this.classList.remove('generated');
        this.value = this.value.trim().slice(0,1); // in case something like " 3.0" was copy-pasted
        if (j !== 8) {
          document.querySelector(`#row${i}col${j+1}input`).focus();
        }
        else if (i !== 8) {
          document.querySelector(`#row${i+1}col0input`).focus();
        }
        else {
          document.querySelector(`#row0col0input`).focus();
        }
      });

      // board navigation controls:
      inputBox.addEventListener('keyup', function(event) {
        if (event.key === 'ArrowRight' || event.key === 'Right') {
          if (j !== 8) {
            document.querySelector(`#row${i}col${j+1}input`).focus();
          }
          else if (i !== 8) {
            document.querySelector(`#row${i+1}col0input`).focus();
          }
          else {
            document.querySelector(`#row0col0input`).focus();
          }
        }
        if (event.key === 'ArrowLeft' || event.key === 'Left' || event.key === 'Backspace') {
          if (j !== 0) {
            document.querySelector(`#row${i}col${j-1}input`).focus();
          }
          else if (i !== 0) {
            document.querySelector(`#row${i-1}col8input`).focus();
          }
          else {
            document.querySelector(`#row8col8input`).focus();
          }
        }
        if (event.key === 'ArrowUp' || event.key === 'Up') {
          if (i !== 0) {
            document.querySelector(`#row${i-1}col${j}input`).focus();
          } else {
            document.querySelector(`#row8col${j}input`).focus();
          }
        }
        if (event.key === 'ArrowDown' || event.key === 'Down') {
          if (i !== 8) {
            document.querySelector(`#row${i+1}col${j}input`).focus();
          } else {
            document.querySelector(`#row0col${j}input`).focus();
          }
        }
        if (event.key === 'Enter') {
          document.querySelector('#submit').click();
        }
      });
      currCell.appendChild(inputBox);
    }
  }
}

function setUpBadInputWarning() {
  const allInputBoxes = document.querySelectorAll('.manualInput');
  allInputBoxes.forEach(box => {
    box.addEventListener('animationend', function() {
      this.classList.remove('warning'); 
    });
  });
}

function setUpClearButton() {
  document.querySelector('#clear').addEventListener('click', () => {
    const allRows = document.querySelectorAll('tr');
    allRows.forEach(row => {
      row.remove();
    });
    setUpBoard();
    setUpBadInputWarning();
    const stringEntryBox = document.querySelector('#stringEntry');
    stringEntryBox.value = stringEntryBox.defaultValue;
    const solutionStringBox = document.querySelector('#solution');
    solutionStringBox.value = solutionStringBox.defaultValue;
    history.pushState(null, null, window.location.href.split('?')[0]);
    document.querySelector('#permalink').setAttribute('disabled', '');
  });
}

function setUpSubmitButton() {
  const solveWorker = new Worker('js/worker.js');
  document.querySelector('#submit').addEventListener('click', () => {
    const allManualInputs = document.querySelectorAll('.manualInput');
    const inputValArray = [];
    allManualInputs.forEach(input => {
      if (input.value) {
        inputValArray.push(input.value);
      } else {
        inputValArray.push(0);
      }
    });
    const boardString = inputValArray.join('');
    document.querySelector('#stringEntry').value = boardString;
    document.querySelector('#solution').value = 'Loading...';
    solveWorker.postMessage(boardString);
    solveWorker.onmessage = function(event) {
      const solutionArray = event.data;
      if (solutionArray) {
        solutionArray.forEach((cellVal, index) => {
          const inputBox = document.querySelector(`#row${Math.floor(index / 9)}col${index % 9}input`);
          if (!inputBox.value) {
            inputBox.classList.add('generated');
            inputBox.value = cellVal;
          }
        });
        document.querySelector('#solution').value = solutionArray.join('');
      } else {
        document.querySelector('#solution').value = 'There are no solutions.'
      }
      if (location.search.substring(1) !== boardString) {
        history.pushState(null, null, window.location.href.split('?')[0]);
        document.querySelector('#permalink').removeAttribute('disabled');
      }
    }
  });
}

function setUpStringEntry() {
  if (location.search) {
    const stringInput = location.search.substring(1).replace(/[^0-9]/gi, '0');
    if (stringInput.length === 81 && Number.isInteger(+stringInput) && +stringInput >= 0) {
      stringInput.split('').forEach((valToInsert, index) => {
        const cellInputBox = document.querySelector(`#row${Math.floor(index / 9)}col${index % 9}input`);
        cellInputBox.classList.remove('generated');
        cellInputBox.value = (+valToInsert === 0) ? '' : valToInsert;
      });
      document.querySelector('#submit').click();
    } else {
      history.pushState(null, null, window.location.href.split('?')[0]);
    }
  }
  document.querySelector('#stringEntry').addEventListener('input', function() {
    document.querySelector('#permalink').setAttribute('disabled', '');
    history.pushState(null, null, window.location.href.split('?')[0]);
    const stringInput = this.value.replace(/[^0-9]/gi, '0');
    if (stringInput.length === 81 && Number.isInteger(+stringInput) && +stringInput >= 0) {
      stringInput.split('').forEach((valToInsert, index) => {
        this.value = stringInput;
        const cellInputBox = document.querySelector(`#row${Math.floor(index / 9)}col${index % 9}input`);
        cellInputBox.classList.remove('generated');
        cellInputBox.value = (+valToInsert === 0) ? '' : valToInsert;
      });
      document.querySelector('#permalink').removeAttribute('disabled');
    }
  });
  document.querySelector('#stringEntry').addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
      document.querySelector('#submit').click();
    }
  });
  // following commented out b/c select() may be problematic on mobile
  // document.querySelector('#stringEntry').addEventListener('focus', function() {
  //   this.select();
  // });
  // document.querySelector('#stringEntry').addEventListener('click', function() {
  //   this.select();
  // });
  // document.querySelector('#solution').addEventListener('focus', function() {
  //   this.select();
  // });
  // document.querySelector('#solution').addEventListener('click', function() {
  //   this.select();
  // });
}

function setUpPermalinkButton() {
  document.querySelector('#permalink').addEventListener('click', () => {
    const stringInput = document.querySelector('#stringEntry').value.replace(/[^0-9]/gi, '0');
    if (stringInput.length === 81 && Number.isInteger(+stringInput) && +stringInput >= 0) {
      history.pushState(null, null, `?${document.querySelector('#stringEntry').value}`);
    }
  });
}
