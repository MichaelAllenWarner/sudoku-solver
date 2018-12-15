function solve() {
  document.querySelector('#unsolvable').classList.add('hidden');

  class Cell {
    constructor(row, col, box, val) {
      this.row = row;
      this.col = col;
      this.box = box;
      this.val = (val) ? val : null;
      this.possVals = (val) ? [] : [1, 2, 3, 4, 5, 6, 7, 8, 9];
      this.rowTakenNumsContributor = false;
      this.colTakenNumsContributor = false;
      this.boxTakenNumsContributor = false;
    }
    selfUpdate() {
      if (!this.val && this.possVals.length === 1) {
        this.val = this.possVals[0];
        this.possVals.pop();
        document.querySelector(`#row${this.row-1}col${this.col-1}input`).value = this.val; // for testing
      }
    }
    checkForNoPossValsLeft() {
      if (!this.val && this.possVals.length === 0) {
        return true;
      }
    }
  }

  class Group {
    constructor(groupType, num) {
      this.groupType = groupType;
      this.num = num;
      this.takenNums = [];
    }
    checkForDuplicates() {
      const nonDuplicates = [];
      for (let i = 0; i < this.takenNums.length; i++) {
        if (nonDuplicates.includes(this.takenNums[i])) {
          return true;
        } else {
          nonDuplicates.push(this.takenNums[i]);
        }
      }
    }
  }

  const cellObjArray = [];
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const row = i + 1;
      const col = j + 1;
      const box = (i <= 2 && j <= 2) ? 1
      : (i <= 2 && j >= 3 && j <= 5) ? 2
      : (i <= 2 && j >= 6) ? 3
      : (i >= 3 && i <= 5 && j <= 2) ? 4
      : (i >= 3 && i <= 5 && j >= 3 && j <= 5) ? 5
      : (i >= 3 && i <= 5 && j >= 6) ? 6
      : (i >= 6 && j <= 2) ? 7
      : (i >= 6 && j >= 3 && j <= 5) ? 8
      : 9;
      const val = +document.querySelector(`#row${i}col${j}input`).value;
      cellObjArray.push(new Cell(row, col, box, val));
    }
  }

  const groupObjArray = [];
  for (let num = 1; num < 10; num++) {
    groupObjArray.push(new Group('row', num));
    groupObjArray.push(new Group('col', num));
    groupObjArray.push(new Group('box', num));
  }

  function makeBasicUpdates(cellObjArray, groupObjArray) {
    function calibrateCellAndGroupObjs(cellObjArray, groupObjArray) {
      let anyChangesMadeHere = false;
      groupObjArray.forEach(groupObj => {
        cellObjArray.forEach(cellObj => {
          if (cellObj[groupObj.groupType] === groupObj.num) {
            if (cellObj.val && !cellObj[`${groupObj.groupType}TakenNumsContributor`]) {
              groupObj.takenNums.push(cellObj.val);
              cellObj[`${groupObj.groupType}TakenNumsContributor`] = true;
              anyChangesMadeHere = true;
            }
            if (!cellObj.val) {
              groupObj.takenNums.forEach(takenNum => {
                if (cellObj.possVals.includes(takenNum)) {
                  const numIndex = cellObj.possVals.findIndex(possVal => possVal === takenNum);
                  cellObj.possVals.splice(numIndex, 1);
                  anyChangesMadeHere = true;
                }
              });
            }
          }
        });
      });
      return anyChangesMadeHere;
    }

    function groupContradictionChecker(groupObjArray) {
      for (let i = 0; i < groupObjArray.length; i++) {
        if (groupObjArray[i].checkForDuplicates()) {
          return true;
        }
      }
    }

    function cellContradictionChecker(cellObjArray) {
      for (let i = 0; i < cellObjArray.length; i++) {
        if (cellObjArray[i].checkForNoPossValsLeft()) {
          return true;
        }
      }
    }

    let anyChangesMade;
    do {
      anyChangesMade = calibrateCellAndGroupObjs(cellObjArray, groupObjArray);
      cellObjArray.forEach(cellObj => {
        cellObj.selfUpdate();
      });
      if (groupContradictionChecker(groupObjArray) || cellContradictionChecker(cellObjArray)) {
        return true;
      }
    } while (anyChangesMade);
  }

  if (makeBasicUpdates(cellObjArray, groupObjArray)) {
    document.querySelector('#unsolvable').classList.remove('hidden');
    return;
  }

  console.log(cellObjArray);
  console.log(groupObjArray);
}

function setupBoard() {
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
      currCell.id = `row${i}col${j}`;
      const inputBox = document.createElement('input');
      inputBox.id = `row${i}col${j}input`;

      inputBox.addEventListener('focus', function() {
        this.select();
      });

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
      });
      currCell.appendChild(inputBox);
    }
  }
}

function setupClearButton() {
  document.querySelector('#clear').addEventListener('click', () => {
    const allRows = document.querySelectorAll('tr');
    allRows.forEach(row => {
      row.remove();
    });
    setupBoard();
    setupBadInputWarning();
    document.querySelector('#unsolvable').classList.add('hidden');
  });
}

function setupSubmitButton() {
  document.querySelector('#submit').addEventListener('click', solve);
}

function setupBadInputWarning() {
  const allInputBoxes = document.querySelectorAll('input');
  allInputBoxes.forEach(box => {
    box.addEventListener('animationend', function() {
      this.classList.remove('warning'); 
    });
  });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupBoard);
    document.addEventListener('DOMContentLoaded', setupClearButton);
    document.addEventListener('DOMContentLoaded', setupSubmitButton);
    document.addEventListener('DOMContentLoaded', setupBadInputWarning);
} else {
    setupBoard();
    setupClearButton();
    setupSubmitButton();
    setupBadInputWarning();
}
