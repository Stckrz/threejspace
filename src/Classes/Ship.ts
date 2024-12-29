import * as THREE from 'three';
import { GLTFLoader, OBJLoader } from 'three/examples/jsm/Addons.js';
import { EngineEmissions } from './instanceMeshes/engineEmissions';
export class Ship {
	scene: THREE.Scene;
	private gltfLoader: GLTFLoader;
	private objLoader: OBJLoader;
	private camera: THREE.Camera;
	public ship: THREE.Group | null;
	textureLoader: THREE.TextureLoader;
	textures: {
		diffuse: string,
		normal: string,
		emission: string,
		specular: string,
	};
	engineEmissions: EngineEmissions;

	constructor(
		scene: THREE.Scene,
		gltfLoader: GLTFLoader,
		objLoader: OBJLoader,
		camera: THREE.Camera,
		textureLoader: THREE.TextureLoader,
		textures: {
			diffuse: string,
			normal: string,
			emission: string,
			specular: string,
		}
	) {
		this.scene = scene;
		this.gltfLoader = gltfLoader;
		this.objLoader = objLoader;
		this.camera = camera;
		this.ship = null;
		this.textures = textures;
		this.textureLoader = textureLoader;
		this.loadModel()
		this.engineEmissions = new EngineEmissions(this.scene)
	}
	loadModel() {

		this.objLoader.load('Models/corvette01.obj', (obj) => {

			this.ship = obj
			this.applyTexture();

			this.ship.position.set(0, -1, -5)
			this.ship.rotateY(60);
			this.ship.rotateX(6);
			this.camera.add(this.ship)

			const boxGeometry = new THREE.BoxGeometry(0.15, 0.15, 0.15)
			const material = new THREE.MeshStandardMaterial({
				color: 0xFF6447,
				emissive: 0x0000FF,
				emissiveIntensity: 2
			});
			const box = new THREE.Mesh(boxGeometry, material)
			this.ship.add(box)
			box.scale.set(2.1, 2.1, 2.1)
			box.position.setX(0.5)
			box.position.setZ(-1.3)
			box.position.setY(0.01)
			box.rotateZ(15)
			const box2 = new THREE.Mesh(boxGeometry, material)
			this.ship.add(box)
			box2.scale.set(2.1, 2.1, 2.1)
			box2.position.setX(-0.52)
			box2.position.setZ(-1.3)
			box2.position.setY(0.05)
			box2.rotateZ(15)
			this.ship.add(box2)
			// this.ship.add(this.engineEmissions.instancedMesh)
			// this.engineEmissions.instancedMesh.position.setY(0.2)
			// this.engineEmissions.instancedMesh.position.setZ(-1.9)
			// this.engineEmissions.instancedMesh.position.setX(-0.4)

			// this.ship.scale.set(4, 4, 4)
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
		if (this.ship) {
			this.ship.traverse((child) => {
				if ((child as THREE.Mesh).isMesh) {
					const mesh = child as THREE.Mesh;
					mesh.material = new THREE.MeshStandardMaterial({
						map: diffuseMap,
						normalMap: normalMap,
						emissiveMap: emissionMap,
						emissive: new THREE.Color(0x0000FF),
						roughnessMap: specularMap,
						color: 0xF8F8F8
					})
				}
			})
		} else {
			console.error('Space station not loaded yet')
		}
	}
	setRotation(x: number, y: number, z: number) {
		if (this.ship) {
			this.ship.rotation.set(x, y, z)
		}
	}
	update() {
		if (this.ship) {
			// this.ship.rotation.x += 0.01;
			this.ship.rotation.z += 0.001;
		}
		this.engineEmissions.update()
	}
}
