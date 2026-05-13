import { useContext } from "react";
import type { List, ListInput } from "../../models/List";
import ModalContext from "../../store/modal-context";
import EditListModalContent from "./EditListModalContent";
import Dialog from "../ui/Dialog";
import AuthContext from "../../store/auth-context";
import { IoPeople, IoPersonAdd } from "react-icons/io5";
import Participants from "../participants/Participants";

interface Props {
  list: List;
  onEditList: (listInput: ListInput) => void;
  onDeleteList: () => void;
  onLeaveList: () => void;
}

const ListDetailsCard = ({
  list,
  onEditList,
  onDeleteList,
  onLeaveList,
}: Props) => {
  const { showModal, hideModal } = useContext(ModalContext);
  const { userInfo } = useContext(AuthContext);

  const handleParticipantsClick = () => {
    showModal({
      content: <Participants list={list} />,
      title: "משתתפים",
      showClose: true,
    });
  };

  const handleEditListClick = () => {
    showModal({
      content: (
        <EditListModalContent
          list={list}
          hideModal={hideModal}
          onEditList={onEditList}
        />
      ),
      title: "עריכת רשימה",
    });
  };

  const isOwner = list.participants[0].user.id === userInfo?.id;

  const handleDeleteLeaveListClick = () => {
    showModal({
      content: (
        <Dialog
          text={
            isOwner
              ? `האם למחוק את הרשימה '${list.name}'?`
              : `האם לעזוב את הרשימה '${list.name}'?`
          }
          onConfirm={() => {
            if (isOwner) {
              onDeleteList();
            } else {
              onLeaveList();
            }
            hideModal();
          }}
          onCancel={hideModal}
        />
      ),
      title: isOwner ? "מחיקת רשימה" : "עזיבת רשימה",
    });
  };

  const participantsText =
    list.participants.length === 1
      ? "משתתף אחד"
      : `${list.participants.length.toString()} משתתפים`;

  return (
    <div className="flex md:block">
      <div className="bg-gray-200 dark:bg-dark-main-800 p-4 rounded-md shadow-md flex md:flex-col gap-4 items-center md:items-start mx-auto md:w-64 max-w-full">
        <div className="max-w-full wrap-break-word min-w-0">
          <h2 className="text-lg md:text-2xl font-semibold text-black dark:text-white">
            {list.name}
          </h2>
          <button
            className="text-sm text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-gray-200 flex items-center mt-2 gap-2 focus:outline-hidden"
            type="button"
            onClick={handleParticipantsClick}
          >
            <IoPeople className="text-base" />
            <span>{participantsText}</span>
            <span className="text-gray-300 dark:text-gray-600 font-light">
              |
            </span>
            <IoPersonAdd className="text-base shrink-0" />
            <span className="hidden sm:inline">הזמנה</span>
          </button>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleEditListClick}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          >
            עריכה
          </button>
          <button
            onClick={handleDeleteLeaveListClick}
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md focus:outline-hidden focus:ring-2 focus:ring-red-500"
          >
            {isOwner ? "מחיקה" : "עזיבה"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListDetailsCard;
