/**
 * 初始化需要的文件
 */
import co from 'co';
import fs from 'fs';
import path from 'path';
import {convertTemplateString} from './utility';

let baseDirectory = process.cwd();
let configConsoleDirectory = path.resolve(__dirname, '../conf/console/');
let configLibraryDirectory = path.resolve(__dirname, '../conf/library/');
let configWebDirectory = path.resolve(__dirname, '../conf/web/');
let userConfigContent = null;

const toCreateConsoleFiles = new Map([
    [path.join(baseDirectory, '/.babelrc'), path.join(configConsoleDirectory, '/babelrc.template')],
    [path.join(baseDirectory, '/package.json'), path.join(configConsoleDirectory, '/package.template')],
    [path.join(baseDirectory, '/readme.md'), path.join(configConsoleDirectory, '/readme.template')],
    [path.join(baseDirectory, '/gulpfile.js'), path.join(configConsoleDirectory, '/gulpfile.template')],
    [path.join(baseDirectory, '/bin/start.js'), path.join(configConsoleDirectory, '/start.template')],
    [path.join(baseDirectory, '/src/index.js'), path.join(configConsoleDirectory, '/index.template')],
    [path.join(baseDirectory, '/.npmignore'), path.join(configConsoleDirectory, '/npmignore.template')],
    [path.join(baseDirectory, '/.eslintrc.js'), path.join(configConsoleDirectory, '/eslintrc.template')]
]);

const toCreateLibraryFiles = new Map([]);
const toCreateWebFiles = new Map([]);

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
    content = convertTemplateString(content, userConfigContent);
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
 * @param {function} callback 
 */
function run(userConfig, callback) {
    let o = { callback };
    callback = o.getValueOrDefault('callback', (error, data) => {});
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
            toCreateFiles = toCreateWebFiles;
            break;
    }

    let promises = [];
    for (let [key, value] of toCreateFiles) {
        promises.push(co(createFile(key, value)));
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