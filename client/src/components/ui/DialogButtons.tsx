interface Props {
  confirmText?: string;
  cancelText?: string;
  secondaryText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  onSecondary?: () => void;
}

const DialogButtons = ({
  confirmText = "אישור",
  cancelText = "ביטול",
  secondaryText,
  onConfirm,
  onCancel,
  onSecondary,
}: Props) => {
  const buttonClassName: React.HTMLAttributes<HTMLButtonElement>["className"] =
    "bg-gray-300 hover:bg-gray-400 text-black dark:bg-dark-main-600 dark:hover:bg-dark-main-700 dark:text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500";

  return (
    <div className="flex justify-between">
      <div className="flex gap-4">
        <button type="button" onClick={onCancel} className={buttonClassName}>
          {cancelText}
        </button>
        {secondaryText && (
          <button
            type="button"
            onClick={onSecondary}
            className={buttonClassName}
          >
            {secondaryText}
          </button>
        )}
      </div>
      <button type="submit" onClick={onConfirm} className={buttonClassName}>
        {confirmText}
      </button>
    </div>
  );
};

export default DialogButtons;
