import CustomError from "./CustomError.js";

class TooManyProducts extends CustomError {
  message: string;

  constructor(message = "User has exceeded the allowed number of products") {
    super(message);
    this.name = "TooManyProducts";
    this.code = "TOO_MANY_PRODUCTS";
    this.message = message;
  }
}

export default TooManyProducts;
