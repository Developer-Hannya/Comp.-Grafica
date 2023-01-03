import * as THREE from  'three';
import checkCollisions from "./appMobile.js";
import {fwdValue, bkdValue, rgtValue, lftValue} from './appMobile.js';
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
    if (bkdValue > 0 && bkdValue < 0.85 && rgtValue > 0 && rgtValue < 0.85)  {
      player.bb.max.x += 0.2;
      playAction = true;
      player.xSpeed = 0.07;
      if(isHoldingBlock === true){
        objectHolded.position.lerp(new THREE.Vector3(4, 3, 0), 0.3);
      }
      quaternion.setFromAxisAngle(new THREE.Vector3(0,1,0),THREE.MathUtils.degToRad(90));
      player.object.quaternion.slerp(quaternion,0.1);
    }
    else if (bkdValue > 0 && bkdValue < 0.85 && lftValue > 0 && lftValue < 0.85)  {
      player.bb.max.z += 0.2;
      playAction = true;
      player.zSpeed = 0.07;
      if(isHoldingBlock === true){
        objectHolded.position.lerp(new THREE.Vector3(0, 3, 4), 0.3);
      }

      quaternion.setFromAxisAngle(new THREE.Vector3(0,1,0),THREE.MathUtils.degToRad(0));
      player.object.quaternion.slerp(quaternion,0.1);  
    }
    else if (fwdValue > 0 && fwdValue < 0.85 && lftValue > 0 && lftValue < 0.85)  {
      player.bb.min.x -= 0.2;
      playAction = true;
      player.xSpeed = -0.07;
      if(isHoldingBlock === true){
        objectHolded.position.lerp(new THREE.Vector3(-4, 3, 0), 0.3);
      }
      quaternion.setFromAxisAngle(new THREE.Vector3(0,1,0),THREE.MathUtils.degToRad(270));
      player.object.quaternion.slerp(quaternion,0.1);
    }
    else if (fwdValue > 0 && fwdValue < 0.85 && rgtValue > 0 && rgtValue < 0.85)  {
      player.bb.min.z -= 0.2
      playAction = true;
      player.zSpeed = -0.07;
      if(isHoldingBlock === true){
        objectHolded.position.lerp(new THREE.Vector3(0, 3, -4), 0.3);
      }
      quaternion.setFromAxisAngle(new THREE.Vector3(0,1,0),THREE.MathUtils.degToRad(180));
      player.object.quaternion.slerp(quaternion,0.1);
    }
    else if (lftValue >= 0.85 && lftValue <= 1){
      player.bb.max.z += 0.2;
      player.bb.min.x -= 0.2;
      playAction = true;
      player.zSpeed = 0.05;
      player.xSpeed = -0.05;
      if(isHoldingBlock === true){
        objectHolded.position.lerp(new THREE.Vector3(-2, 3, 2), 0.3);
      }
      quaternion.setFromAxisAngle(new THREE.Vector3(0,1,0),THREE.MathUtils.degToRad(315));
      player.object.quaternion.slerp(quaternion,0.1);
    }
    else if (rgtValue >= 0.85 && rgtValue <= 1)  {
      player.bb.min.z -= 0.2;
      player.bb.max.x += 0.2;
      playAction = true;
      player.zSpeed = -0.05;
      player.xSpeed = 0.05;
      if(isHoldingBlock === true){
        objectHolded.position.lerp(new THREE.Vector3(2, 3, -2), 0.3);
      }
      quaternion.setFromAxisAngle(new THREE.Vector3(0,1,0),THREE.MathUtils.degToRad(135));
      player.object.quaternion.slerp(quaternion,0.1);
    }
    else if (fwdValue >= 0.85 && fwdValue <= 1){
      player.bb.min.x -= 0.2;
      player.bb.min.z -= 0.2;
      playAction = true;
      player.zSpeed = -0.05;
      player.xSpeed = -0.05;
      if(isHoldingBlock === true){
        objectHolded.position.lerp(new THREE.Vector3(-2, 3, -2), 0.3);
      }
      quaternion.setFromAxisAngle(new THREE.Vector3(0,1,0),THREE.MathUtils.degToRad(225));
      player.object.quaternion.slerp(quaternion,0.1);
    }
    else if (bkdValue >= 0.85 && bkdValue <= 1)  {
      player.bb.max.z += 0.2;
      player.bb.max.x += 0.2;
      playAction = true;
      player.zSpeed = 0.05;
      player.xSpeed = 0.05;
      if(isHoldingBlock === true){
        objectHolded.position.lerp(new THREE.Vector3(2, 3, 2), 0.3);
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
