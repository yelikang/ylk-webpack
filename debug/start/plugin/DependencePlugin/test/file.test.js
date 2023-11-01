/*
 * @Description: 
 * @Autor: Yelikang
 * @Date: 2023-01-12 14:35:25
 */
const getAllfiles = require("../utils/file.js");


describe("目录文件列表", () => {
	it("文件列表获取", async () => {
		const array = await getAllfiles('../../../modules');
		expect(array.size).toBe(5)
	});
});

