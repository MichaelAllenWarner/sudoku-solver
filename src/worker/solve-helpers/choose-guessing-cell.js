// choose a cell with no value and with fewest possVals left (2 is ideal)

export default cellObjArray => {
  let guessingCell;

  for (const cellObj of cellObjArray) {

    if (cellObj.val) {
      continue;
    }

    if (cellObj.possVals.length === 2) {
      guessingCell = cellObj;
      break;
    }

    if (!guessingCell || cellObj.possVals.length < guessingCell.possVals.length) {
      guessingCell = cellObj;
    }
  }

  return guessingCell;
};
