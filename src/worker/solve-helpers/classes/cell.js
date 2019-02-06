export default class Cell {
  constructor(id, val) {
    this.id = id;
    this.val = (val) ? val : null;
    this.possVals = (val) ? [] : [1, 2, 3, 4, 5, 6, 7, 8, 9];
    this.rowTakenNumsContributor = false;
    this.colTakenNumsContributor = false;
    this.boxTakenNumsContributor = false;
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
    if (!this.val && this.possVals.length === 0) {
      return true;
    }
  }
}
