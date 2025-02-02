import { useState } from "react";
import DialogButtons from "../ui/DialogButtons";
import List, { ListInfo } from "../../models/List";
import ListConstants from "../../constants/ListConstants";
import useFormState from "../../hooks/useFormState";
import FormTextInput from "../ui/FormTextInput";
import FormErrorMessage from "../ui/FormErrorMessage";

interface ColorDetails {
  listColor: List["color"];
  text: string;
}

interface Props {
  list: ListInfo;
  hideModal: () => void;
  onEditList: (listInfo: ListInfo) => void;
}

const colors: ColorDetails[] = [
  { listColor: "GRAY", text: "אפור" },
  { listColor: "BROWN", text: "חום" },
  { listColor: "RED", text: "אדום" },
  { listColor: "BLUE", text: "כחול" },
  { listColor: "GREEN", text: "ירוק" },
  { listColor: "YELLOW", text: "צהוב" },
  { listColor: "PINK", text: "ורוד" },
];

const EditListModalContent = ({ list, hideModal, onEditList }: Props) => {
  const [errorMessage, setErrorMessage] = useState<string>();
  const { state: enteredListInfo, handleChange } = useFormState({ ...list });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (enteredListInfo.name.length === 0) {
      setErrorMessage("שם הרשימה לא יכול להיות ריק");
      return;
    }

    if (enteredListInfo.name !== list.name) {
      onEditList(enteredListInfo);
    }
    hideModal();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <FormErrorMessage errorMessage={errorMessage} />
        <FormTextInput
          type="text"
          placeholder="שם הרשימה"
          autoComplete="off"
          value={enteredListInfo.name}
          maxLength={ListConstants.maxListNameLength}
          onChange={handleChange("name")}
        />
        <label>
          <p className="mb-1 text-black dark:text-white">צבע הרשימה</p>
          <select
            className="w-full p-1 rounded-md bg-gray-300 text-gray-700 dark:text-gray-100 dark:bg-dark-main-700 border border-dark-main-600 focus:outline-none focus:ring-2 focus:ring-primary-500 mb-4"
            value={enteredListInfo.color}
            onChange={handleChange("color")}
          >
            {colors.map((c) => (
              <option key={c.listColor} value={c.listColor}>
                {c.text}
              </option>
            ))}
          </select>
        </label>
      </div>
      <DialogButtons onCancel={hideModal} />
    </form>
  );
};

export default EditListModalContent;
