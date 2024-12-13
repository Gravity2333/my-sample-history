const path = require("path");
const { merge } = require("webpack-merge");
const baseConfig = require("./webpack.default");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = merge(baseConfig, {
  mode: "development",
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
    new HtmlWebpackPlugin({
      template: "./demo/demoHistory.html",
      inject: "body",
      scriptLoading: 'module',  // 设置为 'module'
    }),
  ],
  devServer: {
    port: 8888,
    historyApiFallback: true,
    open: true,
  },
});
