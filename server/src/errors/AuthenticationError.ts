import CustomError from "./CustomError.js";

class AuthenticationError extends CustomError {
  message: string;

  constructor(message = "") {
    super(message);
    this.name = "AuthenticationError";
    this.message = message;
  }
}

export default AuthenticationError;
