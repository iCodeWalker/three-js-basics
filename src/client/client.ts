import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const scene = new THREE.Scene();

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

// instead of calling render() in animate()
// we can use orbit-controls for controlong the re-paint of scene when we move mouse.
const controls = new OrbitControls(camera, renderer.domElement);
controls.addEventListener("change", render);

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
  render(); // This render will re-create the scene on window resize
}

// function animate() {
//   requestAnimationFrame(animate);

//   cube.rotation.x += 0.01;
//   cube.rotation.y += 0.01;

//    render(); // creates scene on every
// }

function render() {
  renderer.render(scene, camera);
}

// animate();
render();

// we can optimize our app so that our scene doesn't get re-created every second.

// 1. we can use orbital-control. add change event Listener to it, that calls render. This controls mouse drag on scene
// 2. we can call render() only one time.
// 3. we can add render() to resize event listener, so our scene gets re-created when window size changes.
