/**
 * 初始化需要的文件
 */
import co from 'co';
import fs from 'fs';
import path from 'path';
import { convertTemplateString, copyFile } from './utility';

let baseDirectory = process.cwd();
let configConsoleDirectory = path.resolve(__dirname, '../conf/console/');
let configLibraryDirectory = path.resolve(__dirname, '../conf/library/');
let configWebpackDirectory = path.resolve(__dirname, '../conf/webpack/');
let userConfigContent = null;

let dependencyDictionary = require(path.resolve(__dirname, '../conf/dependencies.json'));

const toCreateConsoleFiles = new Map([
	[path.join(baseDirectory, '/.babelrc'), path.join(configConsoleDirectory, '/babelrc.tmpl')],
	[path.join(baseDirectory, '/.editorconfig'), path.join(configConsoleDirectory, '/editorconfig.tmpl')],
	[path.join(baseDirectory, '/package.json'), path.join(configConsoleDirectory, '/package.tmpl')],
	[path.join(baseDirectory, '/readme.md'), path.join(configConsoleDirectory, '/readme.tmpl')],
	[path.join(baseDirectory, '/gulpfile.js'), path.join(configConsoleDirectory, '/gulpfile.tmpl')],
	[path.join(baseDirectory, '/bin/start.js'), path.join(configConsoleDirectory, '/start.tmpl')],
	[path.join(baseDirectory, '/src/index.js'), path.join(configConsoleDirectory, '/index.tmpl')],
	[path.join(baseDirectory, '/.npmignore'), path.join(configConsoleDirectory, '/npmignore.tmpl')],
	[path.join(baseDirectory, '/.eslintrc.js'), path.join(configConsoleDirectory, '/eslintrc.tmpl')]
]);

const toCreateLibraryFiles = new Map([
	[path.join(baseDirectory, '/.babelrc'), path.join(configLibraryDirectory, '/babelrc.tmpl')],
	[path.join(baseDirectory, '/.editorconfig'), path.join(configLibraryDirectory, '/editorconfig.tmpl')],
	[path.join(baseDirectory, '/package.json'), path.join(configLibraryDirectory, '/package.tmpl')],
	[path.join(baseDirectory, '/readme.md'), path.join(configLibraryDirectory, '/readme.tmpl')],
	[path.join(baseDirectory, '/gulpfile.js'), path.join(configLibraryDirectory, '/gulpfile.tmpl')],
	[path.join(baseDirectory, '/src/index.js'), path.join(configLibraryDirectory, '/index.tmpl')],
	[path.join(baseDirectory, '/.npmignore'), path.join(configLibraryDirectory, '/npmignore.tmpl')],
	[path.join(baseDirectory, '/.eslintrc.js'), path.join(configLibraryDirectory, '/eslintrc.tmpl')]
]);

