import { defineConfig } from "rollup";
import terser from "@rollup/plugin-terser";

export default defineConfig({
  plugins: [
    terser({
      format: {
        comments: /^\*\n\s*\*\s[A-Za-z0-9_-]+\.(c|m)?(j|t)sx?/
      }
    }),
  ],
});
