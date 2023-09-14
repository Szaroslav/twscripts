import { readFileSync } from 'node:fs';
import { globSync } from 'glob';
import stripCode from 'rollup-plugin-strip-code';

export default () => {
  const bannerCommentRegExp = /^\/\*\*.*\*\//s;
  const inputFilenames = globSync('./src/*.js', { dotRelative: true }).map(filePath => {
    const pathSegments = filePath.split(/\/|\\/);
    const filename = pathSegments[pathSegments.length - 1];
    const filenameWithoutExtension = filename.slice(0, filename.lastIndexOf('.'));
    return filenameWithoutExtension;
  });

  return inputFilenames.map(filename => ({
    input: `./src/${filename}.js`,
    output: {
      file: `./dist/${filename}.js`,
      format: 'iife',
      banner: chunkInfo => {
        const fileContent = readFileSync(chunkInfo.facadeModuleId, { encoding: 'utf-8' });

        let banner = '';
        if (bannerCommentRegExp.test(fileContent)) {
          banner = fileContent.match(bannerCommentRegExp);
        }
        return banner + '\n';
      }
    },
    plugins: [
      stripCode({
        pattern: bannerCommentRegExp
      })
    ]
  }));
};
