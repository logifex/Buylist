import { useState } from "react";
import DialogButtons from "../ui/DialogButtons";
import ListConstants from "../../constants/ListConstants";
import FormTextInput from "../ui/FormTextInput";
import FormErrorMessage from "../ui/FormErrorMessage";

interface Props {
  hideModal: () => void;
  onAddList: (name: string) => void;
}

const CreateListModalContent = ({ hideModal, onAddList }: Props) => {
  const [listName, setListName] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>();

  const handleListNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setListName(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (listName.length === 0) {
      setErrorMessage("שם הרשימה לא יכול להיות ריק");
      return;
    }

    onAddList(listName);
    hideModal();
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormErrorMessage errorMessage={errorMessage} />
      <FormTextInput
        type="text"
        placeholder="שם הרשימה"
        autoComplete="off"
        value={listName}
        maxLength={ListConstants.maxListNameLength}
        onChange={handleListNameChange}
      />
      <DialogButtons onCancel={hideModal} />
    </form>
  );
};

export default CreateListModalContent;
