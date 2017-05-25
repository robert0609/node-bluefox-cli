/**
 * 初始化需要的文件
 */
import co from 'co';
import fs from 'fs';
import path from 'path';
import './utility';

let baseDirectory = process.cwd();

function content(userConfig) {
    const babelrcContent = `{
    "presets": [
        "es2015"
    ],
    "plugins": []
}`;

    const packageContent = `{
  "name": "${userConfig.name}",
  "version": "${userConfig.version}",
  "description": "${userConfig.description}",
  "main": "./dist/index.js",
  "bin": {
    "bluefox": "./bin/start.js"
  },
  "scripts": {
    "clean": "./node_modules/.bin/gulp clean",
    "build": "./node_modules/.bin/gulp",
    "dev": "./node_modules/.bin/gulp debug",
    "lint": "./node_modules/.bin/gulp eslint"
  },
  "author": "${userConfig.auther}",
  "license": "ISC",
  "devDependencies": {
    "babel-cli": "^6.24.1",
    "babel-eslint": "^7.2.3",
    "babel-node-debug": "^2.0.0",
    "babel-polyfill": "^6.23.0",
    "babel-preset-es2015": "^6.24.1",
    "chai": "^3.5.0",
    "del": "^2.2.2",
    "eslint": "^3.19.0",
    "gulp": "^3.9.1",
    "gulp-babel": "^6.1.2",
    "gulp-eslint": "^3.0.1",
    "gulp-sourcemaps": "^2.6.0",
    "mocha": "^3.3.0"
  },
  "dependencies": {
    "babel-polyfill": "^6.23.0",
    "co": "^4.6.0"
  }
}`;

    const readmeContent = `# ${userConfig.name}

> ${userConfig.description}

## Build Setup

\`\`\` bash
# install dependencies
npm install

# serve development program
npm run dev

# build for production
npm run build
\`\`\``;

    const gulpFileContent = `var gulp = require('gulp');
var babel = require("gulp-babel");
var sourcemaps = require("gulp-sourcemaps");
var del = require('del');
var eslint = require('gulp-eslint');

gulp.task('eslint', function () {
    return gulp.src(['./src/*.js', './conf/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('mocha', function () {});

gulp.task('clean', ['eslint'], function () {
    return del([
        './dist/**/*'
    ]);
});

gulp.task('development_build', ['clean'], function () {
    return gulp.src('./src/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write('.', {includeContent: false, sourceRoot: '../src'}))
    .pipe(gulp.dest('./dist'));
});

gulp.task('production_build', ['clean'], function () {
    return gulp.src('./src/*.js')
    .pipe(babel())
    .pipe(gulp.dest('./dist'));
});

gulp.task('debug', ['development_build'], function () {
    require('./dist/index');
});

gulp.task('default', ['production_build']);`;

    const startContent = `#!/usr/bin/env node

require('../dist/index');`;

    const indexContent = `/**
* 主模块文件
*/
import 'babel-polyfill';

/**
 * 入口函数
 */
function main(...args) {
    process.stdout.write('Hello world!\\n');
}

/**
 * 缺省执行main函数
 */
main(...process.argv.slice(2));`;

    const ignoreContent = `build/
src/
test/
.vscode/
gulpfile.js`;

    const eslintContent = `module.exports = {
    "root": true,
    "parser": "babel-eslint",
    "env": {
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "sourceType": "module"
    },
    "rules": {
        "linebreak-style": [ "error",  "windows" ],
        "quotes": [ "error", "single" ],
        "semi": [ "error", "always" ],
        "no-unused-vars": "warn",
        "no-console": "warn"
    }
};`;

    return {
        babelrcContent,
        packageContent,
        readmeContent,
        gulpFileContent,
        startContent,
        indexContent,
        ignoreContent,
        eslintContent
    };
}

const toCreateFiles = new Map([
    [path.join(baseDirectory, '/.babelrc'), 'babelrcContent'],
    [path.join(baseDirectory, '/package.json'), 'packageContent'],
    [path.join(baseDirectory, '/readme.md'), 'readmeContent'],
    [path.join(baseDirectory, '/gulpfile.js'), 'gulpFileContent'],
    [path.join(baseDirectory, '/bin/start.js'), 'startContent'],
    [path.join(baseDirectory, '/src/index.js'), 'indexContent'],
    [path.join(baseDirectory, '/.npmignore'), 'ignoreContent'],
    [path.join(baseDirectory, '/.eslintrc.js'), 'eslintContent']
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

function* createFile(filename, content) {
    let isExists = yield* doesFileExist(filename);
    let result = yield new Promise((resolve, reject) => {
        let ws = fs.createWriteStream(filename);
        ws.on('finish', () => {
            resolve('finish');
        }).on('close', () => {
            resolve('close');
        }).on('error', (error) => {
            reject(error);
        });
        ws.write(content);
        ws.end();
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

    let contentProvider = content(userConfig);
    let promises = [];
    for (let [key, value] of toCreateFiles) {
        promises.push(co(createFile(key, contentProvider[value])));
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