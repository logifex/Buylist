import { PropsWithChildren, useCallback, useState } from "react";
import ModalContext, { ModalContextType } from "./modal-context";
import Modal, { ModalProps } from "../components/ui/Modal";

const ModalProvider = ({ children }: PropsWithChildren) => {
  const [modalProps, setModalProps] = useState<ModalProps>();

  const showModal = useCallback((props: ModalProps) => {
    setModalProps(props);
  }, []);

  const hideModal = useCallback(() => {
    setModalProps(undefined);
  }, []);

  const modalContext: ModalContextType = {
    showModal: showModal,
    hideModal: hideModal,
  };

  return (
    <ModalContext value={modalContext}>
      {children}
      {modalProps && (
        <Modal {...modalProps} onClose={modalProps.onClose ?? hideModal} />
      )}
    </ModalContext>
  );
};

export default ModalProvider;
