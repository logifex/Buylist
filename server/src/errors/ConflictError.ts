import CustomError from "./CustomError";

class ConflictError extends CustomError {
  message: string;

  constructor(message: string = "") {
    super(message);
    this.name = "ConflictError";
    this.message = message;
  }
}

export default ConflictError;
