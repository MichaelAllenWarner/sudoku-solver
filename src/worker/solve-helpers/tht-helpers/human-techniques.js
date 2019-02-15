export { addValsToTakenNums, removeTakenNumsFromPossVals, makeUniquePossValsCellVals };

function addValsToTakenNums(cellObjArray, groupObjArray) {
  const groupAndCellValPairs = [];

  for (const cellObj of cellObjArray) {

    // skip cell if it has no value or is already 'accounted for'
    if (!cellObj.val || cellObj.isAccountedForInGroupTakenNums) {
      continue;
    }

    // mark cellObj 'accounted for'
    cellObj.isAccountedForInGroupTakenNums = true;

    const groupContainsCell = groupObj => cellObj[groupObj.groupType]() === groupObj.num;
    const pushGroupAndVal = groupObj => {
      groupAndCellValPairs.push([groupObj, cellObj.val]);
    };

    // get 3 containing groups, push each [groupObj, cellObj.val] to groupAndCellValPairs
    groupObjArray.filter(groupContainsCell).forEach(pushGroupAndVal);
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

    // get containing groups w/ takenNums, push each [cellObj, takenNum] to cellAndTakenNumPairs
    groupObjArray.filter(groupContainsCellAndHasTakenNums).forEach(pushCellAndTakenNums);
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

    // this will be an array of possVals that appear only once in this group:
    let uniqueVals;

    // we'll use these 2 'working' arrays to determine which possVals are unique:
    const candidateUniqueVals = [];
    const ruledOutVals = [];

    for (const cellObj of cellObjArray) {

      // if cell is in group, push to cellsInThisGroup (if not, skip it)
      if (cellObj[groupObj.groupType]() === groupObj.num) {
        cellsInThisGroup.push(cellObj);
      } else {
        continue;
      }

      if (cellObj.possVals.length > 0) {
        for (const possVal of cellObj.possVals) {

          // if possVal is already ruled out, skip it
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
            candidateUniqueVals.splice(possValIndex, 1);
            ruledOutVals.push(possVal);
          }
        }
      }
    }

    // candidateUniqueVals are all now actually unique
    uniqueVals = candidateUniqueVals;

    // push each [cellWithUniqueVal, uniqueVal] to cellAndUniqueValPairs
    for (const uniqueVal of uniqueVals) {

      const cellWithUniqueVal = cellsInThisGroup.find(cellObj =>
        cellObj.possVals.includes(uniqueVal));

      cellAndUniqueValPairs.push([cellWithUniqueVal, uniqueVal]);
    }
  }

  if (cellAndUniqueValPairs.length > 0) {
    for (const [cellObj, uniqueVal] of cellAndUniqueValPairs) {
      cellObj.possVals = [uniqueVal];
    }
    return true;
  }
}
