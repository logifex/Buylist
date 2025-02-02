import CustomError from "./CustomError";

class RemoveOwnerError extends CustomError {
  message: string;

  constructor(message: string = "Owner cannot be removed") {
    super(message);
    this.name = "RemoveOwnerError";
    this.code = "REMOVE_OWNER_ERROR"
    this.message = message;
  }
}

export default RemoveOwnerError;
