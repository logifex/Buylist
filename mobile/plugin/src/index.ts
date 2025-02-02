import { ExpoConfig } from "@expo/config-types";
import { withAndroidManifest } from "expo/config-plugins";

const withSupportsRtl = (expoConfig: ExpoConfig) => {
  return withAndroidManifest(expoConfig, async (config) => {
    const manifest = config.modResults;

    if (!manifest.manifest.application) {
      throw new Error("No application in manifest");
    }

    const application = manifest.manifest.application[0];

    if (!application["$"]["android:supportsRtl"]) {
      application["$"]["android:supportsRtl"] = "true";
    }

    return config;
  });
};

export default withSupportsRtl;
