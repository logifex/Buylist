abstract class CustomError extends Error {
  message: string;
  code?: string;

  constructor(message: string = "") {
    super(message);
    this.message = message;
  }
}

export default CustomError;
