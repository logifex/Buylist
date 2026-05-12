interface Props {
  error: unknown;
  resetErrorBoundary: () => void;
}

const ErrorFallback = ({ error, resetErrorBoundary }: Props) => {
  const errorMessage =
    error && typeof error === "object" && "message" in error
      ? String(error.message)
      : "שגיאה לא ידועה";

  return (
    <div className="bg-background dark:bg-dark-background text-gray-800 dark:text-gray-100 min-h-screen flex">
      <div className="m-auto text-center">
        <h1 className="text-2xl">שגיאה</h1>
        <p>{errorMessage}</p>
        <button
          className="bg-primary-500 dark:bg-dark-main-700 text-black dark:text-white px-2 py-1 rounded-md focus:outline-hidden focus:ring-2 focus:ring-primary-500 hover:bg-primary-600 dark:hover:bg-dark-main-600 mt-2"
          type="button"
          onClick={resetErrorBoundary}
        >
          ניסיון נוסף
        </button>
      </div>
    </div>
  );
};

export default ErrorFallback;
