import * as THREE from  'three';
import Stats from '../build/jsm/libs/stats.module.js';
import GUI from '../libs/util/dat.gui.module.js'
import KeyboardState from '../libs/util/KeyboardState.js'
import {GLTFLoader} from '../build/jsm/loaders/GLTFLoader.js'
import {initRenderer, 
        createGroundPlane,
        initDefaultBasicLight,
        setDefaultMaterial,
        getMaxSize,
        createGroundPlaneWired} from "../libs/util/util.js";
import { Light, MeshLambertMaterial, MeshPhongMaterial, Object3D, Vector3, WebGLArrayRenderTarget } from '../build/three.module.js';
import { moveCharacter } from './moveCharacter.js';
import { onDocumentMouseDown } from './selecaoDeObjetos.js';
import {changeProjection,
        updateCamera,
        camera,
        cameraHolder} from './camera.js';
import {loadLights,
        ambientlight,
        directlight,
        spotLight,
        lightDowngrade} from './luz.js';
import {BlocoSelecionavel, LuminousButton} from './objetos.js';

export var scene = new THREE.Scene();    // Create main scene
export var keyboard = new KeyboardState();
var clock = new THREE.Clock();
var stats = new Stats();          // To show FPS information
var quaternion = new THREE.Quaternion();      //cria um quaternion
  quaternion.setFromAxisAngle(new THREE.Vector3(0,1,0),Math.PI/2);    // muda os eixos do quaternion

//-------------------------------------------------------------------------------
// Renderer
//-------------------------------------------------------------------------------
export var renderer = new THREE.WebGLRenderer({
  powerPreference: "high-performance",
});    // View function in util/utils
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
  renderer.shadowMapsoft = true;
  // VSM/PCF/PCFSoft
  renderer.setPixelRatio(window.innerWidth/window.innerHeight); 
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById("webgl-output").appendChild(renderer.domElement);
  renderer.setClearColor("rgb(30, 30, 42)");

scene.add(cameraHolder);

loadLights();

  //-------------------------------------------------------------------------------
  // Player
  //-------------------------------------------------------------------------------
var player = {
  object: null,
  loaded: false,
  bb: new THREE.Box3(),
  xSpeed: 0,
  zSpeed: 0
}

 //createBBHelper(player.bb, 'yellow');

// Control the appearence of first object loaded
var firstRender = false;

//-------------------------------------------------------------------------------
// Setting ground plane
//-------------------------------------------------------------------------------

// primary ground plane
var groundPlane = createGroundPlane(80, 40, 75, 75, "rgb(222,184,135)"); // (width, height, width segments, height segments, color)
groundPlane.rotateX(THREE.MathUtils.degToRad(-90));
scene.add(groundPlane);

// secondary ground plane
var groundPlane2 = createGroundPlane(1000, 1000, 1, 1, "rgb(222,184,125)"); // (width, height, width segments, height segments, color)
groundPlane2.translateY(-15);
groundPlane2.rotateX(THREE.MathUtils.degToRad(-90));
scene.add(groundPlane2);

// add a grid in ground so it look like it has tiles
const gridHelper = new THREE.GridHelper(40, 40, "rgb(30,7,130)", "rgb(120,66,7)");
gridHelper.translateX(-20);
scene.add( gridHelper );

const gridHelper1 = new THREE.GridHelper(40, 40, "rgb(7,7,7)", "rgb(7,7,7)");
gridHelper1.translateX(20);
scene.add( gridHelper1 );

var groundPlaneA3 = createGroundPlane(40, 20, 75, 75, "rgb(222,184,135)"); // (width, height, width segments, height segments, color)
groundPlaneA3.translateX(65);
groundPlaneA3.translateY(-6);
groundPlaneA3.rotateX(THREE.MathUtils.degToRad(-90));
scene.add(groundPlaneA3);

const gridHelperA3 = new THREE.GridHelper(20, 20, "rgb(7,7,7)", "rgb(7,7,7)");
gridHelperA3.translateX(55);
gridHelperA3.translateY(-6);
scene.add( gridHelperA3 );
const gridHelper2A3 = new THREE.GridHelper(20, 20, "rgb(7,7,7)", "rgb(7,7,7)");
gridHelper2A3.translateX(75);
gridHelper2A3.translateY(-6);
scene.add( gridHelper2A3 );

