import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { addStar, addSun } from './utils/maker';
import { Ship } from './Classes/Ship';
import { VoxelGrid } from './Classes/VoxelGrid';

const ui = document.querySelector('#ui');
const thingbox = document.createElement('div');
thingbox.classList.add('thingbox')
if (ui) {
	ui.appendChild(thingbox)
}



//instantiate the scene and camera.
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

//instantiate the renderer, takes a canvas element.
const renderer = new THREE.WebGLRenderer({
	canvas: document.querySelector('#bg') as HTMLCanvasElement,
})
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
//sets the camera slightly back from center
camera.position.setZ(30);

//adds mouse camera controls
const controls = new OrbitControls(camera, renderer.domElement);
renderer.render(scene, camera);

//texture loading class
const loader = new THREE.TextureLoader();

const gltfLoader = new GLTFLoader();
const ship = new Ship(scene, gltfLoader, camera)

//adds a random hecking.. box.
const boxGeometry = new THREE.BoxGeometry(10, 10, 10)
const material = new THREE.MeshStandardMaterial({ color: 0xFF6447 });
const box = new THREE.Mesh(boxGeometry, material)
box.translateY(10)
// scene.add(box)

//adds spotlight and parents it under the camera.
const spotLight = new THREE.SpotLight(0xffffff, 2, 1, 10);
spotLight.position.set(0, 5, 5);
spotLight.target.position.set(0, 0, 0); // Point it toward the origin
camera.add(spotLight);
scene.add(camera);

//these are like.. helpers. pointlighthelper shows where the light is, gridhelper adds a ground grid.
// const gridHelper = new THREE.GridHelper(200, 50);

//ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2)
scene.add(ambientLight);

addSun(scene, loader)

const starArray = Array.from({ length: 200 }, () => addStar())
starArray.map((star) => scene.add(star))

const bgTexture = loader.load(
	'space.png', () => {
		bgTexture.mapping = THREE.EquirectangularReflectionMapping;
		bgTexture.colorSpace = THREE.SRGBColorSpace;
		scene.background = bgTexture
	}
)

const grid1 = new VoxelGrid(scene, { x: 5, y: 5, z: 5 }, new THREE.Vector3(-10, 0, 0));
grid1.addVoxel(0, 0, 0, 0xff0000);
grid1.addVoxel(1, 0, 0, 0xff0000);
grid1.addVoxel(2, 0, 0, 0xff0000);
grid1.addVoxel(3, 0, 0, 0xff0000);
grid1.addVoxel(4, 0, 0, 0xff0000);
grid1.addVoxel(4, 1, 0, 0xff0000);
grid1.addVoxel(4, 2, 0, 0xff0000);
grid1.addVoxel(4, 3, 0, 0xff0000);
grid1.addVoxel(4, 4, 0, 0xff0000);
grid1.addVoxel(0, 1, 0, 0xff0000);
grid1.addVoxel(0, 2, 0, 0xff0000);
grid1.addVoxel(0, 3, 0, 0xff0000);
grid1.addVoxel(0, 4, 0, 0xff0000);
grid1.addVoxel(0, 0, 1, 0xff0000);
grid1.addVoxel(0, 0, 2, 0xff0000);
grid1.addVoxel(0, 0, 3, 0xff0000);
grid1.addVoxel(0, 0, 4, 0xff0000);
grid1.addVoxel(2, 2, 2, 0xff0000);
grid1.updateVoxelColor(2, 2, 2, 0xffffff);
function animate() {
	requestAnimationFrame(animate);
	// box.rotation.x += 0.005;
	// box.rotation.y += 0.001;
	// box.rotation.z += 0.01;
	grid1.lerpVoxel(2, 2, 2);
	//
	ship.update()
	// ship.rotation.y += 0.005
	// ship.rotation.z += 0.002
	//
	// ship.rotation.x += 0.01
	// box.position.x = THREE.MathUtils.lerp(box.position.x, box.position.x + 1, 0.05)
	// camera.position.z = THREE.MathUtils.lerp(camera.position.z, camera.position.z - 1, 0.05)
	// pointLight.position.set(camera.position.x, camera.position.y, camera.position.z - 5)

	controls.update();

	renderer.render(scene, camera);
}
animate();
