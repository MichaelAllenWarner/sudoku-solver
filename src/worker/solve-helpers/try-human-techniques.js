import {
  addValsToTakenNums,
  removeTakenNumsFromPossVals,
  makeUniquePossValsCellVals
} from './human-techniques';

export default (cellObjArray, groupObjArray) => {

  let changesWereMade;

  do {
    const valsWereAdded = addValsToTakenNums(cellObjArray, groupObjArray);
    const takenNumsWereRemoved = removeTakenNumsFromPossVals(cellObjArray, groupObjArray);
    const uniquesWereMadeVals = makeUniquePossValsCellVals(cellObjArray, groupObjArray);

    changesWereMade = valsWereAdded || takenNumsWereRemoved || uniquesWereMadeVals;

    if (changesWereMade) {
      for (const cellObj of cellObjArray) {
        cellObj.moveLastRemainingPossValToVal();
      }
    }
  } while (changesWereMade);
};
