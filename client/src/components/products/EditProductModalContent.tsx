import { useState } from "react";
import DialogButtons from "../ui/DialogButtons";
import Product, { ProductInput } from "../../models/Product";
import ListConstants from "../../constants/ListConstants";
import useFormState from "../../hooks/useFormState";
import FormTextInput from "../ui/FormTextInput";
import FormErrorMessage from "../ui/FormErrorMessage";

interface Props {
  product: Product;
  hideModal: () => void;
  onEditProduct: (product: ProductInput) => void;
}

const EditProductModalContent = ({
  product,
  hideModal,
  onEditProduct,
}: Props) => {
  const { state: enteredProduct, handleChange } = useFormState({ ...product });
  const [errorMessage, setErrorMessage] = useState<string>();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (enteredProduct.name === "") {
      setErrorMessage("שם המוצר לא יכול להיות ריק");
      return;
    }

    const newNote = enteredProduct.note !== "" ? enteredProduct.note : null;
    onEditProduct({ ...enteredProduct, note: newNote });
    hideModal();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <FormErrorMessage errorMessage={errorMessage} />
        <FormTextInput
          id="product-name-input"
          type="text"
          placeholder="שם המוצר"
          autoComplete="off"
          value={enteredProduct.name}
          maxLength={ListConstants.maxProductNameLength}
          onChange={handleChange("name")}
          label="שם"
        />
        <FormTextInput
          id="product-note-input"
          type="text"
          placeholder="הערה"
          autoComplete="off"
          value={enteredProduct.note ?? ""}
          maxLength={ListConstants.maxProductNoteLength}
          onChange={handleChange("note")}
          label="הערה"
        />
        <label className="flex text-black dark:text-white items-center">
          <input
            id="product-checkbox"
            className="me-2"
            type="checkbox"
            checked={enteredProduct.isChecked}
            onChange={handleChange("isChecked")}
          />
          מסומן
        </label>
      </div>
      <DialogButtons onCancel={hideModal} />
    </form>
  );
};

export default EditProductModalContent;
