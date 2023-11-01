/*
 * @Description: 获取置顶目录下的所有文件信息
 * @Autor: Yelikang
 * @Date: 2023-01-12 14:20:33
 */
const fs = require("fs");
const path = require("path");
let fileArray = new Set();

const readDir = relativeDirPath => {
	const absoluteDirPath = path.resolve(__dirname, relativeDirPath);
	// 读取目录
	const files = fs.readdirSync(absoluteDirPath);
	// 循环目录下的文件
	files.forEach(fileName => {
		const fileDir = path.join(absoluteDirPath, fileName);
		const stats = fs.statSync(fileDir);
		// 是否文件
		const isFile = stats.isFile();
		// 是否目录
		const isDir = stats.isDirectory();
		// 如果是文件，就存入文件数组
		if (isFile) {
			fileArray.add(fileDir);
		} else if (isDir) {
			// 如果是目录，继续循环
			readDir(fileDir);
		}
	})
	return fileArray
}

const getAllfiles = relativeDirPath => {
	return new Promise(resolve => {
		const array = readDir(relativeDirPath);
		resolve(array);
	});
};
module.exports = getAllfiles;