import * as THREE from 'three';
export function addStar() {
	const geometry = new THREE.SphereGeometry(0.12, 12, 12);
	const material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
	const star = new THREE.Mesh(geometry, material);
	const [x, y, z] = Array.from({ length: 3 }, () => THREE.MathUtils.randFloatSpread(200));
	star.position.set(x, y, z);
	return star

}

export function addSun(scene, loader) {

	const suntexture = loader.load('sun.jpg')
	const stargeometry = new THREE.SphereGeometry(50, 20, 20);
	const starmaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, map: suntexture });
	const bigstar = new THREE.Mesh(stargeometry, starmaterial)
	const bigStarPointLight = new THREE.PointLight(0xffffff, 200, 0)
	bigstar.add(bigStarPointLight)
	scene.add(bigstar)
	bigstar.position.set(150, 150, 0)
	return bigstar

}

export const randomHexColorCode = () => {
  let n = (Math.random() * 0xfffff * 1000000).toString(16);
  return '#' + n.slice(0, 6);
};
