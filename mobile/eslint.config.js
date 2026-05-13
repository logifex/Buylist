const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const reactCompiler = require("eslint-plugin-react-compiler");
const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");
const pluginQuery = require("@tanstack/eslint-plugin-query");
const tseslint = require("typescript-eslint");

module.exports = defineConfig([
  {
    ignores: ["dist/*"],
  },
  expoConfig,
  reactCompiler.configs.recommended,
  pluginQuery.configs["flat/recommended-strict"],
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
    rules: {
      "@typescript-eslint/no-deprecated": "off",
    },
  },
  eslintPluginPrettierRecommended,
  {
    rules: {
      "prettier/prettier": [
        "error",
        {
          endOfLine: "auto",
        },
      ],
    },
  },
  {
    files: ["eslint.config.js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  {
    files: ["**/*.js", "**/*.mjs"],
    ...tseslint.configs.disableTypeChecked,
  },
]);
