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
          if (cellObj[groupObj.groupType]() === groupObj.num) {
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
          if (cellObj[groupObj.groupType]() === groupObj.num && !cellObj.val) {
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
          if (cellObj[groupObj.groupType]() === groupObj.num) {
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

onmessage = function(event) {
  const solutionArray = solve(event.data);
  postMessage(solutionArray);
}
