//per cambiare la rotazione di ogni pianeta aggiungiamo un obj centrale
//per fare in modo che il pianeta figlio segua la rotazione dell'obj centrale

//import './style.css'

import * as THREE from 'three'
import MouseMeshInteraction from './three_mmi.js'

import {OrbitControls} from 'three/addons/controls/OrbitControls';
import { TWEEN } from 'https://unpkg.com/three@0.139.0/examples/jsm/libs/tween.module.min.js';
 
var selectedPiece = false;
var title;
var subtitle;
var description;

title = document.querySelector(".title");
subtitle = document.querySelector(".subtitle");
description = document.querySelector(".description");
// title.innerHTML = '<span style="color: red;">Suca </span>'; //  metodo per cambiare il testo dell html

const scene = new THREE.Scene();  //container, per guardare qualcosa al suo interno necessitiamo di "camera"

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//perspective camera simulates the human eye camera, first argument is field of view, second aspect ratio (user browser window)

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
})

renderer.setPixelRatio(window.devicePixelRatio); //settiamo la pixel ratio
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(100);   //posizione di start della camera 140 ottimo

//makin it responsive
function onWindowResize() {
  // Update camera aspect ratio
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  // Update renderer size
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize, false);
onWindowResize();

//mouse mover
const controls = new OrbitControls(camera, renderer.domElement);
controls.minDistance = 40;
controls.maxDistance = 230;

// immagine di bg
const spaceTexture = new THREE.TextureLoader().load('./src/space.jpg');
scene.background = spaceTexture


renderer.render(scene, camera);

//inizio sole (commit crea un sole utilizzando shaders)
const sunTexture = new THREE.TextureLoader().load('/src/texture_plans/sun.jpg');
const sunNormalText = new THREE.TextureLoader().load('/src/texture_plans/sun_normal.jpg');

const sun = new THREE.Mesh(
  new THREE.SphereGeometry(25, 32, 32),
  new THREE.MeshStandardMaterial({
    map: sunTexture,
    normalMap: sunNormalText,
  })
);

scene.add(sun);
sun.name= 'sole';
//fine sole

//Luci
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);
//fine luci

//crea pianeti
function createSphereMesh(texturePath, normalMapPath, radius, segments) {
  const texture = new THREE.TextureLoader().load(texturePath);
  const normalMap = new THREE.TextureLoader().load(normalMapPath);

  const material = new THREE.MeshStandardMaterial({
    map: texture,
    normalMap: normalMap,
  });

  const geometry = new THREE.SphereGeometry(radius, segments, segments);

  const mesh = new THREE.Mesh(geometry, material);

  return mesh;
}
//mercurio
const mercury = createSphereMesh('/src/texture_plans/mercury.jpg','/src/texture_plans/mercury_normal.jpg',1.9,32);
const mercuryObj = new THREE.Object3D();
mercuryObj.add(mercury);
scene.add(mercuryObj);
mercury.name = 'mercurio';
mercury.position.setX(30);

//venere
const venus = createSphereMesh('/src/texture_plans/venus.jpg', '/src/texture_plans/normal_venus.jpg', 4.75, 32);
const venusObj = new THREE.Object3D();
venusObj.add(venus);
scene.add(venusObj);
venus.name = "venere";
venus.position.setX(45);

//terra
const earth = createSphereMesh('/src/texture_plans/earth.jpg','/src/texture_plans/earth_normal_map.jpg', 5,32);
const earthObj = new THREE.Object3D();
earthObj.add(earth);
scene.add(earthObj);
earth.name = "terra";
earth.position.setX(60);

//marte
const mars = createSphereMesh('/src/texture_plans/mars.jpg','/src/texture_plans/mars_normal.jpg', 2.66, 32);
const marsObj = new THREE.Object3D();
marsObj.add(mars);
scene.add(marsObj);
mars.name = "marte";
mars.position.setX(75);

//fine funzione

//creazione stelle
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(500));

  star.position.set(x, y, z);
  scene.add(star);

}
//num elementi array
Array(800).fill().forEach(addStar);

//interazione con mouse click

const mmi = new MouseMeshInteraction(scene, camera);

let tweenStarted = false;

