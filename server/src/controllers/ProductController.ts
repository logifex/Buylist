import type { NextFunction, Request, Response } from "express";
import type {
  CreateProductInput,
  EditProductInput,
  ProductDetails,
  ProductIdParam,
} from "../types/product.js";
import type { ListIdParam } from "../types/list.js";
import { ProductService } from "../services/index.js";
import { ProductNotFoundError } from "../errors/index.js";

const checkProductExists = async (
  req: Request<ListIdParam & ProductIdParam, object, object>,
  res: Response,
  next: NextFunction,
) => {
  const { listId, productId } = req.params;

  const product = await ProductService.getProduct(productId, listId);

  if (!product) {
    return next(new ProductNotFoundError());
  }

  next();
};

const postProduct = async (
  req: Request<ListIdParam, object, CreateProductInput>,
  res: Response<ProductDetails>,
) => {
  const { listId } = req.params;
  const productInput = req.body;

  const product = await ProductService.createProduct(productInput, listId);

  res.status(201).json(product);
};

const patchProduct = async (
  req: Request<ListIdParam & ProductIdParam, object, EditProductInput>,
  res: Response<ProductDetails>,
) => {
  const { listId, productId } = req.params;
  const productInput = req.body;

  const updatedProduct = await ProductService.editProduct(
    productId,
    productInput,
    listId,
  );

  res.status(200).json(updatedProduct);
};

const deleteProduct = async (
  req: Request<ListIdParam & ProductIdParam, object, object>,
  res: Response<void>,
) => {
  const { listId, productId } = req.params;

  await ProductService.deleteProduct(productId, listId);

  res.status(204).send();
};

export default {
  checkProductExists,
  postProduct,
  patchProduct,
  deleteProduct,
};
