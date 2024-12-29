import './style.css'
import * as THREE from 'three';
import { GLTFLoader, OBJLoader, OrbitControls } from 'three/examples/jsm/Addons.js';
import { addStar, addSun, randomHexColorCode } from './utils/maker';
import { Ship } from './Classes/Ship';
import { VectorEnum, VoxelGrid } from './Classes/VoxelGrid';
import { AudioController } from './Classes/UI/AudioController';
import { NowPlaying } from './Classes/UI/NowPlaying';
import { AudioVisualizer } from './Classes/AudioVisualizer';
import { SceneManager } from './Classes/SceneManager';
import { GridInstancedMesh } from './Classes/GridInstanceMesh';
import { StarInstancedMesh } from './Classes/StarsInstanceMesh';
import { CameraManager } from './Classes/CameraManager';
import { SpaceStation } from './Classes/gameObjects/Stations/SpaceStation';
import { EngineEmissions } from './Classes/instanceMeshes/engineEmissions';
import { SphereInstancedMesh } from './Classes/instanceMeshes/sphereInstancedMesh';
import { SpaceDust } from './Classes/instanceMeshes/spaceDust';
import { SpherePlanet } from './Classes/instanceMeshes/spherePlanet';
import { io } from 'socket.io-client';
import { FileBrowser } from './Classes/UI/FileBrowser';

const socket = io('http://localhost:3000', {

});

socket.on('connect', () => {
	console.log('Connected to server!', socket.id);
});

socket.on('disconnect', () => {
	console.log('Disconnected from server!', socket.id);
});

// Or any custom events:
socket.on('currentSong', (data) => {
	console.log('Got currentSong data:', data);
	return data;
});

socket.on('directoryList', (data) => {
	console.log('data:', data);
	return(data)
});

/////////////////////////////////////////////////UI///////////////////////////////////////////
const ui = document.querySelector('#ui')!;
const thingbox = document.createElement('div');
thingbox.classList.add('thingbox')
ui.appendChild(thingbox)


const audioController = new AudioController(ui)
const nowPlaying = new NowPlaying(thingbox, socket)
nowPlaying.setupListeners(audioController.audioPlayer);
const fileBrowser = new FileBrowser(thingbox, socket)

/////////////////////////////////////////////////UI///////////////////////////////////////////

const sceneManager = new SceneManager(document.querySelector('#bg')!)
const audioVisualizer = new AudioVisualizer(sceneManager.scene, audioController.returnAudioAnalyser())
// const cameraManager = new CameraManager(sceneManager.camera)

const ship = new Ship(sceneManager.scene, sceneManager.gltfLoader, sceneManager.objLoader, sceneManager.camera, sceneManager.loader, {
	diffuse: 'Models/corvette01_diffuse.png',
	normal: 'Models/corvette01_normal.png',
	emission: 'Models/corvette01_emission.png',
	specular: 'Models/corvette01_specular.png'
})
const spaceStation = new SpaceStation(
	sceneManager.scene,
	'Models/spacestations/station01.obj',
	sceneManager.objLoader,
	sceneManager.loader,
	{
		diffuse: 'Models/spacestations/station01_diffuse.png',
		normal: 'Models/spacestations/station01_normal.png',
		emission: 'Models/spacestations/station01_emission.png',
		specular: 'Models/spacestations/station01_specular.png'
	},
	audioVisualizer.dataArray

)



//ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2)
sceneManager.scene.add(ambientLight);
addSun(sceneManager.scene, sceneManager.loader)


//adds a random hecking.. box.
const boxGeometry = new THREE.BoxGeometry(10, 10, 10)
const material = new THREE.MeshStandardMaterial({ color: 0xFF6447 });
const box = new THREE.Mesh(boxGeometry, material)
box.translateY(-15)
// sceneManager.scene.add(box)

// const grid1 = new VoxelGrid(sceneManager.scene, { x: 5, y: 5, z: 5 }, new THREE.Vector3(-10, 0, 0));
// grid1.addVoxel(0, 0, 0, 0xff0000);
// grid1.addVoxel(1, 0, 0, 0xff0000);
// grid1.addVoxel(2, 0, 0, 0xff0000);
// grid1.addVoxel(3, 0, 0, 0xff0000);
// grid1.addVoxel(4, 0, 0, 0xff0000)