// ramp/stairs to A3
var escadaTesteA3 = createGroundPlane(10, 6, 75, 75, "rgb(182,144,95)"); // (width, height, width segments, height segments, color)
escadaTesteA3.translateX(43.5);
escadaTesteA3.translateY(-3.5);
escadaTesteA3.rotateX(THREE.MathUtils.degToRad(-90));
escadaTesteA3.rotateY(THREE.MathUtils.degToRad(45));
//escadaTesteA3.castShadow = true;
scene.add(escadaTesteA3);

var matriz = [];
for(var i=0; i<75; i++) {
  matriz[i] = [];
  for(var j=0; j<75; j++) {
    // matriz[i][j] = undefined;
    if (i == 0 || i == 74 || j == 0 || j == 74) {
      matriz[i][j] = 1;
    }
    else {
      matriz[i][j] = 0;
    }
  }
}

// create basic cube components
//export let cubeMaterial = setDefaultMaterial("rgb(182,144,95)");
export let cubeMaterial = new MeshLambertMaterial({
  color: "rgb(182,144,95)",
  shininess: "200",
  specular: "white",
});
export let cubeMaterialSelected = setDefaultMaterial("rgb(100,255,100)");
let cubeGeometry = new THREE.BoxGeometry(1, 1, 1);

export let objects = [];            // vetor de objetos
export let parede = [];             // vetor para guardar blocos da parede
export let teto = [];               // vetor para guardar blocos do teto
export let paredeTranslucida = [];  // vetor apra guardar blocos da parede mais prox da tela
export var LButtons = [];           // vetor de botões iluminados
export var spotlights = [];         // vetor de spotlights

function createArea3(){
  // position cubes in the area A3 like a "house"
  for(var y = -5.5; y <= 1; y++){
    for(var x = 45.5; x <= 85.5; x++) {
      for(var z= -10.5; z <= 10.5; z++) {
        let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        if((x == 45.5 || x == 85.5 || z == -10.5 || z == 10.5) && (((x < -2.5)||(x > 2.5)) && ((z < -2.5)||(z > 2.5)))) {
          cube.position.set(x, y, z);
          cube.castShadow = true;
          cube.receiveShadow = true;
          scene.add(cube);
          let cubeBb  = new THREE.Box3().setFromObject(cube);
          let box = {
            obj: cube,
            bb: cubeBb,
            selected: false,
          };
          parede.push(box);
        }
        if(y === 0.5){
          cube.position.set(x, y, z);
          cube.castShadow = true;
          cube.receiveShadow = true;
          //cube.visible = true;
          scene.add(cube);
          let cubeBb  = new THREE.Box3().setFromObject(cube);
          let box = {
          obj: cube,
          bb: cubeBb,
          selected: false,
        };
        teto.push(box);
        //parede.push(box);
        }
        if (y > -5 && z === 10.5){
          cube.position.set(x, y, z);
          cube.castShadow = true;
          cube.receiveShadow = true;
          scene.add(cube);
          let cubeBb  = new THREE.Box3().setFromObject(cube);
          let box = {
          obj: cube,
          bb: cubeBb,
          selected: false,
          };
          paredeTranslucida.push(box);
        }
      }
    }
  }
  // load the luminous buttons on area A3 and theirs spotlights
  function loadA3Objects(){
    for (let i = 0; i <= 7; i++) {
      if(i<=3){
        let spotlight = new spotLight('white', 0.8, 10, 0.5, 0.3, 0.1, new THREE.Vector3(55 + i*7, 0, -9.5));
        let button = new LuminousButton(new THREE.Vector3(55 + i*7, -4, -10), spotlight);
        LButtons.push(button);
        spotlights.push(spotlight);
        scene.add(button);
      }
      else{
        let spotlight = new spotLight('white', 0.8, 10, 0.5, 0.3, 0.1, new THREE.Vector3(55 + (i-4)*7, 0, 9.5));
        let button = new LuminousButton(new THREE.Vector3(55 + (i-4)*7, -4, 10), spotlight);
        LButtons.push(button);
        spotlights.push(spotlight);
        scene.add(button);
      }
    }
  }
  loadA3Objects();
  // cria os cubos selecionaveis da A3
  function criaCubosSelecionaveisA3(){
    for(let i = 0; i <=1; i ++){  
      let cubeA3 = new THREE.Mesh(cubeGeometry,cubeMaterial);
      if(i === 0)
        cubeA3.position.copy(new THREE.Vector3(62, -5.5, -8));
      else
        cubeA3.position.copy(new THREE.Vector3(76, -5.5, 8));
      let cubeBbA3  = new THREE.Box3().setFromObject(cubeA3);
      let boxA3 = {
        obj: cubeA3,
        bb: cubeBbA3,
        selected: false
      };
      cubeA3.castShadow = true;
      cubeA3.receiveShadow = true;
      scene.add(cubeA3);
      objects.push(boxA3);
    }
  }
  criaCubosSelecionaveisA3();
}
createArea3();

