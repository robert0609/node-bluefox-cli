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
let configWebDirectory = path.resolve(__dirname, '../conf/web/');
let userConfigContent = null;

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

const toCreateWebSiteFiles = new Map([
	[path.join(baseDirectory, '/.babelrc'), path.join(configWebDirectory, '/site', '/babelrc.tmpl')],
	[path.join(baseDirectory, '/.editorconfig'), path.join(configWebDirectory, '/site', '/editorconfig.tmpl')],
	[path.join(baseDirectory, '/.eslintrc.js'), path.join(configWebDirectory, '/site', '/eslintrc.tmpl')],
	[path.join(baseDirectory, '/.npmignore'), path.join(configWebDirectory, '/site', '/npmignore.tmpl')],
	[path.join(baseDirectory, '/package.json'), path.join(configWebDirectory, '/site', '/package.tmpl')],
	[path.join(baseDirectory, '/readme.md'), path.join(configWebDirectory, '/site', '/readme.tmpl')],
	[path.join(baseDirectory, '/src/index.js'), path.join(configWebDirectory, '/site', '/src_index_js.tmpl')],
	[path.join(baseDirectory, '/src/pages/home/index.js'), path.join(configWebDirectory, '/site', '/src_pages_home_index_js.tmpl')],
	[path.join(baseDirectory, '/src/pages/home/index.html'), path.join(configWebDirectory, '/site', '/src_pages_home_index_html.tmpl')],
	[path.join(baseDirectory, '/src/pages/home/index.css'), path.join(configWebDirectory, '/site', '/src_pages_home_index_css.tmpl')],
	[path.join(baseDirectory, '/src/static/home/logo.jpg'), path.join(configWebDirectory, '/site', '/src_static_home_logo.jpg')],
	[path.join(baseDirectory, '/test/karma.conf.js'), path.join(configWebDirectory, '/site', '/test_karma.tmpl')],
	[path.join(baseDirectory, '/test/.eslintrc.js'), path.join(configWebDirectory, '/site', '/test_eslintrc.tmpl')],
	[path.join(baseDirectory, '/test/unit/home.test.js'), path.join(configWebDirectory, '/site', '/test_unit_home.tmpl')],
	[path.join(baseDirectory, '/build/dev.js'), path.join(configWebDirectory, '/site', '/build_dev.tmpl')],
	[path.join(baseDirectory, '/build/prod.js'), path.join(configWebDirectory, '/site', '/build_prod.tmpl')],
	[path.join(baseDirectory, '/conf/index.html'), path.join(configWebDirectory, '/site', '/conf_html.tmpl')],
	[path.join(baseDirectory, '/conf/webpack.base.config.js'), path.join(configWebDirectory, '/site', '/conf_webpack_base.tmpl')],
	[path.join(baseDirectory, '/conf/webpack.dev.config.js'), path.join(configWebDirectory, '/site', '/conf_webpack_dev.tmpl')],
	[path.join(baseDirectory, '/conf/webpack.prod.config.js'), path.join(configWebDirectory, '/site', '/conf_webpack_prod.tmpl')],
	[path.join(baseDirectory, '/conf/webpack.test.config.js'), path.join(configWebDirectory, '/site', '/conf_webpack_test.tmpl')]
]);

const toCreateWebLibraryFiles = new Map([
	[path.join(baseDirectory, '/.babelrc'), path.join(configWebDirectory, '/library', '/babelrc.tmpl')],
	[path.join(baseDirectory, '/.editorconfig'), path.join(configWebDirectory, '/library', '/editorconfig.tmpl')],
	[path.join(baseDirectory, '/.eslintrc.js'), path.join(configWebDirectory, '/library', '/eslintrc.tmpl')],
	[path.join(baseDirectory, '/.npmignore'), path.join(configWebDirectory, '/library', '/npmignore.tmpl')],
	[path.join(baseDirectory, '/package.json'), path.join(configWebDirectory, '/library', '/package.tmpl')],
	[path.join(baseDirectory, '/readme.md'), path.join(configWebDirectory, '/library', '/readme.tmpl')],
	[path.join(baseDirectory, '/src/index.js'), path.join(configWebDirectory, '/library', '/src_index_js.tmpl')],
	[path.join(baseDirectory, '/test/karma.conf.js'), path.join(configWebDirectory, '/library', '/test_karma.tmpl')],
	[path.join(baseDirectory, '/test/.eslintrc.js'), path.join(configWebDirectory, '/library', '/test_eslintrc.tmpl')],
	[path.join(baseDirectory, '/test/unit/index.test.js'), path.join(configWebDirectory, '/library', '/test_unit_index.tmpl')],
	[path.join(baseDirectory, '/build/dev.js'), path.join(configWebDirectory, '/library', '/build_dev.tmpl')],
	[path.join(baseDirectory, '/build/prod.js'), path.join(configWebDirectory, '/library', '/build_prod.tmpl')],
	[path.join(baseDirectory, '/conf/index.html'), path.join(configWebDirectory, '/library', '/conf_html.tmpl')],
	[path.join(baseDirectory, '/conf/webpack.base.config.js'), path.join(configWebDirectory, '/library', '/conf_webpack_base.tmpl')],
	[path.join(baseDirectory, '/conf/webpack.dev.config.js'), path.join(configWebDirectory, '/library', '/conf_webpack_dev.tmpl')],
	[path.join(baseDirectory, '/conf/webpack.prod.config.js'), path.join(configWebDirectory, '/library', '/conf_webpack_prod.tmpl')],
	[path.join(baseDirectory, '/conf/webpack.test.config.js'), path.join(configWebDirectory, '/library', '/conf_webpack_test.tmpl')]
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
		case 'web':
			if (userConfigContent.subKind.toLowerCase() === 'library') {
				toCreateFiles = toCreateWebLibraryFiles;
			}
			else {
				toCreateFiles = toCreateWebSiteFiles;
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
