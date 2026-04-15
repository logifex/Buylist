import NotFoundError from "./NotFoundError.js";

class ListNotFoundError extends NotFoundError {
  message: string;

  constructor(message = "List not found") {
    super(message);
    this.name = "ListNotFoundError";
    this.code = "LIST_NOT_FOUND";
    this.message = message;
  }
}

export default ListNotFoundError;
