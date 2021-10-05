const { app } = require('electron');
const fs = require('fs');
const path = require('path');

module.exports = class Store {
	constructor() {
		this.path = app.getPath('userData');
		this.file = path.join(this.path, 'store.json');

		if (!fs.existsSync(this.file)) {
			fs.writeFileSync(this.file, '{}');
		}

		this.fileData = fs.readFileSync(this.file);
		this.data = JSON.parse(this.fileData);
	}

	get(key) {
		return this.data[key];
	}

	set(key, value) {
		this.data[key] = value;
		this.save();
	}

	delete(key) {
		delete this.data[key];
		this.save();
	}

	save() {
		const stringData = JSON.stringify(this.data);
		fs.writeFileSync(this.file, stringData);
	}
};
