// There are various kinds of lights in Threejs.

// They all extend from the THREE.Light base class, which in turn also extends from the Object3D base class.

// The base class properties

// color
// intensity
// isLight (Read Only)
// Lighting gives you many more options to change the appearance of meshes within the scene.
// Meshes will need materials added to them in order for the lighting adjustments to take effect.

// If a scene has no lighting, most materials won't be visible.
// The MeshBasicMaterial, MeshNormalMaterial and the MeshMatcapMaterial are self illuminating,
// so they don't need lighting to be visible within a scene, but most of the other materials do,
// such as the MeshLambertMaterial, MeshPhongMaterial, MeshStandardMaterial, MeshPhysicalMaterial
// and MeshToonMaterial.

// ----------- Ambient Light -------------

// 1. Lights all objects in the scene equally, except for self illuminating objects such as
// MeshBasicMaterial, MeshNormalMaterial and MeshMatcapMaterial.

// 2. Doesn't cast shadows.

// 3. Light is spread equally in all directions and distances. So positioning the light different from
// the default position of [0, 0, 0] will make no difference.

// 4. Materials won't show shading depending on geometry normals and there will be no specular affect,
// so meshes in front of other meshes will be invisible if they have identical materials or even a single colour map texture.

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";
import { GUI } from "dat.gui";

const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper(Math.PI));

const light = new THREE.AmbientLight(0xffffff, Math.PI);
scene.add(light);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 7;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

new OrbitControls(camera, renderer.domElement);

// const planeGeometry = new THREE.PlaneGeometry(20, 10)//, 360, 180)
// const plane = new THREE.Mesh(planeGeometry, new THREE.MeshPhongMaterial())
// plane.rotateX(-Math.PI / 2)
// //plane.position.y = -1.75
// scene.add(plane)

const torusGeometry = [
  new THREE.TorusGeometry(),
  new THREE.TorusGeometry(),
  new THREE.TorusGeometry(),
  new THREE.TorusGeometry(),
  new THREE.TorusGeometry(),
];

const material = [
  new THREE.MeshBasicMaterial(),
  new THREE.MeshLambertMaterial(),
  new THREE.MeshPhongMaterial(),
  new THREE.MeshPhysicalMaterial({}),
  new THREE.MeshToonMaterial(),
];

const torus = [
  new THREE.Mesh(torusGeometry[0], material[0]),
  new THREE.Mesh(torusGeometry[1], material[1]),
  new THREE.Mesh(torusGeometry[2], material[2]),
  new THREE.Mesh(torusGeometry[3], material[3]),
  new THREE.Mesh(torusGeometry[4], material[4]),
];

const texture = new THREE.TextureLoader().load("img/grid.png");
material[0].map = texture;
material[1].map = texture;
material[2].map = texture;
material[3].map = texture;
material[4].map = texture;

torus[0].position.x = -8;
torus[1].position.x = -4;
torus[2].position.x = 0;
torus[3].position.x = 4;
torus[4].position.x = 8;

scene.add(torus[0]);
scene.add(torus[1]);
scene.add(torus[2]);
scene.add(torus[3]);
scene.add(torus[4]);

window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

const stats = new Stats();
document.body.appendChild(stats.dom);

const data = {
  color: light.color.getHex(),
  mapsEnabled: true,
};

const gui = new GUI();
const lightFolder = gui.addFolder("THREE.Light");
lightFolder.addColor(data, "color").onChange(() => {
  light.color.setHex(Number(data.color.toString().replace("#", "0x")));
});
lightFolder.add(light, "intensity", 0, Math.PI * 2, 0.01);

const ambientLightFolder = gui.addFolder("THREE.AmbientLight");
ambientLightFolder.open();

const meshesFolder = gui.addFolder("Meshes");
meshesFolder.add(data, "mapsEnabled").onChange(() => {
  material.forEach((m) => {
    if (data.mapsEnabled) {
      m.map = texture;
    } else {
      m.map = null;
    }
    m.needsUpdate = true;
  });
});

function animate() {
  requestAnimationFrame(animate);

  torus.forEach((t) => {
    t.rotation.y += 0.01;
  });

  render();

  stats.update();
}

function render() {
  renderer.render(scene, camera);
}

animate();
