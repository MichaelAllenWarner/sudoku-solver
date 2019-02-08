// choose a cell with no value and with fewest possVals left

export default cellObjArray => {
  let guessingCell;

  for (const cellObj of cellObjArray) {

    // move on to next cell if this one has a value
    if (cellObj.val) {
      continue;
    }

    // definitively choose cell if it has only 2 possVals (can't do better!)
    if (cellObj.possVals.length === 2) {
      guessingCell = cellObj;
      break;
    }

    // tentatively choose cell if it's first candidate or better than current candidate
    if (!guessingCell || cellObj.possVals.length < guessingCell.possVals.length) {
      guessingCell = cellObj;
    }
  }

  return guessingCell;
};
