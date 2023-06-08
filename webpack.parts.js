const { WebpackPluginServe } = require('webpack-plugin-serve')
const { MiniHtmlWebpackPlugin } = require('mini-html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const path = require('path')
const { ModuleFederationPlugin } = require("webpack").container;

exports.federateModule = ({
  name,
  filename,
  exposes,
  remotes,
  shared,
}) => ({
  plugins: [
    new ModuleFederationPlugin({
      name,
      filename,
      exposes,
      remotes,
      shared,
    }),
  ],
});

/*

// __dirname is an environment variable 
// that tells you the absolute path of 
// the directory containing the currently executing file.

// In this file, __dirname will be : /Users/diegopalacios/Desktop/webpack-5-book/webpack-demo

console.log(
  '🎉 ',
  __dirname,
  path.join(__dirname, 'src/*.js'),
  glob.sync(path.join(__dirname, 'src/*.js'))
)

*/

exports.clean = () => ({
  plugins: [ new CleanWebpackPlugin() ]
})

exports.devServer = () => ({
  watch: true,
  plugins: [
    new WebpackPluginServe({
      port: process.env.port || 8080,
      static: './dist',
      liveReload: true,
      waitForBuild: true
    })
  ]
})

exports.page = ({ title }) => ({
  plugins: [
    new MiniHtmlWebpackPlugin({ context: { title } }),
    // Limit code splitting chunks, 
    // new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 })
  ]
})

exports.loadCSS = () => ({
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'] // styleLoader(cssLoader(input))
      }
    ]
  }
})

exports.extractCSS = ({ options = {}, loaders = [] } = {}) => ({
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          { loader: MiniCssExtractPlugin.loader, options },
          'css-loader'
        ].concat(loaders),
        sideEffects: true
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'styles/[name].css'
      // filename: '[name].css' // at the root of the build folder
    })
  ]
})

exports.tailwind = () => ({
  loader: 'postcss-loader',
  options: {
    postcssOptions: { 
      plugins: [ require('tailwindcss')() ] 
    }
  }
})

exports.autoprefix = () => ({
  loader: 'postcss-loader',
  options: {
    postcssOptions: { 
      plugins: [ require('autoprefixer')() ] 
    }
  }
})

exports.loadImages = ({ limit } = {}) => ({
  module: {
    rules: [
      {
        test: /\.(jpe?g|png)$/,
        // type: 'asset/resource',
        generator: {
          filename: 'images/[hash][ext][query]'
        },
        type: 'asset',
        parser: { 
          dataUrlCondition: {
            maxSize: limit
          },
        },
        use: [
          { 
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: { // https://github.com/imagemin/imagemin-mozjpeg
                quality: 50,
                progressive: true,
              },
            }
          }
        ]
      }
    ]
  }
})

exports.loadFonts = () => ({
  module: {
    rules: [
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[hash][ext][query]'
        },
      }
    ]
  }
})

const APP_SOURCE = path.join(__dirname, 'src')

exports.loadJavaScript = () => ({
  module: {
    rules: [
      {
        test: /\.js$/,
        include: APP_SOURCE,
        use: 'babel-loader'
      }
    ]
  }
})

exports.loadTypeScript = () => ({
  // entry: ["./src/index.ts"],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    // 👇️ Add `.ts` and `.tsx` as a resolvable extension.
    extensions: [".ts", ".js"]
  },
})

exports.generateSourceMaps = ({ type }) => ({
  devtool: type
})


// exports.responsiveImages = () => ({
//   module: {
//     rules: [
//       {
//         test: /\.(jpe?g|webp)$/i,
//          use: [
//           {
//             loader: "responsive-loader",
//             options: {
//               adapter: require('responsive-loader/sharp'),
//               sizes: [960, 1200, 2400],
//               placeholder: true,
//               placeholderSize: 20,
//               name: 'static/media/[name]-[hash:7]-[width].[ext]',
//             },
//           },
//         ],
//       }
//     ]
//   },
// })