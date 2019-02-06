export { addValsToTakenNums, removeTakenNumsFromPossVals, makeUniquePossValsCellVals };

function addValsToTakenNums(cellObjArray, groupObjArray) {
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
    pushesToMake.forEach(groupObjAndCellObjPair => {
      const groupObj = groupObjAndCellObjPair[0];
      const cellObj = groupObjAndCellObjPair[1];
      groupObj.takenNums.push(cellObj.val);
      cellObj[`${groupObj.groupType}TakenNumsContributor`] = true;
    });
    return true;
  }
}

function removeTakenNumsFromPossVals(cellObjArray, groupObjArray) {
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
    splicesToMake.forEach(cellObjAndDigitPair => {
      const cellObj = cellObjAndDigitPair[0];
      const digit = cellObjAndDigitPair[1];
      const indexToSplice = cellObj.possVals.findIndex(possVal => possVal === digit);
      if (indexToSplice !== -1) { // in case of duplicate elements in possValsToRemove array
        cellObj.possVals.splice(indexToSplice, 1);
      }
    });
    return true;
  }
}

function makeUniquePossValsCellVals(cellObjArray, groupObjArray) {
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
    valuesToSet.forEach(cellObjAndUniqueValPair => {
      const cellObj = cellObjAndUniqueValPair[0];
      const uniqueVal = cellObjAndUniqueValPair[1];
      cellObj.possVals = [uniqueVal];
    });
    return true;
  }
}
