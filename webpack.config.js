module.exports = {
  entry: './app/entry.js',
  output: {
    filename: 'public/bundle.js',
  },
  module: {
    loaders: [
      // {
      //   test: /\.css$/,
      //   loader:'style!css'
      // },
      { 
        test: /\.js$/,
        loader:'babel',
        exclude: /(node_modules|bower_components)/,
        query: {
          presets: ['react', 'es2015']
        }
      },
      // {
      //   test: /\.less$/,
      //   loader: "style!css!less"
      // }
    ]
  }
};
