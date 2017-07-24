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
	if (kind.toLowerCase() === 'webpack') {
		do {
			subKind = yield createQuestionPromise('sub type("site"or"library", default: site)?');
			if (subKind.isEmpty()) {
				subKind = 'site';
			}
		}
		while (!validateSubKind(subKind));
		if (subKind.toLowerCase() === 'library') {
			do {
				webLibrary = yield createQuestionPromise('web library name?(A-Za-z0-9_)');
			}
			while (!validateWebLibrary(webLibrary));
		}
	}
	let name = yield createQuestionPromise('package name?');
	let version = '';
	do {
		version = yield createQuestionPromise('package version(default: 0.0.1)?');
		if (version.isEmpty()) {
			version = '0.0.1';
		}
	}
	while (!validateVersion(version));
	let description = yield createQuestionPromise('package description?');
	let auther = yield createQuestionPromise('develop auther?');
	return { kind, subKind, webLibrary, name, version, description, auther };
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
	let result = ['site', 'library'].indexOf(subKind) > -1;
	if (!result) {
		rl.write('project sub type is error!\n');
	}
	return result;
}

function validateWebLibrary(webLibrary) {
	let result = webLibrary && /\w/g.test(webLibrary);
	if (!result) {
		rl.write('web library name is invalid!\n');
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