const grid = new GridInstancedMesh(sceneManager.scene, audioVisualizer.dataArray);
// const grid2 = new GridInstancedMesh(sceneManager.scene, audioVisualizer.dataArray);

// const instanceCircle = new GridInstancedMesh(sceneManager.scene, audioVisualizer.dataArray)
// const instancedSemi = new GridInstancedMesh(sceneManager.scene, audioVisualizer.dataArray)
// instancedSemi.instancedMesh.position.x += 40
// instancedSemi.instancedMesh.position.z -= 10
// instancedSemi.instancedMesh.position.y -= 5 
// instancedSemi.instancedMesh.rotation.z += 80
let counter = 0;
// document.addEventListener("keydown", (event) => cameraManager.handleKeyDown(event.code))
// document.addEventListener("keyup", (event) => cameraManager.handleKeyUp(event.code))


const engineStuff = new EngineEmissions(sceneManager.scene)
if (ship.ship) {
	ship.ship.add(engineStuff.instancedMesh)
}
engineStuff.instancedMesh.position.setY(8)

// const sphereGeometry = new THREE.SphereGeometry(162, 32, 32)
// const sphereMaterial = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
// const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial)
// const sphereVertices = sphereGeometry.attributes.position;
// sceneManager.scene.add(sphereMesh)
//
// const sphereCubeGeometry = new THREE.SphereGeometry(5, 5, 5)
// const sphereCubeMaterial = new THREE.MeshBasicMaterial({ color: 0x00FF00 })
//
// for (let i = 0; i < sphereVertices.count; i++) {
// 	if (Math.random() * 10 < 3) {
// 		const planeMesh = new THREE.Mesh(sphereCubeGeometry, sphereCubeMaterial)
// 		const x = sphereVertices.getX(i);
// 		const y = sphereVertices.getY(i);
// 		const z = sphereVertices.getZ(i);
//
// 		planeMesh.position.set(x, y, z);
//
// 		sphereMesh.add(planeMesh)
// 	}
// }
const lilSphere = new SphereInstancedMesh(sceneManager.scene, audioVisualizer.dataArray);
const spaceDust = new SpaceDust(sceneManager.scene, sceneManager.camera);
// const spherePlanet = new SpherePlanet(sceneManager.scene, audioVisualizer.dataArray)
// spherePlanet.circlesMesh.position.set(20, 20, 200)


function animate() {
	spaceStation.update();
	spaceDust.update();
	// spherePlanet.update();
	// cameraManager.handleVelocityKeys();
	// cameraManager.update();

	// instancedSemi.changePositionCube()
	// instancedSemi.changeColors()
	//
	grid.changeColors();
	grid.changePositionCircle(34)
	// grid2.changeColors();
	// grid2.changePositionCircle(13)


	// instanceCircle.changeColors()
	// instanceCircle.changePositionCircle()
	requestAnimationFrame(animate);
	audioVisualizer.update()
	// for (const star of starArray) {
	lilSphere.update();
	if (counter <= 500) {
		// sphereMesh.scale.x += 0.01
		// sphereMesh.scale.y += 0.01
		// sphereMesh.scale.z += 0.01
		// star.position.x += 0.01;
	}
	if (counter > 500) {
		// sphereMesh.scale.x = 1
		// sphereMesh.scale.y = 1
		// sphereMesh.scale.z = 1
		// star.position.x -= 0.01;
	}
	if (counter > 1000) {
		counter = 0;
		// starArray.map((star) => {
		// 	star.material.color.set(randomHexColorCode())
		// })
		// grid1.voxels[0].returnPosition();
	}
	// }

	// grid1.lerpVoxel(grid1.voxels[0].voxel, VectorEnum.Y)
	ship.update()
	engineStuff.update();
	counter++
	// sceneManager.controls.update();
	// controls.update()

	sceneManager.renderer.render(sceneManager.scene, sceneManager.camera);

}
animate();
