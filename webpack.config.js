module.exports = {
  entry: './app/entry.js',
  output: {
    path: __dirname,
    filename: 'public/bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader:'style!css'
      },
      { 
        test: /\.js$/,
        loader:'babel',
        exclude: /(node_modules|bower_components)/,
        query: {
          presets: ['react', 'es2015']
        }
      },
      // {
      //   test: /\.json$/,
      //   loader: 'json-loader'
      // },
      // {
      //   test: /\.less$/,
      //   loader: "style!css!less"
      // }
    ]
  },
  // node: {
  //   fs: 'empty',
  //   tls: 'empty',
  //   net: 'empty',
  // },
};