const toCreateWebpackSiteFiles = new Map([
	[path.join(baseDirectory, '/.babelrc'), path.join(configWebpackDirectory, '/site', '/babelrc.tmpl')],
	[path.join(baseDirectory, '/.editorconfig'), path.join(configWebpackDirectory, '/site', '/editorconfig.tmpl')],
	[path.join(baseDirectory, '/.eslintrc.js'), path.join(configWebpackDirectory, '/site', '/eslintrc.tmpl')],
	[path.join(baseDirectory, '/.npmignore'), path.join(configWebpackDirectory, '/site', '/npmignore.tmpl')],
	[path.join(baseDirectory, '/package.json'), path.join(configWebpackDirectory, '/site', '/package.tmpl')],
	[path.join(baseDirectory, '/readme.md'), path.join(configWebpackDirectory, '/site', '/readme.tmpl')],
	[path.join(baseDirectory, '/src/index.js'), path.join(configWebpackDirectory, '/site', '/src_index_js.tmpl')],
	[path.join(baseDirectory, '/src/pages/home/index.js'), path.join(configWebpackDirectory, '/site', '/src_pages_home_index_js.tmpl')],
	[path.join(baseDirectory, '/src/pages/home/index.html'), path.join(configWebpackDirectory, '/site', '/src_pages_home_index_html.tmpl')],
	[path.join(baseDirectory, '/src/pages/home/index.css'), path.join(configWebpackDirectory, '/site', '/src_pages_home_index_css.tmpl')],
	[path.join(baseDirectory, '/src/static/home/logo.jpg'), path.join(configWebpackDirectory, '/site', '/src_static_home_logo.jpg')],
	[path.join(baseDirectory, '/test/karma.conf.js'), path.join(configWebpackDirectory, '/site', '/test_karma.tmpl')],
	[path.join(baseDirectory, '/test/.eslintrc.js'), path.join(configWebpackDirectory, '/site', '/test_eslintrc.tmpl')],
	[path.join(baseDirectory, '/test/unit/home.test.js'), path.join(configWebpackDirectory, '/site', '/test_unit_home.tmpl')],
	[path.join(baseDirectory, '/build/dev.js'), path.join(configWebpackDirectory, '/site', '/build_dev.tmpl')],
	[path.join(baseDirectory, '/build/prod.js'), path.join(configWebpackDirectory, '/site', '/build_prod.tmpl')],
	[path.join(baseDirectory, '/conf/index.html'), path.join(configWebpackDirectory, '/site', '/conf_html.tmpl')],
	[path.join(baseDirectory, '/conf/webpack.base.config.js'), path.join(configWebpackDirectory, '/site', '/conf_webpack_base.tmpl')],
	[path.join(baseDirectory, '/conf/webpack.dev.config.js'), path.join(configWebpackDirectory, '/site', '/conf_webpack_dev.tmpl')],
	[path.join(baseDirectory, '/conf/webpack.prod.config.js'), path.join(configWebpackDirectory, '/site', '/conf_webpack_prod.tmpl')],
	[path.join(baseDirectory, '/conf/webpack.test.config.js'), path.join(configWebpackDirectory, '/site', '/conf_webpack_test.tmpl')]
]);

const toCreateWebpackLibraryFiles = new Map([
	[path.join(baseDirectory, '/.babelrc'), path.join(configWebpackDirectory, '/library', '/babelrc.tmpl')],
	[path.join(baseDirectory, '/.editorconfig'), path.join(configWebpackDirectory, '/library', '/editorconfig.tmpl')],
	[path.join(baseDirectory, '/.eslintrc.js'), path.join(configWebpackDirectory, '/library', '/eslintrc.tmpl')],
	[path.join(baseDirectory, '/.npmignore'), path.join(configWebpackDirectory, '/library', '/npmignore.tmpl')],
	[path.join(baseDirectory, '/package.json'), path.join(configWebpackDirectory, '/library', '/package.tmpl')],
	[path.join(baseDirectory, '/readme.md'), path.join(configWebpackDirectory, '/library', '/readme.tmpl')],
	[path.join(baseDirectory, '/src/index.js'), path.join(configWebpackDirectory, '/library', '/src_index_js.tmpl')],
	[path.join(baseDirectory, '/test/karma.conf.js'), path.join(configWebpackDirectory, '/library', '/test_karma.tmpl')],
	[path.join(baseDirectory, '/test/.eslintrc.js'), path.join(configWebpackDirectory, '/library', '/test_eslintrc.tmpl')],
	[path.join(baseDirectory, '/test/unit/index.test.js'), path.join(configWebpackDirectory, '/library', '/test_unit_index.tmpl')],
	[path.join(baseDirectory, '/build/dev.js'), path.join(configWebpackDirectory, '/library', '/build_dev.tmpl')],
	[path.join(baseDirectory, '/build/prod.js'), path.join(configWebpackDirectory, '/library', '/build_prod.tmpl')],
	[path.join(baseDirectory, '/conf/index.html'), path.join(configWebpackDirectory, '/library', '/conf_html.tmpl')],
	[path.join(baseDirectory, '/conf/webpack.base.config.js'), path.join(configWebpackDirectory, '/library', '/conf_webpack_base.tmpl')],
	[path.join(baseDirectory, '/conf/webpack.dev.config.js'), path.join(configWebpackDirectory, '/library', '/conf_webpack_dev.tmpl')],
	[path.join(baseDirectory, '/conf/webpack.prod.config.js'), path.join(configWebpackDirectory, '/library', '/conf_webpack_prod.tmpl')],
	[path.join(baseDirectory, '/conf/webpack.test.config.js'), path.join(configWebpackDirectory, '/library', '/conf_webpack_test.tmpl')]
]);

