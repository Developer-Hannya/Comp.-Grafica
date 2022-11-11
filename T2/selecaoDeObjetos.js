import * as THREE from  'three';
import { cubeMaterial, cubeMaterialSelected, renderer, objects, parede } from './trabalho02.js';
import { camera} from './camera.js';
import {BlocoSelecionavel} from './objetos.js';

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
    if(intersects.length==0) return;
    //intersercts cria um vetor a partir da câmera na direção do mouse e identifica os objetos nessa reta
    //no console.log(intersects) vi que ta criando um array pegando o plano também, então usamos a posição [0].
    if(isSameMaterial(intersects[0].object.material, cubeMaterial)) {
        intersects[0].object.material=cubeMaterialSelected;
        console.log("cubeMaterialSelected");
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
