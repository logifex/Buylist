import CustomError from "./CustomError";

class AuthenticationError extends CustomError {
  message: string;

  constructor(message: string = "") {
    super(message);
    this.name = "AuthenticationError";
    this.message = message;
  }
}

export default AuthenticationError;
