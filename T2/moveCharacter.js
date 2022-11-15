import * as THREE from  'three';
import checkCollisions from "./trabalho02.js";
import { keyboard } from './trabalho02.js';
import {isHoldingBlock, objectHolded} from './selecaoDeObjetos.js'

export function moveCharacter(playAction, quaternion, player, cameraHolder, objects, parede){
    // codigo para mover o personagem, a camera e colidir com objetos
    if(!player.loaded) return;
    player.xSpeed = 0;
    player.zSpeed = 0;
    let totalObjects = objects.concat(parede);
    totalObjects = totalObjects.map(obj => obj.bb);
    playAction = false;

    //enquanto o personagem anda, aumenta a bb na direção que está andando
    if (keyboard.pressed("down") && keyboard.pressed("right") || keyboard.pressed("S") && keyboard.pressed("D"))  {
      player.bb.max.x += 0.2;
      playAction = true;
      player.xSpeed = 0.07;
      if(keyboard.pressed("shift")){
        player.xSpeed = 0.14;
      }
      if(isHoldingBlock === true){
        objectHolded.position.lerp(new THREE.Vector3(4, 3, 0), 0.3);
      }
      if (cameraHolder.position.x > 40.5 && cameraHolder.position.z < 3 && cameraHolder.position.z > -3 && cameraHolder.position.y > -6) {
        cameraHolder.translateY(-0.07);
      }
      quaternion.setFromAxisAngle(new THREE.Vector3(0,1,0),THREE.MathUtils.degToRad(90));
      player.object.quaternion.slerp(quaternion,0.1);
    }
    else if (keyboard.pressed("down") && keyboard.pressed("left") || keyboard.pressed("S") && keyboard.pressed("A"))  {
      player.bb.max.z += 0.2;
      playAction = true;
      player.zSpeed = 0.07;
      if(keyboard.pressed("shift")){
        player.zSpeed = 0.14;
      }
      if(isHoldingBlock === true){
        objectHolded.position.lerp(new THREE.Vector3(0, 3, 4), 0.3);
      }
      quaternion.setFromAxisAngle(new THREE.Vector3(0,1,0),THREE.MathUtils.degToRad(0));
      player.object.quaternion.slerp(quaternion,0.1);  
    }
    else if (keyboard.pressed("up") && keyboard.pressed("left") || keyboard.pressed("W") && keyboard.pressed("A"))  {
      player.bb.min.x -= 0.2;
      playAction = true;
      player.xSpeed = -0.07;
      if(keyboard.pressed("shift")){
        player.xSpeed = -0.14;
      }
      if(isHoldingBlock === true){
        objectHolded.position.lerp(new THREE.Vector3(-4, 3, 0), 0.3);
      }
      if (cameraHolder.position.x <46.5 && cameraHolder.position.z < 3 && cameraHolder.position.z > -3 && cameraHolder.position.y < 0) {
        cameraHolder.translateY(0.07);
      }
      quaternion.setFromAxisAngle(new THREE.Vector3(0,1,0),THREE.MathUtils.degToRad(270));
      player.object.quaternion.slerp(quaternion,0.1);
    }
    else if (keyboard.pressed("up") && keyboard.pressed("right") || keyboard.pressed("W") && keyboard.pressed("D"))  {
      player.bb.min.z -= 0.2
      playAction = true;
      player.zSpeed = -0.07;
      if(keyboard.pressed("shift")){
        player.zSpeed = -0.14;
      }
      if(isHoldingBlock === true){
        objectHolded.position.lerp(new THREE.Vector3(0, 3, -4), 0.3);
      }
      quaternion.setFromAxisAngle(new THREE.Vector3(0,1,0),THREE.MathUtils.degToRad(180));
      player.object.quaternion.slerp(quaternion,0.1);
    }
    else if (keyboard.pressed("left") || keyboard.pressed("A")){
      player.bb.max.z += 0.2;
      player.bb.min.x -= 0.2;
      playAction = true;
      player.zSpeed = 0.05;
      player.xSpeed = -0.05;
      if(keyboard.pressed("shift")){
        player.zSpeed = 0.1;
        player.xSpeed = -0.1;
      }
      if(isHoldingBlock === true){
        objectHolded.position.lerp(new THREE.Vector3(-2, 3, 2), 0.3);
      }
      if (cameraHolder.position.x <46.5 && cameraHolder.position.z < 3 && cameraHolder.position.z > -3 && cameraHolder.position.y < 0) {
        cameraHolder.translateY(0.05);
      }
      quaternion.setFromAxisAngle(new THREE.Vector3(0,1,0),THREE.MathUtils.degToRad(315));
      player.object.quaternion.slerp(quaternion,0.1);
    }
    else if (keyboard.pressed("right") || keyboard.pressed("D"))  {
      player.bb.min.z -= 0.2;
      player.bb.max.x += 0.2;
      playAction = true;
      player.zSpeed = -0.05;
      player.xSpeed = 0.05;
      // faz o boneco correr (deixei para teste)
      if(keyboard.pressed("shift")){
        player.zSpeed = -0.1;
        player.xSpeed = 0.1;
      }
      if(isHoldingBlock === true){
        objectHolded.position.lerp(new THREE.Vector3(2, 3, -2), 0.3);
      }
      if (cameraHolder.position.x > 40.5 && cameraHolder.position.z < 3 && cameraHolder.position.z > -3 && cameraHolder.position.y > -6) {
        cameraHolder.translateY(-0.05);
      }
      quaternion.setFromAxisAngle(new THREE.Vector3(0,1,0),THREE.MathUtils.degToRad(135));
      player.object.quaternion.slerp(quaternion,0.1);
    }
    else if (keyboard.pressed("up") || keyboard.pressed("W")){
      player.bb.min.x -= 0.2;
      player.bb.min.z -= 0.2;
      playAction = true;
      player.zSpeed = -0.05;
      player.xSpeed = -0.05;
      if(keyboard.pressed("shift")){
        player.zSpeed = -0.1;
        player.xSpeed = -0.1;
      }
      if(isHoldingBlock === true){
        objectHolded.position.lerp(new THREE.Vector3(-2, 3, -2), 0.3);
      }
      if (cameraHolder.position.x <46.5 && cameraHolder.position.z < 3 && cameraHolder.position.z > -3 && cameraHolder.position.y < 0) {
        cameraHolder.translateY(0.05);
      }
      quaternion.setFromAxisAngle(new THREE.Vector3(0,1,0),THREE.MathUtils.degToRad(225));
      player.object.quaternion.slerp(quaternion,0.1);
    }
    else if (keyboard.pressed("down") || keyboard.pressed("S"))  {
      player.bb.max.z += 0.2;
      player.bb.max.x += 0.2;
      playAction = true;
      player.zSpeed = 0.05;
      player.xSpeed = 0.05;
      if(keyboard.pressed("shift")){
        player.zSpeed = 0.1;
        player.xSpeed = 0.1;
      }
      if(isHoldingBlock === true){
        objectHolded.position.lerp(new THREE.Vector3(2, 3, 2), 0.3);
      }
      if (cameraHolder.position.x > 40.5 && cameraHolder.position.z < 3 && cameraHolder.position.z > -3 && cameraHolder.position.y > -6) {
        cameraHolder.translateY(-0.05);
      }
      quaternion.setFromAxisAngle(new THREE.Vector3(0,1,0),THREE.MathUtils.degToRad(45));
      player.object.quaternion.slerp(quaternion,0.1);
    }
    //retorna a bb para o tamando normal e para o movimento do personagem na direção da colisão
    totalObjects.forEach(obj => {
    if(checkCollisions(obj, player.bb) && player.xSpeed < 0 && objectInWayX(player.bb, obj)){
      player.bb.min.x += 0.2;
      player.xSpeed = 0; 
    }
    if(checkCollisions(obj, player.bb) && player.zSpeed < 0 && objectInWayZ(player.bb, obj)){
      player.bb.min.z += 0.2;
      player.zSpeed = 0;
    }
    if(checkCollisions(obj, player.bb) && player.xSpeed > 0 && objectInWayX(player.bb, obj)){
      player.bb.max.x -= 0.2;
      player.xSpeed = 0;
    }
    if(checkCollisions(obj, player.bb) && player.zSpeed > 0 && objectInWayZ(player.bb, obj)){
      player.bb.max.z -= 0.2;
      player.zSpeed = 0;
    }
  
    
  });
  cameraHolder.translateZ(player.zSpeed);
  cameraHolder.translateX(player.xSpeed);
  return playAction;
}

