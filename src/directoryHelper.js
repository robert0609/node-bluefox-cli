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

let toCreateWebDirs = [
    path.join(baseDirectory, '/build'),
    path.join(baseDirectory, '/conf'),
    path.join(baseDirectory, '/src'),
    path.join(baseDirectory, '/test'),
		path.join(baseDirectory, '/src/common'),
		path.join(baseDirectory, '/src/pages'),
		path.join(baseDirectory, '/src/pages/home'),
		path.join(baseDirectory, '/src/static'),
		path.join(baseDirectory, '/src/static/home'),
    path.join(baseDirectory, '/test/unit')
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

/**
 * 创建项目文件夹
 * @param {object} userConfig
 * @param {function} callback
 */
function run(userConfig, callback) {
    let o = { callback };
    callback = o.getValueOrDefault('callback', (error, data) => {});
    let that = this;
    let toCreateDirs = null;
    switch (userConfig.kind.toLowerCase()) {
        case 'console':
            toCreateDirs = toCreateConsoleDirs;
            break;
        case 'library':
            toCreateDirs = toCreateLibraryDirs;
            break;
        case 'web':
            toCreateDirs = toCreateWebDirs;
            break;
    }

    let promises = toCreateDirs.map((elem) => {
        return co(createFolder(elem));
    });
    Promise.all(promises).then((results) => {
        callback.call(that);
    }).catch((error) => {
        callback.call(that, error);
    });
}

export default {
    run
};
