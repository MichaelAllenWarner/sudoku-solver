export default class Group {
  constructor(groupType, num) {
    this.groupType = groupType;
    this.num = num;
    this.takenNums = [];
  }
  checkForDuplicates() { // indicates a contradiction / invalid board
    const nonDuplicates = [];
    for (let i = 0; i < this.takenNums.length; i++) {
      if (nonDuplicates.includes(this.takenNums[i])) {
        return true;
      }
      nonDuplicates.push(this.takenNums[i]);
    }
  }
}
