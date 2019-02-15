export { addValsToTakenNums, removeTakenNumsFromPossVals, makeUniquePossValsCellVals };

function addValsToTakenNums(cellObjArray, groupObjArray) {
  const groupAndCellValPairs = [];

  for (const cellObj of cellObjArray) {

    if (!cellObj.val || cellObj.isAccountedForInGroupTakenNums) {
      continue;
    } else {
      cellObj.isAccountedForInGroupTakenNums = true;
    }

    const groupContainsCell = groupObj => cellObj[groupObj.groupType]() === groupObj.num;
    const pushGroupAndVal = groupObj => {
      groupAndCellValPairs.push([groupObj, cellObj.val]);
    };

    groupObjArray
      .filter(groupContainsCell)
      .forEach(pushGroupAndVal);
  }

  if (groupAndCellValPairs.length > 0) {
    for (const [groupObj, val] of groupAndCellValPairs) {
      groupObj.takenNums.push(val);
    }
    return true;
  }
}

function removeTakenNumsFromPossVals(cellObjArray, groupObjArray) {
  const cellAndTakenNumPairs = [];

  for (const cellObj of cellObjArray) {

    if (cellObj.val) {
      continue;
    }

    const groupContainsCellAndHasTakenNums = groupObj =>
      cellObj[groupObj.groupType]() === groupObj.num
      && groupObj.takenNums.length > 0;

    const pushCellAndTakenNums = groupObj => {
      for (const takenNum of groupObj.takenNums) {
        if (cellObj.possVals.includes(takenNum)) {
          cellAndTakenNumPairs.push([cellObj, takenNum]);
        }
      }
    };

    groupObjArray
      .filter(groupContainsCellAndHasTakenNums)
      .forEach(pushCellAndTakenNums);
  }

  if (cellAndTakenNumPairs.length > 0) {
    for (const [cellObj, number] of cellAndTakenNumPairs) {
      const index = cellObj.possVals.findIndex(possVal => possVal === number);
      if (index !== -1) { // in case of duplicates in cellAndTakenNumPairs
        cellObj.possVals.splice(index, 1);
      }
    }
    return true;
  }
}

function makeUniquePossValsCellVals(cellObjArray, groupObjArray) {
  const cellAndUniqueValPairs = [];

  for (const groupObj of groupObjArray) {

    const cellsInThisGroup = [];

    // we'll use these 2 'working' arrays to determine which possVals are unique:
    const candidateUniqueVals = [];
    const ruledOutVals = [];

    for (const cellObj of cellObjArray) {

      if (cellObj[groupObj.groupType]() === groupObj.num) {
        cellsInThisGroup.push(cellObj);
      } else {
        continue;
      }

      if (cellObj.possVals.length > 0) {
        for (const possVal of cellObj.possVals) {

          if (ruledOutVals.includes(possVal)) {
            continue;
          }

          const possValIndex = candidateUniqueVals.findIndex(val => val === possVal);

          // if possVal isn't yet in candidateUniqueVals, push it there
          if (possValIndex === -1) {
            candidateUniqueVals.push(possVal);
          }

          // if possVal IS already in candidateUniqueVals, rule it out
          else {
            delete candidateUniqueVals[possValIndex];
            ruledOutVals.push(possVal);
          }
        }
      }
    }

    const pushCellAndUniqueVal = uniqueVal => {
      const cellWithUniqueVal = cellsInThisGroup.find(cellObj =>
        cellObj.possVals.includes(uniqueVal));
      cellAndUniqueValPairs.push([cellWithUniqueVal, uniqueVal]);
    };

    candidateUniqueVals
      .filter(el => el) // b/c some may have been deleted
      .forEach(pushCellAndUniqueVal);
  }

  if (cellAndUniqueValPairs.length > 0) {
    for (const [cellObj, uniqueVal] of cellAndUniqueValPairs) {
      cellObj.possVals = [uniqueVal];
    }
    return true;
  }
}
