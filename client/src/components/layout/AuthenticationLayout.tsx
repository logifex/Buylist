import { useContext } from "react";
import AuthContext from "../../store/auth-context";
import { Outlet } from "react-router";
import Loading from "../ui/Loading";
import LoginButton from "../ui/LoginButton";

const AuthenticationLayout = () => {
  const { userInfo, ready } = useContext(AuthContext);

  if (!ready) {
    return <Loading />;
  }

  return userInfo ? (
    <Outlet />
  ) : (
    <div className="flex flex-col items-center gap-4">
      <p className="text-center text-lg font-semibold text-black dark:text-white">
        יש צורך בהתחברות כדי להשתמש ברשימות.
      </p>
      <LoginButton className="bg-primary-500 hover:bg-primary-600 dark:bg-dark-main-800 dark:hover:bg-dark-main-700 px-4 py-2 rounded-lg" />
    </div>
  );
};

export default AuthenticationLayout;
