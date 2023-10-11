// Orbit controls allow the camera to orbit around a target.

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
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

const controls = new OrbitControls(camera, renderer.domElement);

// Never changes camera lookat manually, always use target.set,
// if control.update is not in animate loop, than we have to call it manually

// while using this camera will reset to 0,0,0 whenever we change the view using mouse
// camera.lookAt(0.5, 0.5, 0.5)
// controls.target.set(0.5, 0.5, 0.5); // this will not reset the camera to default of 0,0,0
// controls.update() // will call it in animation lop

controls.addEventListener("change", () => console.log("Controls Change"));

// "start" event happens when we click down the mouse button
controls.addEventListener("start", () => console.log("Controls Start Event"));

// "end" event happens when we lift up the mouse button
controls.addEventListener("end", () => console.log("Controls End Event"));

// "rotate" : rotates the object in loop
// controls.autoRotate = true;

// "autoRotateSpeed" : controls the speed of rotation
// controls.autoRotateSpeed = 10;

// "enableDamping" : when we rotate it continues to be in motion for some time.
// gives a good animation behaviour
// controls.enableDamping = true;

// "dampingFactor" : "decides the speed of damping"
// controls.dampingFactor = .01

// Orbital control using key works in older versions
// controls.enableKeys = true //older versions

// use for model controls
controls.listenToKeyEvents(document.body);
controls.keys = {
  LEFT: "ArrowLeft", //left arrow // KeyA
  UP: "ArrowUp", // up arrow // KeyW
  RIGHT: "ArrowRight", // right arrow // KeyD
  BOTTOM: "ArrowDown", // down arrow // KeyS
};
// use for mouse controls
// Dolly = "zooming"
// Pan = "moving object"
controls.mouseButtons = {
  LEFT: THREE.MOUSE.ROTATE,
  MIDDLE: THREE.MOUSE.DOLLY,
  RIGHT: THREE.MOUSE.PAN,
};

// Controls for mobile
controls.touches = {
  ONE: THREE.TOUCH.ROTATE,
  TWO: THREE.TOUCH.DOLLY_PAN,
};
// controls.screenSpacePanning = true
// azimuth is "how much we can rotate the object in horizontal direction in one go"
controls.minAzimuthAngle = -Math.PI / 2; //0;
controls.maxAzimuthAngle = Math.PI / 2;

// Polar is "how much we can rotate the object in vertical direction in one go"
controls.minPolarAngle = 0;
controls.maxPolarAngle = Math.PI;

// controls the zooming distance
controls.maxDistance = 4;
controls.minDistance = 2;

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

  controls.update();

  render();

  stats.update();
}

function render() {
  renderer.render(scene, camera);
}

animate();
