import Product, { FilteredProducts } from "../models/Product";

const filterProductsChecked = (products: Product[]) => {
  return products.reduce<FilteredProducts>(
    (res, product) => {
      res[product.isChecked ? "checked" : "unChecked"].push(product);

      return res;
    },
    { unChecked: [], checked: [] }
  );
};

export default filterProductsChecked;
