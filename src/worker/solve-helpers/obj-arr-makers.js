import Cell from './classes/cell';
import Group from './classes/group';

export function makeCellObjArray(boardString) {
  const cellObjArray = [];
  const boardArray = boardString.split('');
  for (const [index, value] of boardArray.entries()) {
    cellObjArray.push(new Cell(index, +value));
  }
  return cellObjArray;
}

export function makeGroupObjArray() {
  const groupObjArray = [];
  for (let num = 0; num < 9; num++) {
    groupObjArray.push(new Group('row', num));
    groupObjArray.push(new Group('col', num));
    groupObjArray.push(new Group('box', num));
  }
  return groupObjArray;
}
