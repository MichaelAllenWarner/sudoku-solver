import { makeCellObjArray, makeGroupObjArray } from './solve-helpers/obj-arr-makers';
import tryHumanTechniques from './solve-helpers/try-human-techniques';
import chooseGuessingCell from './solve-helpers/choose-guessing-cell';

export default function solve(boardString) {
  let solution;

  const cellObjArray = makeCellObjArray(boardString);
  const groupObjArray = makeGroupObjArray();

  const preGuessTry = tryHumanTechniques(cellObjArray, groupObjArray);

  const puzzleMayBeValid = preGuessTry ? true : false;

  if (puzzleMayBeValid) {
    const preGuessTryIsSolution = preGuessTry.includes(0) ? false : true;

    // if puzzle is solved, set solution
    if (preGuessTryIsSolution) {
      solution = preGuessTry;
    }

    // if puzzle is not solved, start guessing
    else {
      const guessingCell = chooseGuessingCell(cellObjArray);

      for (const guess of guessingCell.possVals) {

        // make guess
        preGuessTry[guessingCell.id] = guess;

        // try to solve with guess (recursive function call)
        const guessTry = solve(preGuessTry.join(''));

        const guessTryIsSolution = guessTry ? true : false;

        // if puzzle is solved, set solution (and break)
        if (guessTryIsSolution) {
          solution = guessTry;
          break;
        }
      }
    }
  }

  // return solution (array if solved, undefined if puzzle is invalid)
  return solution;
}
