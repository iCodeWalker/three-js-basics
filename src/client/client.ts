// The FBX format is used to provide interoperability between digital content
// creation applications and game engines such as Blender, Maya, Autodesk, Unity, Unreal
// and many others. It supports many features such as 3D models, scene hierarchy, materials,
// lighting, animations, bones and more.

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import Stats from "three/examples/jsm/libs/stats.module";

const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper(5));

const light = new THREE.PointLight(0xffffff, 50);
light.position.set(0.8, 1.4, 1.0);
scene.add(light);

const ambientLight = new THREE.AmbientLight();
scene.add(ambientLight);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0.8, 1.4, 1.0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 1, 0);

// const material = new THREE.MeshNormalMaterial();

const fbxLoader = new FBXLoader();
fbxLoader.load(
  "models/Kachujin G Rosales.fbx",
  (object) => {
    // making our object opaque as it was previously transparent
    object.traverse(function (child) {
      console.log(child.name); // we can use this to change different things like cast shadow etc on objects
      if ((child as THREE.Mesh).isMesh) {
        // we can also remove the material completely
        // (child as THREE.Mesh).material = material;
        if ((child as THREE.Mesh).material) {
          (
            (child as THREE.Mesh).material as THREE.MeshBasicMaterial
          ).transparent = false;
        }
      }
    });
    // scaling the object as in fbx one unit is 1 cm, so our model is 100 times larger as our 1 unit is 1 m
    object.scale.set(0.01, 0.01, 0.01);
    scene.add(object);
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  (error) => {
    console.log(error);
  }
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
