module.exports = function babelConfig(api) {
  api.cache(true);

  const env = {
    node: {
      presets: [
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
      ],
    },
  };

  const plugins = [
    [
      'module-resolver',
      {
        alias: {
          App: './src/screens/App',
          config: './src/config',
          util: './src/util',
        },
        root: [
          './src',
          './src/../shared',
        ],
      },
    ],
    'babel-plugin-styled-components',
    'recharts',
    [
      '@babel/plugin-transform-runtime',
      {
        regenerator: true,
      },
    ],
    '@babel/plugin-proposal-class-properties',
  ];

  const presets = [
    '@babel/preset-env',
    '@babel/preset-react',
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
    env,
    plugins,
    presets,
  };
};
