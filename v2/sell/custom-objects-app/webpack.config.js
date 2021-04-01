const HtmlWebpackPlugin = require('html-webpack-plugin')
const autoprefixer = require('autoprefixer')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')

module.exports = (env = {}) => {
  return {
    entry: './src/index.tsx',
    output: {
      filename: '[name].bundle.js',
      chunkFilename: '[name].bundle.js',
      path: __dirname + '/dist/assets',
    },

    mode: 'development',

    // Enable sourcemaps for debugging webpack's output.
    devtool: env.development ? 'source-map' : false,

    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.json'],
    },
    stats: {
      modules: false,
      hash: false,
      version: false,
    },

    module: {
      rules: [
        {
          test: /\.svg$/,
          use: [
            {
              loader: '@svgr/webpack',
            },
          ],
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: 'style-loader',
            },
            {
              loader: 'css-loader',
              options: {
                modules: {
                  localIdentName: '[hash:base64:3]--[name]--[local]',
                  exportLocalsConvention: 'camelCase',
                },
              },
            },
            {
              loader: require.resolve('postcss-loader'),
              options: {
                postcssOptions: {
                  plugins: [
                    require('postcss-import'),
                    require('postcss-flexbugs-fixes'),
                    autoprefixer({
                      flexbox: 'no-2009',
                    }),
                  ],
                },
              },
            },
          ],
        },
        // All files with a '.ts' or '.tsx' extension will be handled/**/ by
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
        },

        // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
        {
          enforce: 'pre',
          test: /\.js$/,
          loader: 'source-map-loader',
        },
      ],
    },

    plugins: [
      new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: [
          '**/*',
          '!logo.png',
          '!logo-small.png',
          '!screenshot-0.png',
          '!screenshot-1.png',
          '!screenshot-2.png',
        ],
      }),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'index.html',
        hash: true,
      }),
      // Uncomment that in order to analyze bundle size
      // new BundleAnalyzerPlugin(),
    ],
  }
}
