import { PropsWithChildren, useCallback, useEffect, useState } from "react";
import User from "../models/User";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../config/firebase";
import AuthContext, { AuthContextType } from "./auth-context";
import { useQueryClient } from "@tanstack/react-query";
import ListQueryKeys from "../constants/QueryKeys";
import { toast } from "react-toastify";

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [userInfo, setUserInfo] = useState<User>();
  const [ready, setReady] = useState(false);

  const queryClient = useQueryClient();

  const onSignOut = useCallback(async () => {
    await queryClient.cancelQueries();
    queryClient.removeQueries({ queryKey: ListQueryKeys.all });
    setUserInfo(undefined);
  }, [queryClient]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        void onSignOut();
      } else {
        setUserInfo({
          id: user.uid,
          email: user.email,
          name: user.displayName,
          photoUrl: user.photoURL,
        });
      }
      setReady(true);
    });

    return () => {
      unsubscribe();
    };
  }, [onSignOut]);

  const signIn = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      toast.error("שגיאה בהתחברות למשתמש");
      console.error(error);
    }
  };

  const signOut = async () => {
    try {
      await auth.signOut();
    } catch (err) {
      toast.error("שגיאה בהתנתקות מהמשתמש");
      console.error(err);
    }
  };

  const authContext: AuthContextType = {
    userInfo: userInfo,
    ready: ready,
    signIn: signIn,
    signOut: signOut,
  };

  return (
    <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
