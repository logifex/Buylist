import CustomError from "./CustomError";

class NotPermittedError extends CustomError {
  message: string;

  constructor(message: string = "") {
    super(message);
    this.name = "NotPermittedError";
    this.code = "NOT_PERMITTED";
    this.message = message;
  }
}

export default NotPermittedError;
