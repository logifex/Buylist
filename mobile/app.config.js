export default {
  name: "Buylist",
  slug: "buylist",
  version: "0.13.2",
  orientation: "default",
  icon: "./assets/images/icon.png",
  scheme: "buylist",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
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
      backgroundImage: "./assets/images/adaptive-icon-background.png",
      monochromeImage: "./assets/images/adaptive-icon-monochrome.png",
    },
    playStoreUrl: `https://play.google.com/store/apps/details?id=${process.env.ANDROID_PACKAGE}`,
    package: process.env.ANDROID_PACKAGE,
    intentFilters: [
      {
        action: "VIEW",
        autoVerify: true,
        data: [
          {
            scheme: "https",
            host: process.env.EXPO_PUBLIC_SERVER_URL,
            pathPrefix: "/invite",
          },
        ],
        category: ["DEFAULT", "BROWSABLE"],
      },
    ],
    softwareKeyboardLayoutMode: "pan",
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
    "@react-native-firebase/app",
    "@react-native-firebase/auth",
    "@react-native-google-signin/google-signin",
    [
      "expo-build-properties",
      {
        android: {
          enableProguardInReleaseBuilds: true,
          enableShrinkResourcesInReleaseBuilds: true,
          supportsRTL: true,
        },
      },
    ],
    "./app.plugin.js",
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    supportsRTL: true,
  },
};
