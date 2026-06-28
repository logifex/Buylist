import React, {
  PropsWithChildren,
  useCallback,
  useState,
  useEffect,
} from "react";
import {
  GoogleSignin,
  statusCodes,
  isErrorWithCode,
} from "@react-native-google-signin/google-signin";
import { User } from "@/models/User";
import AuthContext, { AuthContextType } from "./auth-context";
import { useQueryClient } from "@tanstack/react-query";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signOut as authSignOut,
  connectAuthEmulator,
  FirebaseAuthTypes,
} from "@react-native-firebase/auth";
import Toast from "react-native-toast-message";
import { auth } from "@/config/firebase";

if (__DEV__ && process.env.EXPO_PUBLIC_FIREBASE_AUTH_EMULATOR_URL) {
  connectAuthEmulator(auth, process.env.EXPO_PUBLIC_FIREBASE_AUTH_EMULATOR_URL);
}

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
});

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [userInfo, setUserInfo] = useState<User>();

  const queryClient = useQueryClient();

  const signInWithIdToken = useCallback(async (idToken: string) => {
    const GoogleAuth = GoogleAuthProvider as {
      credential(idToken: string): FirebaseAuthTypes.AuthCredential;
    };
    const googleCredential = GoogleAuth.credential(idToken);
    await signInWithCredential(auth, googleCredential);
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
      if (!isErrorWithCode(error)) {
        throw error;
      }

      switch (error.code) {
        case statusCodes.SIGN_IN_CANCELLED:
          console.log("Sign in cancelled");
          break;
        case statusCodes.IN_PROGRESS:
          console.log("Sign in already in progress");
          break;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          console.log("Play Services not available or outdated");
          break;
        default:
          Toast.show({
            type: "base",
            text1: "שגיאה בהתחברות למשתמש",
          });
          console.log(error);
          break;
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
      if (!isErrorWithCode(error)) {
        throw error;
      }

      if (error.code === statusCodes.SIGN_IN_REQUIRED) {
        console.log("User has not signed in yet");
      } else {
        console.log(error);
      }
    }
  }, [signInWithIdToken]);

  const signOut = async () => {
    try {
      await authSignOut(auth);
    } catch (error) {
      Toast.show({
        type: "base",
        text1: "שגיאה בהתנתקות מהמשתמש",
      });
      console.error(error);
    }
  };

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        void onSignOut();
      } else {
        if (!user.email || !user.displayName) {
          void signOut();
          return;
        }

        const currentUser: User = {
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
    if (auth.currentUser || !GoogleSignin.hasPreviousSignIn()) {
      return;
    }

    const newUser = GoogleSignin.getCurrentUser();

    if (!newUser?.idToken) {
      void signInSilently();
      return;
    }

    void signInWithIdToken(newUser.idToken);
  }, [signInSilently, signInWithIdToken]);

  const authContext: AuthContextType = {
    userInfo: userInfo,
    signIn: signIn,
    signOut: signOut,
  };

  return <AuthContext value={authContext}>{children}</AuthContext>;
};

export default AuthProvider;
