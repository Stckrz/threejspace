import * as THREE from 'three';

export class VoxelGrid {
	size: { x: number, y: number, z: number };
	position: THREE.Vector3;
	voxels: Map<string, THREE.Mesh>;
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
		this.voxels = new Map();;
		this.gridGroup = new THREE.Group;
		this.gridGroup.position.copy(this.position);
		this.scene.add(this.gridGroup);
	}
	private getKey(x: number, y: number, z: number): string {
		return `${x},${y},${z}`
	}
	addVoxel(x: number, y: number, z: number, color: number): void {
		if (x < 0 || x >= this.size.x || y < 0 || y >= this.size.y || z < 0 || z >= this.size.z) {
			console.warn(`Voxel position (${x}, ${y}, ${z}) is out of bounds.`);
			return;
		}

		const key = this.getKey(x, y, z);
		if (this.voxels.has(key)) {
			console.warn(`Voxel already exists at (${x}, ${y}, ${z}).`);
			return;
		}

		const geometry = new THREE.BoxGeometry(1, 1, 1);
		const material = new THREE.MeshStandardMaterial({ color });
		const voxel = new THREE.Mesh(geometry, material);
		voxel.position.set(x, y, z);
		this.voxels.set(key, voxel);
		this.gridGroup.add(voxel);
	}

	removeVoxel(x: number, y: number, z: number): void {
		const key = this.getKey(x, y, z);
		const voxel = this.voxels.get(key);
		if (voxel) {
			this.gridGroup.remove(voxel);
			this.voxels.delete(key);
		} else {
			console.warn(`No voxel found at (${x}, ${y}, ${z}).`);
		}
	}
	updateVoxelColor(x: number, y: number, z: number, color: number): void{
		const material = new THREE.MeshStandardMaterial({ color });
		const key = this.getKey(x, y, z)
		const voxel = this.voxels.get(key)
		if(voxel){
			voxel.material = material

		}
	}
	lerpVoxel(x:number, y: number, z: number): void{
		const key = this.getKey(x, y, z)
		const voxel = this.voxels.get(key)
		if(voxel){
			voxel.position.x = THREE.MathUtils.lerp(voxel.position.x, voxel.position.x + 1, 0.05)

		}

	}

	clearGrid(): void {
		this.voxels.forEach((voxel) => this.gridGroup.remove(voxel));
		this.voxels.clear();
	}

	update(): void {
		// Optional: Update logic for the grid if needed (e.g., animations)
	}
}
