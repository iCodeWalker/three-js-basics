// The DRACO loader is used to load geometry compressed with the Draco library.

// Draco is an open source library for compressing and decompressing 3D meshes and point clouds.

// glTF files can also be compressed using the DRACO library, and they can also be loaded
// using the glTF loader. We can configure the glTF loader to use the DRACOLoader to
// decompress the file in such cases.

// Caveat, compressing a file doesn't necessarily mean that the file will
// be presented in the scene faster. While compressed geometry can result in a
// significantly smaller file size, the client browsers CPU will use more time decoding the file,
// and also need to download additional libraries into a web worker to run the decompression process.

// All files and applications are different, you will need to test using compression
// or not if you want to know if compression will benefit your application or not.

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
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
//renderer.physicallyCorrectLights = true //deprecated
renderer.useLegacyLights = false; //use this instead of setting physicallyCorrectLights=true property
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Note that since Three release 148, you will find the Draco libraries in the `.\node_modules\three\examples\jsm\libs\draco\` folder.
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/js/libs/draco/");
// we have to set decoder path otherwise it will not work

const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);
loader.load(
  "models/monkey_compressed.glb",
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
        l.shadow.bias = -0.003;
        l.shadow.mapSize.width = 2048;
        l.shadow.mapSize.height = 2048;
      }
    });
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
