const path = require("path");
const { merge } = require("webpack-merge");
const baseConfig = require("./webpack.default");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = merge(baseConfig, {
  mode: "production",
  entry: "./src/index.ts",
  output: {
    filename: "history.js", // 编译后的文件名
    path: path.resolve(__dirname, "../package"), // 编译后的文件路径
    module: true,
    libraryTarget: "module",
    clean: true,
  },
  experiments: {
    outputModule: true,
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "./public/",
          to: "./",
        },
      ],
    }),
  ],
});
