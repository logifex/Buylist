import CustomError from "./CustomError.js";

class RemoveOwnerError extends CustomError {
  message: string;

  constructor(message = "Owner cannot be removed") {
    super(message);
    this.name = "RemoveOwnerError";
    this.code = "REMOVE_OWNER_ERROR";
    this.message = message;
  }
}

export default RemoveOwnerError;
