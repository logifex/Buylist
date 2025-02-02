import { NextFunction, Request, Response } from "express";
import {
  CreateProductInput,
  EditProductInput,
  ProductDetails,
  ProductIdParam,
} from "../types/product";
import { ListIdParam } from "../types/list";
import { ProductService } from "../services";
import { ProductNotFoundError } from "../errors";

const checkProductExists = async (
  req: Request<ListIdParam & ProductIdParam, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  const { listId, productId } = req.params;

  const product = await ProductService.getProduct(productId, listId);

  if (!product) {
    return next(new ProductNotFoundError());
  }

  next();
};

const postProduct = async (
  req: Request<ListIdParam, {}, CreateProductInput>,
  res: Response<ProductDetails>,
  next: NextFunction
) => {
  const { listId } = req.params;
  const productInput = req.body;

  const product = await ProductService.createProduct(productInput, listId);

  res.status(201).json(product);
};

const patchProduct = async (
  req: Request<ListIdParam & ProductIdParam, {}, EditProductInput>,
  res: Response<ProductDetails>,
  next: NextFunction
) => {
  const { listId, productId } = req.params;
  const productInput = req.body;

  const updatedProduct = await ProductService.editProduct(
    productId,
    productInput,
    listId
  );

  res.status(200).json(updatedProduct);
};

const deleteProduct = async (
  req: Request<ListIdParam & ProductIdParam, {}, {}>,
  res: Response<{}>,
  next: NextFunction
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
