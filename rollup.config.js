import { readFileSync } from "node:fs";
import { globSync } from "glob";
import nodeResolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import terser from "@rollup/plugin-terser";
import stripCode from "rollup-plugin-strip-code";
import handlebars from "rollup-plugin-handlebars-plus";

export default () => {
  const bannerCommentRegExp = /^\/\*\*.*\*\//s;
  const inputFilenames = globSync("./src/*.js", { dotRelative: true }).map(filePath => {
    const pathSegments = filePath.split(/\/|\\/);
    const filename = pathSegments[pathSegments.length - 1];
    const filenameWithoutExtension = filename.slice(0, filename.lastIndexOf("."));
    return filenameWithoutExtension;
  });

  return inputFilenames.map(filename => ({
    input: `./src/${filename}.js`,
    output: {
      file: `./build/${filename}.js`,
      format: "iife",
      banner: chunkInfo => {
        const fileContent = readFileSync(chunkInfo.facadeModuleId, { encoding: "utf-8" });

        let banner = "";
        if (bannerCommentRegExp.test(fileContent)) {
          banner = fileContent.match(bannerCommentRegExp);
        }
        return banner + "\n";
      }
    },
    plugins: [
      nodeResolve(),
      commonjs({
        include: "node_modules/**"
      }),
      stripCode({
        pattern: bannerCommentRegExp
      }),
      terser({
        format: {
          comments: /^\*\n\s*\*\s[A-Za-z0-9_-]+\.(c|m)?(j|t)sx?/
        }
      }),
      handlebars()
    ]
  }));
};
