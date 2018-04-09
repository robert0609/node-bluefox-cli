import 'babel-polyfill';
import path from 'path';
import fileHelper from './fileHelper';

let baseDirectory = __dirname;
let homeDir = '/home/yangxu/gitspace/frontend';
let dirs = [
	'v-error-map',
	'v-h5-ui',
	'v-identity',
	'v-image-compressor',
	'v-math',
	'v-page',
	'v-pc-ui',
	'v-qqz-business',
	'v-slider',
	'v-utility',
	'v-vashare-business',
	'v-weixin-jssdk',
];

let resultFile = path.resolve(baseDirectory, '../conf/', 'dependencies.json');

let dependencyDictionary = require(resultFile);

async function loadPackageFiles() {
	let packageFilenames = dirs.map(d => {
		return path.resolve(homeDir, d, 'package.json');
	});
	console.log(packageFilenames);
	let packages = packageFilenames.map(filename => {
		return require(filename);
	});
	packages.forEach(p => {
		for (let k in p.devDependencies) {
			if (dependencyDictionary[k]) {
				p.devDependencies[k] = dependencyDictionary[k];
			}
		}
		for (let k in p.dependencies) {
			if (dependencyDictionary[k]) {
				p.dependencies[k] = dependencyDictionary[k];
			}
		}
		for (let k in p.peerDependencies) {
			if (dependencyDictionary[k]) {
				p.peerDependencies[k] = dependencyDictionary[k];
			}
		}
	});
	await Promise.all(packages.map((p, index) => {
		return fileHelper.write(packageFilenames[index], JSON.stringify(p, null, 2))
	}));
}

loadPackageFiles();
