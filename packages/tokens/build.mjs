import StyleDictionary from 'style-dictionary';

const sd = new StyleDictionary({
  source: ['src/tokens.json'],

  platforms: {
    css: {
      prefix: 'cd',
      transformGroup: 'css',
      buildPath: 'dist/css/',
      files: [
        {
          destination: 'variables.css',
          format: 'css/variables',
          options: {
            outputReferences: false,
            selector: ':root',
          },
        },
      ],
    },

    js: {
      transformGroup: 'js',
      buildPath: 'dist/js/',
      files: [
        {
          destination: 'tokens.js',
          format: 'javascript/es6',
        },
      ],
    },
  },
});

await sd.buildAllPlatforms();
console.log('✓ Style Dictionary build complete');
