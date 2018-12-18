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
        document.querySelector(`#row${this.row-1}col${this.col-1}input`).classList.remove('possVals');
        document.querySelector(`#row${this.row-1}col${this.col-1}input`).classList.add('generated');

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

  class Row extends Group {}
  class Col extends Group {}
  class Box extends Group {}

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
    groupObjArray.push(new Row('row', num));
    groupObjArray.push(new Col('col', num));
    groupObjArray.push(new Box('box', num));
  }

  function solveAndCheckForInvalidPuzzle(cellObjArray, groupObjArray) {

    function addValsToTakenNums(cellObjArray, groupObjArray) {

      let anyChangesMadeHere = false;

      const pushesToMake = [];

      groupObjArray.forEach(groupObj => {
        cellObjArray.forEach(cellObj => {
          if (cellObj[groupObj.groupType] === groupObj.num) {
            if (cellObj.val && !cellObj[`${groupObj.groupType}TakenNumsContributor`]) {
              pushesToMake.push([groupObj, cellObj]);
            }
          }
        });
      });

      if (pushesToMake.length > 0) {
        console.log('Pushes to make: ');
        console.log(pushesToMake);
        pushesToMake.forEach(groupObjAndCellObjPair => {
          const groupObj = groupObjAndCellObjPair[0];
          const cellObj = groupObjAndCellObjPair[1];
          groupObj.takenNums.push(cellObj.val);
          cellObj[`${groupObj.groupType}TakenNumsContributor`] = true;
        });
        anyChangesMadeHere = true;
      }

      return anyChangesMadeHere;
    }

    function removeTakenNumsFromPossVals(cellObjArray, groupObjArray) {

      let anyChangesMadeHere = false;

      const splicesToMake = [];

      groupObjArray.forEach(groupObj => {
        cellObjArray.forEach(cellObj => {
          if (cellObj[groupObj.groupType] === groupObj.num) {
            if (!cellObj.val) {
              groupObj.takenNums.forEach(takenNum => {
                if (cellObj.possVals.includes(takenNum)) {
                  splicesToMake.push([cellObj, takenNum]);
                }
              });
            }
          }
        });
      });
      if (splicesToMake.length > 0) {
        splicesToMake.forEach(cellObjAndDigitPair => {
          const cellObj = cellObjAndDigitPair[0];
          const digit = cellObjAndDigitPair[1];
          const indexToSplice = cellObj.possVals.findIndex(possVal => possVal === digit);
          if (indexToSplice !== -1) {
            cellObj.possVals.splice(indexToSplice, 1);
          }
        });
        anyChangesMadeHere = true;
      }

      return anyChangesMadeHere;
    }

    function uniquePossValInGroup(cellObjArray, groupObjArray) {

      let anyChangesMadeHere = false;

      groupObjArray.forEach(groupObj => {
        const cellsInThisGroup = [];
        cellObjArray.forEach(cellObj => {
          if (cellObj[groupObj.groupType] === groupObj.num) {
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
              cellsInThisGroup[i].possVals = [uniqueVal];
              i = 9;
              anyChangesMadeHere = true;
            }
          }
        });
      });

      return anyChangesMadeHere
    }

    function removePossValIfMustBeInDifferentKnownBox(cellObjArray, groupObjArray) {

      let anyChangesMadeHere = false;

      const boxObjArray = groupObjArray.filter(obj => obj instanceof Box);
      boxObjArray.forEach(boxObj => {
        const possValObjects = [];
        for (let i = 1; i < 10; i++) {
          possValObjects.push({
            number: i,
            rowsWithNumberAsPossVal: [],
            colsWithNumberAsPossVal: []
          });
        }
        cellObjArray.forEach(cellObj => {
          if (cellObj.box === boxObj.num) {
            for (let i = 1; i < 10; i++) {
              if (cellObj.possVals.includes(i)) {
                if (!possValObjects[i-1].rowsWithNumberAsPossVal.includes(cellObj.row)) {
                  possValObjects[i-1].rowsWithNumberAsPossVal.push(cellObj.row);
                }
                if (!possValObjects[i-1].colsWithNumberAsPossVal.includes(cellObj.col)) {
                  possValObjects[i-1].colsWithNumberAsPossVal.push(cellObj.col);
                }
              }
            }
          }
        });
        possValObjects.forEach((possValObject, possValObjectIndex) => {
          const valToRemove = possValObjectIndex + 1;
          if (possValObject.rowsWithNumberAsPossVal.length === 1) {
            const cellsInSameRowButDifferentBox = cellObjArray.filter(cellObj => (cellObj.row === possValObject.rowsWithNumberAsPossVal[0] && cellObj.box !== boxObj.num));
            cellsInSameRowButDifferentBox.forEach(cellObj => {
              if (cellObj.possVals.includes(valToRemove)) {
                const valIndex = cellObj.possVals.findIndex(possVal => possVal === valToRemove);
                cellObj.possVals.splice(valIndex, 1);
                anyChangesMadeHere = true;
              }
            });
          }
          if (possValObject.colsWithNumberAsPossVal.length === 1) {
            const cellsInSameColButDifferentBox = cellObjArray.filter(cellObj => (cellObj.col === possValObject.colsWithNumberAsPossVal[0] && cellObj.box !== boxObj.num));
            cellsInSameColButDifferentBox.forEach(cellObj => {
              if (cellObj.possVals.includes(valToRemove)) {
                const valIndex = cellObj.possVals.findIndex(possVal => possVal === valToRemove);
                cellObj.possVals.splice(valIndex, 1);
                anyChangesMadeHere = true;
              }
            });
          }
        });
      });

      return anyChangesMadeHere;
    }

    function removePossValIfMustBeInPerfectSubset(cellObjArray, groupObjArray) {

      let anyChangesMadeHere = false;

      const splicesToMake = [];

      groupObjArray.forEach(groupObj => {
        const possValsWithCount = [];
        const possValsWithoutCount = [];
        cellObjArray.forEach(cellObj => {
          if (cellObj[groupObj.groupType] === groupObj.num && cellObj.possVals.length > 1) {
            if (possValsWithCount.length === 0) {
              possValsWithCount.push([cellObj.possVals, 1]);
              possValsWithoutCount.push(cellObj.possVals);
            } else {
              for (let i = 0; i < possValsWithCount.length; i++) {
                if (possValsWithCount[i][0].join() === cellObj.possVals.join()) {
                  possValsWithCount[i][1]++;
                  break;
                }
                if (i === possValsWithCount.length - 1) {
                  possValsWithCount.push([cellObj.possVals, 1]);
                  possValsWithoutCount.push(cellObj.possVals);
                  break;
                }
              }
            }
          }
        });
        const candidateSubsetPossVals = [];
        possValsWithCount.forEach(possValsArrWithCount => {
          if (possValsArrWithCount[0].length === possValsArrWithCount[1]) {
            candidateSubsetPossVals.push(possValsArrWithCount[0]);
          }
        });
        candidateSubsetPossVals.forEach(candidatePossVals => {
          possValsWithoutCount.forEach(potentialContainerPossVals => {
            if (potentialContainerPossVals.length > candidatePossVals.length && candidatePossVals.some(el => potentialContainerPossVals.includes(el))) {
              cellObjArray.forEach(cellObj => {
                if (cellObj[groupObj.groupType] === groupObj.num && cellObj.possVals.join() === potentialContainerPossVals.join()) {
                  candidatePossVals.forEach(possValToRemove => {
                    if (potentialContainerPossVals.includes(possValToRemove)) {
                      splicesToMake.push([cellObj, possValToRemove]);
                    }
                  });
                }
              });
            }
          });
        });
      });
      if (splicesToMake.length > 0) {
        splicesToMake.forEach(cellObjAndDigitPair => {
          const cellObj = cellObjAndDigitPair[0];
          const digit = cellObjAndDigitPair[1];
          const indexToSplice = cellObj.possVals.findIndex(possVal => possVal === digit);
          if (indexToSplice !== -1) {
            cellObj.possVals.splice(indexToSplice, 1);
          }
        });
        anyChangesMadeHere = true;
      }

      return anyChangesMadeHere;
    }

    function removePossValIfMustBeInDifferentUnknownBox(cellObjArray, groupObjArray) {

      let anyChangesMadeHere = false;

      const splicesToMake = [];

      const boxObjArray = groupObjArray.filter(obj => obj instanceof Box);
      for (let digit = 1; digit < 10; digit++) {
        boxObjArray.forEach(boxObj => {
          if (!boxObj.takenNums.includes(digit)) {
            const possRowsAndCols = {
              rowsWithDigitAsPossVal: [],
              colsWithDigitAsPossVal: []
            }
            cellObjArray.forEach(cellObj => {
              if (cellObj.box === boxObj.num) {
                if (cellObj.possVals.includes(digit)) {
                  if (!possRowsAndCols.rowsWithDigitAsPossVal.includes(cellObj.row)) {
                    possRowsAndCols.rowsWithDigitAsPossVal.push(cellObj.row);
                  }
                  if (!possRowsAndCols.colsWithDigitAsPossVal.includes(cellObj.col)) {
                    possRowsAndCols.colsWithDigitAsPossVal.push(cellObj.col);
                  }
                }
              }
            });
            if (possRowsAndCols.rowsWithDigitAsPossVal.length === 2) {
              const otherTwoBoxObjs = [];
              boxObjArray.forEach(candidateBoxObj => {
                if (boxObj.num < 4 && candidateBoxObj.num < 4 && candidateBoxObj.num !== boxObj.num) {
                  otherTwoBoxObjs.push(candidateBoxObj);
                }
                if (boxObj.num > 3 && boxObj.num < 7 && candidateBoxObj.num > 3 && candidateBoxObj.num < 7 && candidateBoxObj.num !== boxObj.num) {
                  otherTwoBoxObjs.push(candidateBoxObj);
                }
                if (boxObj.num > 6 && candidateBoxObj.num > 6 && candidateBoxObj.num !== boxObj.num) {
                  otherTwoBoxObjs.push(candidateBoxObj);
                }
              });
              otherTwoBoxObjs.forEach(secondaryBoxObj => {
                const tertiaryBoxObj = (secondaryBoxObj.num === otherTwoBoxObjs[0].num) ? otherTwoBoxObjs[1] : otherTwoBoxObjs[0];
                if (!secondaryBoxObj.takenNums.includes(digit) && !tertiaryBoxObj.takenNums.includes(digit)) {
                  const secondaryPossRows = [];
                  cellObjArray.forEach(cellObj => {
                    if (cellObj.box === secondaryBoxObj.num) {
                      if (cellObj.possVals.includes(digit)) {
                        if (!secondaryPossRows.includes(cellObj.row)) {
                          secondaryPossRows.push(cellObj.row);
                        }
                      }
                    }
                  });
                  if (secondaryPossRows.sort().join() === possRowsAndCols.rowsWithDigitAsPossVal.sort().join()) {
                    cellObjArray.forEach(cellObj => {
                      if (cellObj.box === tertiaryBoxObj.num && secondaryPossRows.includes(cellObj.row) && cellObj.possVals.includes(digit)) {
                        splicesToMake.push([cellObj, digit]);
                      }
                    });
                  }
                }
              });
            }
            if (possRowsAndCols.colsWithDigitAsPossVal.length === 2) {
              const otherTwoBoxObjs = [];
              boxObjArray.forEach(candidateBoxObj => {
                if ((boxObj.num === 1 || boxObj.num === 4 || boxObj.num === 7) && (candidateBoxObj.num === 1 || candidateBoxObj.num === 4 || candidateBoxObj.num === 7) && candidateBoxObj.num !== boxObj.num) {
                  otherTwoBoxObjs.push(candidateBoxObj);
                }
                if ((boxObj.num === 2 || boxObj.num === 5 || boxObj.num === 8) && (candidateBoxObj.num === 2 || candidateBoxObj.num === 5 || candidateBoxObj.num === 8) && candidateBoxObj.num !== boxObj.num) {
                  otherTwoBoxObjs.push(candidateBoxObj);
                }
                if ((boxObj.num === 3 || boxObj.num === 6 || boxObj.num === 9) && (candidateBoxObj.num === 3 || candidateBoxObj.num === 6 || candidateBoxObj.num === 9) && candidateBoxObj.num !== boxObj.num) {
                  otherTwoBoxObjs.push(candidateBoxObj);
                }
              });
              otherTwoBoxObjs.forEach(secondaryBoxObj => {
                const tertiaryBoxObj = (secondaryBoxObj.num === otherTwoBoxObjs[0].num) ? otherTwoBoxObjs[1] : otherTwoBoxObjs[0];
                if (!secondaryBoxObj.takenNums.includes(digit) && !tertiaryBoxObj.takenNums.includes(digit)) {
                  const secondaryPossCols = [];
                  cellObjArray.forEach(cellObj => {
                    if (cellObj.box === secondaryBoxObj.num) {
                      if (cellObj.possVals.includes(digit)) {
                        if (!secondaryPossCols.includes(cellObj.col)) {
                          secondaryPossCols.push(cellObj.col);
                        }
                      }
                    }
                  });
                  if (secondaryPossCols.sort().join() === possRowsAndCols.colsWithDigitAsPossVal.sort().join()) {
                    cellObjArray.forEach(cellObj => {
                      if (cellObj.box === tertiaryBoxObj.num && secondaryPossCols.includes(cellObj.col) && cellObj.possVals.includes(digit)) {
                        splicesToMake.push([cellObj, digit]);
                      }
                    });
                  }
                }
              });
            }
          }
        });
      }
      if (splicesToMake.length > 0) {
        console.log(splicesToMake);
        splicesToMake.forEach(cellObjAndDigitPair => {
          const cellObj = cellObjAndDigitPair[0];
          const digit = cellObjAndDigitPair[1];
          const indexToSplice = cellObj.possVals.findIndex(possVal => possVal === digit);
          if (indexToSplice !== -1) {
            cellObj.possVals.splice(indexToSplice, 1);
          }
        });
        anyChangesMadeHere = true;
      }

      return anyChangesMadeHere;
    }

    function runCellSelfUpdates(cellObjArray) {
      cellObjArray.forEach(cellObj => {
        cellObj.selfUpdate();
      });
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
      const changes1 = addValsToTakenNums(cellObjArray, groupObjArray);
      const changes2 = removeTakenNumsFromPossVals(cellObjArray, groupObjArray);
      const changes3 = uniquePossValInGroup(cellObjArray, groupObjArray);
      const changes4 = removePossValIfMustBeInDifferentKnownBox(cellObjArray, groupObjArray);
      const changes5 = removePossValIfMustBeInPerfectSubset(cellObjArray, groupObjArray);
      const changes6 = removePossValIfMustBeInDifferentUnknownBox(cellObjArray, groupObjArray);
      if (changes1 || changes2 || changes3 || changes4 || changes5 || changes6) {
        anyChangesMade = true;
        runCellSelfUpdates(cellObjArray);
      } else {
        anyChangesMade = false;
      }
    } while (anyChangesMade);

    // for testing:
    cellObjArray.forEach(cellObj => {
      if (cellObj.possVals.length > 0) {
        document.querySelector(`#row${cellObj.row-1}col${cellObj.col-1}input`).value = cellObj.possVals;
        document.querySelector(`#row${cellObj.row-1}col${cellObj.col-1}input`).classList.add('possVals');
      }
    });

    if (groupContradictionChecker(groupObjArray) || cellContradictionChecker(cellObjArray)) {
      return true;
    }
  }

  if (solveAndCheckForInvalidPuzzle(cellObjArray, groupObjArray)) {
    document.querySelector('#unsolvable').classList.remove('hidden');
    return;
  }

  document.querySelector('#restart').classList.remove('hidden');

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
    document.querySelector('#restart').classList.add('hidden');
  });
}

function setupResetPuzzleButton() {
  document.querySelector('#restart').addEventListener('click', () => {
    const allGeneratedInputs = document.querySelectorAll('.generated');
    const allPossValInputs = document.querySelectorAll('.possVals');
    allGeneratedInputs.forEach(input => {
      input.value = '';
      input.classList.remove('generated');
    });
    allPossValInputs.forEach(input => {
      input.value = '';
      input.classList.remove('possVals');
    });
    document.querySelector('#unsolvable').classList.add('hidden');
    document.querySelector('#restart').classList.add('hidden');
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
    document.addEventListener('DOMContentLoaded', setupResetPuzzleButton);
} else {
    setupBoard();
    setupClearButton();
    setupSubmitButton();
    setupBadInputWarning();
    setupResetPuzzleButton();
}
