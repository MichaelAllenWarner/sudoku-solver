function solve() {
  document.querySelector('#unsolvable').classList.add('hidden');
  const cellObjArray = [];
  for (let i = 1; i < 10; i++) {
    for (let j = 1; j < 10; j++) {
      const inputVal = +document.querySelector(`#row${i-1}col${j-1}input`).value;
      cellObjArray.push({
        row: i,
        col: j,
        box: (i <= 3 && j <= 3) ? 1
        : (i <= 3 && j >= 4 && j <= 6) ? 2
        : (i <= 3 && j >= 7) ? 3
        : (i >= 4 && i <= 6 && j <= 3) ? 4
        : (i >= 4 && i <= 6 && j >= 4 && j <= 6) ? 5
        : (i >= 4 && i <= 6 && j >= 7) ? 6
        : (i >= 7 && j <= 3) ? 7
        : (i >= 7 && j >= 4 && j <= 6) ? 8
        : 9,
        val: (inputVal) ? inputVal : null,
        possVals: (inputVal) ? [] : [1, 2, 3, 4, 5, 6, 7, 8, 9],
        rowTakenNumsContributor: false,
        colTakenNumsContributor: false,
        boxTakenNumsContributor: false,
        selfUpdate() {
          if (!this.val && this.possVals.length === 1) {
            this.val = this.possVals[0];
            this.possVals.pop();
            document.querySelector(`#row${this.row-1}col${this.col-1}input`).value = this.val; // for testing
          }
        },
        checkForNoPossValsLeft() {
          if (!this.val && this.possVals.length === 0) {
            return true;
          }
        }
      });
    }
  }
  const groupObjArrays = {
    rowObjArray: [],
    colObjArray: [],
    boxObjArray: []
  }
  function arrFiller(arr) {
    for (let i = 1; i < 10; i++) {
      arr.push({
        num: i,
        takenNums: [],
        checkForDuplicates() {
          const nonDuplicates = [];
          for (let j = 0; j < this.takenNums.length; j++) {
            if (nonDuplicates.includes(this.takenNums[j])) {
              return true;
            } else {
              nonDuplicates.push(this.takenNums[j]);
            }
          }
        }
      });
    }
  }
  arrFiller(groupObjArrays.rowObjArray);
  arrFiller(groupObjArrays.colObjArray);
  arrFiller(groupObjArrays.boxObjArray);

  function makeBasicUpdates(cellObjArray, groupObjArrays) {
    function calibrateCellAndGroupObjs(cellObjArray, groupObjArray, groupType) {
      let anyChangesMadeHere = false;
      groupObjArray.forEach(groupObj => {
        cellObjArray.forEach(cellObj => {
          if (cellObj[groupType] === groupObj.num) {
            if (cellObj.val && !cellObj[`${groupType}TakenNumsContributor`]) {
              groupObj.takenNums.push(cellObj.val);
              cellObj[`${groupType}TakenNumsContributor`] = true;
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
      anyChangesMade = false;
      const cellAndRowCalibrationsMade = calibrateCellAndGroupObjs(cellObjArray, groupObjArrays.rowObjArray, 'row');
      const cellAndColCalibrationsMade = calibrateCellAndGroupObjs(cellObjArray, groupObjArrays.colObjArray, 'col');
      const cellAndBoxCalibrationsMade = calibrateCellAndGroupObjs(cellObjArray, groupObjArrays.boxObjArray, 'box');
      cellObjArray.forEach(cellObj => {
        cellObj.selfUpdate();
      });
      const rowContradictions = groupContradictionChecker(groupObjArrays.rowObjArray);
      const colContradictions = groupContradictionChecker(groupObjArrays.colObjArray);
      const boxContradictions = groupContradictionChecker(groupObjArrays.boxObjArray);
      const cellContradictions = cellContradictionChecker(cellObjArray);
      if (rowContradictions || colContradictions || boxContradictions || cellContradictions) {
        return true;
      }
      if (cellAndRowCalibrationsMade || cellAndColCalibrationsMade || cellAndBoxCalibrationsMade) {
        anyChangesMade = true;
      }
    } while (anyChangesMade);
  }

  if (makeBasicUpdates(cellObjArray, groupObjArrays)) {
    document.querySelector('#unsolvable').classList.remove('hidden');
    return;
  }

  console.log(cellObjArray);
  console.log(groupObjArrays);
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
