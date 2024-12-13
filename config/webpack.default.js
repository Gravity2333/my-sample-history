const path = require("path");

module.exports = {
  context: path.resolve(__dirname,'../'),
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
    extensions: [".ts", ".js"],
    descriptionFiles: ["packages.json"],
    mainFiles: ['index'],
    mainFields: ["main"],
    fallback: {
      "events": require.resolve("events/")
    }
  },
};
