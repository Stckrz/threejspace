import { Metadata } from "../../Models/Metadata";

export class NowPlaying {
	parent: Element;
	metadata: Metadata | null;
	metadataContainer: HTMLElement;
	titleDiv: HTMLElement;
	artistDiv: HTMLElement;
	albumDiv: HTMLElement;
	constructor(
		parent: HTMLElement,
	) {
		this.parent = parent;
		this.metadata = null;
		this.metadataContainer = document.createElement('div');
		this.metadataContainer.classList.add('metadataContainer');
		parent.appendChild(this.metadataContainer);
		this.titleDiv = document.createElement('div');
		this.artistDiv = document.createElement('div');
		this.albumDiv = document.createElement('div');
		this.metadataContainer.appendChild(this.titleDiv);
		this.metadataContainer.appendChild(this.artistDiv);
		this.metadataContainer.appendChild(this.albumDiv);
		this.getMetadata();
	}

	public async getMetadata() {
		try {
			const response = await fetch("http://localhost:3000/metadata");
			const data = await response.json();
			this.metadata = data;
		} catch (error) {
			console.log(error);
		}
	}
	public updateNowPlaying(){
		if(this.metadata){
			this.titleDiv.textContent = this.metadata.title;
			this.artistDiv.textContent = this.metadata.artist;
			this.albumDiv.textContent = this.metadata.album;
		}
	}
	setupListeners(audioPlayer: HTMLAudioElement) {
		console.log('thing received')
		audioPlayer.addEventListener('play-started', async () => {
			await this.getMetadata();
			this.updateNowPlaying();
		});
	}
}
