module.exports = {
    ignorePatterns: [ "node_modules/" ],
    env: {
        "es2024":  true,
    },
    extends: "eslint:recommended",
    overrides: [
        {
            env: {
                node: true,
            },
            files: [
                ".eslintrc.{js,cjs}",
            ],
            parserOptions: {
                "sourceType": "script",
            }
        }
    ],
    parserOptions: {
        ecmaVersion: "latest",
        sourceType:  "module",
    },
    plugins: [
        "@stylistic",
    ],
    rules: {
        "@stylistic/semi":   [ "error", "always" ],
        "@stylistic/quotes": [ "warn",  "double" ],
    }
};
