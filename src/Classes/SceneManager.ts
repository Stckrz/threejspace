import * as THREE from 'three';
import { GLTFLoader, OBJLoader, OrbitControls } from 'three/examples/jsm/Addons.js';
export class SceneManager {
	scene: THREE.Scene;
	camera: THREE.Camera;
	renderer: THREE.WebGLRenderer;
	loader: THREE.TextureLoader;
	gltfLoader: GLTFLoader;
	objLoader: OBJLoader;
	bgTexture: THREE.Texture;
	controls: OrbitControls;
	clock: THREE.Clock;
	constructor(
		canvas: HTMLCanvasElement
	) {
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		this.camera.position.setZ(30);
		this.scene.add(this.camera)
		this.renderer = new THREE.WebGLRenderer({ canvas })
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.loader = new THREE.TextureLoader;
		this.gltfLoader = new GLTFLoader;
		this.objLoader = new OBJLoader;
		this.controls = new OrbitControls(this.camera, this.renderer.domElement);
		this.clock = new THREE.Clock();


		this.bgTexture = this.loader.load(
			'space.png', () => {
				this.bgTexture.mapping = THREE.EquirectangularReflectionMapping;
				this.bgTexture.colorSpace = THREE.SRGBColorSpace;
				this.scene.background = this.bgTexture
			}
		)
	}

	public render(): void {
		this.renderer.render(this.scene, this.camera)

	}
}




