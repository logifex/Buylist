import "tsx/cjs";

const IS_DEV = process.env.APP_VARIANT === "development";

const androidPackage = process.env.ANDROID_PACKAGE ?? "com.example.buylist";

export default {
  name: IS_DEV ? "Buylist (Dev)" : "Buylist",
  slug: "buylist",
  version: "1.1.7",
  orientation: "default",
  icon: "./assets/images/icon.png",
  scheme: "buylist",
  userInterfaceStyle: "automatic",
  ios: {
    supportsTablet: true,
    infoPlist: {
      ExpoLocalization_supportsRTL: true,
    },
  },
  android: {
    googleServicesFile:
      process.env.GOOGLE_SERVICES_JSON ?? "google-services.json",
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon-foreground.png",
      backgroundImage: `./assets/images/${
        IS_DEV
          ? "adaptive-icon-background-dev.png"
          : "adaptive-icon-background.png"
      }`,
      monochromeImage: "./assets/images/adaptive-icon-monochrome.png",
    },
    playStoreUrl: `https://play.google.com/store/apps/details?id=${androidPackage}`,
    package: androidPackage,
    intentFilters: [
      {
        action: "VIEW",
        autoVerify: true,
        data: [
          {
            scheme: "https",
            host: process.env.LINK_HOST,
            pathPrefix: "/invite",
          },
        ],
        category: ["DEFAULT", "BROWSABLE"],
      },
    ],
    softwareKeyboardLayoutMode: "pan",
    blockedPermissions: [
      "android.permission.READ_EXTERNAL_STORAGE",
      "android.permission.SYSTEM_ALERT_WINDOW",
      "android.permission.VIBRATE",
      "android.permission.WRITE_EXTERNAL_STORAGE",
      "android.permission.WAKE_LOCK",
      "android.permission.ACCESS_WIFI_STATE",
    ],
  },
  web: {
    bundler: "metro",
    output: "static",
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-screen.png",
        imageWidth: 150,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
        dark: {
          image: "./assets/images/splash-screen.png",
          imageWidth: 150,
          resizeMode: "contain",
          backgroundColor: "#000000",
        },
      },
    ],
    "expo-localization",
    "expo-status-bar",
    "expo-navigation-bar",
    "@react-native-vector-icons/material-icons",
    "@react-native-vector-icons/material-design-icons",
    "@react-native-vector-icons/ionicons",
    "@react-native-firebase/app",
    "@react-native-firebase/auth",
    "@react-native-google-signin/google-signin",
    [
      "expo-build-properties",
      {
        android: {
          enableMinifyInReleaseBuilds: true,
          enableShrinkResourcesInReleaseBuilds: true,
          usesCleartextTraffic: IS_DEV,
        },
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    supportsRTL: true,
    forcesRTL: true,
    eas: {
      projectId: "75b7cfdb-113c-45ea-9899-1f7cf5bbd049",
    },
  },
  updates: {
    url: "https://u.expo.dev/75b7cfdb-113c-45ea-9899-1f7cf5bbd049",
  },
  runtimeVersion: {
    policy: "appVersion",
  },
};
