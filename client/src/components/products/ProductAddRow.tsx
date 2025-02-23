import { useState } from "react";
import ListConstants from "../../constants/ListConstants";

interface Props {
  onSubmit: (productName: string) => void;
}

const ProductAddRow = ({ onSubmit }: Props) => {
  const [enteredProductName, setEnteredProductName] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEnteredProductName(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (enteredProductName == "") {
      return;
    }

    onSubmit(enteredProductName);
    setEnteredProductName("");
  };

  return (
    <div className="flex justify-center p-4">
      <form className="flex gap-2 w-full" onSubmit={handleSubmit}>
        <input
          id="product-name-input"
          className="bg-transparent border-b-2 text-center flex-1 border-gray-600 placeholder-gray-600 dark:border-gray-400 dark:placeholder-gray-400 text-black dark:text-white"
          type="text"
          placeholder="הוספת מוצר"
          autoComplete="off"
          value={enteredProductName}
          maxLength={ListConstants.maxProductNameLength}
          onChange={handleInputChange}
        />
        <button
          className="flex items-center justify-center w-8 h-8 text-black rounded-full p-4 bg-primary-500 hover:bg-primary-600"
          type="submit"
          title="הוספת מוצר"
        >
          +
        </button>
      </form>
    </div>
  );
};

export default ProductAddRow;
