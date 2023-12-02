// // This is a basic example of using the Raycaster to mouse pick objects in the scene.

// // The scene is traversed and all individual objects are added to the pickableObjects array
// // that is used by the Raycaster. The sphere and plane are deliberately excluded from this so
// // they will not be mouse picked.

// // The plane also receives shadows while everything else only casts shadows.

// import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// import Stats from "three/examples/jsm/libs/stats.module";

// const scene = new THREE.Scene();
// scene.add(new THREE.AxesHelper(5));

// const light = new THREE.SpotLight(0xffffff, 1000);
// light.position.set(12.5, 12.5, 12.5);
// light.castShadow = true;
// light.shadow.mapSize.width = 1024;
// light.shadow.mapSize.height = 1024;
// scene.add(light);

// const camera = new THREE.PerspectiveCamera(
//   75,
//   window.innerWidth / window.innerHeight,
//   0.1,
//   1000
// );
// camera.position.set(15, 15, 15);

// const renderer = new THREE.WebGLRenderer();
// renderer.shadowMap.enabled = true;
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;

// const pickableObjects: THREE.Mesh[] = [];
// let intersectedObject: THREE.Object3D | null;
// const originalMaterials: { [id: string]: THREE.Material | THREE.Material[] } =
//   {};
// const highlightedMaterial = new THREE.MeshBasicMaterial({
//   wireframe: true,
//   color: 0x00ff00,
// });

// const loader = new GLTFLoader();
// loader.load(
//   "models/simplescene.glb",
//   function (gltf) {
//     gltf.scene.traverse(function (child) {
//       if ((child as THREE.Mesh).isMesh) {
//         const m = child as THREE.Mesh;
//         //the sphere and plane will not be mouse picked. THe plane will receive shadows while everything else casts shadows.
//         switch (m.name) {
//           case "Plane":
//             m.receiveShadow = true;
//             break;
//           case "Sphere":
//             m.castShadow = true;
//             break;
//           default:
//             m.castShadow = true;
//             pickableObjects.push(m);
//             //store reference to original materials for later
//             originalMaterials[m.name] = (m as THREE.Mesh).material;
//         }
//       }
//     });
//     scene.add(gltf.scene);
//   },
//   (xhr) => {
//     console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
//   },
//   (error) => {
//     console.log(error);
//   }
// );

// window.addEventListener("resize", onWindowResize, false);
// function onWindowResize() {
//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix();
//   renderer.setSize(window.innerWidth, window.innerHeight);
//   render();
// }

// const raycaster = new THREE.Raycaster();
// let intersects: THREE.Intersection[];

// const mouse = new THREE.Vector2();

// function onDocumentMouseMove(event: MouseEvent) {
//   mouse.set(
//     (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
//     -(event.clientY / renderer.domElement.clientHeight) * 2 + 1
//   );
//   raycaster.setFromCamera(mouse, camera);
//   intersects = raycaster.intersectObjects(pickableObjects, false);

//   if (intersects.length > 0) {
//     intersectedObject = intersects[0].object;
//   } else {
//     intersectedObject = null;
//   }
//   pickableObjects.forEach((o: THREE.Mesh, i) => {
//     if (intersectedObject && intersectedObject.name === o.name) {
//       pickableObjects[i].material = highlightedMaterial;
//     } else {
//       pickableObjects[i].material = originalMaterials[o.name];
//     }
//   });
// }
// document.addEventListener("mousemove", onDocumentMouseMove, false);

// const stats = new Stats();
// document.body.appendChild(stats.dom);

// function animate() {
//   requestAnimationFrame(animate);

//   controls.update();

//   render();

//   stats.update();
// }

// function render() {
//   renderer.render(scene, camera);
// }

// animate();

// While raycasting is almost always used for mouse picking objects in the 3D scene,
// it can also be used for simple collision detection.

// In this example, we detect whether the orbit controls will penetrate another object
// and adjust the cameras position so that it stays outside.

// Essentially, we are creating a ray from the camera target to the camera position.
// If there is an intersected object between, then the camera position is adjusted to the intersect point.
// This prevents the camera from going behind a wall, or inside a box, or floor, or
// any object which is part of the objects array being tested for an intersect.

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";

const scene = new THREE.Scene();

const light1 = new THREE.PointLight(0xffffff, 1000);
light1.position.set(10, 10, 10);
scene.add(light1);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 2;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const raycaster = new THREE.Raycaster();
const sceneMeshes: THREE.Mesh[] = [];
const dir = new THREE.Vector3();
let intersects: THREE.Intersection[] = [];

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.addEventListener("change", function () {
  xLine.position.copy(controls.target);
  yLine.position.copy(controls.target);
  zLine.position.copy(controls.target);

  raycaster.set(
    controls.target,
    dir.subVectors(camera.position, controls.target).normalize()
  );

  intersects = raycaster.intersectObjects(sceneMeshes, false);
  if (intersects.length > 0) {
    if (intersects[0].distance < controls.target.distanceTo(camera.position)) {
      camera.position.copy(intersects[0].point);
    }
  }
});

const material = new THREE.MeshLambertMaterial();

const envTexture = new THREE.CubeTextureLoader().load([
  "img/px_50.png",
  "img/nx_50.png",
  "img/py_50.png",
  "img/ny_50.png",
  "img/pz_50.png",
  "img/nz_50.png",
]);
envTexture.mapping = THREE.CubeReflectionMapping;
envTexture.mapping = THREE.CubeRefractionMapping;
material.envMap = envTexture;

const floor = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), material);
floor.rotateX(-Math.PI / 2);
floor.position.y = -3;
scene.add(floor);
sceneMeshes.push(floor);

const wall1 = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 6),
  new THREE.MeshNormalMaterial({ side: THREE.DoubleSide })
);
wall1.position.x = 5;
wall1.rotateY(-Math.PI / 2);
scene.add(wall1);
sceneMeshes.push(wall1);

const wall2 = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 6),
  new THREE.MeshNormalMaterial({ side: THREE.DoubleSide })
);
wall2.position.z = -5;
scene.add(wall2);
sceneMeshes.push(wall2);

const cube: THREE.Mesh = new THREE.Mesh(
  new THREE.BoxGeometry(),
  new THREE.MeshNormalMaterial()
);
cube.position.set(-3, 0, 0);
scene.add(cube);
sceneMeshes.push(cube);

const ceiling = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshNormalMaterial({ side: THREE.DoubleSide })
);
ceiling.rotateX(Math.PI / 2);
ceiling.position.y = 3;
scene.add(ceiling);
sceneMeshes.push(ceiling);

//crosshair
const lineMaterial = new THREE.LineBasicMaterial({
  color: 0x0000ff,
});
const points: THREE.Vector3[] = [];
points[0] = new THREE.Vector3(-0.1, 0, 0);
points[1] = new THREE.Vector3(0.1, 0, 0);
let lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
const xLine = new THREE.Line(lineGeometry, lineMaterial);
scene.add(xLine);
points[0] = new THREE.Vector3(0, -0.1, 0);
points[1] = new THREE.Vector3(0, 0.1, 0);
lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
const yLine = new THREE.Line(lineGeometry, lineMaterial);
scene.add(yLine);
points[0] = new THREE.Vector3(0, 0, -0.1);
points[1] = new THREE.Vector3(0, 0, 0.1);
lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
const zLine = new THREE.Line(lineGeometry, lineMaterial);
scene.add(zLine);

window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

const stats = new Stats();
document.body.appendChild(stats.dom);

function animate() {
  requestAnimationFrame(animate);

  controls.update();

  render();

  stats.update();
}

function render() {
  renderer.render(scene, camera);
}

animate();
