import { Product, ProductInput, SharedProduct } from "@/models/Product";
import { fetchWithAuth } from "@/utils/apiUtils";

const serverUrl = process.env.EXPO_PUBLIC_SERVER_URL;

if (!serverUrl) {
  throw new Error("Server URL is not defined");
}

const ProductService = {
  async createProduct(
    listId: string,
    product: ProductInput,
  ): Promise<SharedProduct> {
    const response = await fetchWithAuth(
      `${serverUrl}/api/lists/${listId}/products`,
      {
        method: "POST",
        body: JSON.stringify({
          name: product.name,
          note: product.note,
          isChecked: product.isChecked,
        }),
      },
    );

    const json = (await response.json()) as Product;
    return { ...json, isSynced: true };
  },
  async updateProduct(listId: string, product: Product) {
    await fetchWithAuth(
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
  },
  async deleteProduct(listId: string, productId: string) {
    await fetchWithAuth(
      `${serverUrl}/api/lists/${listId}/products/${productId}`,
      { method: "DELETE" },
    );
  },
};

export default ProductService;
