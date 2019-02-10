export default class Group {
  constructor(groupType, num) {
    this.groupType = groupType;
    this.num = num;
    this.takenNums = [];
  }
  checkForDuplicates() { // indicates a contradiction / invalid board
    const nonDuplicates = [];
    for (const num of this.takenNums) {
      if (nonDuplicates.includes(num)) {
        return true;
      }
      nonDuplicates.push(num);
    }
  }
}
