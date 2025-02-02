import CustomError from "../CustomError";

class NotFoundError extends CustomError {
  message: string;

  constructor(message: string = "") {
    super(message);
    this.name = "NotFoundError";
    this.code = "NOT_FOUND";
    this.message = message;
  }
}

export default NotFoundError;
