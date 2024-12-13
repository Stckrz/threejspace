import * as THREE from 'three';
import { Vector } from './VoxelGrid';
export class Voxel {
	color: number;
	voxel: THREE.Mesh;
	position: Vector;
	key: Vector;

	constructor(
		color: number,
		position: Vector,
	) {
		this.color = color;
		const geometry = new THREE.BoxGeometry(1, 1, 1);
		const material = new THREE.MeshStandardMaterial({ color });
		this.voxel = new THREE.Mesh(geometry, material);
		this.position = position;
		this.voxel.position.set(this.position.x, this.position.y, this.position.z);
		this.key = { x: this.position.x, y: this.position.y, z: this.position.z }
		// this.getKey(this.position.x, this.position.y, this.position.z)
	}

	returnKey() {
		return this.key;
	}
	returnPosition() {
		this.voxel.position.set(this.key.x, this.key.y, this.key.z)
	}
}
