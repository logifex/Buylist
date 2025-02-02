import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { prisma } from "../config";
import {
  CreateProductInput,
  EditProductInput,
  ProductDetails,
} from "../types/product";
import { productDetailsSelect } from "../utils/selects";
import SocketService from "./SocketService";
import { ListNotFoundError, ProductNotFoundError } from "../errors";

const getProduct = async (
  productId: string,
  listId: string
): Promise<ProductDetails | null> => {
  return prisma.product.findUnique({
    where: { id: productId, listId: listId },
    select: productDetailsSelect,
  });
};

const createProduct = async (
  productInput: CreateProductInput,
  listId: string
): Promise<ProductDetails> => {
  const { name, note, isChecked } = productInput;

  try {
    const product = await prisma.product.create({
      data: {
        name: name,
        note: note,
        isChecked: isChecked,
        listId: listId,
      },
      select: productDetailsSelect,
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
  listId: string
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
  listId: string
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
