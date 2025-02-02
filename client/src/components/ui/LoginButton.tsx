import { useContext } from "react";
import AuthContext from "../../store/auth-context";

interface Props {
  className?: React.HTMLAttributes<HTMLButtonElement>["className"];
}

const LoginButton = ({
  className = "bg-primary-400 hover:bg-primary-600 dark:bg-dark-background dark:hover:bg-dark-main-700 px-4 py-1 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-600 dark:focus:ring-dark-main-400",
}: Props) => {
  const { signIn } = useContext(AuthContext);

  return (
    <button
      className={className}
      type="button"
      onClick={() => {
        void signIn();
      }}
    >
      התחברות
    </button>
  );
};

export default LoginButton;
