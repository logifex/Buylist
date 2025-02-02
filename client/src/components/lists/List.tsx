import { memo } from "react";
import ListModel from "../../models/List";
import filterProductsChecked from "../../utils/filterProductsChecked";

interface Props {
  list: ListModel;
}

const List = ({ list }: Props) => {
  const filteredProducts = filterProductsChecked(list.products);
  let productLengthText = `${filteredProducts.unChecked.length} מוצרים`;

  if (filteredProducts.unChecked.length === 1) {
    productLengthText = "מוצר אחד";
  }

  if (filteredProducts.checked.length > 0) {
    productLengthText += ` (+${filteredProducts.checked.length} ${
      filteredProducts.checked.length === 1 ? "מסומן" : "מסומנים"
    })`;
  }

  return (
    <div className="p-4 rounded-md shadow-md bg-gray-200 hover:bg-gray-300 dark:bg-dark-main-800 dark:hover:bg-dark-main-700 break-words">
      <h2 className="text-black dark:text-white text-lg font-semibold text-center">
        {list.name}
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 text-center"> {productLengthText}</p>
    </div>
  );
};

export default memo(List);
