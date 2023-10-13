// Used for loading 3d models saved in the Wavefront OBJ format.

// There are many DCC (Digital Content Creation) tools that can create models in OBJ format.

// In Threejs, when importing an OBJ, the default material will be a white MeshPhongMaterial
// so you will need at least one light in your scene.

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import Stats from "three/examples/jsm/libs/stats.module";

const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper(5));

const light = new THREE.PointLight(0xffffff, 1000);
light.position.set(2.5, 7.5, 15);
scene.add(light);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 3;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// by default Obj loader takes MeshPhongMaterial, but we can override it.
const material = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  wireframe: true,
});

const material2 = new THREE.MeshNormalMaterial();

const objLoader = new OBJLoader();
objLoader.load(
  //"models/cube.obj", // path of the model
  "models/monkey.obj",
  (object) => {
    console.log(object);
    //(object.children[0] as THREE.Mesh).material = material; // setting our created material on model

    // this will loop through the object. object.traverse is used for looping
    object.traverse(function (child) {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).material = material2;
      }
    });
    scene.add(object);
  }, // function runs after the object is loaded
  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  }, // if we load a large file from internet this will run to show the progress
  (error) => {
    console.log(error);
  } // in case of error
);

objLoader.load(
  //"models/cube.obj", // path of the model
  "models/cube.obj",
  (object) => {
    object.position.x = -2; // changes the position of the model
    scene.add(object);
  }, // function runs after the object is loaded
  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  }, // if we load a large file from internet this will run to show the progress
  (error) => {
    console.log(error);
  } // in case of error
);

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
