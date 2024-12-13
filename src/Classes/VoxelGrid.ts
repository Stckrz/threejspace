import * as THREE from 'three';
import { Voxel } from './Voxel';
export enum VectorEnum {
	X,
	Y,
	Z
}
export interface Vector{
	x: number,
	y: number,
	z: number
}
export class VoxelGrid {
	size: { x: number, y: number, z: number };
	position: THREE.Vector3;
	voxels: Voxel[];
	gridGroup: THREE.Group;
	scene: THREE.Scene;
	constructor(
		scene: THREE.Scene,
		size: { x: number, y: number, z: number },
		position: THREE.Vector3,
	) {
		this.scene = scene;
		this.size = size;
		this.position = position;
		this.voxels = [];
		this.gridGroup = new THREE.Group;
		this.gridGroup.position.copy(this.position);
		this.scene.add(this.gridGroup);
	}

	// addVoxel(x: number, y: number, z: number, color: number): THREE.Mesh<THREE.BoxGeometry, THREE.MeshStandardMaterial, THREE.Object3DEventMap> | null {
	addVoxel(x: number, y: number, z: number, color: number) {
		if (x < 0 || x >= this.size.x || y < 0 || y >= this.size.y || z < 0 || z >= this.size.z) {
			console.warn(`Voxel position (${x}, ${y}, ${z}) is out of bounds.`);
			return;
		}

		// const key = this.getKey(x, y, z);
		// if (this.voxels.has(key)) {
		// 	console.warn(`Voxel already exists at (${x}, ${y}, ${z}).`);
		// 	return;
		// }
		const voxel = new Voxel( color, {x, y, z})
		this.voxels.push(voxel)
		// voxel.position.set(x, y, z);
		// this.voxels.set(key, voxel);
		this.gridGroup.add(voxel.voxel);
		return this;
	}

	// removeVoxel(x: number, y: number, z: number): void {
	// 	const key = this.getKey(x, y, z);
	// 	const voxel = this.voxels.get(key);
	// 	if (voxel) {
	// 		this.gridGroup.remove(voxel);
	// 		this.voxels.delete(key);
	// 	} else {
	// 		console.warn(`No voxel found at (${x}, ${y}, ${z}).`);
	// 	}
	// }
	// updateVoxelColor(x: number, y: number, z: number, color: number): void {
	// 	const material = new THREE.MeshStandardMaterial({ color });
	// 	const key = this.getKey(x, y, z)
	// 	const voxel = this.voxels.get(key)
	// 	if (voxel) {
	// 		voxel.material = material
	// 	}else{
	// 		console.log("voxelNotFound")
	// 	}
	// }
	lerpVoxel(voxel: Voxel, direction: VectorEnum): void {
		// const key = this.getKey(x, y, z)
		// const voxel = this.voxels.get(key)
		if (voxel) {
			switch (direction) {
				case VectorEnum.X:
					voxel.position.x = THREE.MathUtils.lerp(voxel.position.x, voxel.position.x + 1, 0.05)
					break
				case VectorEnum.Y:
					voxel.position.y = THREE.MathUtils.lerp(voxel.position.y, voxel.position.y + 1, 0.05)
					break
				case VectorEnum.Z:
					voxel.position.z = THREE.MathUtils.lerp(voxel.position.z, voxel.position.z + 1, 0.05)
					break
			}
		} else{console.log("voxelNotFound")}
	}

	clearGrid(): void {
		// this.voxels.map((voxel) => this.gridGroup.remove(voxel));
		this.voxels = [];
		// this.voxels.clear();
	}

	update(): void {
		// Optional: Update logic for the grid if needed (e.g., animations)
	}
}
