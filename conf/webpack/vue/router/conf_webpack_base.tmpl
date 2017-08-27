var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');

function __path_src() {
	return path.resolve(__dirname, '../src');
}

function __path_test() {
	return path.resolve(__dirname, '../test/unit');
}

function __cssLoaders() {
	if (process.env.NODE_ENV === 'production') {
		return ExtractTextPlugin.extract({
			fallback: 'style-loader',
			use: [
				{
					loader: 'css-loader'
				},
				{
					loader: 'postcss-loader'
				}
			]
		});
	}
	else {
		return [
			{
				loader: 'style-loader'
			},
			{
				loader: 'css-loader'
			},
			{
				loader: 'postcss-loader'
			}
		];
	}
}

function __vuecssLoaders(loaderName) {
	var loaders = [
		{
			loader: 'css-loader',
			options: {
				sourceMap: process.env.NODE_ENV === 'production' ? false : true
			}
		}
	];
	if (loaderName) {
		loaders.push({
			loader: loaderName + '-loader',
			options: {
				sourceMap: process.env.NODE_ENV === 'production' ? false : true
			}
		});
	}

	if (process.env.NODE_ENV === 'production') {
		return ExtractTextPlugin.extract({
			fallback: 'vue-style-loader',
			use: loaders
		});
	}
	else {
		return [
			{
				loader: 'vue-style-loader'
			}
		].concat(loaders);
	}
}

module.exports = {
	entry: {
		app: __path_src()
	},
	output: {
		path: path.resolve(__dirname, '../dist'),
		filename: 'static/js/[name]-[chunkhash:7].js',
		chunkFilename: 'static/js/[id].[chunkhash:7].js',
		publicPath: '/dist/'
	},
	devtool: 'source-map',
	resolve: {
		extensions: ['.js', '.vue', '.json'],
		alias: {
			'vue$': 'vue/dist/vue.esm.js'
		}
	},
	module: {
		rules: [
			{
				enforce: 'pre',
				test: /\.(js|html|vue)$/,
				include: [
					__path_src(),
					__path_test()
				],
				use: [
					{
						loader: 'eslint-loader',
						options: {
							formatter: require('eslint-friendly-formatter')
						}
					}
				]
			},
			{
				test: /\.vue$/,
				include: [
					__path_src(),
					__path_test()
				],
				use: [
					{
						loader: 'vue-loader',
						options: {
							loaders: {
								css: __vuecssLoaders(),
								sass: __vuecssLoaders('sass'),
								scss: __vuecssLoaders('sass')
							}
						}
					}
				]
			},
			{
				test: /\.js$/,
				include: [
					__path_src(),
					__path_test()
				],
				use: [
					{
						loader: 'babel-loader'
					}
				]
			},
			{
				test: /\.html$/,
				include: [
					__path_src(),
					__path_test()
				],
				use: [
					{
						loader: 'html-loader'
					}
				]
			},
			{
				resource: {
					test: /\.css$/,
					include: [
						__path_src(),
						__path_test()
					]
				},
				use: __cssLoaders()
			},
			{
				resource: {
					test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
					include: [
						__path_src(),
						__path_test()
					]
				},
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 8192,
							name: 'static/img/[name].[hash:7].[ext]'
						}
					}
				]
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, './index.html')
		})
	]
};