const toCreateWebpackVueFiles = new Map([
	[path.join(baseDirectory, '/.babelrc'), path.join(configWebpackDirectory, '/vue/raw', '/babelrc.tmpl')],
	[path.join(baseDirectory, '/.editorconfig'), path.join(configWebpackDirectory, '/vue/raw', '/editorconfig.tmpl')],
	[path.join(baseDirectory, '/.eslintrc.js'), path.join(configWebpackDirectory, '/vue/raw', '/eslintrc.tmpl')],
	[path.join(baseDirectory, '/postcss.config.js'), path.join(configWebpackDirectory, '/vue/raw', '/postcss_config.tmpl')],
	[path.join(baseDirectory, '/.npmignore'), path.join(configWebpackDirectory, '/vue/raw', '/npmignore.tmpl')],
	[path.join(baseDirectory, '/package.json'), path.join(configWebpackDirectory, '/vue/raw', '/package.tmpl')],
	[path.join(baseDirectory, '/readme.md'), path.join(configWebpackDirectory, '/vue/raw', '/readme.tmpl')],
	[path.join(baseDirectory, '/src/index.js'), path.join(configWebpackDirectory, '/vue/raw', '/src_index_js.tmpl')],
	[path.join(baseDirectory, '/src/pages/home/home.vue'), path.join(configWebpackDirectory, '/vue/raw', '/src_pages_home_vue.tmpl')],
	[path.join(baseDirectory, '/src/static/home/logo.jpg'), path.join(configWebpackDirectory, '/vue/raw', '/src_static_home_logo.jpg')],
	[path.join(baseDirectory, '/test/karma.conf.js'), path.join(configWebpackDirectory, '/vue/raw', '/test_karma.tmpl')],
	[path.join(baseDirectory, '/test/.eslintrc.js'), path.join(configWebpackDirectory, '/vue/raw', '/test_eslintrc.tmpl')],
	[path.join(baseDirectory, '/test/unit/home.test.js'), path.join(configWebpackDirectory, '/vue/raw', '/test_unit_home.tmpl')],
	[path.join(baseDirectory, '/build/dev.js'), path.join(configWebpackDirectory, '/vue/raw', '/build_dev.tmpl')],
	[path.join(baseDirectory, '/build/prod.js'), path.join(configWebpackDirectory, '/vue/raw', '/build_prod.tmpl')],
	[path.join(baseDirectory, '/conf/index.html'), path.join(configWebpackDirectory, '/vue/raw', '/conf_html.tmpl')],
	[path.join(baseDirectory, '/conf/webpack.base.config.js'), path.join(configWebpackDirectory, '/vue/raw', '/conf_webpack_base.tmpl')],
	[path.join(baseDirectory, '/conf/webpack.dev.config.js'), path.join(configWebpackDirectory, '/vue/raw', '/conf_webpack_dev.tmpl')],
	[path.join(baseDirectory, '/conf/webpack.prod.config.js'), path.join(configWebpackDirectory, '/vue/raw', '/conf_webpack_prod.tmpl')],
	[path.join(baseDirectory, '/conf/webpack.test.config.js'), path.join(configWebpackDirectory, '/vue/raw', '/conf_webpack_test.tmpl')]
]);

