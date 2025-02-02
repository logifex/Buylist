import React, {
  PropsWithChildren,
  useCallback,
  useState,
  useEffect,
} from "react";
import auth from "@react-native-firebase/auth";
import {
  GoogleSignin,
  statusCodes,
  NativeModuleError,
} from "@react-native-google-signin/google-signin";
import User from "@/models/User";
import AuthContext, { AuthContextType } from "./auth-context";
import { useNetInfo } from "@react-native-community/netinfo";
import AppDataService from "@/services/AppDataService";
import { useQueryClient } from "@tanstack/react-query";

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
});

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [userInfo, setUserInfo] = useState<User>();
  const [ready, setReady] = useState(false);

  const { isConnected } = useNetInfo();
  const queryClient = useQueryClient();

  useEffect(() => {
    const setSavedUser = async () => {
      const savedUser = await AppDataService.readUser();

      if (!savedUser) {
        return;
      }

      setUserInfo(savedUser);
    };

    setSavedUser();
  }, []);

  const setUserByIdToken = useCallback(async (idToken: string) => {
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    const authUser = await auth().signInWithCredential(googleCredential);
    const currentUser: User = {
      id: authUser.user.uid,
      email: authUser.user.email,
      name: authUser.user.displayName,
      photoUrl: authUser.user.photoURL
        ? authUser.user.photoURL.replace("s96-c", "s400-c")
        : null,
    };
    setUserInfo(currentUser);
    await AppDataService.writeUser(currentUser);
  }, []);

  const signInSilently = useCallback(async () => {
    try {
      const newUser = await GoogleSignin.signInSilently();

      if (!newUser.data?.idToken) {
        return;
      }

      await setUserByIdToken(newUser.data.idToken);
    } catch (error) {
      const nativeModuleError = error as NativeModuleError;
      if (!nativeModuleError.code) {
        throw error;
      }

      if (nativeModuleError.code === statusCodes.SIGN_IN_REQUIRED) {
        console.log("User has not signed in yet");
      } else {
        console.log(error);
      }
    } finally {
      setReady(true);
    }
  }, [setUserByIdToken]);

  useEffect(() => {
    if (isConnected && !ready) {
      signInSilently();
    }
  }, [isConnected, ready, signInSilently]);

  const signIn = useCallback(async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const newUser = await GoogleSignin.signIn();

      if (!newUser.data?.idToken) {
        return;
      }

      await setUserByIdToken(newUser.data.idToken);
    } catch (error) {
      const nativeModuleError = error as NativeModuleError;
      if (!nativeModuleError.code) {
        throw error;
      }

      if (nativeModuleError.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log("Sign in cancelled");
      } else if (nativeModuleError.code === statusCodes.IN_PROGRESS) {
        console.log("Sign in already in progress");
      } else if (
        nativeModuleError.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE
      ) {
        console.log("Play Services not available or outdated");
      } else {
        console.log(error);
      }
    }
  }, [setUserByIdToken]);

  const signOut = async () => {
    try {
      await AppDataService.removeUser();
      await auth().signOut();
      await GoogleSignin.signOut();
      await queryClient.cancelQueries();
      queryClient.removeQueries();
      queryClient.getMutationCache().clear();
      setUserInfo(undefined);
    } catch (error) {
      console.error(error);
    }
  };

  const authContext: AuthContextType = {
    userInfo: userInfo,
    signIn: signIn,
    signOut: signOut,
  };

  return (
    <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
