export default (cellObjArray, groupObjArray) => {
  for (const cellObj of cellObjArray) {
    if (cellObj.checkForNoPossValsLeft()) {
      return true;
    }
  }

  for (const groupObj of groupObjArray) {
    if (groupObj.checkForDuplicates()) {
      return true;
    }
  }
};
