"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_plugins_1 = require("expo/config-plugins");
const withSupportsRtl = (expoConfig) => {
    return (0, config_plugins_1.withAndroidManifest)(expoConfig, async (config) => {
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
exports.default = withSupportsRtl;
