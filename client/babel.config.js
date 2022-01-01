module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        corejs: '3',
        modules: 'commonjs',
        useBuiltIns: 'usage',
        targets: "> 0.5%, not ie 11"
      },
    ],
    ['@babel/preset-react'],
  ],
};
