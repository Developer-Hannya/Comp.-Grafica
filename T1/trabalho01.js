import * as THREE from  'three';
import Stats from '../build/jsm/libs/stats.module.js';
import GUI from '../libs/util/dat.gui.module.js'
import KeyboardState from '../libs/util/KeyboardState.js'
import {GLTFLoader} from '../build/jsm/loaders/GLTFLoader.js'
import {initRenderer, 
        initDefaultSpotlight, 
        createGroundPlane,
        SecondaryBox, 
        setDefaultMaterial,
        getMaxSize,
        onWindowResize,
        createGroundPlaneWired} from "../libs/util/util.js";
import { Vector3 } from '../build/three.module.js';
import { moveCharacter } from './moveCharacter.js';

var scene = new THREE.Scene();    // Create main scene
var clock = new THREE.Clock();
var stats = new Stats();          // To show FPS information
export var keyboard = new KeyboardState();
initDefaultSpotlight(scene, new THREE.Vector3(50, 50, 50)); // Use default light

var renderer = initRenderer();    // View function in util/utils
  renderer.setClearColor("rgb(30, 30, 42)");

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

createBBHelper(player.bb, 'yellow')
//-------------------------------------------------------------------------------
// Quaternion
//-------------------------------------------------------------------------------
var quaternion = new THREE.Quaternion(); //cria um quaternion
quaternion.setFromAxisAngle(new THREE.Vector3(0,1,0),Math.PI/2); // muda os eixos do quaternion

//-------------------------------------------------------------------------------
// Orthographic camera
//-------------------------------------------------------------------------------
//let camLook = new THREE.Vector3(-1.0, -1.0, -1.0);
let camPos  = new THREE.Vector3(10, 10, 10);
let camUp   = new THREE.Vector3(0, 1, 0);
var aspect = window.innerWidth / window.innerHeight;
var d = 6.7;
var message = new SecondaryBox("");
var camera = new THREE.OrthographicCamera(- d * aspect, d * aspect, d, - d, 0.1, 1000); // (left, right, top, bottom, near, far);
  //camera.lookAt(camLook);
  camera.position.set(camPos);
  camera.up.set(camUp);
  
//-------------------------------------------------------------------------------
// Camera holder
//-------------------------------------------------------------------------------
let cameraHolder = new THREE.Object3D();
cameraHolder.position.set(0,0,0);
cameraHolder.add(camera);
scene.add(cameraHolder);
camera.lookAt(cameraHolder);

// Control the appearence of first object loaded
var firstRender = false;

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

//-------------------------------------------------------------------------------
// Setting ground plane
//-------------------------------------------------------------------------------

var groundPlane = createGroundPlane(45, 45, 45, 45, "rgb(222,184,135)"); // (width, height, width segments, height segments, color)
groundPlane.rotateX(THREE.MathUtils.degToRad(-90));
scene.add(groundPlane);

const gridHelper = new THREE.GridHelper( 45, 45, "rgb(255,0,0)", "rgb(7,7,7)");
scene.add( gridHelper );

var matriz = [];
for(var i=0; i<45; i++) {
  matriz[i] = [];
  for(var j=0; j<45; j++) {
    matriz[i][j] = undefined;
    if (i == 0 || i == 44 || j == 0 || j == 44) {
      matriz[i][j] = 1;
    }
    else {
      matriz[i][j] = 0;
    }
  }
}


// create a cube
let cubeMaterial;
cubeMaterial = setDefaultMaterial("rgb(222,184,135)");
let cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
// position the cube
let objects = [];
for(var i = -22; i <= 22; i++) {
  for(var j= -22; j <= 22; j++) {
    let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    if(i == -22 || i == 22 || j == -22 || j == 22) {
      cube.position.set(i, 0.5, j);
      scene.add(cube);
      let cubeBb  = new THREE.Box3().setFromObject(cube);
      objects.push(cubeBb);
    }
  }
}

// Show axes (parameter is size of each axis)
var axesHelper = new THREE.AxesHelper( 2 );
  axesHelper.visible = false;
scene.add( axesHelper );

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

function updateCamera()
{
  // atualiza a câmera
  camera.position.copy(camPos); 
  camera.up.copy(camUp);
  camera.lookAt(cameraHolder.position);

  //var pos = new THREE.Vector3();
  //cameraHolder.getWorldPosition(pos); // salva a posição global do objeto na variavel 'pos'
  // message.changeMessage("Pos: {" + pos.x + ", " + pos.y + ", " + pos.z + "} " + 
  //                        "/ Quaternion: {" + quaternion.w + "} ");
}

function controlAxis() {

}

function controlPerpective() {

}

function keyboardUpdate() {

  keyboard.update();
  playAction = moveCharacter(playAction, quaternion, player, cameraHolder, objects);
  if ( keyboard.down("C"))  {
    changeProjection();
  }
  updateCamera();
}

function changeProjection()
{
  // store the previous position of the camera
  var posit = new THREE.Vector3().copy(camera.position);

  if (camera instanceof THREE.PerspectiveCamera)
  {
    // OrthographicCamera( left, right, top, bottom, near, far )
    camera = new THREE.OrthographicCamera(- d * aspect, d * aspect, d, - d, 0.1, 1000);
  } else {
    // PerspectiveCamera( fov, aspect, near, far)
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  }
  camera.position.copy(posit);
  camera.lookAt(cameraHolder.position);
  cameraHolder.add(camera);
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
      // console.log(playerPos);
      let size = new THREE.Vector3(2, 2, 2);
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

function createBBHelper(bb, color)
{
   // Create a bounding box helper
   let helper = new THREE.Box3Helper( bb, color );
   scene.add( helper );
   return helper;
}