export class Band {
  static codeToPosition = (code: string) => {
    switch (code) {
      case '80m':
        return 0;
      case '40m':
        return 1;
      case '30m':
        return 2;
      case '20m':
        return 3;
      case '15m':
        return 4;
      case '10m':
        return 5;
      case '2m':
        return 6;
      case '70cm':
        return 7;
    }
  }
}
