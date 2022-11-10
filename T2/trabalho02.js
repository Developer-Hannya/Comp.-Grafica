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
        onWindowResize,
        createGroundPlaneWired} from "../libs/util/util.js";
import { Vector3 } from '../build/three.module.js';
import { moveCharacter } from './moveCharacter.js';
import { onDocumentMouseDown } from './selecaoDeObjetos.js';
import {changeProjection,
        updateCamera,
        camera,
        cameraHolder} from './camera.js';
import { createLadder } from './escadas.js';
import { createPortals } from './portais.js';

export var scene = new THREE.Scene();    // Create main scene
export var keyboard = new KeyboardState();
var clock = new THREE.Clock();
var stats = new Stats();          // To show FPS information
var quaternion = new THREE.Quaternion();      //cria um quaternion
  quaternion.setFromAxisAngle(new THREE.Vector3(0,1,0),Math.PI/2);    // muda os eixos do quaternion
export var renderer = initRenderer();    // View function in util/utils
  renderer.setClearColor("rgb(30, 30, 42)");
scene.add(cameraHolder);

createLadder();
createPortals();

//-------------------------------------------------------------------------------
// Light
//-------------------------------------------------------------------------------
const light = new initDefaultBasicLight(scene, true, new THREE.Vector3(100,150,-50), 130, 4000, 0.1, 1000);

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

// createBBHelper(player.bb, 'yellow')

// Control the appearence of first object loaded
var firstRender = false;

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

//-------------------------------------------------------------------------------
// Setting ground plane
//-------------------------------------------------------------------------------

// primary ground plane
var groundPlane = createGroundPlane(80, 40, 75, 75, "rgb(222,184,135)"); // (width, height, width segments, height segments, color)
groundPlane.rotateX(THREE.MathUtils.degToRad(-90));
scene.add(groundPlane);

// secondary ground plane
var groundPlane2 = createGroundPlane(1000, 1000, 1, 1, "rgb(222,184,125)"); // (width, height, width segments, height segments, color)
groundPlane2.translateY(-6);
groundPlane2.rotateX(THREE.MathUtils.degToRad(-90));
scene.add(groundPlane2);

// add a grid in ground so it look like it has tiles
const gridHelper = new THREE.GridHelper(40, 40, "rgb(30,7,130)", "rgb(120,66,7)");
gridHelper.translateX(-20);
scene.add( gridHelper );

const gridHelper1 = new THREE.GridHelper(40, 40, "rgb(7,7,7)", "rgb(7,7,7)");
gridHelper1.translateX(20);
scene.add( gridHelper1 );

// var groundPlaneA1 = createGroundPlane(80, 40, 75, 75, "rgb(0,184,0)"); // (width, height, width segments, height segments, color)
// groundPlaneA1.translateX(77);
// groundPlaneA1.rotateX(THREE.MathUtils.degToRad(-90));
// scene.add(groundPlaneA1);

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
export let objects = [];
export let parede = [];
for(var i = -40; i <= 40; i++) {
  for(var j= -20; j <= 20; j++) {
    let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    if((i == -40 || i == 40 || j == -20 || j == 20) && (((i < -3)||(i > 3)) && ((j < -3)||(j > 3)))) {
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

//adicionando blocos do meio
/*
for(var i = -33; i <= 33; i++) {
  for(var j= -33; j <= 33; j++) {
    var k = Math.floor(Math.random() * 30);
    let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    if((i != 0 && j != 0) && k == 1) {
      if(matriz[i-2+37][j+37] === 0 && matriz[i-2+37][j+1+37] === 0 && matriz[i-2+37][j-1+37] === 0 && matriz[i-2+37][j+2+37] === 0 && matriz[i-2+37][j-2+37] === 0 &&
        matriz[i+2+37][j+37] === 0 && matriz[i+2+37][j+1+37] === 0 && matriz[i+2+37][j-1+37] === 0 && matriz[i+2+37][j+2+37] === 0 && matriz[i+2+37][j-2+37] === 0 &&
        matriz[i+37][j-2+37] === 0 && matriz[i-1+37][j-2+37] === 0 && matriz[i+1+37][j-2+37] === 0 &&
        matriz[i+37][j+2+37] === 0 && matriz[i-1+37][j+2+37] === 0 && matriz[i+1+37][j+2+37] === 0){
        cube.position.set(i, 0.5, j);
        cube.castShadow = true;
        cube.receiveShadow = true;
        scene.add(cube);
        matriz[i+37][j+37] = 1;
        let cubeBb  = new THREE.Box3().setFromObject(cube);
        let box = {
          obj: cube,
          bb: cubeBb,
          selected: false
        };
        objects.push(box);
        k = Math.floor(Math.random() * 30);
      }
    }
    k = Math.floor(Math.random() * 30);
  }
}
*/

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