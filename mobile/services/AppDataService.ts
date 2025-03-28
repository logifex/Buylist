import AsyncStorage from "@react-native-async-storage/async-storage";
import List from "../models/List";
import { ThemeStateType } from "../store/theme-context";
import { ColorSchemeName } from "react-native";

const AppDataService = {
  readLists: async (): Promise<List[]> => {
    const listsJson = await AsyncStorage.getItem("listsdata");
    const storedLists = listsJson ? JSON.parse(listsJson) : [];

    return storedLists;
  },
  writeLists: async (lists: List[]) => {
    const listsJson = JSON.stringify(lists);
    await AsyncStorage.setItem("listsdata", listsJson);
  },
  readStarredLists: async (): Promise<string[]> => {
    const starredListsJson = await AsyncStorage.getItem("starredlists");
    const starredLists = starredListsJson ? JSON.parse(starredListsJson) : [];

    return starredLists;
  },
  writeStarredLists: async (starredLists: string[]) => {
    const starredListsJson = JSON.stringify(starredLists);
    await AsyncStorage.setItem("starredlists", starredListsJson);
  },
  readTheme: async (): Promise<ColorSchemeName | undefined> => {
    const theme = await AsyncStorage.getItem("theme");

    if (theme !== "light" && theme !== "dark") {
      if (theme) {
        await AsyncStorage.removeItem("theme");
      }
      return;
    }

    return theme;
  },
  writeTheme: async (theme: ThemeStateType) => {
    await AsyncStorage.setItem("theme", theme);
  },
  removeTheme: async () => {
    await AsyncStorage.removeItem("theme");
  },
  readRuntimes: async (): Promise<number | undefined> => {
    const runtimes = await AsyncStorage.getItem("runtimes");

    if (runtimes) {
      return +runtimes;
    }
  },
  writeRuntimes: async (runtimes: number) => {
    await AsyncStorage.setItem("runtimes", runtimes.toString());
  },
};

export default AppDataService;
