import * as THREE from 'three';

export class AudioVisualizer {
	private analyser: AnalyserNode;
	public dataArray: Uint8Array;
	private scene: THREE.Scene;
	constructor(
		scene: THREE.Scene,
		analyser: AnalyserNode,
		fftSize: number = 2048,
	) {
		this.scene = scene;
		this.analyser = analyser;
		this.analyser.fftSize = fftSize;

		const bufferLength = this.analyser.frequencyBinCount;
		this.dataArray = new Uint8Array(bufferLength);
	}

	public update(): void {
		this.analyser.getByteFrequencyData(this.dataArray);
	}
}
