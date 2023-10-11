// TrackballControls is similar to the OrbitControls. However, it does not maintain a constant
// camera up vector. That means that the camera can orbit past its polar extremes.
// It won't flip to stay the right side up

import * as THREE from "three";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";
import Stats from "three/examples/jsm/libs/stats.module";

const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper(5));

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

// when we click and rotate the mouse the up axis also gets changed

const controls = new TrackballControls(camera, renderer.domElement);
controls.addEventListener("change", () => console.log("Controls Change"));
// "start" event happens when we click down the mouse button
controls.addEventListener("start", () => console.log("Controls Start Event"));

// "end" event happens when we lift up the mouse button
controls.addEventListener("end", () => console.log("Controls End Event"));

// disables the controller
// controls.enabled = false;

// controls the rotate speed.
controls.rotateSpeed = 1.0;

// controls the zooming speed
controls.zoomSpeed = 1.2;

// controls the speed of moving of 3d object, when we right click mouse button and move it.
controls.panSpeed = 0.8;

// key controls
// controls.keys = ['KeyA', 'KeyS', 'KeyD']

// To control moving of 3d object
// controls.noPan = true //default false

// To control rotating of 3d object
// controls.noRotate = true //default false

// To control zooming of 3d object
// controls.noZoom = true //default false

// when we rotate it continues to be in motion for some time.
// controls.staticMoving = true //default false

// decides the speed of damping or slowing down of rotation
// controls.dynamicDampingFactor = 0.1

// Controls maximum and minimum zoom of 3d object
// controls.maxDistance = 4
// controls.minDistance = 2

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  wireframe: true,
});

const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

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

  // trackball controls needs to be updated in the animation loop before it will work
  controls.update();

  render();

  stats.update();
}

function render() {
  renderer.render(scene, camera);
}

animate();
