import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { addStar, addSun, randomHexColorCode } from './utils/maker';
import { Ship } from './Classes/Ship';
import { VectorEnum, VoxelGrid } from './Classes/VoxelGrid';
import { PlayButton } from './Classes/UI/PlayButton';
import { NowPlaying } from './Classes/UI/NowPlaying';

/////////////////////////////////////////////////UI///////////////////////////////////////////
const ui = document.querySelector('#ui');
const thingbox = document.createElement('div');
thingbox.classList.add('thingbox')
if (ui) {
	ui.appendChild(thingbox)

	const audioControls = document.createElement('div')
	audioControls.classList.add('audioControls');
	ui.appendChild(audioControls)

	const audioPlayer = document.createElement('audio');
	const audioSource = document.createElement('source');
	audioSource.type = "audio/mpeg";
	audioSource.src = "http://localhost:3000/stream";
	audioControls.appendChild(audioPlayer)
	audioPlayer.appendChild(audioSource);

	const playButton = new PlayButton(audioPlayer, audioControls)
	const nowPlaying = new NowPlaying(thingbox)
	nowPlaying.setupListeners(audioPlayer);

}
/////////////////////////////////////////////////UI///////////////////////////////////////////


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
scene.add(box)

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
grid1.addVoxel(4, 0, 0, 0xff0000)

// grid1.updateVoxelColor(2, 2, 2, 0xffffff);
let counter = 0;

// const render = function() {
// 	requestAnimationFrame(render);
//
// 	if (counter <= 100) {
// 		box.position.x += 0.01;
// 		counter++;
// 	}
//
// 	if (counter > 100) {
// 		box.position.x -= 0.01;
// 		counter++;
// 	}
//
// 	if (counter > 200) {
// 		counter = 0;
//
// 		// if (grid1.voxels[0].position !== grid1.voxels[0].key) {
// 		// grid1.lerpVoxel(grid1.voxels[0].voxel, VectorEnum.X)
// 		// }
// 		grid1.voxels[0].returnPosition();
// 	}
// 	renderer.render(scene, camera);
//
// }
// render()
function animate() {
	requestAnimationFrame(animate);

	for (const star of starArray) {
		if (counter <= 500) {
			star.position.x += 0.01;
			box.position.x += 0.0001;
		}
		if (counter > 500) {
			star.position.x -= 0.01;
			box.position.x -= 0.0001;
		}
		if (counter > 1000) {
			counter = 0;
			star.material.color.set(randomHexColorCode())
		grid1.voxels[0].returnPosition();
		}
	}

	grid1.lerpVoxel(grid1.voxels[0].voxel, VectorEnum.Y)
	ship.update()
	counter++
	controls.update();

	renderer.render(scene, camera);
}
animate();
