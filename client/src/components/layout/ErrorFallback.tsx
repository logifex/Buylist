interface Props {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback = ({ error, resetErrorBoundary }: Props) => {
  return (
    <div className="bg-background dark:bg-dark-background text-gray-800 dark:text-gray-100 min-h-screen flex">
      <div className="m-auto text-center">
        <h1 className="text-2xl">שגיאה</h1>
        <p>{error.message}</p>
        <button
          className="bg-primary-500 dark:bg-dark-main-700 text-black dark:text-white px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 hover:bg-primary-600 dark:hover:bg-dark-main-600 mt-2"
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
