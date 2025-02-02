import { MdDelete, MdEdit } from "react-icons/md";
import ProductModel from "../../models/Product";
import { memo } from "react";
import getGradientColor from "../../utils/getGradientColor";
import List from "../../models/List";

interface Props extends ProductModel {
  color: List["color"];
  onChange: (updatedProduct: ProductModel) => void;
  onDelete: (productId: string) => void;
  onEditClick: (product: ProductModel) => void;
}

const Product = ({
  color,
  onChange,
  onDelete,
  onEditClick,
  ...rest
}: Props) => {
  const product = rest;

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...product, isChecked: e.target.checked });
  };
  const checkedClass = product.isChecked ? " line-through" : "";
  const backgroundColor = getGradientColor(color);
  const isNote = product.note && product.note !== "";

  return (
    <div
      className="rounded-2xl p-2 md:py-3 border-2 border-black flex justify-between shadow-md"
      style={{
        backgroundImage: `linear-gradient(to right, ${backgroundColor[0]}, ${backgroundColor[1]})`,
      }}
    >
      <div className="flex min-w-0">
        <div className="p-2 content-center">
          <input
            type="checkbox"
            title="סימון"
            checked={product.isChecked}
            onChange={handleCheck}
          />
        </div>
        <div className="flex flex-col break-words min-w-0">
          <p className={`text-lg text-black${checkedClass}`}>{product.name}</p>
          <p
            className={`text-sm${checkedClass} ${
              isNote ? "text-black" : "text-gray-800"
            }`}
          >
            {isNote ? product.note : "הערה"}
          </p>
        </div>
      </div>
      <div className="flex">
        <button type="button" onClick={() => onEditClick(product)}>
          <MdEdit color="black" size={48} title="עריכת מוצר" />
        </button>
        <button
          type="button"
          onClick={() => {
            onDelete(product.id);
          }}
        >
          <MdDelete color="black" size={48} title="מחיקת מוצר" />
        </button>
      </div>
    </div>
  );
};

export default memo(Product);
