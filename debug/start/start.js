/*
 * @Description: 
 * @Autor: Yelikang
 * @Date: 2023-01-10 13:51:22
 */
const webpack = require("../../lib/index.js");
const config = require("./webpack.config.js");

console.log("start webpack test");
const compiler = webpack(config);
compiler.run((error, stats) => {
	if (error) {
		console.log(error);
	} else {
		console.log(stats);
	}
});
