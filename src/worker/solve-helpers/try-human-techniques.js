import {
  addValsToTakenNums,
  removeTakenNumsFromPossVals,
  makeUniquePossValsCellVals
} from './human-techniques';

export default (cellObjArray, groupObjArray) => {

  let anyChangesMade;

  do {
    anyChangesMade =
      addValsToTakenNums(cellObjArray, groupObjArray)
      || removeTakenNumsFromPossVals(cellObjArray, groupObjArray)
      || makeUniquePossValsCellVals(cellObjArray, groupObjArray);

    if (anyChangesMade) {
      for (const cellObj of cellObjArray) {
        cellObj.moveLastRemainingPossValToVal();
      }
    }
  } while (anyChangesMade);
};
