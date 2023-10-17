// A loader for loading glTF models into the Threejs scene.

// glTF is a specification for the efficient transmission and loading of 3D scenes and models.

// glTF minimizes both the size of 3D assets, and the runtime processing needed to unpack
// and use those assets.

// A glTF file may contain one or more scenes, meshes, materials, textures, skins, skeletons, morph targets, animations, lights and cameras.

// Assets can be provided in either JSON (.gltf) or binary (.glb) format.

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import Stats from "three/examples/jsm/libs/stats.module";

const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper(5));

// We don't need light if we are using 'renderer.useLegacyLights '

// const light = new THREE.SpotLight();
// light.position.set(5, 5, 5);
// scene.add(light);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 2;

const renderer = new THREE.WebGLRenderer();
renderer.useLegacyLights = false; // can use this light as this light is included in gltf scene.

// Since Three r150, and Blender 3.6, lighting has changed significantly.
//
// renderer.physicallyCorrectLights = true // is now deprecated since Three r150. Use renderer.useLegacyLights = false instead.
//
// If exporting lights from Blender, they are very bright.
// lights exported from blender are 10000 times brighter when used in Threejs
// so, you can counter this by setting renderer.useLegacyLights = false
// renderer.useLegacyLights = false // WebGLRenderer.physicallyCorrectLights = true is now WebGLRenderer.useLegacyLights = false
// however, they are now still 100 times brighter in Threejs than in Blender,
// so to try and match the threejs scene shown in video, reduce Spotlight watts in Blender to 10w.
// The scene in blender will be lit very dull.
// Blender and Threejs use different renderers, they will never match. Just try your best.
//
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const loader = new GLTFLoader();
loader.load(
  "models/monkey.glb",
  function (gltf) {
    gltf.scene.traverse(function (child) {
      if ((child as THREE.Mesh).isMesh) {
        const m = child as THREE.Mesh;
        m.receiveShadow = true;
        m.castShadow = true;
      }
      if ((child as THREE.Light).isLight) {
        const l = child as THREE.SpotLight;
        l.castShadow = true;
        //  when an object cast and receives a shadow it have some it has some interference on the
        // model. we can minimize it using shadow.bias
        // But if offsets the slightly
        l.shadow.bias = -0.003;
        l.shadow.mapSize.width = 2048;
        l.shadow.mapSize.height = 2048;
      }
    });
    console.log(gltf.scene);
    scene.add(gltf.scene);
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
