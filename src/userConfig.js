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
    let name = yield createQuestionPromise('name?');
    let version = yield createQuestionPromise('version?');
    let description = yield createQuestionPromise('description?');
    let auther = yield createQuestionPromise('auther?');
    return { name, version, description, auther };
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