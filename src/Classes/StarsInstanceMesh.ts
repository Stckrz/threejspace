import * as THREE from 'three';
import { BoxGeometry, InstancedMesh, MeshStandardMaterial } from "three";
import { randomHexColorCode } from '../utils/maker';

export class StarInstancedMesh {
	scene: THREE.Scene;
	dataArray: Uint8Array;
	count: number
	dummy: THREE.Object3D;
	geometry: THREE.SphereGeometry
	material: MeshStandardMaterial;
	instancedMesh: InstancedMesh

	constructor(scene: THREE.Scene, dataArray: Uint8Array) {
		this.scene = scene;
		this.dataArray = dataArray;
		this.count = 0;
		// this.grid = this.createVoxelFloor(50);
		this.count = 200; // Number of voxels
		this.geometry = new THREE.SphereGeometry(0.08, 0.08, 0.08);
		this.material = new THREE.MeshBasicMaterial();

		this.material.vertexColors = true; // Enable vertex colors
		this.instancedMesh = new THREE.InstancedMesh(this.geometry, this.material, this.count);
		this.dummy = new THREE.Object3D();
		const gridSize = Math.cbrt(this.count); // Determine grid dimensions
		if (!Number.isInteger(gridSize)) {
			console.warn('Count must be a perfect cube to form a proper 3D grid.');
		}
		let index = 0;
		for (let i = 0; i < this.count; i++) {
			this.dummy.position.x = Math.random() * 100 - 20;
			this.dummy.position.y = Math.random() * 100 - 20;
			this.dummy.position.z = Math.random() * 100 - 20;
			this.instancedMesh.setColorAt(index, new THREE.Color(0xffff00))
			this.dummy.updateMatrix();
			this.instancedMesh.setMatrixAt(index++, this.dummy.matrix);
		}
		this.scene.add(this.instancedMesh)
		this.changeColors()
		// this.instancedMesh.rotateX(90)
	}

	changeColors() {
		this.scene.add(this.instancedMesh);
		const colors = new Float32Array(this.count * 3); // RGB for each instance
		const color = new THREE.Color();

		// cube.material.color.setHSL(scale, 0.5, 0.5); // Change color
		for (let i = 0; i < this.count; i++) {
			const random_r = Math.random()
			const random_g = Math.random()
			const random_b = Math.random()
			color.setHSL(random_r, random_g, random_b)
			this.instancedMesh.setColorAt(i, color)
			colors[i * 3] = random_r
			colors[i * 3 + 1] = random_g
			colors[i * 3 + 2] = random_b
		}
		this.instancedMesh.instanceColor.needsUpdate = true;

		this.instancedMesh.geometry.setAttribute('color', new THREE.InstancedBufferAttribute(colors, 3));
		this.material.vertexColors = true;
	}

	//
	animateStars() {
		const gridSize = Math.cbrt(this.count);
		for (let i = 0; i < this.count; i++) {
			const x = i % (gridSize)
			const y = Math.floor((i / gridSize) % gridSize)
			const z = Math.floor(i / (gridSize * gridSize) * 2);

			const scale = (this.dataArray[i] / 255) * 1.5 - 0.5;

			this.dummy.position.set(
				(x - gridSize / 4) * 2,
				(y - gridSize / 4) * 2 * scale,
				(z - gridSize / 4) * 2
			)
			this.dummy.updateMatrix();
			this.instancedMesh.setMatrixAt(i, this.dummy.matrix);
		}
		this.instancedMesh.instanceMatrix.needsUpdate = true;
	}
}
