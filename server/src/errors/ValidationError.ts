import CustomError from "./CustomError.js";

class ValidationError extends CustomError {
  message: string;
  data: unknown;

  constructor(message = "Validation Error") {
    super(message);
    this.name = "ValidationError";
    this.code = "VALIDATION_ERROR";
    this.message = message;
  }
}

export default ValidationError;
