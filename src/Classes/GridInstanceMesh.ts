import * as THREE from 'three';
import { BoxGeometry, InstancedMesh, MeshStandardMaterial } from "three";

export class GridInstancedMesh {
	scene: THREE.Scene;
	dataArray: Uint8Array;
	count: number
	dummy: THREE.Object3D;
	geometry: BoxGeometry
	material: MeshStandardMaterial;
	instancedMesh: InstancedMesh

	constructor(scene: THREE.Scene, dataArray: Uint8Array) {
		this.scene = scene;
		this.dataArray = dataArray;
		this.count = 0;
		// this.grid = this.createVoxelFloor(50);
		this.count = 1000; // Number of voxels
		this.geometry = new THREE.BoxGeometry(2, 2, 2);
		// this.material = new THREE.MeshStandardMaterial();
		this.material = new THREE.MeshBasicMaterial();

		this.material.vertexColors = true; // Enable vertex colors
		this.instancedMesh = new THREE.InstancedMesh(this.geometry, this.material, this.count);
		this.dummy = new THREE.Object3D();
		const gridSize = Math.cbrt(this.count); // Determine grid dimensions
		if (!Number.isInteger(gridSize)) {
			console.warn('Count must be a perfect cube to form a proper 3D grid.');
		}
		let index = 0;
		for (let x = 0; x < gridSize; x++) {
			for (let y = 0; y < gridSize; y++) {
				for (let z = 0; z < gridSize; z++) {
					if (index >= this.count) break; // Safety check for non-perfect cube counts
					this.dummy.position.set(
						x * 2,
						y * 2,
						z * 2
					);
					this.instancedMesh.setColorAt(index, new THREE.Color(0xffff00))
					this.dummy.updateMatrix();
					this.instancedMesh.setMatrixAt(index++, this.dummy.matrix);
				}
			}
		}
		this.scene.add(this.instancedMesh)
		// this.instancedMesh.rotateX(90)
	}

	changeColors() {
		this.scene.add(this.instancedMesh);
		const colors = new Float32Array(this.count * 3); // RGB for each instance
		const color = new THREE.Color();

		// cube.material.color.setHSL(scale, 0.5, 0.5); // Change color
		for (let i = 0; i < this.count; i++) {

			const scale = (this.dataArray[i] / 255) * 0.5 + 0.5;
			color.setHSL(scale, 0.5, 0.5)
			this.instancedMesh.setColorAt(i, color)
			colors[i * 3] = color.r
			colors[i * 3 + 1] = color.g
			colors[i * 3 + 2] = color.b
		}
		this.instancedMesh.instanceColor.needsUpdate = true;

		this.instancedMesh.geometry.setAttribute('color', new THREE.InstancedBufferAttribute(colors, 3));
		this.material.vertexColors = true;
	}

	changePositionCircle(passedRadius: number) {
		const time = performance.now() * 0.001; // Time-based animation
		for (let i = 0; i < this.count; i++) {
			// const scale = this.dataArray[i] / 255;
			const scale = (this.dataArray[i] / 255);
			const angle = i * 0.5; // increment angle based on index

			// Create a helical pattern where 'y' height depends on the angle
			const radius = passedRadius + (scale * 2) * 10;
			const x = Math.cos(angle) * radius;
			const y = scale
			const z = Math.sin(angle) * radius;

			this.dummy.position.set(x, y, z);

			this.dummy.rotation.set(
				Math.sin(time + i * 0.1) * Math.PI,
				Math.cos(time + i * 0.1) * Math.PI,
				Math.sin(time + i * 0.1) * Math.PI
			);

					const dynamicScale = 1 + Math.sin(time + i * 0.1) * 0.2;
					this.dummy.scale.set(dynamicScale, dynamicScale, dynamicScale);
			this.dummy.updateMatrix();
			this.instancedMesh.setMatrixAt(i, this.dummy.matrix);
		}
		this.instancedMesh.instanceMatrix.needsUpdate = true;
	}
	//
	changePosition() {
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
	changePositionCube() {
		let index = 0;
		const gridSize = Math.cbrt(this.count);
		const time = performance.now() * 0.001; // Time-based animation
		for (let x = 0; x < gridSize; x++) {
			for (let y = 0; y < gridSize; y++) {
				for (let z = 0; z < gridSize; z++) {
					if (index >= this.count) break; // Safety check for non-perfect cube counts

					// Scale based on dataArray and sine waves for dynamic animation
					const scale = (this.dataArray[index % this.dataArray.length] / 255) * 1.5 - 0.5;
					const sinWave = Math.sin(time + x * 0.1 + y * 0.6 + z * 0.1) * 0.5;


					this.dummy.position.set(
						(scale + x + sinWave) * 4,
						(scale + y + sinWave) * 4,
						(scale + z + sinWave) * 4
					);

					// Rotate cubes dynamically
					this.dummy.rotation.set(
						Math.sin(time + index * 0.1) * Math.PI,
						Math.cos(time + index * 0.1) * Math.PI,
						Math.sin(time + index * 0.1) * Math.PI
					);

					// Scale cubes for extra visual flair
					const dynamicScale = 1 + Math.sin(time + index * 0.1) * 0.5;
					this.dummy.scale.set(dynamicScale, dynamicScale, dynamicScale);

					this.dummy.updateMatrix();
					this.instancedMesh.setMatrixAt(index++, this.dummy.matrix);
				}
			}
		}
		this.instancedMesh.instanceMatrix.needsUpdate = true;
	}

	// changePositionCube() {
	// 	let index = 0;
	// 	const gridSize = Math.cbrt(this.count);
	// 	for (let x = 0; x < gridSize; x++) {
	// 		const scale = (this.dataArray[x] / 255) * 1.5 - 0.5;
	// 		for (let y = 0; y < gridSize; y++) {
	// 			for (let z = 0; z < gridSize; z++) {
	// 				if (index >= this.count) break; // Safety check for non-perfect cube counts
	// 				this.dummy.position.set(
	// 					(scale + x) * 2,
	// 					(scale + y) * 2,
	// 					(scale + z) * 2
	// 				);
	// 				this.dummy.updateMatrix();
	// 				this.instancedMesh.setMatrixAt(index++, this.dummy.matrix);
	// 			}
	// 			this.instancedMesh.instanceMatrix.needsUpdate = true;
	// 		}
	// 	}
	// }
}
