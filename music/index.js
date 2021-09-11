const ytdl = require('ytdl-core');
const ytsr = require('ytsr');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// const filePath = path.join(__dirname, 'musicas.txt');
// if (!fs.existsSync(filePath)) {
// 	fs.writeFileSync(filePath, '');
// 	console.log(
// 		'Um arquivo de texto foi criado para que sejam colocadas as músicas a serem baixadas do yotube.'
// 	);
// 	console.log('*Utilize uma linha por música.');
// 	process.exit();
// }

// fs.readFile(filePath, { encoding: 'utf-8' }, (err, file) => {
// 	if (err) throw err;
// 	if (!file) throw new Error('Nenhuma música foi escrita no arquivo.');

// 	const lines = file.split('\n');
// 	lines.forEach(async (line) => {
// 		if (ytdl.validateURL(line)) {
// 			await download(line);
// 		}
// 		const filters = (await ytsr.getFilters(line)).get('Type').get('Video');
// 		const search = await ytsr(filters.url, { limit: 1 });

// 		download(search.items[0].url);
// 	});
// });

async function main(dir, text) {
	if (ytdl.validateURL(text)) {
		await download(dir, text);
		return;
	}
	const filters = (await ytsr.getFilters(text)).get('Type').get('Video');
	const search = await ytsr(filters.url, { limit: 1 });

	download(dir, search.items[0].url);
}

async function download(dir, url) {
	if (!dir) return;
	const dirPath = dir;

	const info = await ytdl.getInfo(url);
	const format = ytdl.chooseFormat(info.formats, { filter: 'audioonly' });

	const { title } = info.videoDetails;

	const destination = fs.createWriteStream(path.join(dirPath, `${title}.aac`));
	ytdl(url, { format, quality: 'highestaudio' }).pipe(destination);
}

module.exports = main;
