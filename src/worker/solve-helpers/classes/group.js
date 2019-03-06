export default class Group {
  constructor(groupType, num) {
    this.groupType = groupType;
    this.num = num;
    this.takenNums = [];
  }
  
  checkForDuplicates() { // indicates a contradiction / invalid board
    const numIsDuplicated = (num, ind, arr) => arr.indexOf(num) !== arr.lastIndexOf(num);
    return this.takenNums.some(numIsDuplicated);
  }
}
