/**
 * 操作脚手架目录
 */
import co from 'co';
import fs from 'fs';
import path from 'path';
import './utility';

let baseDirectory = process.cwd();

let toCreateConsoleDirs = [
	path.join(baseDirectory, '/bin'),
	path.join(baseDirectory, '/build'),
	path.join(baseDirectory, '/conf'),
	path.join(baseDirectory, '/dist'),
	path.join(baseDirectory, '/doc'),
	path.join(baseDirectory, '/src'),
	path.join(baseDirectory, '/test')
];

let toCreateLibraryDirs = [
	path.join(baseDirectory, '/build'),
	path.join(baseDirectory, '/conf'),
	path.join(baseDirectory, '/dist'),
	path.join(baseDirectory, '/doc'),
	path.join(baseDirectory, '/src'),
	path.join(baseDirectory, '/test')
];

let toCreateWebpackSiteDirs = [
	[
		path.join(baseDirectory, '/build'),
		path.join(baseDirectory, '/conf'),
		path.join(baseDirectory, '/src'),
		path.join(baseDirectory, '/test')
	],
	[
		path.join(baseDirectory, '/src/common'),
		path.join(baseDirectory, '/src/pages'),
		path.join(baseDirectory, '/src/static'),
		path.join(baseDirectory, '/test/unit')
	],
	[
		path.join(baseDirectory, '/src/pages/home'),
		path.join(baseDirectory, '/src/static/home')
	]
];

let toCreateWebpackLibraryDirs = [
	[
		path.join(baseDirectory, '/build'),
		path.join(baseDirectory, '/conf'),
		path.join(baseDirectory, '/src'),
		path.join(baseDirectory, '/test')
	],
	[
		path.join(baseDirectory, '/src/static'),
		path.join(baseDirectory, '/test/unit')
	],
	[
		path.join(baseDirectory, '/src/static/img'),
		path.join(baseDirectory, '/src/static/style')
	]
];

let toCreateWebpackVueDirs = [
	[
		path.join(baseDirectory, '/build'),
		path.join(baseDirectory, '/conf'),
		path.join(baseDirectory, '/src'),
		path.join(baseDirectory, '/test')
	],
	[
		path.join(baseDirectory, '/src/common'),
		path.join(baseDirectory, '/src/pages'),
		path.join(baseDirectory, '/src/static'),
		path.join(baseDirectory, '/test/unit')
	],
	[
		path.join(baseDirectory, '/src/pages/home'),
		path.join(baseDirectory, '/src/static/home')
	]
];

let toCreateWebpackVueWithRouterDirs = [
	[
		path.join(baseDirectory, '/build'),
		path.join(baseDirectory, '/conf'),
		path.join(baseDirectory, '/src'),
		path.join(baseDirectory, '/test')
	],
	[
		path.join(baseDirectory, '/src/common'),
		path.join(baseDirectory, '/src/pages'),
		path.join(baseDirectory, '/src/static'),
		path.join(baseDirectory, '/src/router'),
		path.join(baseDirectory, '/test/unit')
	],
	[
		path.join(baseDirectory, '/src/pages/error'),
		path.join(baseDirectory, '/src/pages/home'),
		path.join(baseDirectory, '/src/pages/notfound'),
		path.join(baseDirectory, '/src/static/home')
	]
];

function* createFolder(targetDir) {
	let isExists = yield new Promise((resolve, reject) => {
		fs.access(targetDir, (error) => {
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
	if (isExists) {
		return true;
	}
	else {
		let createResult = yield new Promise((resolve, reject) => {
			fs.mkdir(targetDir, (error) => {
				if (error) {
					reject(error);
				}
				else {
					resolve(true);
				}
			});
		});
		return createResult;
	}
}

async function createFolderCascade(toCreateDirs) {
	for (let i = 0; i < toCreateDirs.length; ++i) {
		let promises = toCreateDirs[i].map((elem) => {
			return co(createFolder(elem));
		});
		await Promise.all(promises);
	}
}

/**
 * 创建项目文件夹
 * @param {object} userConfig
 * @param {function} callback
 */
function run(userConfig, callback) {
	let o = { callback };
	callback = o.getValueOrDefault('callback', (error, data) => { });
	let that = this;
	let toCreateDirs = null;
	switch (userConfig.kind.toLowerCase()) {
		case 'console':
			toCreateDirs = toCreateConsoleDirs;
			break;
		case 'library':
			toCreateDirs = toCreateLibraryDirs;
			break;
		case 'webpack':
			if (userConfig.subKind.toLowerCase() === 'library') {
				toCreateDirs = toCreateWebpackLibraryDirs;
			}
			else if (userConfig.subKind.toLowerCase() === 'vue') {
				if (userConfig.withVueRouter.toLowerCase() === 'y') {
					toCreateDirs = toCreateWebpackVueWithRouterDirs;
				}
				else {
					toCreateDirs = toCreateWebpackVueDirs;
				}
			}
			else {
				toCreateDirs = toCreateWebpackSiteDirs;
			}
			break;
	}

	if (toCreateDirs[0] instanceof Array) {
		createFolderCascade(toCreateDirs).then(() => {
			callback.call(that);
		}).catch(error => {
			callback.call(that, error);
		});
	}
	else {
		let promises = toCreateDirs.map((elem) => {
			return co(createFolder(elem));
		});
		Promise.all(promises).then((results) => {
			callback.call(that);
		}).catch((error) => {
			callback.call(that, error);
		});
	}
}

export default {
	run
};
