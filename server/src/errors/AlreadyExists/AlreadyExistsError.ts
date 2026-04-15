import CustomError from "../CustomError.js";

class AlreadyExistsError extends CustomError {
  message: string;

  constructor(message = "") {
    super(message);
    this.name = "AlreadyExistsError";
    this.code = "ALREADY_EXISTS";
    this.message = message;
  }
}

export default AlreadyExistsError;
