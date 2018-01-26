import 'babel-polyfill';
import path from 'path';
import fileHelper from './fileHelper';

let baseDirectory = __dirname;
let dirs = [
	'../conf/console/',
	'../conf/library/',
	'../conf/webpack/library/',
	'../conf/webpack/site/',
	'../conf/webpack/vue/raw/',
	'../conf/webpack/vue/router/',
];

let resultFile = path.resolve(baseDirectory, '../conf/', 'dependencies.json');

async function loadPackageFiles() {
	let packageFilenames = dirs.map(d => {
		return path.resolve(baseDirectory, d, 'package.tmpl');
	});
	let packageFiles = await Promise.all(packageFilenames.map(filename => {
		return fileHelper.read(filename);
	}));
	let packages = packageFiles.map(content => {
		return JSON.parse(content);
	});
	let dependencies = {};
	packages.forEach(p => {
		for (let k in p.devDependencies) {
			dependencies[k] = p.devDependencies[k];
			p.devDependencies[k] = '';
		}
		for (let k in p.dependencies) {
			dependencies[k] = p.dependencies[k];
			p.dependencies[k] = '';
		}
	});
	await fileHelper.write(resultFile, JSON.stringify(dependencies, null, 2));
	await Promise.all(packages.map((p, index) => {
		return fileHelper.write(packageFilenames[index], JSON.stringify(p, null, 2))
	}));
}

loadPackageFiles();
