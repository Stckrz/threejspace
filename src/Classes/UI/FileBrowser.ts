import { Socket } from "socket.io-client";
interface file {
	name: string,
	parentPath: string,
	path: string
}
interface fileReturnObject {
	directories: file[],
	files: file[]
}

export class FileBrowser {
	parent: Element;
	socket: Socket
	directoryBox: HTMLDivElement;
	currentFilePath: string;
	getFilesButton: HTMLButtonElement;
	backButton: HTMLButtonElement;
	directories: file[];
	files: file[];
	historyStack: string[];

	constructor(
		parent: Element,
		socket: Socket
	) {
		this.parent = parent;
		this.socket = socket;
		this.currentFilePath = './src/assets/audio'
		this.directories = [];
		this.files = [];
		this.historyStack = ['./src/assets/audio'];
		this.directoryBox = document.createElement('div');
		this.directoryBox.classList.add('directoryBox');
		parent.appendChild(this.directoryBox);

		this.getFilesButton = document.createElement('button');
		this.getFilesButton.addEventListener('click', () => {
			this.retreiveData('./src/assets/audio')
		})
		this.getFilesButton.innerText = "getstuff"
		this.getFilesButton.classList.add('playButton')
		this.directoryBox.appendChild(this.getFilesButton)
		this.backButton = document.createElement('button');
		this.backButton.innerText = "back";
		this.backButton.classList.add('playButton')
		this.backButton.addEventListener('click', () => {
			this.navigateBack()

		})
		this.directoryBox.appendChild(this.backButton)
	}
	retreiveData(filePath: string, isBackNavigation = false) {
		console.log("historyStack",this.historyStack)
		if (this.currentFilePath !== filePath && !isBackNavigation) {
			this.historyStack.push(this.currentFilePath)
		}
		this.currentFilePath = filePath


		this.socket.emit('listContents', { filePath }, (data: fileReturnObject) => {
			this.directories = data.directories
			this.files = data.files
			this.directoryBox.innerHTML = '';
			this.directoryBox.appendChild(this.backButton)
			console.log(data)

			this.directories.forEach((dir: file) => {
				const directoryElement = document.createElement('div');
				directoryElement.innerText = dir.name; // Adjust based on your data structure
				directoryElement.classList.add('directoryItem')
				directoryElement.addEventListener('click', () => {
					console.log("parentPath", dir.parentPath)
					this.retreiveData(`${dir.path}/${dir.name}`)
				})
				this.directoryBox.appendChild(directoryElement);
			});
			this.files.forEach((file: file) => {
				const fileElement = document.createElement('div');
				fileElement.innerText = file.name; // Adjust based on your data structure
				fileElement.classList.add('songItem')
				fileElement.addEventListener('click', () => {
					const songPath = `app/${file.path}/${file.name}`;
					console.log(`app/${file.path}/${file.name}`)
					this.socket.emit('addSong', {songPath})
				})
				this.directoryBox.appendChild(fileElement);
			});
		});
	}
	navigateBack() {
		console.log("historyStack",this.historyStack)
		if (this.historyStack.length > 0) {
			const previousPath = this.historyStack.pop();
			if (previousPath) {
				this.retreiveData(previousPath, true)
			} else {
				console.log('no more history..')
			}
		}
	}
}
