import CustomError from "./CustomError";

class TooManyLists extends CustomError {
  message: string;

  constructor(message: string = "User has exceeded the allowed number of lists") {
    super(message);
    this.name = "TooManyLists";
    this.code = "TOO_MANY_LISTS";
    this.message = message;
  }
}

export default TooManyLists;
