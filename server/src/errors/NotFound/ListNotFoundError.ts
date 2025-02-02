import NotFoundError from "./NotFoundError";

class ListNotFoundError extends NotFoundError {
  message: string;

  constructor(message: string = "List not found") {
    super(message);
    this.name = "ListNotFoundError";
    this.code = "LIST_NOT_FOUND";
    this.message = message;
  }
}

export default ListNotFoundError;
