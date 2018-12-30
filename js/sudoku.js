// model:

function solve(boardString) {

  class Cell {
    constructor(id, val) {
      this.id = id;
      this.val = (val) ? val : null;
      this.possVals = (val) ? [] : [1, 2, 3, 4, 5, 6, 7, 8, 9];
      this.rowTakenNumsContributor = false;
      this.colTakenNumsContributor = false;
      this.boxTakenNumsContributor = false;
    }
    row() {
      return Math.floor(this.id / 9);
    }
    col() {
      return this.id % 9;
    }
    box() {
      return (3 * Math.floor(this.row() / 3)) + Math.floor(this.col() / 3);
    }
    selfUpdate() {
      if (!this.val && this.possVals.length === 1) {
        this.val = this.possVals[0];
        this.possVals.pop();
      }
    }
    checkForNoPossValsLeft() { // indicates a contradiction / invalid board
      if (!this.val && this.possVals.length === 0) {
        return true;
      }
    }
  }

  const cellObjArray = [];
  const boardArray = boardString.split('');
  for (const [index, value] of boardArray.entries()) {
    cellObjArray.push(new Cell(index, +value));
  }


  class Group {
    constructor(groupType, num) {
      this.groupType = groupType;
      this.num = num;
      this.takenNums = [];
    }
    checkForDuplicates() { // indicates a contradiction / invalid board
      const nonDuplicates = [];
      for (let i = 0; i < this.takenNums.length; i++) {
        if (nonDuplicates.includes(this.takenNums[i])) {
          return true;
        }
        nonDuplicates.push(this.takenNums[i]);
      }
    }
  }

  const groupObjArray = [];
  for (let num = 0; num < 9; num++) {
    groupObjArray.push(new Group('row', num));
    groupObjArray.push(new Group('col', num));
    groupObjArray.push(new Group('box', num));
  }


  function attemptSolveAndReturnCurrBoardArray(cellObjArray, groupObjArray) {

    // 'technique' functions to narrow down cell possVals:

    function cellValsToAddToGroupTakenNums(cellObjArray, groupObjArray) {
      const pushesToMake = [];

      groupObjArray.forEach(groupObj => {
        cellObjArray.forEach(cellObj => {
          const groupNumOfCell = (groupObj.groupType === 'row') ? cellObj.row()
          : (groupObj.groupType === 'col') ? cellObj.col()
          : cellObj.box();
          if (groupNumOfCell === groupObj.num) {
            if (cellObj.val && !cellObj[`${groupObj.groupType}TakenNumsContributor`]) {
              pushesToMake.push([groupObj, cellObj]);
            }
          }
        });
      });

      if (pushesToMake.length > 0) {
        return pushesToMake;
      }
    }

    function groupTakenNumsToRemoveFromCellPossVals(cellObjArray, groupObjArray) {
      const splicesToMake = [];

      groupObjArray.forEach(groupObj => {
        cellObjArray.forEach(cellObj => {
          const groupNumOfCell = (groupObj.groupType === 'row') ? cellObj.row()
          : (groupObj.groupType === 'col') ? cellObj.col()
          : cellObj.box();
          if (groupNumOfCell === groupObj.num && !cellObj.val) {
            groupObj.takenNums.forEach(takenNum => {
              if (cellObj.possVals.includes(takenNum)) {
                splicesToMake.push([cellObj, takenNum]);
              }
            });
          }
        });
      });

      if (splicesToMake.length > 0) {
        return splicesToMake;
      }
    }

    function uniquePossValsToMakeCellVals(cellObjArray, groupObjArray) {
      const valuesToSet = [];

      groupObjArray.forEach(groupObj => {
        const cellsInThisGroup = [];
        cellObjArray.forEach(cellObj => {
          const groupNumOfCell = (groupObj.groupType === 'row') ? cellObj.row()
          : (groupObj.groupType === 'col') ? cellObj.col()
          : cellObj.box();
          if (groupNumOfCell === groupObj.num) {
            cellsInThisGroup.push(cellObj);
          }
        });
        const candidateVals = [];
        const ruledOutVals = [];
        for (let i = 1; i < 10; i++) {
          cellsInThisGroup.forEach(cellObj => {
            if (cellObj.possVals.includes(i) && !candidateVals.includes(i) && !ruledOutVals.includes(i)) {
              candidateVals.push(i);
            } else if (cellObj.possVals.includes(i) && candidateVals.includes(i) && !ruledOutVals.includes(i)) {
              const valIndex = candidateVals.findIndex(candidate => candidate === i);
              candidateVals.splice(valIndex, 1);
              ruledOutVals.push(i);
            }
          });
        }
        const uniqueVals = candidateVals;
        uniqueVals.forEach(uniqueVal => {
          for (let i = 0; i < 9; i++) {
            if (cellsInThisGroup[i].possVals.includes(uniqueVal)) {
              valuesToSet.push([cellsInThisGroup[i], uniqueVal]);
              i = 9;
            }
          }
        });
      });

      if (valuesToSet.length > 0) {
        return valuesToSet;
      }
    }


    // run the 'technique' functions until no further progress is made:

    let anyChangesMade;
    do {
      anyChangesMade = false;

      const valsToAddToTakenNums = cellValsToAddToGroupTakenNums(cellObjArray, groupObjArray);
      if (valsToAddToTakenNums) {
        anyChangesMade = true;
        valsToAddToTakenNums.forEach(groupObjAndCellObjPair => {
          const groupObj = groupObjAndCellObjPair[0];
          const cellObj = groupObjAndCellObjPair[1];
          groupObj.takenNums.push(cellObj.val);
          cellObj[`${groupObj.groupType}TakenNumsContributor`] = true;
        });
      }

      const possValsToRemove = groupTakenNumsToRemoveFromCellPossVals(cellObjArray, groupObjArray);
      if (possValsToRemove) {
        anyChangesMade = true;
        possValsToRemove.forEach(cellObjAndDigitPair => {
          const cellObj = cellObjAndDigitPair[0];
          const digit = cellObjAndDigitPair[1];
          const indexToSplice = cellObj.possVals.findIndex(possVal => possVal === digit);
          if (indexToSplice !== -1) { // in case of duplicate elements in possValsToRemove array
            cellObj.possVals.splice(indexToSplice, 1);
          }
        });
      }

      const uniquesToMakeCellVals = uniquePossValsToMakeCellVals(cellObjArray, groupObjArray);
      if (uniquesToMakeCellVals) {
        anyChangesMade = true;
        uniquesToMakeCellVals.forEach(cellObjAndUniqueValPair => {
          const cellObj = cellObjAndUniqueValPair[0];
          const uniqueVal = cellObjAndUniqueValPair[1];
          cellObj.possVals = [uniqueVal];
        });
      }

      if (anyChangesMade) {
        cellObjArray.forEach(cellObj => {
          cellObj.selfUpdate();
        });
      }
    } while (anyChangesMade);


    // contradiction-finding functions:

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


    // check for contradictions. If none found, return current state of board as an array:

    if (!groupContradictionChecker(groupObjArray) && !cellContradictionChecker(cellObjArray)) {
      return cellObjArray.map(cellObj => (cellObj.val) ? cellObj.val : 0);
    }
  }


  const currBoardArray = attemptSolveAndReturnCurrBoardArray(cellObjArray, groupObjArray);

  if (currBoardArray) { // no contradictions found
    if (!currBoardArray.includes(0)) { // puzzle is solved, return array of current board
      return currBoardArray;
    }
    // else, start guessing (always using a cell with fewest possVals left):
    const cellObjectsWithoutValue = [];
    cellObjArray.forEach(cellObj => {
      if (!cellObj.val) {
        cellObjectsWithoutValue.push(cellObj);
      }
    });
    cellObjectsWithoutValue.sort((a, b) => a.possVals.length - b.possVals.length);
    const guessingCell = cellObjectsWithoutValue[0];
    for (const [index, guess] of guessingCell.possVals.entries()) {
      currBoardArray.splice(guessingCell.id, 1, guess);
      const guessArray = solve(currBoardArray.join('')); // recursive function
      if (guessArray) { // puzzle is solved, return guessArray all the way up
        return guessArray;
      }
      if (index === guessingCell.possVals.length - 1) { // only contradictions here, back up
        return;
      }
    }
  }
}


// view/controller

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
    const solutionArray = solve(boardString);
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

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setUpBoard);
    document.addEventListener('DOMContentLoaded', setUpBadInputWarning);
    document.addEventListener('DOMContentLoaded', setUpClearButton);
    document.addEventListener('DOMContentLoaded', setUpSubmitButton);
    document.addEventListener('DOMContentLoaded', setUpStringEntry);
    document.addEventListener('DOMContentLoaded', setUpPermalinkButton);
} else {
    setUpBoard();
    setUpBadInputWarning();
    setUpClearButton();
    setUpSubmitButton();
    setUpStringEntry();
    setUpPermalinkButton();
}
