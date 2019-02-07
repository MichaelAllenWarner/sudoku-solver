import { makeCellObjArray, makeGroupObjArray } from './solve-helpers/obj-arr-makers';
import tryHumanTechniques from './solve-helpers/try-human-techniques';
import chooseGuessingCell from './solve-helpers/choose-guessing-cell';

export default function solve(boardString) {
  let solution;

  const cellObjArray = makeCellObjArray(boardString);
  const groupObjArray = makeGroupObjArray();

  const currBoardArray = tryHumanTechniques(cellObjArray, groupObjArray);

  const puzzleMayBeValid = currBoardArray ? true : false;

  if (puzzleMayBeValid) {
    const currBoardIsSolution = currBoardArray.includes(0) ? false : true;

    // if puzzle is solved, set solution
    if (currBoardIsSolution) {
      solution = currBoardArray;
    } 

    // if puzzle is not solved, start guessing
    else {
      const guessingCell = chooseGuessingCell(cellObjArray);

      for (const guess of guessingCell.possVals) {
        currBoardArray.splice(guessingCell.id, 1, guess);

        // try to solve with guess (recursive function call)
        const guessArray = solve(currBoardArray.join(''));

        const guessArrayIsSolution = guessArray ? true : false;

        // if puzzle is solved, set solution (and break)
        if (guessArrayIsSolution) {
          solution = guessArray;
          break;
        }
      }
    }
  }

  // return solution (array if solved, undefined if puzzle is invalid)
  return solution;
}
