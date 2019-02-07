const path = require('path');

module.exports = [
  {
    entry: './src/main/es5-index.js',
    output: {
      filename: 'es5-main.js',
      path: path.resolve(__dirname, 'public/js')
    },
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  useBuiltIns: 'usage',
                  debug: true,
                  targets: {
                    browsers: ['> 1%']
                  }
                }]
              ]
            }
          }
        }
      ]
    }
  },
  {
    entry: './src/worker/index.js',
    output: {
      filename: 'es5-worker.js',
      path: path.resolve(__dirname, 'public/js')
    },
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  useBuiltIns: 'usage',
                  debug: true,
                  targets: {
                    browsers: ['> 1%']
                  }
                }]
              ]
            }
          }
        }
      ]
    }
  },
  {
    entry: './src/main/index.js',
    output: {
      filename: 'main.js',
      path: path.resolve(__dirname, 'public/js')
    },
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/
        }
      ]
    }
  },
  {
    entry: './src/worker/index.js',
    output: {
      filename: 'worker.js',
      path: path.resolve(__dirname, 'public/js')
    },
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/
        }
      ]
    }
  }
];