const toCreateWebpackVueWithRouterFiles = new Map([
	[path.join(baseDirectory, '/.babelrc'), path.join(configWebpackDirectory, '/vue/router', '/babelrc.tmpl')],
	[path.join(baseDirectory, '/.editorconfig'), path.join(configWebpackDirectory, '/vue/router', '/editorconfig.tmpl')],
	[path.join(baseDirectory, '/.eslintrc.js'), path.join(configWebpackDirectory, '/vue/router', '/eslintrc.tmpl')],
	[path.join(baseDirectory, '/postcss.config.js'), path.join(configWebpackDirectory, '/vue/router', '/postcss_config.tmpl')],
	[path.join(baseDirectory, '/.npmignore'), path.join(configWebpackDirectory, '/vue/router', '/npmignore.tmpl')],
	[path.join(baseDirectory, '/package.json'), path.join(configWebpackDirectory, '/vue/router', '/package.tmpl')],
	[path.join(baseDirectory, '/readme.md'), path.join(configWebpackDirectory, '/vue/router', '/readme.tmpl')],
	[path.join(baseDirectory, '/src/index.js'), path.join(configWebpackDirectory, '/vue/router', '/src_index_js.tmpl')],
	[path.join(baseDirectory, '/src/app.vue'), path.join(configWebpackDirectory, '/vue/router', '/src_app_vue.tmpl')],
	[path.join(baseDirectory, '/src/pages/error/error.vue'), path.join(configWebpackDirectory, '/vue/router', '/src_pages_error_vue.tmpl')],
	[path.join(baseDirectory, '/src/pages/home/home.vue'), path.join(configWebpackDirectory, '/vue/router', '/src_pages_home_vue.tmpl')],
	[path.join(baseDirectory, '/src/pages/notfound/notfound.vue'), path.join(configWebpackDirectory, '/vue/router', '/src_pages_notfound_vue.tmpl')],
	[path.join(baseDirectory, '/src/router/index.js'), path.join(configWebpackDirectory, '/vue/router', '/src_router_index_js.tmpl')],
	[path.join(baseDirectory, '/src/static/home/logo.jpg'), path.join(configWebpackDirectory, '/vue/router', '/src_static_home_logo.jpg')],
	[path.join(baseDirectory, '/test/karma.conf.js'), path.join(configWebpackDirectory, '/vue/router', '/test_karma.tmpl')],
	[path.join(baseDirectory, '/test/.eslintrc.js'), path.join(configWebpackDirectory, '/vue/router', '/test_eslintrc.tmpl')],
	[path.join(baseDirectory, '/test/unit/home.test.js'), path.join(configWebpackDirectory, '/vue/router', '/test_unit_home.tmpl')],
	[path.join(baseDirectory, '/build/dev.js'), path.join(configWebpackDirectory, '/vue/router', '/build_dev.tmpl')],
	[path.join(baseDirectory, '/build/prod.js'), path.join(configWebpackDirectory, '/vue/router', '/build_prod.tmpl')],
	[path.join(baseDirectory, '/conf/index.html'), path.join(configWebpackDirectory, '/vue/router', '/conf_html.tmpl')],
	[path.join(baseDirectory, '/conf/webpack.base.config.js'), path.join(configWebpackDirectory, '/vue/router', '/conf_webpack_base.tmpl')],
	[path.join(baseDirectory, '/conf/webpack.dev.config.js'), path.join(configWebpackDirectory, '/vue/router', '/conf_webpack_dev.tmpl')],
	[path.join(baseDirectory, '/conf/webpack.prod.config.js'), path.join(configWebpackDirectory, '/vue/router', '/conf_webpack_prod.tmpl')],
	[path.join(baseDirectory, '/conf/webpack.test.config.js'), path.join(configWebpackDirectory, '/vue/router', '/conf_webpack_test.tmpl')]
]);

