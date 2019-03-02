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

    const cellIsInGroup = cellObj => cellObj[groupObj.groupType]() === groupObj.num;
    const pushCellAndPossValsToGroupArrays = cellObj => {
      cellsInGroup.push(cellObj);
      Array.prototype.push.apply(possValsInGroup, cellObj.possVals);
    };

    cellObjArray
      .filter(cellIsInGroup)
      .forEach(pushCellAndPossValsToGroupArrays);

    const possValIsUniqueInGroup = (val, ind, arr) => arr.indexOf(val) === arr.lastIndexOf(val);
    const pushUniqueValAndItsCell = val => {
      const cellWithUniquePossVal = cellsInGroup.find(cellObj => cellObj.possVals.includes(val));
      cellAndUniqueValPairs.push([cellWithUniquePossVal, val]);
    };

    possValsInGroup
      .filter(possValIsUniqueInGroup)
      .forEach(pushUniqueValAndItsCell);
  }

  for (const [cellObj, uniquePossVal] of cellAndUniqueValPairs) {
    cellObj.possVals = [uniquePossVal];
  }

  return (cellAndUniqueValPairs.length > 0);
}
