const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  mode: "development",
  // entry: "./src/index.ts", // 项目的入口文件
  entry: "./src/libs/index.ts",
  output: {
    filename: "bundle.js", // 编译后的文件名
    path: path.resolve(__dirname, "public"), // 编译后的文件路径
    module: true,
    libraryTarget: "module",
    clean: true,
    // publicPath:'/center'
  },
  experiments: {
    outputModule: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/, // 匹配 TypeScript 文件
        use: "ts-loader", // 使用 ts-loader 来处理 TypeScript 文件
        exclude: /node_modules/, // 排除 node_modules 目录
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"], // 自动解析的文件扩展名
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "./demo",
          to: "./demo",
        },
      ],
    }),
    // new HtmlWebpackPlugin({ template: "./index.html" }),
  ],
  devServer: {
    port: 8888,
    hot: false,
    historyApiFallback: true,
  },
};
