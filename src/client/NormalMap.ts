import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";
import { GUI } from "dat.gui";

const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper(5));

const light = new THREE.PointLight(0xffffff, 200);
light.position.set(0, 2, 5);
scene.add(light);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 1;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const planeGeometry = new THREE.PlaneGeometry(3.6, 1.8);

const material = new THREE.MeshPhongMaterial();

const texture = new THREE.TextureLoader().load("img/worldColour.5400x2700.jpg");
material.map = texture;

// Even more impressive than the bumpmap is the normalMap.

// The normalMap uses the rgb values of the image to affect the the lighting.

// gives us more control of texture for bumps.

// It also simulates perceived depth in relation to the lights but uses a different algorithm
// to indicate how much to alter the lighting in the up/down and left/right directions.

// Use the normalScale property to alter the perceived depth.
// The normalScale requires a THREE.Vector2. Typically the x,y values of the normalScale would
// be between 0 and 1.0.

// Does not have any affect on geometry, it only changes the lightening.

const normalTexture = new THREE.TextureLoader().load(
  "img/earth_normalmap_8192x4096.jpg"
);
material.normalMap = normalTexture;
material.normalScale.set(2, 2);

const plane = new THREE.Mesh(planeGeometry, material);
scene.add(plane);

window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

const stats = new Stats();
document.body.appendChild(stats.dom);

const gui = new GUI();
gui.add(material.normalScale, "x", 0, 10, 0.01);
gui.add(material.normalScale, "y", 0, 10, 0.01);
gui.add(light.position, "x", -20, 20).name("Light Pos X");

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
