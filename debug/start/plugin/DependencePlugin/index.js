/*
 * @Description: 依赖检测插件
 * @Autor: Yelikang
 * @Date: 2023-01-12 13:37:49
 */
const chalk = require('chalk');

const defaultOptions = {
	// 默认检测目录
	dirPath: "src"
};
const pluginName = "DependencyPlugin";
const getAllfiles = require('./utils/file')
class DependencyPlugin {
	constructor(options = {}) {
		this.options = Object.assign(defaultOptions, options);
	}
	apply(compiler) {
		// 监听提交打包文件之前回调
		compiler.hooks.emit.tapPromise(pluginName, compilation => {
			console.log(chalk.yellow("开始依赖检测... \n"));
			return new Promise(resolve => {
				this.depFiles = getDependenceModule(compilation.modules);
				resolve();
			}).finally(() => {
				// 对比文件
				getAllfiles("../../../" + this.options.dirPath).then(allFiles => {
					compilerFile(allFiles, this.depFiles)
				}).finally(() => {
					this.depFiles = []
					console.log(chalk.yellow("\n结束依赖检测..."));
				})
			});
		});
	}
}

const getDependenceModule = modules => {
	const depsFiles = new Set()
	modules.forEach(module => {
		const { resource } = module;
		if (resource) {
			depsFiles.add(resource)
		}
	});
	return depsFiles
};

const compilerFile = (allFiles, depFiles) => {
	const unUsedFile = []
	// 循环所有文件，查看是否被依赖
	allFiles.forEach(fileName => {
		if (!depFiles.has(fileName)) {
			// 分析出未被应用的模块
			// 分析被引用了的模块(可指定某个模块)，被哪些地方引用、引用了几次
			// 生成文件报告

			// {module:'xxx', number:2, deps:['1','2']}
			unUsedFile.push({
				module: fileName
			});
		}
	})
	console.log(chalk.red("===start未被应用的模块=== \n"))
	unUsedFile.forEach(item => {
		console.log(chalk.red(item.module + "\n"))
	})
	console.log(chalk.red("===end 未被应用的模块=== \n"))
};

module.exports = DependencyPlugin;


// 删除无用代码思路compilation.fileDependencies   链接:https://juejin.cn/post/7066956841279815694
// 开源：webpack-deadcode-plugin