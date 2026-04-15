import CustomError from "../CustomError.js";

class NotFoundError extends CustomError {
  message: string;

  constructor(message = "") {
    super(message);
    this.name = "NotFoundError";
    this.code = "NOT_FOUND";
    this.message = message;
  }
}

export default NotFoundError;
