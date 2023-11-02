/*
 * @Description:
 * @Autor: Yelikang
 * @Date: 2022-12-06 15:03:11
 */

const path = require("path");
const TestPlugin = require("./plugin/tests.js");
const DependencyPlugin = require("./plugin/DependencePlugin");
const NewDependencyPlugin = require("./plugin/DependencePlugin/new.js");

module.exports = {
	// 解析上下文路径为当前webpack.config.js所处路径
	context: path.resolve(__dirname),
	mode: "development",
	entry: "./index.js",
	output: {
		filename: "bundle.js",
		path: path.resolve(__dirname, "dist")
	},
	plugins: [
		// new TestPlugin({
		// 	name: "哈哈哈"
		// }),
		// new DependencyPlugin({
		// 	dirPath: "modules"
		// })
		new NewDependencyPlugin({
			srcPath: "modules"
		})
	],
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					{
						loader: "css-loader"
					}
				]
			}
		]
	},
	// 测试enhanced-resolve传参
	resolve: {
		alias: {
			test: "src/test"
		}
	}
};