// map com as spotlights
export var totalSpotlights = spotlights.map(obj => obj);
// map com os botões iluminados
export var totalButtons = LButtons.map(obj => obj);
totalSpotlights.forEach(obj => {obj.loadLight()});
// map com blocos do teto
export var totalTetos = teto.map(obj => obj.obj);
// map com blocos da parede mais prox da tela
export var totalParedeTranslucida = paredeTranslucida.map(obj => obj.obj);

// position cubes in the initial area
for(var i = -40.5; i <= 40.5; i++) {
  for(var j= -20.5; j <= 20.5; j++) {
    let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    if((i == -40.5 || i == 40.5 || j == -20.5 || j == 20.5) && (((i < -2.5)||(i > 2.5)) && ((j < -2.5)||(j > 2.5)))) {
      cube.position.set(i, 0.5, j);
      cube.castShadow = true;
      cube.receiveShadow = true;
      scene.add(cube);
      let cubeBb  = new THREE.Box3().setFromObject(cube);
      let box = {
        obj: cube,
        bb: cubeBb,
        selected: false
      };
      parede.push(box);
    }
  }
}


// //adicionando blocos do meio
// for(var i = -33; i <= 33; i++) {
//   for(var j= -33; j <= 33; j++) {
//     var k = Math.floor(Math.random() * 30);
//     let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
//     if((i != 0 && j != 0) && k == 1) {
//       if(matriz[i-2+37][j+37] === 0 && matriz[i-2+37][j+1+37] === 0 && matriz[i-2+37][j-1+37] === 0 && matriz[i-2+37][j+2+37] === 0 && matriz[i-2+37][j-2+37] === 0 &&
//         matriz[i+2+37][j+37] === 0 && matriz[i+2+37][j+1+37] === 0 && matriz[i+2+37][j-1+37] === 0 && matriz[i+2+37][j+2+37] === 0 && matriz[i+2+37][j-2+37] === 0 &&
//         matriz[i+37][j-2+37] === 0 && matriz[i-1+37][j-2+37] === 0 && matriz[i+1+37][j-2+37] === 0 &&
//         matriz[i+37][j+2+37] === 0 && matriz[i-1+37][j+2+37] === 0 && matriz[i+1+37][j+2+37] === 0){
//         cube.position.set(i, 0.5, j);
//         cube.castShadow = true;
//         cube.receiveShadow = true;
//         scene.add(cube);
//         matriz[i+37][j+37] = 1;
//         let cubeBb  = new THREE.Box3().setFromObject(cube);
//         let box = {
//           obj: cube,
//           bb: cubeBb,
//           selected: false
//         };
//         objects.push(box);
//         k = Math.floor(Math.random() * 30);
//       }
//     }
//     k = Math.floor(Math.random() * 30);
//   }
// }

// Show axes (parameter is size of each axis)
var axesHelper = new THREE.AxesHelper( 2 );
  axesHelper.visible = false;
scene.add( axesHelper );

//----------------------------------------------------------------------------
// Seleção de objetos
//----------------------------------------------------------------------------
document.addEventListener( 'mousedown', onDocumentMouseDown, false );
//----------------------------------------------------------------------------

var playAction = true;
var time = 0;
var mixer = new Array();

// Load animated files
loadGLTFFile('../assets/objects/walkingMan.glb');
render();

