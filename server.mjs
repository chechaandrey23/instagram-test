import path from 'path';
import { readdir, readFile } from 'fs/promises';

//const content_path = '/min-content';
const content_path = '/content';

let files = await readdir(path.resolve() + content_path);

files = files.filter((filename) => {
	return /.txt$/i.test(filename);
});

let promises = files.map((value) => {
	return readFile(path.resolve() + content_path + '/' + value, {encoding: 'utf8'});
});

let datas = await Promise.all(promises);

let allIndexs = {};

let indexs = datas.map((dataItem, index) => {
	let itemIndex = {};
	
	let re = /[^\r\n]+/g
	let res;
	
	while((res = re.exec(dataItem))) {
		let world = res[0];
		// local index
		if(itemIndex.hasOwnProperty(world)) {
			itemIndex[world]++;
		} else {
			itemIndex[world] = 1;
		}
		
		// all index
		if(allIndexs.hasOwnProperty(world)) {
			allIndexs[world]++;
		} else {
			allIndexs[world] = 1;
		}
	}
	
	return itemIndex;
});

const uniqueKeys = Object.entries(allIndexs);

function uniqueValues() {
	let countArray = uniqueKeys.filter(([, count]) => {
		return count === 1;
	});
	
	return countArray.length;
}

function existInAllFiles() {
	let countArray = uniqueKeys.filter(([world]) => {
		let countArray = indexs.filter((index) => {
			return index.hasOwnProperty(world);
		});
		return countArray.length === indexs.length;
	});
	
	return countArray.length;
}

function existInAtLeastTen() {
	let countArray = uniqueKeys.filter(([world]) => {
		let countArray = indexs.filter((index) => {
			return index.hasOwnProperty(world);
		});
		return countArray.length >= 10;
	});
	
	return countArray.length;
}

console.log(`Unique phrases: ${uniqueValues()}`);

console.log(`Phrases that are in all 20 files: ${existInAllFiles()}`);

console.log(`Phrases that are in at least ten files: ${existInAtLeastTen()}`);








































