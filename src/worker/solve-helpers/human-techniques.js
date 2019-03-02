export { addValsToTakenNums, removeTakenNumsFromPossVals, makeUniquePossValsCellVals };

function addValsToTakenNums(cellObjArray, groupObjArray) {
  const groupAndCellValPairs = [];

  for (const cellObj of cellObjArray) {

    if (!cellObj.val || cellObj.isAccountedForInGroupTakenNums) {
      continue;
    }

    cellObj.isAccountedForInGroupTakenNums = true;

    const groupContainsCell = groupObj => cellObj[groupObj.groupType]() === groupObj.num;
    const pushGroupAndVal = groupObj => {
      groupAndCellValPairs.push([groupObj, cellObj.val]);
    };

    groupObjArray
      .filter(groupContainsCell)
      .forEach(pushGroupAndVal);
  }

  for (const [groupObj, val] of groupAndCellValPairs) {
    groupObj.takenNums.push(val);
  }

  return (groupAndCellValPairs.length > 0);
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

  for (const [cellObj, number] of cellAndTakenNumPairs) {
    const index = cellObj.possVals.indexOf(number);
    if (index !== -1) { // in case of duplicates in cellAndTakenNumPairs
      cellObj.possVals.splice(index, 1);
    }
  }

  return (cellAndTakenNumPairs.length > 0);
}

function makeUniquePossValsCellVals(cellObjArray, groupObjArray) {
  const cellAndUniqueValPairs = [];

  for (const groupObj of groupObjArray) {

    const cellsInGroup = [];
    const possValsInGroup = [];

    for (const cellObj of cellObjArray) {

      if (cellObj[groupObj.groupType]() !== groupObj.num) {
        continue;
      }

      cellsInGroup.push(cellObj);

      for (const possVal of cellObj.possVals) {
        possValsInGroup.push(possVal);
      }
    }

    for (const val of possValsInGroup) {

      const valIsUnique = possValsInGroup.indexOf(val) === possValsInGroup.lastIndexOf(val);

      if (!valIsUnique) {
        continue;
      }

      const cellWithUniquePossVal = cellsInGroup.find(cellObj => cellObj.possVals.includes(val));

      cellAndUniqueValPairs.push([cellWithUniquePossVal, val]);
    }
  }

  for (const [cellObj, uniquePossVal] of cellAndUniqueValPairs) {
    cellObj.possVals = [uniquePossVal];
  }

  return (cellAndUniqueValPairs.length > 0);
}
