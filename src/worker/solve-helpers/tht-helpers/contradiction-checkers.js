export { groupContradictionChecker, cellContradictionChecker };

function groupContradictionChecker(groupObjArray) {
  for (let i = 0; i < groupObjArray.length; i++) {
    if (groupObjArray[i].checkForDuplicates()) {
      return true;
    }
  }
}

function cellContradictionChecker(cellObjArray) {
  for (let i = 0; i < cellObjArray.length; i++) {
    if (cellObjArray[i].checkForNoPossValsLeft()) {
      return true;
    }
  }
}
