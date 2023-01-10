/*
 * @Description:
 * @Autor: Yelikang
 * @Date: 2022-12-06 15:05:51
 */

class Test {
	constructor(options) {
		this.options = options || {};
	}
	apply(compiler) {
		// 全局compiler编译对象
		// module模块编译对象

		// 注册环境构建时的回调
		compiler.hooks.environment.tap("start environment", compilation => {
			console.log(compilation);
		});

		// 注册提交打包文件时的回调(输出 asset 到 output 目录之前执行)
		compiler.hooks.emit.tapPromise("TestPlugin", compilation => {
			// compilation.modules中会显示项目依赖了哪些模块(这里可以判断出哪些代码没有被使用)
			// 获取指定目录下的所有文件名，构建数组对象，与被使用了的模块进行匹配
			
			// 模块被哪些地方依赖，每个compilation.modules的dependencies会记录这些模块依赖哪些模块，可以反向记录哪些模块被哪里依赖

			// compilation.modules对象中的depth记录依赖层级
			
			// {module:'xxx', number:2, deps:['1','2']}

			return new Promise(resolve => {
				const assetKeys = Object.keys(compilation.assets);
				console.log("TestPlugin is being called", assetKeys);
				// 挨个访问打包后的文件内容
				assetKeys.forEach(fileName => {
					let assetFile = compilation.assets[fileName];
					let source = assetFile.source();
					source = "/*添加内容*/\n" + source;
					// 改写source方法返回的内容\
					compilation.assets[fileName] = {
						source: function () {
							return source;
						},
						size: function () {
							return source.length;
						}
					};
				});
				resolve();
			});
		});
		// 绑定在thisCompilation钩子上，可以进一步绑定到compilation过程的更早期的阶段
		compiler.hooks.thisCompilation.tap("TestPlugin", compilation => {
			compilation.hooks.chunkAsset.tap("TestPlugin", (module, fileName) => {
				console.log("module", fileName);
			});
		});

		// 注册打包完成后的回调
		compiler.hooks.done.tap("build done", stats => {
			console.log("build done", stats);
		});
	}
}

module.exports = Test;
