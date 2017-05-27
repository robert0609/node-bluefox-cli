/**
 * 命令行操作
 */
import co from 'co';
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// rl.on('line', (input) => {
//     process.stdout.write('You input: ' + input + '\n', 'utf8');
// });
rl.on('pause', () => {
    //console.log('pause');
});
rl.on('resume', () => {
    //console.log('resume');
});
rl.on('close', () => {
    //console.log('close');
});

function createQuestionPromise(question) {
    return new Promise(function (resolve, reject) {
        rl.question(question, resolve);
    });
}

function* conversation() {
    let kind = '';
    do {
        kind = yield createQuestionPromise('project type("console"、"library"or"web", default: console)?');
        if (kind.isEmpty()) {
            kind = 'console';
        }
    }
    while (!validateKind(kind));
    let name = yield createQuestionPromise('package name?');
    let version = '';
    do {
        version = yield createQuestionPromise('package version(default: 1.0.0)?');
        if (version.isEmpty()) {
            version = '1.0.0';
        }
    }
    while (!validateVersion(version));
    let description = yield createQuestionPromise('package description?');
    let auther = yield createQuestionPromise('develop auther?');
    return { kind, name, version, description, auther };
}

function validateKind(kind) {
    kind = kind.toLowerCase();
    let result = ['console', 'library', 'web'].indexOf(kind) > -1;
    if (!result) {
        rl.write('kind is error!\n');
    }
    return result;
}

function validateVersion(version) {
    let regex = /[1-9]*\d+\.[1-9]*\d+\.[1-9]*\d+/g;
    let result = regex.test(version);
    if (!result) {
        rl.write('version is error!\n');
    }
    return result;
}

/**
 * 运行用户配置获取器，返回用户输入的配置项
 * @param {function} callback 
 */
function run(callback) {
    let that = this;
    rl.prompt();
    co(conversation).then((arg) => {
        callback.call(that, null, arg);
    }).catch((error) => {
        callback.call(that, error);
    });
}

export default {
    run
};