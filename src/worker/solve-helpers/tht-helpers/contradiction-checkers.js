export { groupContradictionChecker, cellContradictionChecker };

function groupContradictionChecker(groupObjArray) {
  for (const groupObj of groupObjArray) {
    if (groupObj.checkForDuplicates()) {
      return true;
    }
  }
}

function cellContradictionChecker(cellObjArray) {
  for (const cellObj of cellObjArray) {
    if (cellObj.checkForNoPossValsLeft()) {
      return true;
    }
  }
}
