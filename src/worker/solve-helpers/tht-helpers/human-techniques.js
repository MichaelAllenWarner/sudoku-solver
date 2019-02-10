export { addValsToTakenNums, removeTakenNumsFromPossVals, makeUniquePossValsCellVals };

function addValsToTakenNums(cellObjArray, groupObjArray) {
  const groupAndCellValPairs = [];

  for (const cellObj of cellObjArray) {

    // move to next cell if this one has no value
    if (!cellObj.val) {
      continue;
    }

    // move to next cell if this is already 'accounted for'
    if (cellObj.isAccountedForInGroupTakenNums) {
      continue;
    }

    // get 3 containing groups (faster than filter method b/c stops at 3)
    const containingGroups = [];

    for (const groupObj of groupObjArray) {
      if (containingGroups.length === 3) {
        break;
      }
      if (cellObj[groupObj.groupType]() === groupObj.num) {
        containingGroups.push(groupObj);
      }
    }

    // push all 3 group / cell-value pairs to groupAndCellValPairs
    for (const groupObj of containingGroups) {
      groupAndCellValPairs.push([groupObj, cellObj.val]);
    }

    // mark cellObj 'accounted for'
    cellObj.isAccountedForInGroupTakenNums = true;
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

    // move to next cell if this one has a value
    if (cellObj.val) {
      continue;
    }

    // get containing groups w/ takenNums (0-3 total)
    const qualContainingGroups = [];

    for (const groupObj of groupObjArray) {
      if (qualContainingGroups.length === 3) {
        break;
      }
      if (cellObj[groupObj.groupType]() === groupObj.num
        && groupObj.takenNums.length > 0) {
        qualContainingGroups.push(groupObj);
      }
    }

    // push cell / takenNum pairs to cellAndTakenNumPairs
    if (qualContainingGroups.length > 0) {
      for (const groupObj of qualContainingGroups) {
        for (const takenNum of groupObj.takenNums) {
          if (cellObj.possVals.includes(takenNum)) {
            cellAndTakenNumPairs.push([cellObj, takenNum]);
          }
        }
      }
    }
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

    const candidateUniqueVals = [];
    const ruledOutVals = [];
    const cellsInThisGroup = [];

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

    // push cellObj / unique-val pairs to cellAndUniqueValPairs
    for (const uniqueVal of candidateUniqueVals) {

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
