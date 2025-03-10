import globals from "globals";
import js from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";

/**
 * @param {import("eslint").Linter.LanguageOptions} languageOptions
 * @returns {import("eslint").Linter.Config}
 */
function commonConfig(languageOptions) {
  return {
    languageOptions: {
      ecmaVersion: 2024,
      parserOptions: {
        ecmaVersion: 2024,
        sourceType: "module",
      },
      ...languageOptions,
    },
    plugins: {
      "@stylistic": stylistic,
    },
    rules: {
      "no-unused-vars": [
        "error",
        {
          args: "after-used",
          destructuredArrayIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "@stylistic/semi": ["error", "always"],
      "@stylistic/quotes": ["warn", "double"],
    },
  };
}

/** @type { import("eslint").Linter.Config[] } */
export default [
  js.configs.recommended,
  commonConfig({
    globals: {
      ...globals.browser,
      ...globals.jquery,
      _: "readonly",
      TribalWars: "readonly",
      Memo: "readonly",
      CommandPopup: "readonly",
      UI: "readonly",
      game_data: "readonly",
      mobile: "readonly",
      image_base: "readonly",
      char_limit: "readonly",
      s: "readonly",
      userSettings: "readonly",
    },
  }),
  {
    ...commonConfig({
      globals: {
        ...globals.node,
      },
    }),
    files: ["src/general/**"],
  },
];
