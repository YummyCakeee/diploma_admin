module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['.'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          tests: ['./tests/'],
          "components": "./src/components",
          "containers": "./src/containers",
          "global": "./src/global",
          "screens": "./src/screens",
          "utils": "./src/utils",
          "constants": "./src/constants",
          "store": "./src/store",
        }
      }
    ]
  ]
};
