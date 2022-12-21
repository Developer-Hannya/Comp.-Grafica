import * as THREE from  'three';
import checkCollisions, { cubeMaterial, cubeMaterialSelected, renderer, objects, parede, scene, selectableCubes, quaternion, player } from './trabalho02.js';
import { camera, cameraHolder} from './camera.js';
import {SelectableCube} from './objetos.js';

export var isHoldingBlock = false;
export var objectHolded = null;
var quaternionAux = new THREE.Quaternion();

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

    let boxes = selectableCubes.map(box => box);
    //let boxes = objects.map(box => box);

    var intersects = raycaster.intersectObjects(boxes);
    console.log(intersects);
        
    //intersercts cria um vetor a partir da câmera na direção do mouse e identifica os objetos nessa reta
    //no console.log(intersects) vi que ta criando um array pegando o plano também, então usamos a posição [0].
    if(isHoldingBlock === true && intersects.length==0){
        //console.log(objectHolded);
        let auxPos = objectHolded.position
        cameraHolder.remove(objectHolded);
        objectHolded.material=cubeMaterial;
        scene.add(objectHolded);
        let newPos = new THREE.Vector3(Math.round(auxPos.x+cameraHolder.position.x), cameraHolder.position.y + 0.5 , Math.round(auxPos.z+cameraHolder.position.z));
        objectHolded.position.copy(newPos);
        objectHolded.updateBlockBB();
        objectHolded = null;
        isHoldingBlock = false;
    }
    else if(intersects.length==0) return;
    else if(isSameMaterial(intersects[0].object.material, cubeMaterial) && isHoldingBlock === false && player.bb.distanceToPoint(intersects[0].object.position) <3.5 || intersects[0].object.pressing === true && player.bb.distanceToPoint(intersects[0].object.isPressing.position)<3.5 && isSameMaterial(intersects[0].object.material, cubeMaterial) && isHoldingBlock === false) {
        intersects[0].object.material=cubeMaterialSelected;
        cameraHolder.add(intersects[0].object);
        intersects[0].object.position.copy(cubeSide());
        intersects[0].object.updateBlockBB();
        isHoldingBlock = true;
        objectHolded = intersects[0].object;
    }
    else if(isSameMaterial(intersects[0].object.material, cubeMaterialSelected) && isHoldingBlock === false) {
        intersects[0].object.material=cubeMaterial;
    }
}

//função que compara se o rgb das duas cores recebidas são iguais
function isSameMaterial(material1, material2){
    if(material1.color.r==material2.color.r && material1.color.g==material2.color.g && material1.color.b==material2.color.b){
        return true;
    }
    return false;
}

function cubeSide(){
    if(quaternion.equals(quaternionAux.setFromAxisAngle(new THREE.Vector3(0,1,0),THREE.MathUtils.degToRad(90))))
        return new THREE.Vector3(2,3,-2);
    else if(quaternion.equals(quaternionAux.setFromAxisAngle(new THREE.Vector3(0,1,0),THREE.MathUtils.degToRad(0))))
        return new THREE.Vector3(0, 3, 4);
    else if(quaternion.equals(quaternionAux.setFromAxisAngle(new THREE.Vector3(0,1,0),THREE.MathUtils.degToRad(270))))
        return new THREE.Vector3(-4, 3, 0);
    else if(quaternion.equals(quaternionAux.setFromAxisAngle(new THREE.Vector3(0,1,0),THREE.MathUtils.degToRad(180))))
        return new THREE.Vector3(0, 3, -4);
    else if(quaternion.equals(quaternionAux.setFromAxisAngle(new THREE.Vector3(0,1,0),THREE.MathUtils.degToRad(315))))
        return new THREE.Vector3(-2, 3, 2);
    else if(quaternion.equals(quaternionAux.setFromAxisAngle(new THREE.Vector3(0,1,0),THREE.MathUtils.degToRad(135))))
        return new THREE.Vector3(2, 3, -2);
    else if(quaternion.equals(quaternionAux.setFromAxisAngle(new THREE.Vector3(0,1,0),THREE.MathUtils.degToRad(225))))
        return new THREE.Vector3(-2, 3, -2);
    else if(quaternion.equals(quaternionAux.setFromAxisAngle(new THREE.Vector3(0,1,0),THREE.MathUtils.degToRad(45))))
        return new THREE.Vector3(2, 3, 2);
    else 
        return new THREE.Vector3(0, 3, 0);

}