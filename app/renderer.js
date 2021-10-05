const { ipcRenderer, remote } = require('electron');
const $ = require('jquery');
const bootstrap = require('bootstrap');

const noPathModal = new bootstrap.Modal($('#noFolderPathModal'));

const listElement = $('.main-list');
const itemModel = $('.main-list > li');
const addButton = $('.add-btn');

// Start
// const store = remote.getGlobal('store');
// const downloadPath = store.get('downloadPath');
// const pathArray = downloadPath.split('\\');
// const folderName = pathArray[pathArray.length - 1];

// folderNameChange();
$('.dir-selection').on('click', () => {
	$('#dir')[0].click();
});

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

async function folderNameChange() {
	if (downloadPath) {
		$('.dir-selection').find('span').text(folderName).removeClass('visually-hidden');
		$('.dir-selection').find('button').text('Selecionar outra pasta');
	}
}

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

const downloadDir = $('#dir').on('click', async () => {
	window.postMessage({
		type: 'select-dirs',
	});
	await folderNameChange();
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
	store.set('downloadPath', downloadDir[0].files[0].path);
});
