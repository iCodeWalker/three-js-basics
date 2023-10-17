// MTL is the material information used by an OBJ file.
// we can set the colours, specular, emissive, alpha, smoothness, image maps, and there coordinates.

// Since it is a MeshPhongMaterial by default, we can only set properties affecting the meshPhongMaterial.

// we you create OBJ and MTL using Blender, then you can change
// Base Color
// Specular
// Emission
// Alpha
// Smooth/Flat Shaded

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
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

const mtlLoader = new MTLLoader();
mtlLoader.load(
  "models/monkey.mtl", // path to the model
  (materials) => {
    materials.preload();
    console.log(materials);
    const objLoader = new OBJLoader();
    objLoader.setMaterials(materials); // to tell the obj loader to assgin material to the object.
    objLoader.load(
      "models/monkey.obj",
      (object) => {
        scene.add(object);
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      (error) => {
        console.log("An error happened");
      }
    );
  }, // success callback runs when the file is fully downloaded.
  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  }, // Progress callback
  (error) => {
    console.log("An error happened");
  } // error callback
);

mtlLoader.load(
  "models/monkeyTextured.mtl", // path to the model
  (materials) => {
    materials.preload();
    console.log(materials);
    const objLoader = new OBJLoader();
    objLoader.setMaterials(materials); // to tell the obj loader to assgin material to the object.
    objLoader.load(
      "models/monkeyTextured.obj",
      (object) => {
        scene.add(object);
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      (error) => {
        console.log("An error happened");
      }
    );
  }, // success callback runs when the file is fully downloaded.
  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  }, // Progress callback
  (error) => {
    console.log("An error happened");
  } // error callback
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
