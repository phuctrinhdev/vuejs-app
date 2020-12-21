module.exports = {
  presets: [
    [
      '@babel/preset-env', 
      {
        'useBuiltIns': 'entry',
        'targets': {
          'node': 'current',
          'browsers': '> 0.25%, not dead',
        }
      } 
    ]
  ],
  plugins: [
    'lodash',
    '@babel/plugin-transform-runtime',
    '@babel/plugin-syntax-dynamic-import', 
    'transform-object-rest-spread'
  ]
}