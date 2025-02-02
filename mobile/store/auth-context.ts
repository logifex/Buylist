import React from "react";
import User from "@/models/User";

export type AuthContextType = {
  userInfo?: User;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = React.createContext<AuthContextType>({
  userInfo: undefined,
  signIn: () => {
    return Promise.resolve();
  },
  signOut: () => {
    return Promise.resolve();
  },
});

export default AuthContext;
