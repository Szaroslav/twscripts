import { readFileSync } from "node:fs";
import { defineConfig } from "rollup";
import terser from "@rollup/plugin-terser";
import banner from "rollup-plugin-banner2";

const bannerCommentRegExp = /^\/\*\*.*?\*\//s;

const bannerComment = path => {
  const fileContent = readFileSync(path, { encoding: "utf-8" });

  let banner = "";
  if (bannerCommentRegExp.test(fileContent)) {
    banner = fileContent.match(bannerCommentRegExp)[0]
      .replace(/^\/\*\* */gm, "")
      .replace(/^ *\*\//gm,   "")
      .replace(/^ *\* */gm,   "")
      .replace(/^\n$/gm,      "")
      .slice(1, -1);
  }
  return banner;
};

export default filename => defineConfig({
  plugins: [
    terser({
      format: {
        ascii_only: true,
      }
    }),
    banner(() => bannerComment(`./src/${filename}`), {
      formatter: "docBlockAndGap",
    }),
  ],
});
