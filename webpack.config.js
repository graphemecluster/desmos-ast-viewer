const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const output = path.resolve(__dirname, "./dist");
const include = path.resolve(__dirname, "./src");

module.exports = {
  mode: "production",
  entry: "./src/index.js",
  output: {
    path: output,
    filename: "index.js",
  },
  module: {
    rules: [
      {
        test: /\.ne$/,
        include,
        use: "nearley-loader",
      },
      {
        test: /\.css$/i,
        include,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  devServer: {
    contentBase: output,
    watchContentBase: true,
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "index.css",
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
  ],
  optimization: {
    minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
  },
};
