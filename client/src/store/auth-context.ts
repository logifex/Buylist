import React from "react";
import User from "../models/User";

export interface AuthContextType {
  userInfo?: User;
  ready: boolean,
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType>({
  userInfo: undefined,
  ready: false,
  signIn: () => {
    return Promise.resolve();
  },
  signOut: () => {
    return Promise.resolve();
  },
});

export default AuthContext;
