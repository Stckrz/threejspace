import * as THREE from 'three';

export class EngineEmissions {
	scene: THREE.Scene;
	count: number
	dummy: THREE.Object3D;
	geometry: THREE.BoxGeometry;
	material: THREE.MeshStandardMaterial;
	instancedMesh: THREE.InstancedMesh;
	timeOffsets: number[];
	positionOffsets: number[];

	constructor(scene: THREE.Scene) {
		this.scene = scene;
		this.count = 10;
		this.geometry = new THREE.SphereGeometry(0.25, 0.25, 0.25);
		this.material = new THREE.MeshStandardMaterial({
			color: 0xff0000,
			emissive: 0xff0000,
			emissiveIntensity: 5.0
		});
		this.timeOffsets = [];
		this.positionOffsets = [];

		// this.material.vertexColors = true; // Enable vertex colors
		this.instancedMesh = new THREE.InstancedMesh(this.geometry, this.material, this.count);
		this.dummy = new THREE.Object3D();

		let index = 0;
		for (let i = 0; i < this.count; i++) {
			this.timeOffsets.push(Math.random() * 2 * Math.PI);
			this.positionOffsets.push(Math.random() * 0.2);
			this.dummy.position.set(
				0, 0, 0
			);
			this.dummy.updateMatrix();
			this.instancedMesh.setMatrixAt(index++, this.dummy.matrix);
		}
		// this.scene.add(this.instancedMesh)
	}
	setColor() {

	}
	update() {
		for (let i = 0; i < this.count; i++) {
			let time = (performance.now() / 1000) + this.timeOffsets[i]; // Time with offset
            const maxHeight = 0.5; // Height at which the cube resets
			const yPosition = (time / 2) % maxHeight;
			const newPosition = new THREE.Vector3(
				this.positionOffsets[i],
				yPosition,
				this.positionOffsets[i]
			);
			this.dummy.rotateX(Math.random() * 0.005)
			this.dummy.rotateY(Math.random() * 0.001)
			this.dummy.position.copy(newPosition);
			this.dummy.scale.set(yPosition + 0.2, yPosition + 0.2, yPosition + 0.2)
			this.dummy.updateMatrix();

			// Update the instance matrix
			this.instancedMesh.setMatrixAt(i, this.dummy.matrix);
			if(yPosition >= maxHeight){
				this.dummy.scale.set(0, 0, 0)
				this.dummy.position.setY(0)
			}

		}
		this.instancedMesh.instanceMatrix.needsUpdate = true;

	}
}
