var baseConfig = require('./webpack.base.config');
var merge = require('webpack-merge');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
var path = require('path');

module.exports = merge(baseConfig, {
	plugins: [
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			},
			sourceMap: true
		}),
		new ExtractTextPlugin('static/style/[name]-[contenthash:7].css'),
		new OptimizeCSSPlugin({
			cssProcessorOptions: {
				safe: true
			}
		}),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			minChunks: function (module) {
				return module.resource &&
        /\.js$/.test(module.resource) && module.context && (module.context.indexOf(path.resolve(__dirname, '../src/common')) !== -1 || module.context.indexOf(path.resolve(__dirname, '../node_modules')) !== -1);
			}
		}),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'manifest'
		})
	]
});
