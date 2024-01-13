import { globSync } from "glob";
import _ from "lodash";

import { defineConfig } from "rollup";
import nodeResolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
// import handlebars from "rollup-plugin-handlebars-plus";

import productionConfig from "./config/rollup.config.prod.js";
import developmentConfig from "./config/rollup.config.dev.js";

export default args => {
  const inputFilenames = globSync("./src/*.js", { dotRelative: true }).map(filePath => {
    const pathSegments = filePath.split(/\/|\\/);
    const filename = pathSegments[pathSegments.length - 1];
    const filenameWithoutExtension = filename.slice(0, filename.lastIndexOf("."));
    return filenameWithoutExtension;
  });

  return inputFilenames.map(filename => {
    const baseConfiguration = defineConfig({
      input: `./src/${filename}.js`,
      output: {
        file: `./build/${filename}.js`,
        format: "iife",
      },
      plugins: [
        nodeResolve(),
        commonjs({
          include: "node_modules/**"
        }),
        // handlebars(),
      ],
    });

    if (args.dev) {
      return _.merge(baseConfiguration, developmentConfig);
    }
    else {
      return _.merge(baseConfiguration, productionConfig(`${filename}.js`));
    }
  });
};
