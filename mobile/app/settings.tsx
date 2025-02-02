import { StyleSheet, View } from "react-native";
import React, { useContext } from "react";
import AuthContext from "@/store/auth-context";
import { ScrollView } from "react-native-gesture-handler";
import Category from "@/components/Settings/Category";
import Profile from "@/components/Settings/Profile";
import Text from "@/components/Ui/ThemedText";
import ThemeSelect from "@/components/Settings/ThemeSelect";
import AuthButton from "@/components/Ui/AuthButton";
import * as Application from "expo-application";

const Settings = () => {
  const userCtx = useContext(AuthContext);

  return (
    <View style={styles.fullSpace}>
      <ScrollView>
        <Category title="פרופיל">
          <View style={styles.profile}>
            {userCtx.userInfo && (
              <Profile
                email={userCtx.userInfo.email}
                name={userCtx.userInfo.name}
                photoUrl={userCtx.userInfo.photoUrl}
              />
            )}
            <AuthButton />
          </View>
        </Category>
        <Category title="ערכת נושא">
          <ThemeSelect />
        </Category>
        <Category title="אודות">
          <Text style={styles.appTitle}>Buylist</Text>
          <Text>גרסה {Application.nativeApplicationVersion}</Text>
        </Category>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  fullSpace: {
    flex: 1,
  },
  profile: {
    width: 200,
    alignSelf: "center",
  },
  appTitle: {
    textAlign: "left",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default Settings;
