import CustomError from "./CustomError";

class ValidationError extends CustomError {
  message: string;
  data: any;

  constructor(message: string = "Validation Error") {
    super(message);
    this.name = "ValidationError";
    this.code = "VALIDATION_ERROR";
    this.message = message;
  }
}

export default ValidationError;
