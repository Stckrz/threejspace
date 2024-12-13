export class PlayButton {
	audioPlayer: HTMLAudioElement;
	parent: HTMLElement;
	playStatus: boolean;
	textContent: string;
	playButton: HTMLButtonElement;
	constructor(
		audioPlayer: HTMLAudioElement,
		parent: HTMLElement,
	) {
		this.audioPlayer = audioPlayer;
		this.parent = parent;
		this.textContent = "Play";
		this.playStatus = false;
		this.playButton = document.createElement("button");
		this.playButton.textContent = this.textContent;
		this.playButton.classList.add('playButton');
		parent.appendChild(this.playButton);
		this.instantiateListeners();
		this.playButton.addEventListener('click', () => {
			// if (this.playStatus) {
			// 	audioPlayer.pause();
			// } else {
			// 	audioPlayer.play();
			// }
		});
	}
	private instantiateListeners() {

		this.playButton.addEventListener('click', () => this.toggleStream());
		// 	this.audioPlayer.addEventListener('play', () => {
		// 		console.log("play1")
		// 		this.playStatus = true;
		// 		this.playButton.textContent = 'Pause';
		// 		this.audioPlayer.dispatchEvent(new CustomEvent('play-started'));
		// 	});
		//
		// 	this.audioPlayer.addEventListener('play', () => { this.updatePlayStatus(true); console.log("play2") });
		// 	this.audioPlayer.addEventListener('pause', () => {
		// 		this.updatePlayStatus(true); 
		// 		console.log("pause") 
		// 	});
		this.audioPlayer.addEventListener('ended', () => {
			console.log('ended');
			this.reconnectStream();
		});
		this.audioPlayer.addEventListener('error', () => {
			console.error('Playback error. Attempting to reconnect...');
			this.reconnectStream();
		});
	}


	private toggleStream() {
		if (this.playStatus) {
			this.disconnectStream();
		} else {
			this.connectStream();
		}
	}

	private connectStream() {
		console.log("Connecting to stream...");
		this.audioPlayer.load(); // Ensure the stream is loaded
		this.audioPlayer.play().catch((error) => {
			console.error("Failed to start the stream:", error);
		});
		this.playStatus = true;
		this.updateButtonState();
	}

	private disconnectStream() {
		console.log("Disconnecting from stream...");
		this.audioPlayer.pause();
		this.audioPlayer.currentTime = 0; // Reset the stream position
		this.playStatus = false;
		this.updateButtonState();
	}

	private updateButtonState() {
		this.playButton.textContent = this.playStatus ? "Stop" : "Connect";
	}

	startStream() {
		this.audioPlayer.play()
	}

	private reconnectStream(retryDelay: number = 5000) {
		this.audioPlayer.pause();
		this.audioPlayer.currentTime = 0;

		setTimeout(() => {
			console.log('Reconnecting to stream...');
			this.audioPlayer.load();
			this.audioPlayer.play().catch((error) => {
				console.error('Failed to reconnect to the stream:', error);
				this.reconnectStream(retryDelay);
			});
		}, retryDelay);
	}
}
