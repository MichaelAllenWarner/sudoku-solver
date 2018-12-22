function solve(boardString) {

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

    id() {
      return 9 * (this.row - 1) + (this.col - 1);
    }
    selfUpdate() {
      if (!this.val && this.possVals.length === 1) {
        this.val = this.possVals[0];
        this.possVals.pop();
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
  const boardArray = boardString.split(',');
  for (const [index, value] of boardArray.entries()) {
    const row = Math.floor(index / 9) + 1;
    const col = (index % 9) + 1;
    const box = ((3 * Math.floor((row - 1) / 3)) + Math.floor((col - 1) / 3)) + 1;
    const val = +value;
    cellObjArray.push(new Cell(row, col, box, val));
  }


  const groupObjArray = [];
  for (let num = 1; num < 10; num++) {
    groupObjArray.push(new Row('row', num));
    groupObjArray.push(new Col('col', num));
    groupObjArray.push(new Box('box', num));
  }

  function attemptSolveAndReturnCurrBoardArray(cellObjArray, groupObjArray) {

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
        splicesToMake.forEach(cellObjAndDigitPair => {
          const cellObj = cellObjAndDigitPair[0];
          const digit = cellObjAndDigitPair[1];
          const indexToSplice = cellObj.possVals.findIndex(possVal => possVal === digit);
          if (indexToSplice !== -1) {
            // console.log('Splice bc in different unknown box: ');
            // console.log('cell possVals: ');
            // console.log(cellObj.possVals);
            // console.log('digit to splice: ');
            // console.log(digit);
            cellObj.possVals.splice(indexToSplice, 1);
          }
        });
        anyChangesMadeHere = true;
      }

      return anyChangesMadeHere;
    }

    function xWing(cellObjArray, groupObjArray) {

      let anyChangesMadeHere = false;

      const splicesToMake = [];

      const rowObjArray = groupObjArray.filter(obj => obj instanceof Row);
      const colObjArray = groupObjArray.filter(obj => obj instanceof Col);

      const allQualDigitsAndColNums = []; // format: [[[[digit, col#, col#], [digit, col#, col#]... ], row#], [etc]] add after dealing w/ duplicate
      const duplicateQualDigitsAndColNums = []; // format: [[[digit, col#, col#], [row#s]], [[digit, col#, col#], [row#s]] ...] add or add to row#s
      rowObjArray.forEach(rowObj => {
        const digitsAndColNums = [];
        for (let digit = 1; digit < 10; digit++) {
          const colNums = [];
          cellObjArray.forEach(cellObj => {
            if (cellObj.row === rowObj.num && cellObj.possVals.includes(digit)) {
              colNums.push(cellObj.col);
            }
          });
          if (colNums.length === 2) {
            colNums.sort();
            digitsAndColNums.push([digit, colNums[0], colNums[1]]);
          }
        }
        if (allQualDigitsAndColNums.length === 0) {
          allQualDigitsAndColNums.push([digitsAndColNums, rowObj.num]);
        } else {
          digitsAndColNums.forEach(digAndColNums => {
            let existsInDuplicateArray = false;
            for (let i = 0; i < duplicateQualDigitsAndColNums.length; i++) {
              if (digAndColNums.join() === duplicateQualDigitsAndColNums[i][0].join()) {
                existsInDuplicateArray = true;
                if (!duplicateQualDigitsAndColNums[i][1].includes(rowObj.num)) {
                  duplicateQualDigitsAndColNums[i][1].push(rowObj.num);
                  // break; ???
                }
              }
            }
            for (let i = 0; i < allQualDigitsAndColNums.length; i++) {
              for (let j = 0; j < allQualDigitsAndColNums[i][0].length; j++) {
                if (digAndColNums.join() === allQualDigitsAndColNums[i][0][j].join() && !existsInDuplicateArray) {
                  duplicateQualDigitsAndColNums.push([digAndColNums, [allQualDigitsAndColNums[i][1], rowObj.num]]);
                }
                // else if here to add to allQualDigitsAndColNums only selectively ??
              }
            }
          });
          allQualDigitsAndColNums.push([digitsAndColNums, rowObj.num]);
        }
      });
      if (duplicateQualDigitsAndColNums.length > 0) {
        duplicateQualDigitsAndColNums.forEach(duplicate => {
          cellObjArray.forEach(cellObj => {
            if ((cellObj.col === duplicate[0][1] || cellObj.col === duplicate[0][2]) && !duplicate[1].includes(cellObj.row) && cellObj.possVals.includes(duplicate[0][0])) {
              splicesToMake.push([cellObj, duplicate[0][0]]);
            }
          });
        });
      }

      const allQualDigitsAndRowNums = [];
      const duplicateQualDigitsAndRowNums = [];
      colObjArray.forEach(colObj => {
        const digitsAndRowNums = [];
        for (let digit = 1; digit < 10; digit++) {
          const rowNums = [];
          cellObjArray.forEach(cellObj => {
            if (cellObj.col === colObj.num && cellObj.possVals.includes(digit)) {
              rowNums.push(cellObj.row);
            }
          });
          if (rowNums.length === 2) {
            rowNums.sort();
            digitsAndRowNums.push([digit, rowNums[0], rowNums[1]]);
          }
        }
        if (allQualDigitsAndRowNums.length === 0) {
          allQualDigitsAndRowNums.push([digitsAndRowNums, colObj.num]);
        } else {
          digitsAndRowNums.forEach(digAndRowNums => {
            let existsInDuplicateArray = false;
            for (let i = 0; i < duplicateQualDigitsAndRowNums.length; i++) {
              if (digAndRowNums.join() === duplicateQualDigitsAndRowNums[i][0].join()) {
                existsInDuplicateArray = true;
                if (!duplicateQualDigitsAndRowNums[i][1].includes(colObj.num)) {
                  duplicateQualDigitsAndRowNums[i][1].push(colObj.num);
                  // break; ???
                }
              }
            }
            for (let i = 0; i < allQualDigitsAndRowNums.length; i++) {
              for (let j = 0; j < allQualDigitsAndRowNums[i][0].length; j++) {
                if (digAndRowNums.join() === allQualDigitsAndRowNums[i][0][j].join() && !existsInDuplicateArray) {
                  duplicateQualDigitsAndRowNums.push([digAndRowNums, [allQualDigitsAndRowNums[i][1], colObj.num]]);
                }
                // else if here to add to allQualDigitsAndRowNums only selectively ??
              }
            }
          });
          allQualDigitsAndRowNums.push([digitsAndRowNums, colObj.num]);
        }
      });
      if (duplicateQualDigitsAndRowNums.length > 0) {
        duplicateQualDigitsAndRowNums.forEach(duplicate => {
          cellObjArray.forEach(cellObj => {
            if ((cellObj.row === duplicate[0][1] || cellObj.row === duplicate[0][2]) && !duplicate[1].includes(cellObj.col) && cellObj.possVals.includes(duplicate[0][0])) {
              splicesToMake.push([cellObj, duplicate[0][0]]);
            }
          });
        });
      }


      if (splicesToMake.length > 0) {
        splicesToMake.forEach(cellObjAndDigitPair => {
          const cellObj = cellObjAndDigitPair[0];
          const digit = cellObjAndDigitPair[1];
          const indexToSplice = cellObj.possVals.findIndex(possVal => possVal === digit);
          if (indexToSplice !== -1) {
            // console.log('X-Wing Splice: ');
            // console.log('cell possVals: ');
            // console.log(cellObj.possVals);
            // console.log('digit to splice: ');
            // console.log(digit);
            cellObj.possVals.splice(indexToSplice, 1);
          }
        });
        anyChangesMadeHere = true;
      }

      return anyChangesMadeHere;
    }

    function removePossValIfMustBeInDifferentRowOrCol(cellObjArray, groupObjArray) {

      let anyChangesMadeHere = false;

      const splicesToMake = [];

      const nonBoxObjArray = groupObjArray.filter(obj => !(obj instanceof Box));

      nonBoxObjArray.forEach(groupObj => {
        const possValObjects =[];
        for (let i = 1; i < 10; i++) {
          possValObjects.push({
            number: i,
            boxesWithNumberAsPossVal: []
          });
        }
        cellObjArray.forEach(cellObj => {
          if (cellObj[groupObj.groupType] === groupObj.num) {
            for (let i = 1; i < 10; i++) {
              if (cellObj.possVals.includes(i)) {
                if (!possValObjects[i-1].boxesWithNumberAsPossVal.includes(cellObj.box)) {
                  possValObjects[i-1].boxesWithNumberAsPossVal.push(cellObj.box);
                }
              }
            }
          }
        });
        possValObjects.forEach(possValObject => {
          const valToRemove = possValObject.number;
          if (possValObject.boxesWithNumberAsPossVal.length === 1) {
            const cellsInSameBoxButDifferentLine = cellObjArray.filter(cellObj => (cellObj.box === possValObject.boxesWithNumberAsPossVal[0] && cellObj[groupObj.groupType] !== groupObj.num));
            cellsInSameBoxButDifferentLine.forEach(cellObj => {
              if (cellObj.possVals.includes(valToRemove)) {
                splicesToMake.push([cellObj, valToRemove]);
              }
            });
          }
        });
      });

      if (splicesToMake.length > 0) {
        splicesToMake.forEach(cellObjAndDigitPair => {
          const cellObj = cellObjAndDigitPair[0];
          const digit = cellObjAndDigitPair[1];
          const indexToSplice = cellObj.possVals.findIndex(possVal => possVal === digit);
          if (indexToSplice !== -1) {
            // console.log('splice bc must be in different row or col: ');
            // console.log('cell possVals: ');
            // console.log(cellObj.possVals);
            // console.log('digit to splice: ');
            // console.log(digit);
            cellObj.possVals.splice(indexToSplice, 1);
          }
        });
        anyChangesMadeHere = true;
      }

      return anyChangesMadeHere;
    }

    function removePossValBecauseCellIsPartOfHiddenSubset(cellObjArray, groupObjArray) {

      let anyChangesMadeHere = false;

      const splicesToMake = [];

      groupObjArray.forEach(groupObj => {
        const possValsInGroupWithCellIDs = [];
        for (let digit = 1; digit < 10; digit++) {
          possValsInGroupWithCellIDs.push([digit, []]);
        }
        cellObjArray.forEach(cellObj => {
          if (cellObj[groupObj.groupType] === groupObj.num) {
            for (let digit = 1; digit < 10; digit++) {
              if (cellObj.possVals.includes(digit)) {
                possValsInGroupWithCellIDs[digit-1][1].push(cellObj.id());
              }
            }
          }
        });
        const qualPossValsInGroupWithCellIDs = [];
        possValsInGroupWithCellIDs.forEach(candidate => {
          if (candidate[1].length < 4 && candidate[1].length > 1) {
            qualPossValsInGroupWithCellIDs.push(candidate);
          }
        });
        qualPossValsInGroupWithCellIDs.forEach(primaryCandidate => {
          qualPossValsInGroupWithCellIDs.forEach(secondaryCandidate => {
            if (primaryCandidate[0] !== secondaryCandidate[0]) {
              const uniqueCellIDsForPair = [];
              primaryCandidate[1].forEach(cellID => {
                uniqueCellIDsForPair.push(cellID);
              });
              secondaryCandidate[1].forEach(cellID => {
                if (!uniqueCellIDsForPair.includes(cellID)) {
                  uniqueCellIDsForPair.push(cellID);
                }
              });
              if (uniqueCellIDsForPair.length === 2) {
                cellObjArray.forEach(cellObj => {
                  if (uniqueCellIDsForPair.includes(cellObj.id())) {
                    cellObj.possVals.forEach(possVal => {
                      if (possVal !== primaryCandidate[0] && possVal !== secondaryCandidate[0]) {
                        splicesToMake.push([cellObj, possVal]);
                      }
                    });
                  }
                });
              }
              if (uniqueCellIDsForPair.length === 3) {
                qualPossValsInGroupWithCellIDs.forEach(tertiaryCandidate => {
                  if (tertiaryCandidate[0] !== primaryCandidate[0] && tertiaryCandidate[0] !== secondaryCandidate[0]) {
                    const uniqueCellIDsForTrio = [];
                    uniqueCellIDsForPair.forEach(cellID => {
                      uniqueCellIDsForTrio.push(cellID);
                    });
                    tertiaryCandidate[1].forEach(cellID => {
                      if (!uniqueCellIDsForTrio.includes(cellID)) {
                        uniqueCellIDsForTrio.push(cellID);
                      }
                    });
                    if (uniqueCellIDsForTrio.length === 3) {
                      cellObjArray.forEach(cellObj => {
                        if (uniqueCellIDsForTrio.includes(cellObj.id())) {
                          cellObj.possVals.forEach(possVal => {
                            if (possVal !== primaryCandidate[0] && possVal !== secondaryCandidate[0] && possVal !== tertiaryCandidate[0]) {
                              splicesToMake.push([cellObj, possVal]);
                            }
                          });
                        }
                      });
                    }
                  }
                });
              }
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
            // console.log('splice bc hidden subset: ');
            // console.log('cell ID: ');
            // console.log(cellObj.id());
            // console.log('cell possVals: ');
            // console.log(cellObj.possVals);
            // console.log('digit to splice: ');
            // console.log(digit);
            cellObj.possVals.splice(indexToSplice, 1);
          }
        });
        anyChangesMadeHere = true;
      }

      return anyChangesMadeHere;
    }

    function singlesChaining(cellObjArray, groupObjArray) {

      let anyChangesMadeHere = false;

      const splicesToMake = [];

      const digitsWithConjPairs = [];
      for (let digit = 1; digit < 10; digit++) {
        digitsWithConjPairs.push([digit, []]);
      }
      groupObjArray.forEach(groupObj => {
        for (let digit = 1; digit < 10; digit++) {
          const cellObjsWithDigAsPossValInGroup = [];
          cellObjArray.forEach(cellObj => {
            if (cellObj[groupObj.groupType] === groupObj.num && cellObj.possVals.length > 1 && cellObj.possVals.includes(digit)) {
              cellObjsWithDigAsPossValInGroup.push(cellObj);
            }
          });
          if (cellObjsWithDigAsPossValInGroup.length === 2) {
            digitsWithConjPairs[digit - 1][1].push(cellObjsWithDigAsPossValInGroup);
          }
        }
      });
      digitsWithConjPairs.forEach(digWithConjPairs => {
        if (digWithConjPairs[1].length > 2) {
          const digit = digWithConjPairs[0];
          const conjPairs = []; // format: [[cellObj1, cellObj2], [cellObj1, cellObj2], ...]
          digWithConjPairs[1].forEach(conjPair => {
            conjPairs.push(conjPair);
          });

          const singlesChains = [];

          let outerChangesMade;
          do {
            outerChangesMade = false;
            function checkIfConjPairAlreadyInASinglesChain(conjPair, singlesChains) {
              const conjPairIDs = [conjPair[0].id(), conjPair[1].id()].sort();
              for (let j = 0; j < singlesChains.length; j++) {
                const singlesChain = singlesChains[j];
                for (let k = 0; k < singlesChain.length; k++) {
                  const chainPair = singlesChain[k];
                  const chainPairIDs = [chainPair[0].id(), chainPair[1].id()].sort();
                  if (conjPairIDs.join() === chainPairIDs.join()) {
                    return true;
                  }
                }
              }
            }
            let innerChangesMade;
            do {
              innerChangesMade = false;
              conjPairsLoop:
              for (let i = 0; i < conjPairs.length; i++) {
                const conjPair = conjPairs[i];
                if (checkIfConjPairAlreadyInASinglesChain(conjPair, singlesChains)) {
                  continue;
                }
                for (let j = 0; j < singlesChains.length; j++) {
                  const singlesChain = singlesChains[j];
                  for (let k = 0; k < singlesChain.length; k++) {
                    const chainPair = singlesChain[k];
                    const chainPairIDs = [chainPair[0].id(), chainPair[1].id()];
                    if (chainPairIDs.includes(conjPair[0].id()) || chainPairIDs.includes(conjPair[1].id())) {
                      singlesChain.push(conjPair);
                      innerChangesMade = true;
                      outerChangesMade = true;
                      continue conjPairsLoop;
                    }
                  }
                }
              }
            } while (innerChangesMade);
            for (let i = 0; i < conjPairs.length; i++) {
              const conjPair = conjPairs[i];
              if (checkIfConjPairAlreadyInASinglesChain(conjPair, singlesChains)) {
                continue;
              }
              singlesChains.push([conjPair]);
              outerChangesMade = true;
              break; // so only one new singlesChain is added at a time
            }
          } while (outerChangesMade);

          singlesChains.forEach(chain => {
            if (chain.length > 2) {
              const catACells = [];
              const catBCells = [];
              const catACellIDs = [];
              const catBCellIDs = [];
              const cellIDsAccountedFor = [];
              let changesMade;
              do {
                changesMade = false;
                chain.forEach(pair => {
                  if (cellIDsAccountedFor.length === 0) {
                    catACells.push(pair[0]);
                    catBCells.push(pair[1]);
                    catACellIDs.push(pair[0].id());
                    catBCellIDs.push(pair[1].id());
                    cellIDsAccountedFor.push(pair[0].id());
                    cellIDsAccountedFor.push(pair[1].id());
                    changesMade = true;
                  } else {
                    if (cellIDsAccountedFor.includes(pair[0].id()) && !cellIDsAccountedFor.includes(pair[1].id())) {
                      if (catACellIDs.includes(pair[0].id())) {
                        catBCells.push(pair[1]);
                        catBCellIDs.push(pair[1].id());
                        cellIDsAccountedFor.push(pair[1].id());
                        changesMade = true;
                      } else {
                        catACells.push(pair[1]);
                        catACellIDs.push(pair[1].id());
                        cellIDsAccountedFor.push(pair[1].id());
                        changesMade = true;
                      }
                    }
                    if (cellIDsAccountedFor.includes(pair[1].id()) && !cellIDsAccountedFor.includes(pair[0].id())) {
                      if (catACellIDs.includes(pair[1].id())) {
                        catBCells.push(pair[0]);
                        catBCellIDs.push(pair[0].id());
                        cellIDsAccountedFor.push(pair[0].id());
                        changesMade = true;
                      } else {
                        catACells.push(pair[0]);
                        catACellIDs.push(pair[0].id());
                        cellIDsAccountedFor.push(pair[0].id());
                        changesMade = true;
                      }
                    }
                  }
                });
              } while (changesMade);

              groupObjArray.forEach(groupObj => {
                const cellsInThisGroup = [];
                const cellIDsInThisGroup = [];
                cellObjArray.forEach(cellObj => {
                  if (cellObj[groupObj.groupType] === groupObj.num) {
                    cellsInThisGroup.push(cellObj);
                    cellIDsInThisGroup.push(cellObj.id());
                  }
                });
                const catACellIDsInGroup = [];
                const catBCellIDsInGroup = [];
                catACellIDs.forEach(cellID => {
                  if (cellIDsInThisGroup.includes(cellID)) {
                    catACellIDsInGroup.push(cellID);
                  }
                });
                catBCellIDs.forEach(cellID => {
                  if (cellIDsInThisGroup.includes(cellID)) {
                    catBCellIDsInGroup.push(cellID);
                  }
                });

                // if group contains >1 of catA (or catB) cells and 0 catB (or catA), then catA (B) cells CANNOT be digit in question
                if (catACellIDsInGroup.length > 1 && catBCellIDsInGroup.length === 0) {
                  catACells.forEach(cellObj => {
                    splicesToMake.push([cellObj, digit]);
                  });
                }
                if (catBCellIDsInGroup.length > 1 && catACellIDsInGroup.length === 0) {
                  catBCells.forEach(cellObj => {
                    splicesToMake.push([cellObj, digit]);
                  });
                }
              });

              // if cell w/ digit as possVal is NOT in catA or catB...
              // ... but is in same GROUP with a catA and also in same GROUP with a catB (doesn't have to be same group for them),
              // ... then digit can be eliminated as possVal for this cell

            }
          });

        }
      });


      if (splicesToMake.length > 0) {
        splicesToMake.forEach(cellObjAndDigitPair => {
          const cellObj = cellObjAndDigitPair[0];
          const digit = cellObjAndDigitPair[1];
          const indexToSplice = cellObj.possVals.findIndex(possVal => possVal === digit);
          if (indexToSplice !== -1) {
            // console.log('splice bc single chain: ');
            // console.log('cell ID: ');
            // console.log(cellObj.id());
            // console.log('cell possVals: ');
            // console.log(cellObj.possVals);
            // console.log('digit to splice: ');
            // console.log(digit);
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
      const changes7 = xWing(cellObjArray, groupObjArray);
      const changes8 = removePossValIfMustBeInDifferentRowOrCol(cellObjArray, groupObjArray);
      const changes9 = removePossValBecauseCellIsPartOfHiddenSubset(cellObjArray, groupObjArray);
      const changes10 = singlesChaining(cellObjArray, groupObjArray);
      if (changes1 || changes2 || changes3 || changes4 || changes5 || changes6 || changes7 || changes8 || changes9 || changes10) {
        anyChangesMade = true;
        runCellSelfUpdates(cellObjArray);
      } else {
        anyChangesMade = false;
      }
    } while (anyChangesMade);


    // if no contradictions found, return current board array:
    if (!groupContradictionChecker(groupObjArray) && !cellContradictionChecker(cellObjArray)) {
      return cellObjArray.map(cellObj => (cellObj.val) ? cellObj.val : 0);
    }
  }

  const currBoardArray = attemptSolveAndReturnCurrBoardArray(cellObjArray, groupObjArray);

  if (currBoardArray) { // no contradictions found
    if (!currBoardArray.includes(0)) { // puzzle is solved, return array of current board
      return currBoardArray;
    } else { // not solved, start guessing
      const cellObjectsWithoutValue = [];
      cellObjArray.forEach(cellObj => {
        if (!cellObj.val) {
          cellObjectsWithoutValue.push(cellObj);
        }
      });
      cellObjectsWithoutValue.sort((a, b) => a.possVals.length - b.possVals.length);
      const guessingCell = cellObjectsWithoutValue[0];
      for (const [index, guess] of guessingCell.possVals.entries()) {
        currBoardArray.splice(guessingCell.id(), 1, guess);
        const guessArray = solve(currBoardArray.join()); // recursive function
        if (guessArray) { // puzzle is solved, return guessArray all the way up
          return guessArray;
        } else if (index === guessingCell.possVals.length - 1) { // found contradiction, back up
          return;
        }
      }
    }
  }
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
  document.querySelector('#submit').addEventListener('click', () => {
    document.querySelector('#unsolvable').classList.add('hidden');
    const inputValArray = [];
    const allInputs = document.querySelectorAll('input');
    allInputs.forEach(input => {
      if (input.value) {
        inputValArray.push(input.value);
      } else {
        inputValArray.push(0);
      }
    });
    const boardString = inputValArray.join();
    const solutionArray = solve(boardString);
    if (solutionArray) {
      solutionArray.forEach((cellVal, index) => {
        const inputBox = document.querySelector(`#row${Math.floor(index / 9)}col${index % 9}input`);
        if (!inputBox.value) {
          inputBox.classList.add('generated');
          inputBox.value = cellVal;
        }
      });
    } else {
      document.querySelector('#unsolvable').classList.remove('hidden');
    }
  });
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