function loadGLTFFile(modelName)
{
  var loader = new GLTFLoader( );
  loader.load( modelName, function ( gltf ) {
    var obj = gltf.scene;
    obj.traverse( function ( child ) {
      if ( child ) {
          child.castShadow = true;
      }
    });
    obj.traverse( function( node )
    {
      if( node.material ) node.material.side = THREE.DoubleSide;
    });

    // create the man animated object  
    player.object = obj;
    
    scene.add ( obj );
    cameraHolder.add(player.object);
    player.object.applyQuaternion(quaternion);
    player.loaded = true;

    // Create animationMixer and push it in the array of mixers
    var mixerLocal = new THREE.AnimationMixer(obj);
    mixerLocal.clipAction( gltf.animations[0] ).play();
    mixer.push(mixerLocal);
    }, onProgress, onError);
}

function onError() { };

function onProgress ( xhr, model ) {
    if ( xhr.lengthComputable ) {
      var percentComplete = xhr.loaded / xhr.total * 100;
    }
}

function keyboardUpdate() {

  keyboard.update();
  playAction = moveCharacter(playAction, quaternion, player, cameraHolder, objects, parede);
  if ( keyboard.down("C"))  {
    changeProjection();
  }
  // fixa a camera na entrada A3 (TESTE)
  if(keyboard.pressed("Q")){
    var obj123 = new Object3D();
    obj123.position.set(50,0,0);
    scene.add(obj123);
    camera.lookAt(obj123.position);
  }
  updateCamera();
}

// atualiza as luzes
function lightsUpdate(){
  directlight.updateLight();
  lightDowngrade();
  tetoVisibility();
  paredeTranslucidaVisibility();
  lightSensor();
}

// sensor de proximidade dos botões iluminados
function lightSensor(){
  totalButtons.forEach(obj => {
    if(checkCollisions(obj.bb, player.bb)){
      obj.spotlight.visibilityTrue();
    }
    else if(obj.spotlight.loaded === true)
    {
      obj.spotlight.visibilityFalse();
    }
  });
}

// muda a visibilidade do teto de acordo com a posição do personagem
function tetoVisibility(){
  // [...totalTetos][0] -> seleciona o primeiro elemento do map
  if([...totalTetos][0].visible  === true && cameraHolder.position.y < -5.7){
    totalTetos.forEach(obj => {
      obj.visible = false;
    });
  }
  else if([...totalTetos][0].visible === false && cameraHolder.position.y > -5.7){
    totalTetos.forEach(obj => {
      obj.visible = true;
    });
  }
}

// muda a visibilidade da parede mais próxima da tela de acordo com a posição do personagem
function paredeTranslucidaVisibility(){
  // [...totalParedeTranslucida][0] -> seleciona o primeiro elemento do map
  if([...totalParedeTranslucida][0].visible  === true && cameraHolder.position.y < -5.7){
    totalParedeTranslucida.forEach(obj => {
      obj.visible = false;
    });
  }
  else if([...totalParedeTranslucida][0].visible  === false && cameraHolder.position.y > -5.7){
    totalParedeTranslucida.forEach(obj => {
      obj.visible = true;
    });
  }
}

function render()
{
  updatePlayer();
  lightsUpdate();
  stats.update();
  var delta = clock.getDelta(); // Get the seconds passed since the time 'oldTime' was set and sets 'oldTime' to the current time.
  keyboardUpdate(); 
  requestAnimationFrame(render);
  renderer.render(scene, camera);
  // Animation control
  if (playAction)
  {
    for(var i = 0; i<mixer.length; i++)
      mixer[i].update( delta );
  }
}

function updatePlayer()
{
   if(player.loaded)
   {
      let playerPos = new THREE.Vector3();
      player.object.localToWorld(playerPos);
      playerPos.y += 1;
      let size = new THREE.Vector3(1.1, 1.1, 1.1);
      player.bb.setFromCenterAndSize(playerPos, size);
   }
}

//colisão
export default function checkCollisions(object, playerBb)
{
   let collision = playerBb.intersectsBox(object);
   if(collision){
      return true;
   }
   return false;
}

// deixa a bb visivel
function createBBHelper(bb, color)
{
   let helper = new THREE.Box3Helper( bb, color );
   scene.add( helper );
   return helper;
}