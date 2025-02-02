import NotFoundError from "./NotFoundError";

class ProductNotFoundError extends NotFoundError {
  message: string;

  constructor(message: string = "Product not found") {
    super(message);
    this.name = "ProductNotFoundError";
    this.code = "PRODUCT_NOT_FOUND";
    this.message = message;
  }
}

export default ProductNotFoundError;
