const webpack = require('webpack');
const HtmlWebPackPlugin = require("html-webpack-plugin");
//const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const devMode = process.env.NODE_ENV !== 'production'
const path = require('path')

module.exports = {
  entry: [
    './src/index.js',
    './src/style.css'
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react', 'mobx'],
            plugins: [['import', { "libraryName": "antd", "libraryDirectory": "es", "style": "css" }]]
          }
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: { minimize: true }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          //devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          //MiniCssExtractPlugin.loader,
          'style-loader',
          'css-loader'
        ],
      },
      {
        test: /\.less$/,
        loader: 'less-loader' // compiles Less to CSS
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'url-loader?limit=8192' // inline base64 URLs for <=8k images, direct URLs for the rest
      },
      {
        test: /\.wav$/,
        loader: 'file-loader'
      },
      {
        test: /\.csv$/,
        use: [
          {
            loader: path.resolve('src/loaders/dictloader.js')
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html",
      inject: false
    })//,
    //new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      //filename: devMode ? 'style.css' : 'style.[hash].css'//,
      //filename: 'style.css'
      //chunkFilename: devMode ? '[id].css' : '[id].[hash].css'
    //})
  ],
  devServer: {
    contentBase: './dist',
    hot: true,
    inline: true,
    //host: '192.168.1.126',
    port: 8000
    
  }
};

