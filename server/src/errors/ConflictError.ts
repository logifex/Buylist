import CustomError from "./CustomError.js";

class ConflictError extends CustomError {
  message: string;

  constructor(message = "") {
    super(message);
    this.name = "ConflictError";
    this.message = message;
  }
}

export default ConflictError;
