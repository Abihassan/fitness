module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    // Reanimated v4 moved its worklets runtime into react-native-worklets —
    // this plugin replaces the old "react-native-reanimated/plugin" entry
    // and must stay LAST in the plugins array.
    plugins: ["react-native-worklets/plugin"],
  };
};
