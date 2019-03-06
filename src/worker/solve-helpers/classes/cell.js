export default class Cell {
  constructor(id, val) {
    this.id = id;
    this.val = (val) ? val : null;
    this.possVals = (val) ? [] : Array.from({ length: 9 }, (el, ind) => ind + 1);
    this.isAccountedForInGroupTakenNums = false;
  }

  row() {
    return Math.floor(this.id / 9);
  }

  col() {
    return this.id % 9;
  }

  box() {
    return (3 * Math.floor(this.row() / 3)) + Math.floor(this.col() / 3);
  }

  moveLastRemainingPossValToVal() {
    if (!this.val && this.possVals.length === 1) {
      this.val = this.possVals[0];
      this.possVals.pop();
    }
  }
  
  checkForNoPossValsLeft() { // indicates a contradiction / invalid board
    return !this.val && this.possVals.length === 0;
  }
}