//verifica se o objeto que está colidindo com o personagem é no eixo x
function objectInWayX(player, obj){
  let inWay = false;
  if(obj.min.z == player.min.z && obj.max.z == player.max.z){
    inWay = true;
  }
  if((obj.min.z > (player.min.z + 0.05) && obj.min.z < (player.max.z - 0.05))){
    inWay = true;
  }
  if((obj.max.z > (player.min.z + 0.05) && obj.max.z < (player.max.z - 0.05))){
    inWay = true;
  }
  if((player.max.z > (obj.max.z + 0.05) && player.min.z < (obj.min.z - 0.05))){
    inWay = true;
  }
  if((player.min.z > (obj.min.z + 0.05) && player.max.z < (obj.max.z - 0.05))){
    inWay = true;
  }
  return inWay;
}

//verifica se o objeto que está colidindo com o personagem é no eixo z
function objectInWayZ(player, obj){
  let inWay = false;
  if(obj.min.x == player.min.x && obj.max.x == player.max.z){
    inWay = true;
  }
  if((obj.min.x > (player.min.x + 0.05) && obj.min.x < (player.max.x - 0.05))){
    inWay = true;
  }
  if((obj.max.x > (player.min.x + 0.05) && obj.max.x < (player.max.x - 0.05))){
    inWay = true;
  }
  if((player.max.x > (obj.max.x + 0.05) && player.min.x < (obj.min.x - 0.05))){
    inWay = true;
  }
  if((player.min.x > (obj.min.x + 0.05) && player.max.x < (obj.max.x - 0.05))){
    inWay = true;
  }
  return inWay;
}
