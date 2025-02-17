import DialogButtons from "./DialogButtons";

interface Props {
  text: string;
  confirmText?: string;
  cancelText?: string;
  secondaryText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  onSecondary?: () => void;
}

const Dialog = ({
  text,
  confirmText = "אישור",
  cancelText = "ביטול",
  secondaryText,
  onConfirm,
  onCancel,
  onSecondary,
}: Props) => {
  return (
    <div>
      <div className="text-center pb-6 break-words">
        <p className="text-black dark:text-white whitespace-pre-line">{text}</p>
      </div>
      <DialogButtons
        confirmText={confirmText}
        cancelText={cancelText}
        secondaryText={secondaryText}
        onConfirm={onConfirm}
        onCancel={onCancel}
        onSecondary={onSecondary}
      />
    </div>
  );
};

export default Dialog;
