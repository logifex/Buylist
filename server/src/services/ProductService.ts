import type {
  CreateProductInput,
  EditProductInput,
  ProductDetails,
} from "../types/product.js";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { prisma, resourceLimits } from "../config/index.js";
import { productDetailsSelect } from "../utils/selects.js";
import SocketService from "./SocketService.js";
import {
  ListNotFoundError,
  ProductNotFoundError,
  TooManyProducts,
} from "../errors/index.js";

const getProduct = async (
  productId: string,
  listId: string,
): Promise<ProductDetails | null> => {
  return prisma.product.findUnique({
    where: { id: productId, listId: listId },
    select: productDetailsSelect,
  });
};

const createProduct = async (
  productInput: CreateProductInput,
  listId: string,
): Promise<ProductDetails> => {
  const { name, note, isChecked } = productInput;

  try {
    const product = await prisma.$transaction(async (tx) => {
      const productAmount = await tx.product.count({
        where: {
          listId: listId,
        },
      });

      if (productAmount >= resourceLimits.PRODUCT_LIMIT) {
        throw new TooManyProducts();
      }

      return prisma.product.create({
        data: {
          name: name,
          note: note,
          isChecked: isChecked,
          listId: listId,
        },
        select: productDetailsSelect,
      });
    });
    SocketService.emitProductAdd(listId, product);

    return product;
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      if (err.code === "P2003") {
        throw new ListNotFoundError();
      }
    }
    throw err;
  }
};

const editProduct = async (
  productId: string,
  productInput: EditProductInput,
  listId: string,
): Promise<ProductDetails> => {
  const { name, note, isChecked } = productInput;

  try {
    const updatedProduct = await prisma.product.update({
      where: { id: productId, listId: listId },
      data: {
        name: name,
        note: note,
        isChecked: isChecked,
      },
      select: productDetailsSelect,
    });
    SocketService.emitProductUpdate(listId, updatedProduct);

    return updatedProduct;
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        throw new ProductNotFoundError();
      }
    }
    throw err;
  }
};

const deleteProduct = async (
  productId: string,
  listId: string,
): Promise<void> => {
  try {
    await prisma.product.delete({ where: { id: productId, listId: listId } });
    SocketService.emitProductDelete(listId, productId);
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        throw new ProductNotFoundError();
      }
    }
    throw err;
  }
};

export default {
  getProduct,
  createProduct,
  editProduct,
  deleteProduct,
};
