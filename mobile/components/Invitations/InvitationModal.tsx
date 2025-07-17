import React from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import List, { SharedList } from "@/models/List";
import AuthRequiredBottomModal from "../Ui/AuthRequiredBottomModal";
import Invitation from "./Invitation";

type Props = {
  onRequestClose: () => void;
  onShareList: () => Promise<SharedList>;
  list: List;
  ref: React.RefObject<BottomSheetModal | null>;
};

const InvitationModal = ({ onRequestClose, onShareList, list, ref }: Props) => {
  return (
    <AuthRequiredBottomModal
      ref={ref}
      title="הזמנה לרשימה"
      snapPoints={[300]}
      showHandle
      closeKeyboard
      onRequestClose={onRequestClose}
    >
      <Invitation onShareList={onShareList} list={list} />
    </AuthRequiredBottomModal>
  );
};

export default InvitationModal;
