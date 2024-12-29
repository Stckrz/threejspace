import * as THREE from 'three';
export class SphereInstancedMesh {
	// sphereGeometry: THREE.SphereGeometry;
	sphereMaterial: THREE.MeshBasicMaterial;
	sphereMesh: THREE.Mesh;
	sphereVertices: THREE.BufferAttribute | THREE.InterleavedBufferAttribute;
	circlesMesh: THREE.InstancedMesh;
	dummyMatrix = THREE.Matrix4;
	scene: THREE.Scene;
	dataArray: Uint8Array;
	constructor(
		scene: THREE.Scene,
		dataArray: Uint8Array,
	) {
		this.scene = scene;
		this.dataArray = dataArray;
		this.create();
	}
	create() {
		const sphereGeometry = new THREE.SphereGeometry(162, 32, 32)
		const sphereMaterial = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
		this.sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial)
		this.scene.add(this.sphereMesh)
		this.sphereVertices = sphereGeometry.attributes.position;

		const sphereCubeGeometry = new THREE.SphereGeometry(5, 5, 5)
		const sphereCubeMaterial = new THREE.MeshBasicMaterial({ color: 0x00FFFF, vertexColors: true })

		const totalInstances = this.sphereVertices.count;
		this.circlesMesh = new THREE.InstancedMesh(sphereCubeGeometry, sphereCubeMaterial, totalInstances);
		this.sphereMesh.add(this.circlesMesh)

		for (let i = 0; i < this.sphereVertices.count; i++) {
			// if (Math.random() * 10 < 2) {
			// this.circlesMesh = new THREE.InstancedMesh(sphereCubeGeometry, sphereCubeMaterial, 100)
			const x = this.sphereVertices.getX(i);
			const y = this.sphereVertices.getY(i);
			const z = this.sphereVertices.getZ(i);
			this.dummyMatrix = new THREE.Matrix4();
			this.dummyMatrix.makeTranslation(x, y, z);
			this.circlesMesh.setMatrixAt(i, this.dummyMatrix);
			this.circlesMesh.instanceMatrix.needsUpdate = true;
		}
	}

	update() {
		this.sphereMesh.rotateY(0.001)
		this.changeColors();
		this.changeScale();
		this.changeRadius();
	}
	changeRadius(){
		let prevScale = 0.5;
		let maxVal = 0
		for(let i = 0; i < this.dataArray.length; i++){
			if(this.dataArray[i] > maxVal){
				maxVal = this.dataArray[i]
			}
		}
		const newScale = THREE.MathUtils.lerp(prevScale, (maxVal/255 + 2), 0.2)

		this.sphereMesh.scale.setScalar(newScale)
		prevScale = newScale
	}

	changeScale() {
		const dummyMatrix = new THREE.Matrix4();
		const dummyPosition = new THREE.Vector3();
		const dummyQuaternion = new THREE.Quaternion();
		const dummyScale = new THREE.Vector3();
		const instanceCount = this.circlesMesh.count;

		for (let i = 0; i < instanceCount; i++) {
			const scale = (this.dataArray[i] / 255) * 0.5 + 0.5;
			this.circlesMesh.getMatrixAt(i, dummyMatrix)
			dummyMatrix.decompose(dummyPosition, dummyQuaternion, dummyScale);
			dummyScale.set(scale * 1.5, scale * 1.5, scale * 1.5)
			dummyMatrix.compose(dummyPosition, dummyQuaternion, dummyScale);
			this.circlesMesh.setMatrixAt(i, dummyMatrix)
		}
		this.circlesMesh.instanceMatrix.needsUpdate = true;
	}
	changeColors() {
		const count = this.sphereVertices.count
		const colors = new Float32Array(count * 3); // RGB for each instance
		const color = new THREE.Color();

		for (let i = 0; i < count; i++) {
			const scale = (this.dataArray[i] / 255) * 0.5 + 0.5;
			color.setHSL(-(scale * 3), 0.5, 0.5)
			colors[i * 3] = color.r
			colors[i * 3 + 1] = color.g
			colors[i * 3 + 2] = color.b
			this.circlesMesh.setColorAt(i, color)
		}
		this.circlesMesh.instanceColor.needsUpdate = true;
		this.circlesMesh.geometry.setAttribute('color', new THREE.InstancedBufferAttribute(colors, 3));
	}
}
