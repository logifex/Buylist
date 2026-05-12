import React, { useContext, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import * as NavigationBar from "expo-navigation-bar";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";
import { Stack } from "expo-router";
import HeaderButton from "../components/Ui/HeaderButton";
import ThemeContext from "../store/theme-context";
import Providers from "./providers";
import JoinList from "@/components/Invitations/JoinList";
import AppContext from "@/store/app-context";
import * as StoreReview from "expo-store-review";
import { StyleSheet, View } from "react-native";
import { useNetInfo } from "@react-native-community/netinfo";
import { connectSocket } from "@/config/socket";
import AuthContext from "@/store/auth-context";
import { NavigationProp } from "@react-navigation/native";

if (__DEV__) {
  import("@/ReactotronConfig");
}

export type RootStackParamList = {
  index: undefined;
  list: { listId: string; isShared: string };
  settings: undefined;
};

const HomeHeaderRight = ({
  navigation,
}: {
  navigation: NavigationProp<RootStackParamList>;
}) => {
  const { theme } = useContext(ThemeContext);

  return (
    <HeaderButton
      onPress={() => {
        if (navigation.getState().index === 0) {
          navigation.navigate("settings");
        }
      }}
    >
      <MaterialIcon
        name="settings"
        size={24}
        color={theme.text}
        accessibilityLabel="הגדרות"
      />
    </HeaderButton>
  );
};

const RootLayout = () => {
  return (
    <Providers>
      <RootLayoutContent />
    </Providers>
  );
};

const RootLayoutContent = () => {
  const { theme, currentColorSchemeName } = useContext(ThemeContext);
  const { runtimes } = useContext(AppContext);
  const { isInternetReachable } = useNetInfo();
  const isLoggedIn = !!useContext(AuthContext).userInfo;

  useEffect(() => {
    if (isInternetReachable && isLoggedIn) {
      connectSocket();
    }
  }, [isInternetReachable, isLoggedIn]);

  useEffect(() => {
    const askReview = async () => {
      if (runtimes === 5 && (await StoreReview.hasAction())) {
        await StoreReview.requestReview();
      }
    };

    askReview();
  }, [runtimes]);

  const statusBarStyle = currentColorSchemeName === "dark" ? "light" : "dark";
  const title = __DEV__ ? "Buylist (Dev)" : "Buylist";

  useEffect(() => {
    NavigationBar.setStyle(
      currentColorSchemeName === "dark" ? "dark" : "light",
    );
  }, [currentColorSchemeName]);

  return (
    <>
      <StatusBar style={statusBarStyle} />
      <View style={[styles.fullSpace, { backgroundColor: theme.background }]}>
        <Stack>
          <Stack.Screen
            name="index"
            options={({ navigation }) => ({
              title: title,
              headerRight: () =>
                HomeHeaderRight({
                  navigation: navigation as NavigationProp<RootStackParamList>,
                }),
            })}
          />
          <Stack.Screen name="list" />
          <Stack.Screen name="settings" options={{ title: "הגדרות" }} />
        </Stack>
      </View>
      <JoinList />
    </>
  );
};

const styles = StyleSheet.create({
  fullSpace: {
    flex: 1,
  },
});

export default RootLayout;
