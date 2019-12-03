const path = require("path");
const htmlPlugin = require("html-webpack-plugin");
const copyPlugin = require("copy-webpack-plugin");
const baseManifest = require("./src/manifest.json");
const webpackExtensionManifestPlugin = require("webpack-extension-manifest-plugin");

module.exports = {
  mode: "development",
  entry: {
    popup: path.resolve(__dirname, "src/js/popup/index.js"),
    background: path.resolve(__dirname, "src/js/background/index.js")
    // , option: path.resolve(__dirname, "src/js/option/index.js")
  },
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "[name].js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader"
      },
      {
        test: /\.(c|sc|sa)ss$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.(png|svg)$/,
        use: "file-loader"
      }
    ]
  },
  plugins: [
    new htmlPlugin({
      title: "pomodoro-timer",
      manifest: "manifest.json",
      hash: true,
      filename: "popup.html",
      template: "./src/popup.html",
      excludeChunks: ["background"]
    }),
    new htmlPlugin({
      title: "pomodoro-timer",
      manifest: "manifest.json",
      hash: true,
      filename: "options.html",
      template: "./src/options.html",
      excludeChunks: ["background", "popup"]
    }),
    new copyPlugin([
      {
        from: "src/images",
        to: "images"
      }
    ]),
    new webpackExtensionManifestPlugin({
      config: {
        base: baseManifest
      }
    })
  ],
  devtool: "source-map"
};
