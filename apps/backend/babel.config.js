module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'entry',
        corejs: true,
      },
    ],
    '@babel/preset-typescript',
  ],
  plugins: [
    '@babel/plugin-transform-typescript',
    ['@babel/plugin-proposal-decorators', { version: '2023-11' }],
  ],
};
