import CustomError from "../CustomError";

class AlreadyExistsError extends CustomError {
  message: string;

  constructor(message: string = "") {
    super(message);
    this.name = "AlreadyExistsError";
    this.code = "ALREADY_EXISTS";
    this.message = message;
  }
}

export default AlreadyExistsError;
