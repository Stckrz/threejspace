import * as THREE from 'three';
export class SpaceDust {
	scene: THREE.Scene;
	instancedMesh: THREE.InstancedMesh;
	camera: THREE.Camera;
	dummyMatrix: THREE.Object3D;
	positions: THREE.Vector3[] = []; // track each dust particle's position
	totalDust: number
	constructor(
		scene: THREE.Scene,
		camera: THREE.Camera,
	) {
		this.scene = scene;
		this.camera = camera;
		this.dummyMatrix = new THREE.Object3D();
		this.totalDust = 50;
		this.create()
	}
	create() {
		// const sphereCubeGeometry = new THREE.SphereGeometry(0.1, 8, 8)
		const sphereCubeGeometry = new THREE.SphereGeometry(0.12, 8, 8)
		const sphereCubeMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, })
		const maxRadius = 100000;
		this.instancedMesh = new THREE.InstancedMesh(sphereCubeGeometry, sphereCubeMaterial, this.totalDust);
		for (let i = 0; i < 100; i++) {
			const position = this.randomSpherePoint(maxRadius);
			this.positions.push(position);
			this.dummyMatrix.position.copy(position);
			this.dummyMatrix.updateMatrix()
			this.instancedMesh.setMatrixAt(i, this.dummyMatrix.matrix)
		}
		this.instancedMesh.instanceMatrix.needsUpdate = true;
		this.scene.add(this.instancedMesh)
	}
	update() {
		const maxDistance = 150;  // if dust is farther than this, we relocate it

		const dummy = new THREE.Object3D();
		for (let i = 0; i < this.totalDust; i++) {
			const pos = this.positions[i];

			// Distance from camera
			const distance = pos.distanceTo(this.camera.position);
			if (i > 75) {
				pos.x += 0.01;
			} else if (i > 50) {
				pos.y += 0.01;
			} else {
				pos.z += 0.01;
			}
			// pos.y += (Math.random() - 0.5) * 0.01;
			// pos.z += (Math.random() - 0.5) * 0.01;
			if (distance > maxDistance) {
				// Re-randomize somewhere in front of the camera
				const forwardDirection = new THREE.Vector3(0, 0, -1);
				forwardDirection.applyQuaternion(this.camera.quaternion);
				// Move it "far" in front + some random offset
				pos.copy(this.camera.position)
					.addScaledVector(forwardDirection, 50 + Math.random() * 50);

				// Optionally add some sideways randomness
				pos.x += (Math.random() - 0.5) * 100;
				pos.y += (Math.random() - 0.5) * 100;
				pos.z += (Math.random() - 0.5) * 100;
			}

			dummy.position.copy(pos);
			dummy.updateMatrix();
			this.instancedMesh.setMatrixAt(i, dummy.matrix);
		}
		// Mark the whole instanceMatrix as updated once
		this.instancedMesh.instanceMatrix.needsUpdate = true;
	}
	private randomSpherePoint(radius: number) {
		// Uniform random distribution in a sphere
		const u = Math.random();
		const v = Math.random();
		const theta = 2 * Math.PI * u;
		const phi = Math.acos(2 * v - 1);
		const r = radius * Math.cbrt(Math.random());

		const sinPhi = Math.sin(phi);

		const x = r * sinPhi * Math.cos(theta);
		const y = r * sinPhi * Math.sin(theta);
		const z = r * Math.cos(phi);

		return new THREE.Vector3(
			this.camera.position.x + x,
			this.camera.position.y + y,
			this.camera.position.z + z
		);
	}
}

