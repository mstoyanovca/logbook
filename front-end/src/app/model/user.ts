export class User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    verificationToken: string;
    refreshTokens: string[];
    resetToken?: string;
    resetTokenExpiration?: string;
    jwtToken?: string;
    isVerified: boolean;

    constructor() {
      this.id = "";
      this.firstName = "";
      this.lastName = "";
      this.email = "";
      this.password = "";
      this.verificationToken = "";
      this.refreshTokens = [];
      this.resetToken = "";
      this.resetTokenExpiration = "";
      this.jwtToken = "";
      this.isVerified = false;
    }
}
