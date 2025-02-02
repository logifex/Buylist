import { PropsWithChildren, useEffect, useState } from "react";
import User from "../models/User";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../config/firebase";
import AuthContext, { AuthContextType } from "./auth-context";
import { useQueryClient } from "@tanstack/react-query";
import ListQueryKeys from "../constants/QueryKeys";

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [userInfo, setUserInfo] = useState<User>();
  const [ready, setReady] = useState(false);

  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUserInfo(
        user
          ? {
              id: user.uid,
              email: user.email,
              name: user.displayName,
              photoUrl: user.photoURL,
            }
          : undefined
      );
      setReady(true);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const signIn = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error(error);
    }
  };

  const signOut = async () => {
    try {
      await auth.signOut();
      await queryClient.cancelQueries();
      queryClient.removeQueries({ queryKey: ListQueryKeys.all });
    } catch (err) {
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
