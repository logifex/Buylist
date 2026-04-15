import NotFoundError from "./NotFoundError.js";

class ProductNotFoundError extends NotFoundError {
  message: string;

  constructor(message = "Product not found") {
    super(message);
    this.name = "ProductNotFoundError";
    this.code = "PRODUCT_NOT_FOUND";
    this.message = message;
  }
}

export default ProductNotFoundError;
