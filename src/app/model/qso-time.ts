export class QsoTime {
  constructor(public hour: number,
              public minute: number) {
  }

  toString() {
    return this.minute !== 0 ? this.hour + ':' + this.minute : this.hour + ':00';
  }
}
