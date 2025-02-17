import { useContext } from "react";
import AuthContext from "../../store/auth-context";
import { Outlet } from "react-router";
import Loading from "../ui/Loading";
import HomePage from "../../pages/home";

const AuthenticationLayout = () => {
  const { userInfo, ready } = useContext(AuthContext);

  if (!ready) {
    return <Loading />;
  }

  return userInfo ? (
    <Outlet />
  ) : (
    <HomePage />
  );
};

export default AuthenticationLayout;
