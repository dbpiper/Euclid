module.exports = function babelConfig(api) {
  api.cache(true);

  const presets = [
    [
      '@babel/preset-env',
      {
        targets: 'maintained node versions',
      },
    ],
    [
      '@babel/preset-typescript',
      {
        allExtensions: true,
        isTSX: true,
        jsxPragma: 'React',
      },
    ],
  ];

  return {
    presets,
  };
};
