export class AudioController {
	audioPlayer: HTMLAudioElement;
	parent: Element;
	playStatus: boolean;
	textContent: string;
	playButton: HTMLButtonElement;
	dataArray: Uint8Array;
	analyser: AnalyserNode;
	constructor(
		parent: Element,
	) {
		this.parent = parent;
		this.textContent = "Play";
		this.playStatus = false;

		const audioControls = document.createElement('div')
		audioControls.classList.add('audioControls');
		parent.appendChild(audioControls)

		this.playButton = document.createElement("button");
		this.playButton.textContent = this.textContent;
		this.playButton.classList.add('playButton');
		audioControls.appendChild(this.playButton);
		this.playButton.addEventListener('click', () => {
		});

		this.audioPlayer = document.createElement('audio');
		this.audioPlayer.crossOrigin = 'anonymous'; // Allow cross-origin audio processing
		const audioSource = document.createElement('source');
		audioSource.type = "audio/mpeg";
		audioSource.src = "http://localhost:3000/stream";
		audioControls.appendChild(this.audioPlayer)
		this.audioPlayer.appendChild(audioSource);

		this.instantiateListeners();

		//Set up audio analyser
		const audioContext = new (window.AudioContext)();
		const track = audioContext.createMediaElementSource(this.audioPlayer);
		this.analyser = audioContext.createAnalyser();
		track.connect(this.analyser);
		this.analyser.connect(audioContext.destination);
		// Configure the analyser
		this.analyser.fftSize = 128;
		const bufferLength = this.analyser.frequencyBinCount;
		this.dataArray = new Uint8Array(bufferLength);
	}

	private instantiateListeners() {

		this.playButton.addEventListener('click', () => this.toggleStream());
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
	returnAudioAnalyser() {
		return this.analyser;
	}
}
