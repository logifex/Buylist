import React, {
  PropsWithChildren,
  useCallback,
  useState,
  useEffect,
} from "react";
import firebaseAuth from "@react-native-firebase/auth";
import {
  GoogleSignin,
  statusCodes,
  NativeModuleError,
} from "@react-native-google-signin/google-signin";
import User from "@/models/User";
import AuthContext, { AuthContextType } from "./auth-context";
import { useQueryClient } from "@tanstack/react-query";
import { auth } from "@/config/firebase";
import Toast from "react-native-toast-message";

if (__DEV__ && process.env.EXPO_PUBLIC_FIREBASE_AUTH_EMULATOR_URL) {
  auth.useEmulator(process.env.EXPO_PUBLIC_FIREBASE_AUTH_EMULATOR_URL);
}

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
});

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [userInfo, setUserInfo] = useState<User>();

  const queryClient = useQueryClient();

  const signInWithIdToken = useCallback(async (idToken: string) => {
    const googleCredential =
      firebaseAuth.GoogleAuthProvider.credential(idToken);
    await auth.signInWithCredential(googleCredential);
  }, []);

  const signIn = useCallback(async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const newUser = await GoogleSignin.signIn();

      if (!newUser.data?.idToken) {
        return;
      }

      await signInWithIdToken(newUser.data.idToken);
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
        Toast.show({
          type: "base",
          text1: "שגיאה בהתחברות למשתמש",
        });
        console.log(error);
      }
    }
  }, [signInWithIdToken]);

  const signInSilently = useCallback(async () => {
    try {
      const newUser = await GoogleSignin.signInSilently();

      if (!newUser.data?.idToken) {
        return;
      }

      await signInWithIdToken(newUser.data.idToken);
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
    }
  }, [signInWithIdToken]);

  const onSignOut = useCallback(async () => {
    try {
      await GoogleSignin.signOut();
      await queryClient.cancelQueries();
      queryClient.removeQueries();
      queryClient.getMutationCache().clear();
      setUserInfo(undefined);
    } catch (error) {
      console.error(error);
    }
  }, [queryClient]);

  const signOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      Toast.show({
        type: "base",
        text1: "שגיאה בהתנתקות מהמשתמש",
      });
      console.error(error);
    }
  };

  const authContext: AuthContextType = {
    userInfo: userInfo,
    signIn: signIn,
    signOut: signOut,
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        await onSignOut();
      } else {
        const currentUser = {
          id: user.uid,
          email: user.email,
          name: user.displayName,
          photoUrl: user.photoURL
            ? user.photoURL.replace("s96-c", "s400-c")
            : null,
        };
        setUserInfo(currentUser);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [onSignOut]);

  useEffect(() => {
    if (!auth.currentUser) {
      signInSilently();
    }
  }, [signInSilently]);

  return (
    <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
