import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
export class Ship {
	scene: THREE.Scene;
	private gltfLoader: GLTFLoader;
	private camera: THREE.Camera;
	public ship: THREE.Group | null;

	constructor(
		scene: THREE.Scene,
		gltfLoader: GLTFLoader,
		camera: THREE.Camera,
	) {
		this.scene = scene;
		this.gltfLoader = gltfLoader;
		this.camera = camera;
		this.ship = null;
		this.loadModel()
	}
	loadModel() {
		this.gltfLoader.load('Models/ship.glb', (gltf) => {
			this.ship = gltf.scene;
			this.ship.position.set(0, -2, -5)
			this.ship.rotateY(300)

			this.camera.add(this.ship)
		},
			(error) => {
				console.error('Error loading model: ', error)
			}
		);
	}
	setRotation(x: number, y: number, z: number) {
		if (this.ship) {
			this.ship.rotation.set(x, y, z)
		}
	}
	update() {
		if (this.ship) {
			this.ship.rotation.x += 0.01;
			this.ship.rotation.z += 0.01;
		}
	}
}
