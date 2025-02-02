import { createContext } from "react";
import { ModalProps } from "../components/ui/Modal";

export interface ModalContextType {
  showModal: (props: ModalProps) => void;
  hideModal: () => void;
}

const ModalContext = createContext<ModalContextType>({
  showModal: () => {
    return;
  },
  hideModal: () => {
    return;
  },
});

export default ModalContext;
