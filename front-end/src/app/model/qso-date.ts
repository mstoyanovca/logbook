export class QsoDate {
  constructor(public year: number,
              public month: number,
              public day: number) {
  }

  toString() {
    return this.year + '-' + this.month + '-' + this.day;
  }
}
