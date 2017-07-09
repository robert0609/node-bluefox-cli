var baseConfig = require('./webpack.base.config');
var merge = require('webpack-merge');
var webpack = require('webpack');

Object.keys(baseConfig.entry).forEach(function (name) {
	baseConfig.entry[name] = ['webpack-hot-middleware/client?reload=true'].concat(baseConfig.entry[name])
})

module.exports = merge(baseConfig, {
	output: {
		filename: 'static/js/[name].js',
		chunkFilename: 'static/js/[id].js',
		publicPath: '/'
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoEmitOnErrorsPlugin()
	]
});
