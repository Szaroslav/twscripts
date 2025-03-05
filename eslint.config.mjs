import js from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";

/** @type { import("eslint").Linter.Config[] } */
export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2024,
      parserOptions: {
        ecmaVersion: 2024,
        sourceType: "module",
      },
    },
    plugins: {
      "@stylistic": stylistic,
    },
    rules: {
      "@stylistic/semi": ["error", "always"],
      "@stylistic/quotes": ["warn", "double"],
    },
  },
];