function* doesFileExist(filename) {
	let isExists = yield new Promise((resolve, reject) => {
		fs.access(filename, (error) => {
			if (error) {
				if (error.code == 'ENOENT') {
					resolve(false);
				}
				else {
					reject(error);
				}
			}
			else {
				resolve(true);
			}
		});
	});
	return isExists;
}

function* createFile(filename, templateFilename) {
	let isExists = yield* doesFileExist(filename);
	let content = yield new Promise((resolve, reject) => {
		let rs = fs.createReadStream(templateFilename);
		let result = '';
		rs.on('data', (data) => {
			result += data;
		}).on('end', () => {
			resolve(result);
		}).on('close', () => {
			// console.log('close');
		}).on('error', (error) => {
			reject(error);
		});
	});
	if (path.extname(templateFilename) === '.tmpl') {
		content = convertTemplateString(content, userConfigContent);
	}
	if (path.basename(templateFilename) === 'package.tmpl') {
		//针对package.tmpl文件，设置依赖库的版本号
		let jsonContent = JSON.parse(content);
		for (let k in jsonContent.devDependencies) {
			jsonContent.devDependencies[k] = dependencyDictionary[k];
		}
		for (let k in jsonContent.dependencies) {
			jsonContent.dependencies[k] = dependencyDictionary[k];
		}
		content = JSON.stringify(jsonContent, null, 2);
	}
	let result = yield new Promise((resolve, reject) => {
		let ws = fs.createWriteStream(filename);
		ws.on('finish', () => {
			resolve('finish');
		}).on('close', () => {
			resolve('close');
		}).on('error', (error) => {
			reject(error);
		});
		let contentBuffer = Buffer.from(content);
		let length = contentBuffer.length;
		let hasWriteLength = 0;
		writeChunk();

		function writeChunk() {
			let writeResult = true;
			while (writeResult && hasWriteLength < length) {
				let restLength = length - hasWriteLength;
				let toWriteLength = restLength < 10240 ? restLength : 10240;
				let toWriteBuffer = contentBuffer.slice(hasWriteLength, toWriteLength);
				writeResult = ws.write(toWriteBuffer);
				hasWriteLength += toWriteLength;
			}
			if (!writeResult) {
				ws.once('drain', writeChunk);
				return;
			}
			if (hasWriteLength === length) {
				ws.end();
			}
		}
	});
	return result;
}

/**
 * 初始化相关的配置文件
 * @param {object} userConfig
 * @param {function} callback
 */
function run(userConfig, callback) {
	let o = { callback };
	callback = o.getValueOrDefault('callback', (error, data) => { });
	let that = this;
	userConfigContent = userConfig;
	let toCreateFiles = null;
	switch (userConfigContent.kind.toLowerCase()) {
		case 'console':
			toCreateFiles = toCreateConsoleFiles;
			break;
		case 'library':
			toCreateFiles = toCreateLibraryFiles;
			break;
		case 'webpack':
			if (userConfigContent.subKind.toLowerCase() === 'library') {
				toCreateFiles = toCreateWebpackLibraryFiles;
			}
			else if (userConfigContent.subKind.toLowerCase() === 'vue') {
				if (userConfigContent.withVueRouter.toLowerCase() === 'y') {
					toCreateFiles = toCreateWebpackVueWithRouterFiles;
				}
				else {
					toCreateFiles = toCreateWebpackVueFiles;
				}
			}
			else {
				toCreateFiles = toCreateWebpackSiteFiles;
			}
			break;
	}

	let promises = [];
	for (let [key, value] of toCreateFiles) {
		if (path.extname(value) === '.tmpl') {
			promises.push(co(createFile(key, value)));
		}
		else {
			promises.push(co(copyFile(value, key)));
		}
	}
	Promise.all(promises).then((results) => {
		callback.call(that);
	}).catch((error) => {
		callback.call(that, error);
	});
}

export default {
	run
};
