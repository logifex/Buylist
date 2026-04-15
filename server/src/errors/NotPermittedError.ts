import CustomError from "./CustomError.js";

class NotPermittedError extends CustomError {
  message: string;

  constructor(message = "") {
    super(message);
    this.name = "NotPermittedError";
    this.code = "NOT_PERMITTED";
    this.message = message;
  }
}

export default NotPermittedError;
