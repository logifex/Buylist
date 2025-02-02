import ReactDOM from "react-dom";
import { ReactNode, useEffect } from "react";

export interface ModalProps {
  content: ReactNode;
  title?: string;
  showClose?: boolean;
  onClose?: () => void;
  canClose?: boolean;
}

const Modal = ({
  content,
  title,
  showClose,
  onClose,
  canClose = true,
}: ModalProps) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const modalRoot = document.getElementById("modal");
  if (!modalRoot) return;

  return ReactDOM.createPortal(
    <div
      className="overflow-hidden fixed inset-0 bg-background dark:bg-dark-background bg-opacity-80 dark:bg-opacity-80 flex items-center justify-center"
      onClick={(e) => {
        e.stopPropagation();
        if (canClose && onClose) {
          onClose();
        }
      }}
    >
      <div
        className="bg-gray-200 dark:bg-dark-main-800 rounded-lg shadow-lg p-6 w-full max-w-sm m-4 max-h-full overflow-y-auto relative"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {showClose && (
          <div className="absolute top-4 end-4 text-black dark:text-white text-xl">
            <button type="button" onClick={onClose}>
              x
            </button>
          </div>
        )}
        {title && (
          <h2 className="text-black dark:text-white text-xl font-bold mb-4 text-center">
            {title}
          </h2>
        )}
        {content}
      </div>
    </div>,
    modalRoot
  );
};

export default Modal;
