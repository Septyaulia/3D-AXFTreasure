// index.js
import * as THREE from './Three JS/Three JS/build/three.module.js';
import { OrbitControls } from './Three JS/Three JS/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from './Three JS/Three JS/examples/jsm/loaders/GLTFLoader.js';


const width = window.innerWidth;
const height = window.innerHeight;

const scene = new THREE.Scene();

// Camera orbit
const cameraOrbit = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
cameraOrbit.position = new THREE.Vector3(0, 20, 70);
camera.position.copy(cameraPosition);
cameraOrbit.lookAt(0, 0, 0);

const controlOrbit = new OrbitControls(cameraOrbit, document.body);
controlOrbit.enabledDamping = true;
controlOrbit.dampingFactor = 0.25;
controlOrbit.screenSpacePanning = false;
controlOrbit.maxPolarAngle = Math.PI / 2;

// Scene camera
const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
const cameraPosition = new THREE.Vector3(0, 20, 70);
camera.position.copy(cameraPosition);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
document.body.appendChild(renderer.domElement);

function create(geo, mat) {
    let object = new THREE.Mesh(geo, mat);
    scene.add(object); // Fixed: use scene.add instead of scene
    return object;
}

// Point light
let pointLight = new THREE.PointLight(0xff0000, 2, 200);
pointLight.castShadow = true;
pointLight.position.set(0, 13, 0);
scene.add(pointLight);

// Spotlights
function createSpotlight(position) {
  let spotlight = new THREE.SpotLight(0xffffff, 0.6, 50);
  spotlight.castShadow = true;
  spotlight.position.set(position.x, position.y, position.z);
  scene.add(spotlight);
}

createSpotlight(new THREE.Vector3(13, 2, 13));
createSpotlight(new THREE.Vector3(13, 2, -13));
createSpotlight(new THREE.Vector3(-13, 2, 13));
createSpotlight(new THREE.Vector3(-13, 2, -13));

function createSecondSpotlight(position, target) {
  let spotlight = new THREE.SpotLight(0xff0000);
  spotlight.intensity = 0.8;
  spotlight.castShadow = true;
  spotlight.distance = 50;
  spotlight.position.set(position.x, position.y, position.z);
  let spotlightTarget = new THREE.Object3D();
  spotlightTarget.position.set(target.x, target.y, target.z);
  spotlight.target = spotlightTarget;

  // scene.add(spotlight, spotlightTarget);
}

createSecondSpotlight(new THREE.Vector3(6, 13, 0), new THREE.Vector3(50, 0, 0));
createSecondSpotlight(
  new THREE.Vector3(-6, 13, 0),
  new THREE.Vector3(-50, 0, 0)
);


// createSecondSpotlight(new THREE.Vector3(6, 13, 0), new THREE.Vector3(50, 0, 0));
// createSecondSpotlight(new THREE.Vector3(-6, 13, 0), new THREE.Vector3(-50, 0, 0));

// Ground
let groundTexture = new THREE.TextureLoader().load('asset/texture_ground.jpg');
let groundGeo = new THREE.PlaneGeometry(100, 100);
let groundMat = new THREE.MeshPhongMaterial({
    map: groundTexture,
    side: THREE.DoubleSide
});
let ground = create(groundGeo, groundMat);
ground.position.set(0, 0, 0);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;


// Objects
// // Altar
const altarLoader = new GLTFLoader();
let altar;

altarLoader.load('/assets/altar_for_diana/scene.gltf', (gltf) => {
    altar = gltf.scene;
    altar.castShadow = true;
    altar.receiveShadow = true;
    scene.add(altar);

});


// Text
let textGeo = new THREE.TextGeometry('Don\'t click me!', {
    font: new THREE.FontLoader().load('helvetiker_bold.typeface.json'),
    size: 1,
    height: 0.1,
    curveSegments: 5,
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: 0.1,
    bevelOffset: 0,
    bevelSegments: 4
});
let textMat = new THREE.MeshPhongMaterial({ color: 0xFF0000 });
let text = create(textGeo, textMat);
text.position.set(-10, 18, 0);

// // Treasure
let treasureGeo = new THREE.SphereGeometry(2, 32, 16);
let treasureMat = new THREE.MeshPhongMaterial({ color: 0xffff00 });
let treasure = create(treasureGeo, treasureMat);
treasure.position.set(0, 13, 0);

// Pillars
function createPillar(position) {
    let pillarGeo = new THREE.CylinderGeometry(3, 3, 30, 32);
    
    // You mentioned using a texture, so load it here
    let pillarTexture = new THREE.TextureLoader().load('assets/pillar.jpg');
    let pillarMat = new THREE.MeshPhongMaterial({ map: pillarTexture });

    let pillar = create(pillarGeo, pillarMat);
    pillar.position.set(position.x, position.y, position.z);
    pillar.castShadow = true;
    pillar.receiveShadow = true;

    return pillar;
}

// Create the four pillars
let pillarPositions = [
    new THREE.Vector3(15, 15, 15),
    new THREE.Vector3(-15, 15, 15),
    new THREE.Vector3(15, 15, -15),
    new THREE.Vector3(-15, 15, -15)
];

let pillars = pillarPositions.map(createPillar);
// Skybox
let skyGeo = new THREE.BoxGeometry(100, 100, 100);
let loader = new THREE.TextureLoader();
let skyMat = [
    new THREE.MeshBasicMaterial({ map: loader.load('./assets/skybox/right.png'), side: THREE.BackSide }),
    new THREE.MeshBasicMaterial({ map: loader.load('./assets/skybox/left.png'), side: THREE.BackSide }),
    new THREE.MeshBasicMaterial({ map: loader.load('./assets/skybox/top.png'), side: THREE.BackSide }),
    new THREE.MeshBasicMaterial({ map: loader.load('./assets/skybox/bottom.png'), side: THREE.BackSide }),
    new THREE.MeshBasicMaterial({ map: loader.load('./assets/skybox/front.png'), side: THREE.BackSide }),
    new THREE.MeshBasicMaterial({ map: loader.load('./assets/skybox/back.png'), side: THREE.BackSide }),
];
let skybox = new THREE.Mesh(skyGeo, skyMat);
scene.add(skybox);

// Animation
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();
