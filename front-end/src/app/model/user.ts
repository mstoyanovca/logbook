export class User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    jwtToken?: string;

    constructor() {
      this.id = "";
      this.firstName = "";
      this.lastName = "";
      this.email = "";
      this.jwtToken = "";
    }
}
