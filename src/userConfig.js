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
		kind = yield createQuestionPromise('project type("console"、"library"or"webpack", default: console)?');
		if (kind.isEmpty()) {
			kind = 'console';
		}
	}
	while (!validateKind(kind));
	let subKind = '';
	let webLibrary = '';
	let withVueRouter = '';
	if (kind.toLowerCase() === 'webpack') {
		do {
			subKind = yield createQuestionPromise('sub type("site"、"library"or"vue", default: site)?');
			if (subKind.isEmpty()) {
				subKind = 'site';
			}
		}
		while (!validateSubKind(subKind));
		if (subKind.toLowerCase() === 'library') {
			do {
				webLibrary = yield createQuestionPromise('webpack library name(A-Za-z0-9_)?');
			}
			while (!validateWebLibrary(webLibrary));
		}
		else if (subKind.toLowerCase() === 'vue') {
			do {
				withVueRouter = yield createQuestionPromise('with vue-router("y"or"n", default: n)?');
				if (withVueRouter.isEmpty()) {
					withVueRouter = 'n';
				}
				else if (withVueRouter.toLowerCase() === 'yes') {
					withVueRouter = 'y';
				}
				else if (withVueRouter.toLowerCase() === 'no') {
					withVueRouter = 'n';
				}
			}
			while (!validateVueKind(withVueRouter));
		}
	}
	let name = yield createQuestionPromise('package name?');
	let version = '';
	do {
		version = yield createQuestionPromise('package version(default: 0.1.1)?');
		if (version.isEmpty()) {
			version = '0.1.1';
		}
	}
	while (!validateVersion(version));
	let description = yield createQuestionPromise('package description?');
	let auther = yield createQuestionPromise('develop auther?');
	return { kind, subKind, webLibrary, withVueRouter, name, version, description, auther };
}

function validateKind(kind) {
	kind = kind.toLowerCase();
	let result = ['console', 'library', 'webpack'].indexOf(kind) > -1;
	if (!result) {
		rl.write('project type is error!\n');
	}
	return result;
}

function validateSubKind(subKind) {
	subKind = subKind.toLowerCase();
	let result = ['site', 'library', 'vue'].indexOf(subKind) > -1;
	if (!result) {
		rl.write('project sub type is error!\n');
	}
	return result;
}

function validateVueKind(withVueRouter) {
	withVueRouter = withVueRouter.toLowerCase();
	let result = ['y', 'n', 'yes', 'no'].indexOf(withVueRouter) > -1;
	if (!result) {
		rl.write('error!\n');
	}
	return result;
}

function validateWebLibrary(webLibrary) {
	let result = webLibrary && /\w/g.test(webLibrary);
	if (!result) {
		rl.write('webpack library name is invalid!\n');
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
