import * as THREE from  'three';
import { cubeMaterial, cubeMaterialSelected, renderer, objects, parede, scene } from './trabalho02.js';
import { camera, cameraHolder} from './camera.js';
import {BlocoSelecionavel} from './objetos.js';

var isHoldingBlock = false;
var objectHolded = null;

export function onDocumentMouseDown( event ) 
{
    var raycaster = new THREE.Raycaster(); // create once
    var mouse = new THREE.Vector2(); // create once
    
    //identifica a posição do mouse
    mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;
    
    raycaster.setFromCamera( mouse, camera );

    //se for pra selecionar a parede também, descomentar as 2 linhas abaixo e comentar a próxima:
    //let boxes = objects.concat(parede);
    //boxes = boxes.map(box => box.obj);

    let boxes = objects.map(box => box.obj);
    

    var intersects = raycaster.intersectObjects(boxes);
    console.log(intersects);
    //intersercts cria um vetor a partir da câmera na direção do mouse e identifica os objetos nessa reta
    //no console.log(intersects) vi que ta criando um array pegando o plano também, então usamos a posição [0].
    if(isHoldingBlock === true && intersects.length==0){
        console.log(objectHolded);
        cameraHolder.remove(objectHolded);
        scene.add(objectHolded);
        objectHolded.material=cubeMaterial;
        objectHolded.position.copy(cameraHolder.position);
        objectHolded = null;
        isHoldingBlock = false;
    }
    else if(intersects.length==0) return;
    else if(isSameMaterial(intersects[0].object.material, cubeMaterial || isHoldingBlock === false)) {
        intersects[0].object.material=cubeMaterialSelected;
        console.log("cubeMaterialSelected");
        cameraHolder.add(intersects[0].object);
        intersects[0].object.position.set(0,5,0);
        isHoldingBlock = true;
        objectHolded = intersects[0].object;
        console.log(objectHolded);
    }
    else if(isSameMaterial(intersects[0].object.material, cubeMaterialSelected)) {
        intersects[0].object.material=cubeMaterial;
        console.log("cubeMaterial");
    }
}

//função que compara se o rgb das duas cores recebidas são iguais
function isSameMaterial(material1, material2){
    if(material1.color.r==material2.color.r && material1.color.g==material2.color.g && material1.color.b==material2.color.b){
        return true;
    }
    return false;
}
