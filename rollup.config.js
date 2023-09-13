import { globSync } from 'glob';

export default () => {
  const inputFilenames = globSync('./src/*.js', { dotRelative: true }).map(filePath => {
    const pathSegments = filePath.split(/\/|\\/);
    const filename = pathSegments[pathSegments.length - 1];
    const filenameWithoutExtension = filename.slice(0, filename.lastIndexOf('.'));
    return filenameWithoutExtension;
  });

  return inputFilenames.map(filename => ({
    input: `./src/${filename}.js`,
    output: {
      file: `./dist/${filename}.js`
    }
  }));
};
