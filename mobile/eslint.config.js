const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const reactCompiler = require("eslint-plugin-react-compiler");
const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");
const pluginQuery = require("@tanstack/eslint-plugin-query");

module.exports = defineConfig([
  expoConfig,
  reactCompiler.configs.recommended,
  eslintPluginPrettierRecommended,
  pluginQuery.configs["flat/recommended"],
  {
    ignores: ["dist/*"],
    rules: {
      "prettier/prettier": [
        "error",
        {
          endOfLine: "auto",
        },
      ],
    },
  },
]);
