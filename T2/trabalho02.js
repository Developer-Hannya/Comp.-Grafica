import * as THREE from 'three';
import Stats from '../build/jsm/libs/stats.module.js';
import GUI from '../libs/util/dat.gui.module.js'
import KeyboardState from '../libs/util/KeyboardState.js'
import {GLTFLoader} from '../build/jsm/loaders/GLTFLoader.js'
import {initRenderer, 
        createGroundPlane,
        initDefaultBasicLight,
        setDefaultMaterial,
        getMaxSize,
        onWindowResize,
        createGroundPlaneWired} from "../libs/util/util.js";
import { Vector3 } from '../build/three.module.js';
import { moveCharacter } from './moveCharacter.js';
import { onDocumentMouseDown } from './selecaoDeObjetos.js';
import {changeProjection,
        updateCamera,
        camera,
        cameraHolder} from './camera.js';
import { Staircase } from './escadas.js';
import { createPortals, Portal } from './portais.js';
import { Door } from './porta.js';

export var scene = new THREE.Scene();    // Create main scene
export var keyboard = new KeyboardState();
var clock = new THREE.Clock();
var stats = new Stats();          // To show FPS information
var quaternion = new THREE.Quaternion();      //cria um quaternion
  quaternion.setFromAxisAngle(new THREE.Vector3(0,1,0),Math.PI/2);    // muda os eixos do quaternion
export var renderer = initRenderer();    // View function in util/utils
  renderer.setClearColor("rgb(30, 30, 42)");
scene.add(cameraHolder);

export let objects = [];
export let portas = [];
export let escadas = [];

createPortals();

//-------------------------------------------------------------------------------
// Light
//-------------------------------------------------------------------------------
const light = new initDefaultBasicLight(scene, true, new THREE.Vector3(100,150,-50), 130, 4000, 0.1, 1000);

//-------------------------------------------------------------------------------
// Player
//-------------------------------------------------------------------------------
export var player = {
  object: null,
  loaded: false,
  bb: new THREE.Box3(),
  xSpeed: 0,
  zSpeed: 0
}

// createBBHelper(player.bb, 'yellow')

// Control the appearence of first object loaded
var firstRender = false;

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

//área 3
let escada = new Staircase(0, -1.6, +21 + 3*0.8, "n");
scene.add(escada);

let portal = new Portal(0, 3, 20.5, "z");
scene.add(portal);

let porta = new Door(0, 3, 20.5, "z");
scene.add(porta);

//área final
let escada2 = new Staircase(0, 1.2, -21 - 4*0.8, "n");
scene.add(escada2);

let portal2 = new Portal(0, 3, -20.5, "z");
scene.add(portal2);

let porta2 = new Door(0, 3, -20.5, "z");
scene.add(porta2);

//área 2
let escada3 = new Staircase(-41 - 4*0.8, 1.2, 0, "w");
//escada3.rotateY(Math.PI * 0.5);
scene.add(escada3);

let portal3 = new Portal(-40.5, 3, 0, "x");
scene.add(portal3);

let porta3 = new Door(-40.5, 3, 0, "x");
scene.add(porta3);

//área 1
let escada4 = new Staircase(41 + 3*0.8 + 5.6, -1.6 - 2.8, 0, "w");
scene.add(escada4);
let escada5 = new Staircase(41 + 3*0.8, -1.6, 0, "w");
scene.add(escada5);

let portal4 = new Portal(40.5, 3, 0, "x");
scene.add(portal4);

let porta4 = new Door(40.5, 3, 0, "x");
scene.add(porta4);


//-------------------------------------------------------------------------------
// Setting ground plane
//-------------------------------------------------------------------------------

// primary ground plane
var groundPlane = createGroundPlane(82, 42, 75, 75, "rgb(222,184,135)"); // (width, height, width segments, height segments, color)
groundPlane.rotateX(THREE.MathUtils.degToRad(-90));
scene.add(groundPlane);

// secondary ground plane
var groundPlane2 = createGroundPlane(1000, 1000, 1, 1, "rgb(50,50,50)"); // (width, height, width segments, height segments, color) rgb(222,184,125)
groundPlane2.translateY(-6);
groundPlane2.rotateX(THREE.MathUtils.degToRad(-90));
scene.add(groundPlane2);

// add a grid in ground so it look like it has tiles
const gridHelper = new THREE.GridHelper(30, 30, "rgb(30,7,130)", "rgb(120,66,7)");
gridHelper.translateX(-15);
scene.add( gridHelper );

const gridHelper1 = new THREE.GridHelper(30, 30, "rgb(7,7,7)", "rgb(7,7,7)");
gridHelper1.translateX(15);
scene.add( gridHelper1 );

var groundPlaneA2 = createGroundPlane(50, 25, 75, 75, "rgb(110,110,184)"); // (width, height, width segments, height segments, color)
groundPlaneA2.translateY(2);
groundPlaneA2.translateX(-70);
groundPlaneA2.rotateX(THREE.MathUtils.degToRad(-90));
scene.add(groundPlaneA2);

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


// create a cube
export let cubeMaterial = setDefaultMaterial("rgb(182,144,95)");
export let cubeMaterialSelected = setDefaultMaterial("rgb(100,255,100)");
let cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
// position the cube
export let parede = [];
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

let cubeMaterialArea2 = setDefaultMaterial("rgb(10,10,255)");
for(var i = -95; i <= -45; i++) {
  for(var j= -12.5; j <= 12.5; j++) {
    let cubeArea2 = new THREE.Mesh(cubeGeometry, cubeMaterialArea2);
    if((i == -95 || i == -45 || j == -12.5 || j == 12.5) && ((j < -3)||(j > 3))) {
      cubeArea2.position.set(i, 2.5, j);
      cubeArea2.castShadow = true;
      cubeArea2.receiveShadow = true;
      scene.add(cubeArea2);
      let cubeBbArea2  = new THREE.Box3().setFromObject(cubeArea2);
      let boxArea2 = {
        obj: cubeArea2,
        bb: cubeBbArea2,
        selected: false
      };
      parede.push(boxArea2);
    }
  }
}

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
  updateCamera();
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
export function createBBHelper(bb, color)
{
   let helper = new THREE.Box3Helper( bb, color );
   scene.add( helper );
   return helper;
}
function render()
{
  updatePlayer();
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
  Door.openDoors();

  Staircase.updatePlayerY();
}