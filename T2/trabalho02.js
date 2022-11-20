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
import {objectHolded, onDocumentMouseDown } from './selecaoDeObjetos.js';
import {changeProjection,
        updateCamera,
        camera,
        cameraHolder} from './camera.js';
import {loadLights,
        ambientlight,
        directlight,
        spotLight,
        lightDowngrade} from './luz.js';
import {SelectableCube, LuminousButton, PressurePlate} from './objetos.js';
import { Staircase } from './escadas.js';
import { createPortals, Portal } from './portais.js';
import { Door } from './porta.js';
import { SecondaryBox } from '../libs/util/util.js';
import {Key} from './key.js';

export var scene = new THREE.Scene();    // Create main scene
export var keyboard = new KeyboardState();
var clock = new THREE.Clock();
var stats = new Stats();          // To show FPS information
export var quaternion = new THREE.Quaternion();      //cria um quaternion
quaternion.setFromAxisAngle(new THREE.Vector3(0,1,0),Math.PI/2);    // muda os eixos do quaternion

//-------------------------------------------------------------------------------
// Renderer
//-------------------------------------------------------------------------------
export var renderer = new THREE.WebGLRenderer({
  powerPreference: "default",
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
export let objects = [];            // vetor de objetos (para colisão)
export let portas = [];             // vetor de portas
export let escadas = [];            // vetor de escadas
export let chaves = [];
export let parede = [];             // vetor para guardar blocos da parede
export let teto = [];               // vetor para guardar blocos do teto
export let paredeTranslucida = [];  // vetor apra guardar blocos da parede mais prox da tela
export var LButtons = [];           // vetor de botões iluminados
export var pressPlates = [];        // vetor com todas as placas de pressão
export var pressPlatesA2 = [];      // vetor de placas de pressão da Area 2
export var pressPlatesA3 = [];      // vetor de placas de pressão da Area 3
export var spotlights = [];         // vetor de spotlights
export var selectableCubes = [];    // vetor de cubos selecionaveis
export var doorA3Open = false;      // variavel para saber se a porta A3 esta aberta
export var doorA2Open = false;      // variavel para saber se a porta A2 esta aberta

createPortals();
export var player = {
  object: null,
  loaded: false,
  bb: new THREE.Box3(),
  xSpeed: 0,
  zSpeed: 0
}

let key = new Key(5, 0, 7, "blue");
scene.add(key);

let key1 = new Key(5, 0, 5, "red");
scene.add(key1);

let key2 = new Key(7, 0, 5, "yellow");
scene.add(key2);

//área inicial
let escada = new Staircase(+13, -1.6, +17 + 3*0.8 + 0.4, "n");
scene.add(escada);

let portal = new Portal(+13, 3, 17, "z");
scene.add(portal);

let porta = new Door(+13, 3, 17, "z");
scene.add(porta);

//área azul
let escada2 = new Staircase(+13, 1.2, -18 - 3*0.8 - 0.4, "n");
scene.add(escada2);

let portal2 = new Portal(+13, 3, -17, "z", "blue");
scene.add(portal2);

let porta2 = new Door(+13, 3, -17, "z", "blue");
scene.add(porta2);

//área amarelo
let escada3 = new Staircase(-23 - 3*0.8 - 0.4 +13, 1.2, 0, "w");
scene.add(escada3);

let portal3 = new Portal(-22 +13, 3, 0, "x", "yellow");
scene.add(portal3);

let porta3 = new Door(-22 +13, 3, 0, "x", "yellow");
scene.add(porta3);

//área vermelho
let escada4 = new Staircase(22 + 3*0.8 + 0.4 +13, -1.6, 0, "w");
scene.add(escada4);
let escada5 = new Staircase(22 + 3*0.8 + 0.4 + 5.6 +13, -1.6 - 2.8, 0, "w");
scene.add(escada5);
escada5.staircaseBox.max.x += 1;

let portal4 = new Portal(22 +13, 3, 0, "x", "red");
scene.add(portal4);

let porta4 = new Door(22 +13, 3, 0, "x", "red");
scene.add(porta4);

let portaA2 = new Door(13, 5.8, -57.60, "w", "blue");
scene.add(portaA2);
let portaA3 = new Door(86, -3, 0, "x", "red");
scene.add(portaA3);


 //createBBHelper(player.bb, 'yellow');
// Control the appearence of first object loaded
var firstRender = false;

//-------------------------------------------------------------------------------
// Setting ground plane
//-------------------------------------------------------------------------------

// primary ground plane
var groundPlane = createGroundPlane(45, 35, 75, 75, "rgb(222,184,135)"); // (width, height, width segments, height segments, color)
groundPlane.rotateX(THREE.MathUtils.degToRad(-90));
groundPlane.translateX(13);
scene.add(groundPlane);

// secondary ground plane
var groundPlane2 = createGroundPlane(1000, 1000, 1, 1, "rgb(222,184,125)"); // (width, height, width segments, height segments, color)
groundPlane2.translateY(-15);
groundPlane2.rotateX(THREE.MathUtils.degToRad(-90));
groundPlane2.receiveShadow = false;
scene.add(groundPlane2);
groundPlane2.castShadow = false;

// add a grid in ground so it look like it has tiles
const gridHelper = new THREE.GridHelper(35, 35, "rgb(7,7,7)", "rgb(7,7,7)");
gridHelper.translateX(8);
scene.add( gridHelper );

const gridHelper1 = new THREE.GridHelper(35, 35, "rgb(7,7,7)", "rgb(7,7,7)");
gridHelper1.translateX(18);
scene.add( gridHelper1 );

var groundPlaneA3 = createGroundPlane(40, 20, 75, 75, "rgb(222,184,135)"); // (width, height, width segments, height segments, color)
groundPlaneA3.translateX(65);
groundPlaneA3.translateY(-6);
groundPlaneA3.rotateX(THREE.MathUtils.degToRad(-90));
scene.add(groundPlaneA3);

var groundPlaneA3_2 = createGroundPlane(6, 6, 5, 5, "rgb(222,184,135)"); // (width, height, width segments, height segments, color)
groundPlaneA3_2.translateX(88);
groundPlaneA3_2.translateY(-6);
groundPlaneA3_2.rotateX(THREE.MathUtils.degToRad(-90));
scene.add(groundPlaneA3_2);

const gridHelperA3 = new THREE.GridHelper(20, 20, "rgb(7,7,7)", "rgb(7,7,7)");
gridHelperA3.translateX(55);
gridHelperA3.translateY(-6);
scene.add( gridHelperA3 );
const gridHelper2A3 = new THREE.GridHelper(20, 20, "rgb(7,7,7)", "rgb(7,7,7)");
gridHelper2A3.translateX(75);
gridHelper2A3.translateY(-6);
scene.add( gridHelper2A3 );
const gridHelperA3_2 = new THREE.GridHelper(6, 6, "rgb(7,7,7)", "rgb(7,7,7)");
gridHelperA3_2.translateX(88);
gridHelperA3_2.translateY(-6);
scene.add( gridHelperA3_2 );

var groundPlaneA2 = createGroundPlane(25, 35, 75, 75, "rgb(222,184,135)"); // (width, height, width segments, height segments, color)
groundPlaneA2.translateY(2.8);
groundPlaneA2.translateX(13);
groundPlaneA2.translateZ(-40);
groundPlaneA2.rotateX(THREE.MathUtils.degToRad(-90));
scene.add(groundPlaneA2);

const gridHelperA2 = new THREE.GridHelper(26, 26, "rgb(7,7,7)", "rgb(7,7,7)");
gridHelperA2.translateX(13);
gridHelperA2.translateZ(-36);
gridHelperA2.translateY(2.8);
scene.add( gridHelperA2 );
const gridHelper2A2 = new THREE.GridHelper(26, 26, "rgb(7,7,7)", "rgb(7,7,7)");
gridHelper2A2.translateX(13);
gridHelper2A2.translateZ(-45);
gridHelper2A2.translateY(2.8);
scene.add( gridHelper2A2 );
const gridHelperA2_2 = new THREE.GridHelper(6, 6, "rgb(7,7,7)", "rgb(7,7,7)");
gridHelperA2_2.translateX(13);
gridHelperA2_2.translateZ(-60.5);
gridHelperA2_2.translateY(2.8);
scene.add( gridHelperA2_2 );

var groundPlaneA2_2 = createGroundPlane(6, 6, 5, 5, "rgb(222,184,135)"); // (width, height, width segments, height segments, color)
groundPlaneA2_2.translateX(13);
groundPlaneA2_2.translateZ(-60.5);
groundPlaneA2_2.translateY(2.8);
groundPlaneA2_2.rotateX(THREE.MathUtils.degToRad(-90));
scene.add(groundPlaneA2_2);

// area final
var groundPlaneAf = createGroundPlane(10, 10, 75, 75, "rgb(222,184,135)"); // (width, height, width segments, height segments, color)
groundPlaneAf.translateY(2.8);
groundPlaneAf.translateX(-20.2);
groundPlaneAf.rotateX(THREE.MathUtils.degToRad(-90));
scene.add(groundPlaneAf);

// area 1
var groundPlaneA1 = createGroundPlane(20, 25, 75, 75, "rgb(222,184,135)"); // (width, height, width segments, height segments, color)
groundPlaneA1.translateY(-2.8);
groundPlaneA1.translateX(13);
groundPlaneA1.translateZ(35.6);
groundPlaneA1.rotateX(THREE.MathUtils.degToRad(-90));
scene.add(groundPlaneA1);

// area chave 1
var groundPlaneAc1 = createGroundPlane(11, 11, 75, 75, "rgb(222,184,135)"); // (width, height, width segments, height segments, color)
groundPlaneAc1.translateY(-2.8);
groundPlaneAc1.translateX(13);
groundPlaneAc1.translateZ(56.6);
groundPlaneAc1.rotateX(THREE.MathUtils.degToRad(-90));
scene.add(groundPlaneAc1);

// create basic cube components
//export let cubeMaterial = setDefaultMaterial("rgb(182,144,95)");
export let cubeMaterial = new MeshLambertMaterial({
  color: "rgb(182,144,95)",
});
export let cubeMaterialSelected = new MeshLambertMaterial({
  color: "rgb(182,144,95)",
});
let cubeGeometry = new THREE.BoxGeometry(1, 1, 1);

let area1Boxes = [];
let area1BridgeSlots = [];

function createArea1(){
  function createSelectableCubesA1(){

    for(let i = 0; i < 6; i++){
      let cubeA1 = new SelectableCube(new THREE.Vector3(13, -2.3, 30+i), cubeGeometry, cubeMaterial);
      cubeA1.updateBlockBB();
      scene.add(cubeA1);
      selectableCubes.push(cubeA1);
      area1Boxes.push(cubeA1);
    }
  }

  //parede da area 1
for(var i = 3; i <= 23; i++) {
  for(var j= 23.6; j <= 47.6; j++) {
      let cubeArea1 = new THREE.Mesh(cubeGeometry, cubeMaterial);
      //console.log(j);
      if((i == 3 || i == 23 || j == 23.6 || j == 47.6) && ((i <= 10)||(i > 15)||(j == 47.6 && (i == 11 || i == 15 || i == 14)))) {
        cubeArea1.position.set(i, -2.3, j);
        cubeArea1.castShadow = true;
        cubeArea1.receiveShadow = true;
        scene.add(cubeArea1);
        let cubeBbArea1  = new THREE.Box3().setFromObject(cubeArea1);
        let boxArea1 = {
          obj: cubeArea1,
          bb: cubeBbArea1,
          selected: false
        };
        parede.push(boxArea1);
      }  
  }
}
//area da chave da area 1
for(var i = 8; i <= 18; i++) {
  for(var j= 51.6; j <= 61.6; j++) {
      let cubeArea1 = new THREE.Mesh(cubeGeometry, cubeMaterial);
      //console.log(j);
      if((i == 8 || i == 18 || j == 51.6 || j == 61.6) && ((i < 12)||(i > 13)||(j == 61.6))) {
        cubeArea1.position.set(i, -2.3, j);
        cubeArea1.castShadow = true;
        cubeArea1.receiveShadow = true;
        scene.add(cubeArea1);
        let cubeBbArea1  = new THREE.Box3().setFromObject(cubeArea1);
        let boxArea1 = {
          obj: cubeArea1,
          bb: cubeBbArea1,
          selected: false
        };
        parede.push(boxArea1);
      }  
  }
}

  function createBridge(){
    for(let i = 0; i < 3; i++){
      for(let j = 0; j < 2; j++){
        let boxPosition = new THREE.Vector3(12 + j, -3.3, 48.6 + i);
        let colliderPosition = new THREE.Vector3(12.5 + j, -2.3, 48.6 + i);
        let box = new THREE.Box3().setFromCenterAndSize(boxPosition, new THREE.Vector3(1, 1.5, 1));
        let helper = new THREE.Box3().setFromCenterAndSize(boxPosition, new THREE.Vector3(1, 1, 1));
        let collider = new THREE.Box3().setFromCenterAndSize(colliderPosition, new THREE.Vector3(1, 1, 1));
        parede.push({bb: collider});
        createBBHelper(helper, "white");
        area1BridgeSlots.push({"space": box, "collider": collider, "helper": helper});
      }
    }
  }


  createSelectableCubesA1();
  createBridge();
}

function buildArea1Bridge(){
  for(let k = 0; k < area1Boxes.length; k++){
    const box = area1Boxes[k];
    let possibleSpaces = [];
    box.updateBlockBB();

    for(let i = 0; i < area1BridgeSlots.length; i++) {
      const slot = area1BridgeSlots[i];
      if(box.bb.intersectsBox(slot.space)){
        let x = (slot.space.min.x + slot.space.max.x)/2;
        let y = (slot.space.min.y + slot.space.max.y)/2;
        let z = (slot.space.min.z + slot.space.max.z)/2;
        possibleSpaces.push({"position": new THREE.Vector3(x, y, z), "index": i});
      }
    }

    let closestPosition = {"position": undefined, "index": -1};

    if(possibleSpaces.length != 0){
      for(let i = 0; i < possibleSpaces.length; i++){
        let pos = possibleSpaces[i].position;
        // console.log(pos);
        if(!closestPosition.position || box.position.distanceTo(pos) < box.position.distanceTo(closestPosition.position)){
          closestPosition.position = pos;
          closestPosition.index = possibleSpaces[i].index;
        }
      }

      area1BridgeSlots[closestPosition.index].collider.max.x = area1BridgeSlots[closestPosition.index].collider.min.x;
      area1BridgeSlots[closestPosition.index].collider.max.y = area1BridgeSlots[closestPosition.index].collider.min.y;
      area1BridgeSlots[closestPosition.index].collider.max.z = area1BridgeSlots[closestPosition.index].collider.min.z;
      area1BridgeSlots[closestPosition.index].helper.max.x = area1BridgeSlots[closestPosition.index].helper.min.x;
      area1BridgeSlots[closestPosition.index].helper.max.y = area1BridgeSlots[closestPosition.index].helper.min.y;
      area1BridgeSlots[closestPosition.index].helper.max.z = area1BridgeSlots[closestPosition.index].helper.min.z;
  
      area1BridgeSlots.splice(closestPosition.index, 1);
      area1Boxes.splice(k, 1);
      k--;
      console.log(closestPosition);
      
      selectableCubes = selectableCubes.filter(cube => cube.uuid != box.uuid);
  
      box.position.x = closestPosition.position.x;
      box.position.y = closestPosition.position.y;
      box.position.z = closestPosition.position.z;
  
      box.bb.max.x = box.bb.min.x;
      box.bb.max.y = box.bb.min.y;
      box.bb.max.z = box.bb.min.z;
  
      console.log(area1BridgeSlots);
    }
  };
}

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
          let cubeBb = new THREE.Box3();
          if (y == -5.5){
            //console.log(y);
            cubeBb.setFromObject(cube);
            createBBHelper(cubeBb, "yellow");
          }
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
  for(var x = 85.5; x <= 91.5; x++) {
    for(var z= -3; z <= 3; z++) {
      if(x == 91.5 || z == 3 || z == -3) {
        let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.set(x, -5.5, z);
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
  function createSelectableCubesA3(){
    for(let i = 0; i <=1; i ++){  
      let cubeA3 = new SelectableCube(new THREE.Vector3(3, 0.5, 3), cubeGeometry, cubeMaterial);
      if(i === 0){
        cubeA3.position.copy(new THREE.Vector3(62, -5.5, -8));
      }
      else{
        cubeA3.position.copy(new THREE.Vector3(55, -5.5, 8));
      }
      cubeA3.updateBlockBB();
      scene.add(cubeA3);
      selectableCubes.push(cubeA3);
    }
  }
  createSelectableCubesA3();
  // crias as placas de pressão da A3

  function createPressurePlatesA3(){
    let pressPlateA3Material = new THREE.MeshPhongMaterial({
      color: "grey",
      specular: "white",
      shininess: "200"
    });
    let pressPlateA3Geometry = new THREE.BoxGeometry(2,1,2);
    for(let i = 0; i <=1; i ++){  
      let pressPlateA3 = new PressurePlate(new THREE.Vector3(0, -6, 0), pressPlateA3Geometry, pressPlateA3Material);
      if(i === 0)
        pressPlateA3.position.set(55, -6, -8);
      else{
        pressPlateA3.position.set(76, -6, 8);
      }
      pressPlateA3.updatePressPlateBB();
      scene.add(pressPlateA3);
      pressPlates.push(pressPlateA3);
      pressPlatesA3.push(pressPlateA3);
    }
  }
  createPressurePlatesA3();
}
createArea3();
createArea1();

// map com as spotlights
export var totalSpotlights = spotlights.map(obj => obj);
// map com os botões iluminados
export var totalButtons = LButtons.map(obj => obj);
totalSpotlights.forEach(obj => {obj.loadLight()});
// map com blocos do teto
export var totalTetos = teto.map(obj => obj.obj);
// map com blocos da parede mais prox da tela
export var totalParedeTranslucida = paredeTranslucida.map(obj => obj.obj);
// map com placas de pressão

// checa se as placas de pressão estão sendo pressionadas por algum cubo selecionavel
function creckAnyPlateIsPressed(placas, cubos){
  placas.forEach(placa =>{
    cubos.forEach(cube => {
      // se a placa for precisonada por algum cubo, desce e salva o cubo que esta pressionando ela
      if(checkCollisions(placa.bb, cube.bb)){
        placa.add(cube);
        cube.position.set(0, 0.95 , 0);
        cube.updateBlockBB();
        placa.position.lerp(new THREE.Vector3(placa.position.x, placa.getYPressed(), placa.position.z), 0.03);
        placa.pressed = true;
        placa.pressedBy = cube;
        cube.pressing = true;
        cube.isPressing = placa;
      }
      // checa se a placa não é precionada por nenhum dos 'n' cubo (se pressedBy for null ignora a condicional,
      // se não, checa colisão com o ultimo cubo pressionado, se não ouver colisão então exacuta a condicional)
      else if (placa.pressedBy!= null && !checkCollisions(placa.bb, placa.pressedBy.bb)){
        placa.position.lerp(new THREE.Vector3(placa.position.x, placa.getYNotPressed(), placa.position.z), 0.03);
        placa.pressed = false;
        placa.pressedBy.pressing = false;
      }
    })
  })
  if(checkAllArePressed(totalPressPlatesA3) === true){
    // FUNÇÃO PARA ABRIR PORTA AQUI
    doorA3Open = true;
  }
  else{
    doorA3Open = false;
  }
  if(checkAllArePressed(totalPressPlatesA2) === true){
    // FUNÇÃO PARA ABRIR PORTA AQUI
    doorA2Open = true;
  }
  else{
    doorA2Open = false;
  }
}

// checa se todas as placas estão pressionadas ('map' como parametro)
function checkAllArePressed(plates){
  let qntPressedA3 = 0;
  plates.forEach(obj =>{
    if(obj.pressed === true){
      qntPressedA3++;
    }
  });
  if(qntPressedA3 === plates.length){
    qntPressedA3 = 0;
      return true;
  }
  qntPressedA3 = 0;
    return false;
}

// position cubes in the initial area
for(var i = -22+13; i <= 22+13; i++) {
  for(var j= -17; j <= 17; j++) {
    let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    if((i == -22+13 || i == 22+13 || j == -17 || j == 17) && (((i < -3+13)||(i > 3+13)) && ((j < -3)||(j > 3)))) {
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


//parede da area final
for(var i = -25.6; i <= -15.6; i++) {
  for(var j= -5; j <= 5; j++) {
      let cubeAreaf = new THREE.Mesh(cubeGeometry, cubeMaterial);
      //console.log(i);
      if((i == -25.6 || i == -15.600000000000001 || j == -5 || j == 5) && ((j <= -3)||(j >= 3)||i == -25.6)) {
        cubeAreaf.position.set(i, 3.3, j);
        cubeAreaf.castShadow = true;
        cubeAreaf.receiveShadow = true;
        scene.add(cubeAreaf);
        let cubeBbAreaf  = new THREE.Box3().setFromObject(cubeAreaf);
        let boxAreaf = {
          obj: cubeAreaf,
          bb: cubeBbAreaf,
          selected: false
        };
        parede.push(boxAreaf);
      }  
  }
}

function createArea2(){
  //let cubeMaterialArea2 = setDefaultMaterial("rgb(10,10,255)");
  for(var x = 0.5; x <= 25.5; x++) {
    for(var z= -58;z <= -23; z++) {
      let cubeArea2 = new THREE.Mesh(cubeGeometry, cubeMaterial);
      if((x == 0.5 || x == 25.5 || z == -58 || z == -23) && ((x < 10)||(x > 16))) {
        cubeArea2.position.set(x, 3.3, z);
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
  function createSelectableCubesA2(){
    for(let i = 0; i <= 5; i ++){  
      let cubeA2 = new SelectableCube(new THREE.Vector3(3, 0.5, 3), cubeGeometry, cubeMaterial);
      switch (i){
        case 0:
          cubeA2.position.copy(new THREE.Vector3(4, 3.3, -30));
          break;
        case 1:
          cubeA2.position.copy(new THREE.Vector3(4, 3.3, -36));
          break;
        case 2:
          cubeA2.position.copy(new THREE.Vector3(4, 3.3, -43));
          break;
        case 3:
          cubeA2.position.copy(new THREE.Vector3(23, 3.3, -28));
          break;
        case 4:
          cubeA2.position.copy(new THREE.Vector3(17, 3.3, -35));
        break;
        case 5:
          cubeA2.position.copy(new THREE.Vector3(20, 3.3, -41));
        break;
      }
      cubeA2.updateBlockBB();
      scene.add(cubeA2);
      selectableCubes.push(cubeA2);
    }
  }
  createSelectableCubesA2();
  // crias as placas de pressão da A3

  function createPressurePlatesA2(){
    let pressPlateA2Material = new THREE.MeshPhongMaterial({
      color: "grey",
      specular: "white",
      shininess: "200"
    });
    let pressPlateA2Geometry = new THREE.BoxGeometry(2,1,2);
    for(let i = 0; i <=2; i ++){  
      let pressPlateA2 = new PressurePlate(new THREE.Vector3(0, 2.8, 0), pressPlateA2Geometry, pressPlateA2Material);
      switch (i){
        case 0:
          pressPlateA2.position.set(20, 2.8, -52);
          break;
        case 1:
          pressPlateA2.position.set(13, 2.8, -52);
          break;
        case 2:
          pressPlateA2.position.set(6, 2.8,-52);
          break;
      } 
      pressPlateA2.updatePressPlateBB();
      scene.add(pressPlateA2);
      pressPlates.push(pressPlateA2);
      pressPlatesA2.push(pressPlateA2);
    }
  }
  createPressurePlatesA2();
}
createArea2();

export var totalPressPlates = pressPlates.map(obj => obj);
export var totalPressPlatesA3 = pressPlatesA3.map(obj => obj);
export var totalPressPlatesA2 = pressPlatesA2.map(obj => obj);

// map com cubos selecionaveis
export var totalSelectableCubes = selectableCubes.map(obj => obj);

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

// sensor de proximidade dos botões iluminados (se a porta A3 estiver aberta acende todas sporlights)
function lightSensor(){
    totalButtons.forEach(obj => {
      if(checkCollisions(obj.bb, player.bb) || doorA3Open === true){
        obj.spotlight.visibleTrue();
      }
      else if(obj.spotlight.loaded === true && doorA3Open === false)
      {
        obj.spotlight.visibleFalse();
      }
    });
}

// muda a visibilidade do teto de acordo com a posição do personagem
function tetoVisibility(){
  // [...totalTetos][0] -> seleciona o primeiro elemento do map
  if([...totalTetos][0].visible  === true && cameraHolder.position.y < -5){
    totalTetos.forEach(obj => {
      obj.visible = false;
    });
  }
  else if([...totalTetos][0].visible === false && cameraHolder.position.y > -5){
    totalTetos.forEach(obj => {
      obj.visible = true;
    });
  }
}

// muda a visibilidade da parede mais próxima da tela de acordo com a posição do personagem
function paredeTranslucidaVisibility(){
  // [...totalParedeTranslucida][0] -> seleciona o primeiro elemento do map
  if([...totalParedeTranslucida][0].visible  === true && cameraHolder.position.y < -5){
    totalParedeTranslucida.forEach(obj => {
      obj.visible = false;
    });
  }
  else if([...totalParedeTranslucida][0].visible  === false && cameraHolder.position.y > -5){
    totalParedeTranslucida.forEach(obj => {
      obj.visible = true;
    });
  }
}

 //placa da area final
 let pressPlateAfMaterial = new THREE.MeshPhongMaterial({
  color: "grey",
  specular: "white",
  shininess: "200"
});
let pressPlateAfGeometry = new THREE.BoxGeometry(2,1,2);
let pressPlateAf = new PressurePlate(new THREE.Vector3(-3, 0, -3), pressPlateAfGeometry, pressPlateAfMaterial);
pressPlateAf.position.set(-20.6, 2.6, 0);
pressPlateAf.updatePressPlateBB();
scene.add(pressPlateAf);
let pressPlateBb = new THREE.Box3();
pressPlateBb.setFromObject(pressPlateAf);
pressPlateBb.max.y += 3;
createBBHelper(pressPlateBb, "yellow");

const endingMessage = document.getElementById('endingMessage');

console.log(endingMessage);

function endGame(){
  if(checkCollisions(pressPlateBb, player.bb)){
    console.log('a');
    pressPlateAf.position.set(-20.6, 2.4, 0);
    pressPlateAf.updatePressPlateBB();

    endingMessage.style.display = '';
  }
}

render();

function render()
{
  updatePlayer();
  creckAnyPlateIsPressed(totalPressPlates, totalSelectableCubes);
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
  Door.openDoors();

  Staircase.updatePlayerY();
  Key.collectKeys();
  endGame();
  buildArea1Bridge();
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