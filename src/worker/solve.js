import { makeCellObjArray, makeGroupObjArray } from './solve-helpers/obj-arr-makers';
import tryHumanTechniques from './solve-helpers/try-human-techniques';
import thereIsAContradiction from './solve-helpers/find-contradictions';
import chooseGuessingCell from './solve-helpers/choose-guessing-cell';

export default function solve(boardString) {

  const cellObjArray = makeCellObjArray(boardString);
  const groupObjArray = makeGroupObjArray();

  tryHumanTechniques(cellObjArray, groupObjArray);

  if (thereIsAContradiction(cellObjArray, groupObjArray)) {
    return;
  }

  const preGuessProgress = cellObjArray.map(cellObj => cellObj.val || 0);

  if (!preGuessProgress.includes(0)) {
    const solution = preGuessProgress;
    return solution;
  }

  const guessingArray = preGuessProgress;
  const guessingCell = chooseGuessingCell(cellObjArray);

  for (const guess of guessingCell.possVals) {

    guessingArray[guessingCell.id] = guess;

    // recursive function call
    const solutionOrUndefined = solve(guessingArray.join(''));

    if (solutionOrUndefined) {
      const solution = solutionOrUndefined;
      return solution;
    }
  }
}
