import Product, { ProductInput } from "../models/Product";
import { fetchWithAuth } from "../utils/apiUtils";

const serverUrl = import.meta.env.VITE_SERVER_URL;

const ProductService = {
  async createProduct(
    listId: string,
    productInput: ProductInput
  ): Promise<Product> {
    const response = await fetchWithAuth(
      `${serverUrl}/api/lists/${listId}/products`,
      {
        method: "POST",
        body: JSON.stringify({
          name: productInput.name,
          note: productInput.note,
          isChecked: productInput.isChecked,
        }),
      }
    );

    const product = (await response.json()) as Product;
    return product;
  },
  async updateProduct(listId: string, product: Product) {
    const response = await fetchWithAuth(
      `${serverUrl}/api/lists/${listId}/products/${product.id}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          name: product.name,
          note: product.note,
          isChecked: product.isChecked,
        }),
      },
    );

    const updatedProduct = (await response.json()) as Product;
    return updatedProduct;
  },
  async deleteProduct(listId: string, productId: string) {
    await fetchWithAuth(
      `${serverUrl}/api/lists/${listId}/products/${productId}`,
      { method: "DELETE" }
    );
  },
};

export default ProductService;
