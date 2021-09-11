const { ipcRenderer } = require('electron');
const $ = require('jquery');
const bootstrap = require('bootstrap');

const noPathModal = new bootstrap.Modal($('#noFolderPathModal'));

const listElement = $('.main-list');
const itemModel = $('.main-list > li');
const addButton = $('.add-btn');

const removeItem = itemModel.find('.delete-item');
removeItem.on('click', (e) => {
	e.preventDefault();
	itemModel.find('input').val('');
});

addKeypressListener(itemModel);

addButton.on('click', (e) => {
	e.preventDefault();
	createItem();
});

function createItem() {
	const newElement = itemModel.clone();
	newElement.find('input').val('')[0].focus();
	listElement.append(newElement);
	addKeypressListener(newElement);

	const removeItem = newElement.find('.delete-item');
	removeItem.on('click', (e) => {
		e.preventDefault();
		newElement.remove();
	});
	return newElement;
}

function addKeypressListener(element) {
	element.on('keypress', (e) => {
		if (e.which == 13) {
			createItem().find('input')[0].focus();
		}
	});
}

const downloadDir = $('#dir').on('click', () => {
	window.postMessage({
		type: 'select-dirs',
	});
});

$('.close-modal').on('click', () => {
	$('#dir')[0].click();
});
$('.download-btn').on('click', () => {
	if (!downloadDir[0].files[0]) {
		noPathModal.show();
		return;
	}
	const musics = [];
	listElement.find('input').each((i, e) => {
		if (e.value) musics.push(e.value);
	});
	ipcRenderer.send('download-musics', downloadDir[0].files[0].path, musics);
});
