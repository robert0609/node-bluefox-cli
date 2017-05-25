/**
 * 操作脚手架目录
 */
import co from 'co';
import fs from 'fs';
import path from 'path';
import './utility';

let baseDirectory = process.cwd();

let toCreateDirs = [
    path.join(baseDirectory, '/bin'), 
    path.join(baseDirectory, '/build'), 
    path.join(baseDirectory, '/conf'), 
    path.join(baseDirectory, '/dist'), 
    path.join(baseDirectory, '/doc'), 
    path.join(baseDirectory, '/src'), 
    path.join(baseDirectory, '/test')
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
 * @param {function} callback 
 */
function run(callback) {
    let o = { callback };
    callback = o.getValueOrDefault('callback', (error, data) => {});
    let that = this;
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