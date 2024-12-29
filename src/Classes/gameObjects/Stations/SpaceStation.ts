import * as THREE from 'three';
import { OBJLoader } from "three/examples/jsm/Addons.js";

export class SpaceStation {
	scene: THREE.Scene;
	filePath: string;
	loader: OBJLoader;
	textureLoader: THREE.TextureLoader;
	textures: {
		diffuse: string,
		normal: string,
		emission: string,
		specular: string,
	}
	stationModel: THREE.Group | null;
	dataArray: Uint8Array;

	constructor(
		scene: THREE.Scene,
		filePath: string,
		loader: OBJLoader,
		textureLoader: THREE.TextureLoader,
		textures: {
			diffuse: string;
			normal: string;
			emission: string;
			specular: string;
		},
		dataArray: Uint8Array,
	) {
		this.scene = scene;
		this.filePath = filePath;
		this.loader = loader;
		this.textureLoader = textureLoader;
		this.stationModel = null;
		this.dataArray = dataArray;
		this.textures = textures;
		this.loadModel();
	}
	loadModel() {
		this.loader.load(this.filePath, (obj) => {

			this.stationModel = obj
			this.applyTexture();

			this.scene.add(this.stationModel)
			this.stationModel.scale.set(4, 4, 4)

			// const instanceCircle = new GridInstancedMesh(sceneManager.scene, audioVisualizer.dataArray)
			// const instancedSemi = new GridInstancedMesh(sceneManager.scene, audioVisualizer.dataArray)
		},
			(xhr) => {
				// onProgress: Log loading progress
				console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
			},
			(error) => {
				console.log('error', error)
			}
		);
	}
	applyTexture() {
		const diffuseMap = this.textureLoader.load(this.textures.diffuse);
		const normalMap = this.textureLoader.load(this.textures.normal);
		const emissionMap = this.textureLoader.load(this.textures.emission);
		const specularMap = this.textureLoader.load(this.textures.specular);
		if (this.stationModel) {
			this.stationModel.traverse((child) => {
				if ((child as THREE.Mesh).isMesh) {
					const mesh = child as THREE.Mesh;
					mesh.material = new THREE.MeshStandardMaterial({
						map: diffuseMap,
						normalMap: normalMap,
						emissiveMap: emissionMap,
						emissive: new THREE.Color(0x0000FF),
						emissiveIntensity: 3.0,
						roughnessMap: specularMap,
						color: 0x808080
					})
				}
			})
		} else {
			console.error('Space station not loaded yet')
		}
	}

	update() {
		// const scale = (this.dataArray[i] / 255);
		let time = (performance.now() / 1000);
		const dynamicScale = 4 + Math.sin(time * 0.1) * 0.2;
		if (this.stationModel) {
			this.stationModel.rotation.y += 0.001;
			this.stationModel.scale.set(dynamicScale, dynamicScale, dynamicScale)
		}
	}
}
