const { join } = require('path');
const { tsESLINT, config } = require('../../eslint.base');

module.exports = tsESLINT.config(config, {
  languageOptions: {
    parser: require('@babel/eslint-parser'),
    parserOptions: {
      ecmaVersion: 2022,
      tsconfigRootDir: __dirname,
      project: true,
      babelOptions: {
        configFile: join(__dirname, 'babel.config'),
      },
    },
  },
  rules: {
    'no-undef': 'off',
    '@typescript-eslint/no-require-imports': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
  },
});
