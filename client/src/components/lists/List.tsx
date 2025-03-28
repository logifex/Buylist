import { memo } from "react";
import ListModel from "../../models/List";
import filterProductsChecked from "../../utils/filterProductsChecked";
import { MdOutlineStar, MdOutlineStarBorder } from "react-icons/md";
import { Link } from "react-router";

interface Props {
  list: ListModel;
  isStarred: boolean;
  onStar: (listId: string, star: boolean) => void;
}

const List = ({ list, isStarred, onStar }: Props) => {
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
    <div className="p-4 rounded-md shadow-md bg-gray-200 hover:bg-gray-300 dark:bg-dark-main-800 dark:hover:bg-dark-main-700 break-words flex items-center group">
      <div className="w-5">
        <button
          type="button"
          className={isStarred ? "block" : "hidden group-hover:block"}
          onClick={() => onStar(list.id, !isStarred)}
        >
          {isStarred ? (
            <MdOutlineStar size={20} title="מסומן בכוכב" />
          ) : (
            <MdOutlineStarBorder size={20} title="לא מסומן בכוכב" />
          )}
        </button>
      </div>
      <Link className="block flex-1" to={`/lists/${list.id}`}>
        <div>
          <h2 className="text-black dark:text-white text-lg font-semibold text-center">
            {list.name}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            {" "}
            {productLengthText}
          </p>
        </div>
      </Link>
      <div className="w-5"></div>
    </div>
  );
};

export default memo(List);
