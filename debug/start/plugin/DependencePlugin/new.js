const fg = require("fast-glob");
const path = require("path");
const chalk = require("chalk");

class NewDependencePlugin {
	constructor(options) {
		this._options = Object.assign(
			{
				srcPath: ""
			},
			options
		);
	}
	apply(compiler) {
		compiler.hooks.afterEmit.tapAsync("PluginName", (compilation, cb) => {
			const deps = Array.from(compilation.fileDependencies);
			const contextPath = compilation.compiler.context;
			const srcPath = path.resolve(contextPath, this._options.srcPath);
			const depFiles = getSrcDepFiles(deps, srcPath);
			const allFiles = getSrcAllFiles(srcPath);
			const unusedFiles = allFiles.filter(file => file && !depFiles[file]);
			logFileInfo(unusedFiles);
		});
	}
}

const getSrcAllFiles = srcPath => {
	const unixPath = toUnixFilePath(srcPath + "/**/*.*");
	const files = fg.sync([unixPath], { ignore: "**/node_modules/**" });
	return files;
};

const getSrcDepFiles = (depFiles, srcPath) => {
	return depFiles
		.filter(file => {
			return (
				file &&
				file.indexOf("node_modules") === -1 &&
				file.indexOf(srcPath) > -1
			);
		})
		.reduce((acc, file) => {
			const unixFile = toUnixFilePath(file);
			acc[unixFile] = true;
			return acc;
		}, {});
};

const toUnixFilePath = path => {
	return path.replace(/\\+/g, "/");
};

const logFileInfo = files => {
	if (!files.length) {
		console.log(
			chalk.yellow(
				"\n--------------------- 未检测到未使用的文件 ---------------------"
			)
		);
		return;
	}

	console.log(
		chalk.yellow(
			"\n--------------------- 输出：未使用的文件 ---------------------"
		)
	);
	files.forEach(file => console.log(`\n${chalk.yellow(file)}`));
	console.log(
		chalk.yellow(
			"\n--------------------- 结束输出：未使用的文件 ---------------------"
		)
	);
};

module.exports = NewDependencePlugin;