mmi.addHandler('sole', 'click', function(mesh){
  console.log("sono sole ");
  title.innerHTML = "<span class='span-mars'>Sole</span>";

  subtitle.innerHTML = "Stella madre del Sistema Solare";
  description.innerHTML = "In grado di irradiare con la sua luce la quasi totalità dei pianeti della Via Lattea, attorno a lei orbitano gli otto pianeti principali.";
  //animaz start
  var aabb = new THREE.Box3().setFromObject( sun );
  var center = aabb.getCenter( new THREE.Vector3() );
  var size = aabb.getSize( new THREE.Vector3() );


  const tween = new TWEEN.Tween(camera.position)
  .to({ 
    x: center.x,
    y: center.y,
    z: center.z + size.z,
  }, 1000)
  .easing(TWEEN.Easing.Sinusoidal.Out)
  .start(); 
  stop= true;

});
let stop = false;
mmi.addHandler('mercurio', 'click', function(mesh){
  console.log("sono mercurio ");
  title.innerHTML = "<span class='span-mercury'>Mercurio</span>";

  subtitle.innerHTML = " E' il pianeta più interno del sistema solare e il più vicino al Sole.";
  description.innerHTML = "Un pianeta roccioso, gigantesco e irrilevabile, caratterizzato da un'atmosfera ghiacciata e umida.";

  var aabb = new THREE.Box3().setFromObject( mercury );
  var center = aabb.getCenter( new THREE.Vector3() ); 
  var size = aabb.getSize( new THREE.Vector3() );


  const tween = new TWEEN.Tween(camera.position)
  .to({ 
    x: center.x,
    y: center.y,
    z: center.z + size.z,
  }, 1000)
  .easing(TWEEN.Easing.Sinusoidal.Out)
  .start(); 
  stop= true;
  
});

mmi.addHandler('venere', 'click', function(mesh){
  console.log("sono venere ");
  title.innerHTML = "<span class='span-venus'>Venere</span>";

  subtitle.innerHTML = "La Dea romana dell'amore e della bellezza ";
  description.innerHTML = "Il suo simbolo astronomico è la rappresentazione stilizzata della mano di Venere che sorregge uno specchio.";

  var aabb = new THREE.Box3().setFromObject( venus );
  var center = aabb.getCenter( new THREE.Vector3() ); 
  var size = aabb.getSize( new THREE.Vector3() );


  const tween = new TWEEN.Tween(camera.position)
  .to({ 
    x: center.x,
    y: center.y,
    z: center.z + size.z,
  }, 1000)
  .easing(TWEEN.Easing.Sinusoidal.Out)
  .start(); 
  stop= true;


});
mmi.addHandler('terra', 'click', function(mesh){
  console.log("sono terra ");
  title.innerHTML = "<span class='span-earth'>Terra</span>";

  subtitle.innerHTML = "E' il più grande dei pianeti terrestri del sistema solare ";
  description.innerHTML = "L'unico corpo planetario del sistema solare adatto a sostenere la vita come concepita e conosciuta da noi esseri umani.";

  var aabb = new THREE.Box3().setFromObject( earth );
  var center = aabb.getCenter( new THREE.Vector3() ); 
  var size = aabb.getSize( new THREE.Vector3() );


  const tween = new TWEEN.Tween(camera.position)
  .to({ 
    x: center.x,
    y: center.y,
    z: center.z + size.z,
  }, 1000)
  .easing(TWEEN.Easing.Sinusoidal.Out)
  .start(); 
  stop= true;
});
mmi.addHandler('marte', 'click', function(mesh){
  console.log("sono marte ");
  title.innerHTML = "<span class='span-mars'>Marte</span>";
  
  subtitle.innerHTML = "L'ultimo dei pianeti terrestri";
  description.innerHTML = "Chiamato il Pianeta Rosso per via del suo colore caratteristico causato dalla grande quantità di ossido di ferro che lo ricopre.";
  var aabb = new THREE.Box3().setFromObject( mars );
  var center = aabb.getCenter( new THREE.Vector3() ); 
  var size = aabb.getSize( new THREE.Vector3() );


  const tween = new TWEEN.Tween(camera.position)
  .to({ 
    x: center.x,
    y: center.y,
    z: center.z + size.z,
  }, 1000)
  .easing(TWEEN.Easing.Sinusoidal.Out)
  .start(); 
  stop= true;
});


const EARTH_YEAR = 2 * Math.PI * (1 / 60) * (1 / 60);

function animate(){
  scene.rotation.y += 0.0005;
  scene.rotation.x += 0.001;
  scene.rotation.z += 0.001;

  //self - planets rotation
  sun.rotation.y += 0.001;
  mercury.rotation.y += EARTH_YEAR * 0.05;

  venus.rotation.y += EARTH_YEAR * 2;
  earth.rotation.y += EARTH_YEAR;
  mars.rotation.y += EARTH_YEAR * 0.5;
  //obj rotation (around sun)
  if(stop == false){
    venusObj.rotateY(0.01175957018);
    earthObj.rotateY(0.01);
    marsObj.rotateY(0.008085963734);
    mercuryObj.rotateY(0.0159032908);
  }


 // controls.update();
  mmi.update();
  TWEEN.update();
  requestAnimationFrame(animate); 
  renderer.render(scene, camera);
}

animate();
