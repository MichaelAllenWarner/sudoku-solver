import {
  addValsToTakenNums,
  removeTakenNumsFromPossVals,
  makeUniquePossValsCellVals
} from './tht-helpers/human-techniques';

import {
  groupContradictionChecker,
  cellContradictionChecker
} from './tht-helpers/contradiction-checkers';


export default (cellObjArray, groupObjArray) => {

  // run the 'human technique' functions until no further progress is made:
  let anyChangesMade;

  do {
    anyChangesMade = (addValsToTakenNums(cellObjArray, groupObjArray)
      || removeTakenNumsFromPossVals(cellObjArray, groupObjArray)
      || makeUniquePossValsCellVals(cellObjArray, groupObjArray));

    if (anyChangesMade) {
      for (const cellObj of cellObjArray) {
        cellObj.moveLastRemainingPossValToVal();
      }
    }
  } while (anyChangesMade);

  // check for contradictions. If none found, return current state of board as an array:
  const puzzleMayBeValid = (!groupContradictionChecker(groupObjArray)
    && !cellContradictionChecker(cellObjArray));

  if (puzzleMayBeValid) {
    return cellObjArray.map(cellObj => cellObj.val || 0);
  }
};
