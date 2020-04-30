module.exports = function (api) {
  const isTest = api.env('test');
  api.cache(true);

  const presets = [
    [
      require('@babel/preset-env'),
      ...(isTest ? [{ targets: { node: 'current' } }] : []),
    ],
  ];
  const plugins = [];

  return {
    presets,
    plugins,
  };
};
