import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/Addons.js';
interface directionObject {
	forward: boolean,
	back: boolean,
	left: boolean,
	right: boolean,
	up: boolean,
	down: boolean,
}
export class CameraManager {
	camera: THREE.Camera;
	controller: PointerLockControls;
	velocity: THREE.Vector3;
	direction: THREE.Vector3;
	acceleration: number;
	deceleration: number;
	speed: number;
	maxSpeed: number;
	keys: directionObject
	constructor(
		camera: THREE.Camera,

	) {
		this.camera = camera;
		this.controller = new PointerLockControls(this.camera, document.body);
		this.velocity = new THREE.Vector3(0, 0, 0);
		this.direction = new THREE.Vector3(0, 0, 0);
		this.acceleration = 0.1;
		this.speed = 0.1
		this.deceleration = 0.95;
		this.maxSpeed = 1;
		this.keys = {
			forward: false,
			back: false,
			left: false,
			right: false,
			up: false,
			down: false,
		}

		document.addEventListener("click", () => {
			this.controller.lock();
		});
	}
	update() {
		this.direction.z = (Number(this.keys.forward) - Number(this.keys.back));
		this.direction.x = Number(this.keys.right) - Number(this.keys.left);
		this.direction.normalize(); // this ensures consistent movements in all directions

		if (this.keys.forward || this.keys.back) {
			this.velocity.z += this.direction.z * this.speed
			if (this.speed < this.maxSpeed) {
				this.speed += 0.02
			}
		}
		if (this.keys.left || this.keys.right) {
			this.velocity.x += this.direction.x * this.speed
			if (this.speed < this.maxSpeed) {
				this.speed += 0.02
			}
		}
		if (!this.keys.left && !this.keys.right && !this.keys.forward && !this.keys.back) {
			this.speed = 0;

		}
		this.controller.moveRight(this.velocity.x);
		this.controller.moveForward(this.velocity.z);
		this.velocity.x = 0
		this.velocity.y = 0
		this.velocity.z = 0
	}
	handleKeyDown(key) {
		console.log(key)
		switch (key) {
			case "KeyW":
				this.keys.forward = true;
				break;
			case "KeyS":
				this.keys.back = true;
				break;
			case "KeyA":
				this.keys.left = true;
				break;
			case "KeyD":
				this.keys.right = true;
				break;
		}
	}
	handleKeyUp(key) {
		console.log(key)
		switch (key) {
			case "KeyW":
				this.keys.forward = false;
				break;
			case "KeyS":
				this.keys.back = false;
				break;
			case "KeyA":
				this.keys.left = false;
				break;
			case "KeyD":
				this.keys.right = false;
				break;
		}
	}
}
