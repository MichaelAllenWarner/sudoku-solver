// choose a cell with no value and with fewest possVals left

export default cellObjArray => {
  const cellObjectsWithoutValue = [];
  cellObjArray.forEach(cellObj => {
    if (!cellObj.val) {
      cellObjectsWithoutValue.push(cellObj);
    }
  });
  cellObjectsWithoutValue.sort((a, b) => a.possVals.length - b.possVals.length);
  return cellObjectsWithoutValue[0];
};
