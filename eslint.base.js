const eslint = require("@eslint/js");
const tsESLINT = require("typescript-eslint");
const importESLINT = require("eslint-plugin-import/config/typescript");
const prettierESLINT = require("eslint-plugin-prettier/recommended");

const config = tsESLINT.config(
  eslint.configs.recommended,
  prettierESLINT,
  importESLINT
);

module.exports = { config, tsESLINT };
