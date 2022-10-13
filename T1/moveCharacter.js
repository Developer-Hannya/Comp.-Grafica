import * as THREE from  'three';
import checkCollisions from "./trabalho01.js";
import { keyboard } from './trabalho01.js';

export function moveCharacter(playAction, quaternion, player, cameraHolder, objects){
    // codigo para mover o personagem, a camera e colidir com objetos
    player.xSpeed = 0;
    player.zSpeed = 0;
    let filteredObjects = [];
    playAction = false;

    if (keyboard.pressed("down") && keyboard.pressed("right") || keyboard.pressed("S") && keyboard.pressed("D"))  {
      player.bb.max.x += 0.2;
      filteredObjects = objects.filter(obj => obj.min.x > player.object.position.x);
      playAction = true;
      player.xSpeed = 0.1;
      quaternion.setFromAxisAngle(new THREE.Vector3(0,1,0),THREE.MathUtils.degToRad(90));
      player.object.quaternion.slerp(quaternion,0.1);
    }
    else if (keyboard.pressed("down") && keyboard.pressed("left") || keyboard.pressed("S") && keyboard.pressed("A"))  {
      player.bb.max.z += 0.2;
      filteredObjects = objects.filter(obj => obj.min.z > player.object.position.z);
      playAction = true;
      player.zSpeed = 0.1;
      quaternion.setFromAxisAngle(new THREE.Vector3(0,1,0),THREE.MathUtils.degToRad(0));
      player.object.quaternion.slerp(quaternion,0.1);  
    }
    else if (keyboard.pressed("up") && keyboard.pressed("left") || keyboard.pressed("W") && keyboard.pressed("A"))  {
      player.bb.min.x -= 0.2;
      filteredObjects = objects.filter(obj => obj.max.x < player.object.position.x);
      playAction = true;
      player.xSpeed = -0.1;
      quaternion.setFromAxisAngle(new THREE.Vector3(0,1,0),THREE.MathUtils.degToRad(270));
      player.object.quaternion.slerp(quaternion,0.1);
    }
    else if (keyboard.pressed("up") && keyboard.pressed("right") || keyboard.pressed("W") && keyboard.pressed("D"))  {
      player.bb.min.z -= 0.2
      filteredObjects = objects.filter(obj => obj.max.z < player.object.position.z);
      playAction = true;
      player.zSpeed = -0.1;
      quaternion.setFromAxisAngle(new THREE.Vector3(0,1,0),THREE.MathUtils.degToRad(180));
      player.object.quaternion.slerp(quaternion,0.1);
    }
    else if (keyboard.pressed("left") || keyboard.pressed("A")){
      player.bb.max.z += 0.2;
      player.bb.min.x -= 0.2;
      filteredObjects = objects.filter(obj => obj.min.z > player.object.position.z || obj.max.x < player.object.position.x);
      playAction = true;
      player.zSpeed = 0.05;
      player.xSpeed = -0.05;
      quaternion.setFromAxisAngle(new THREE.Vector3(0,1,0),THREE.MathUtils.degToRad(315));
      player.object.quaternion.slerp(quaternion,0.1);
    }
    else if (keyboard.pressed("right") || keyboard.pressed("D"))  {
      player.bb.min.z -= 0.2;
      player.bb.max.x += 0.2;
      filteredObjects = objects.filter(obj => obj.max.z < player.object.position.z || obj.min.x > player.object.position.x);
      playAction = true;
      player.zSpeed = -0.05;
      player.xSpeed = 0.05;
      quaternion.setFromAxisAngle(new THREE.Vector3(0,1,0),THREE.MathUtils.degToRad(135));
      player.object.quaternion.slerp(quaternion,0.1);
    }
    else if (keyboard.pressed("up") || keyboard.pressed("W")){
      player.bb.min.x -= 0.2;
      player.bb.min.z -= 0.2;
      filteredObjects = objects.filter(obj => obj.max.x < player.object.position.x || obj.max.z < player.object.position.z);
      playAction = true;
      player.zSpeed = -0.05;
      player.xSpeed = -0.05;
      quaternion.setFromAxisAngle(new THREE.Vector3(0,1,0),THREE.MathUtils.degToRad(225));
      player.object.quaternion.slerp(quaternion,0.1);
    }
    else if (keyboard.pressed("down") || keyboard.pressed("S"))  {
      player.bb.max.z += 0.2;
      player.bb.max.x += 0.2;
      filteredObjects = objects.filter(obj => obj.min.z > player.object.position.z || obj.min.x > player.object.position.x);
      playAction = true;
      player.zSpeed = 0.05;
      player.xSpeed = 0.05;
      quaternion.setFromAxisAngle(new THREE.Vector3(0,1,0),THREE.MathUtils.degToRad(45));
      player.object.quaternion.slerp(quaternion,0.1);
    }

//   if (keyboard.pressed("down") && keyboard.pressed("right") || keyboard.pressed("S") && keyboard.pressed("D"))  {
//     player.bb.max.z += 0.2;
//     player.bb.max.x += 0.2;
//     filteredObjects = objects.filter(obj => obj.min.z > player.object.position.z || obj.min.x > player.object.position.x);
//     playAction = true;
//     player.zSpeed = 0.05;
//     player.xSpeed = 0.05;
//     quaternion.setFromAxisAngle(new THREE.Vector3(0,1,0),THREE.MathUtils.degToRad(45));
//     player.object.quaternion.slerp(quaternion,0.1);
//   }
//   else if (keyboard.pressed("down") && keyboard.pressed("left") || keyboard.pressed("S") && keyboard.pressed("A"))  {
//     player.bb.max.z += 0.2;
//     player.bb.min.x -= 0.2;
//     filteredObjects = objects.filter(obj => obj.min.z > player.object.position.z || obj.max.x < player.object.position.x);
//     playAction = true;
//     player.zSpeed = 0.05;
//     player.xSpeed = -0.05;
//     quaternion.setFromAxisAngle(new THREE.Vector3(0,1,0),THREE.MathUtils.degToRad(315));
//     player.object.quaternion.slerp(quaternion,0.1);
//   }
//   else if (keyboard.pressed("up") && keyboard.pressed("left") || keyboard.pressed("W") && keyboard.pressed("A"))  {
//     player.bb.min.x -= 0.2;
//     player.bb.min.z -= 0.2;
//     filteredObjects = objects.filter(obj => obj.max.x < player.object.position.x || obj.max.z < player.object.position.z);
//     playAction = true;
//     player.zSpeed = -0.05;
//     player.xSpeed = -0.05;
//     quaternion.setFromAxisAngle(new THREE.Vector3(0,1,0),THREE.MathUtils.degToRad(225));
//     player.object.quaternion.slerp(quaternion,0.1);
//   }
//   else if (keyboard.pressed("up") && keyboard.pressed("right") || keyboard.pressed("W") && keyboard.pressed("D"))  {
//     player.bb.min.z -= 0.2;
//     player.bb.max.x += 0.2;
//     filteredObjects = objects.filter(obj => obj.max.z < player.object.position.z || obj.min.x > player.object.position.x);
//     playAction = true;
//     player.zSpeed = -0.05;
//     player.xSpeed = 0.05;
//     quaternion.setFromAxisAngle(new THREE.Vector3(0,1,0),THREE.MathUtils.degToRad(135));
//     player.object.quaternion.slerp(quaternion,0.1);
//   } else if (keyboard.pressed("left") || keyboard.pressed("A")){
//     player.bb.min.x -= 0.2;
//     filteredObjects = objects.filter(obj => obj.max.x < player.object.position.x);
//     playAction = true;
//     player.xSpeed = -0.1;
//     quaternion.setFromAxisAngle(new THREE.Vector3(0,1,0),THREE.MathUtils.degToRad(270));
//     player.object.quaternion.slerp(quaternion,0.1);
//   }
//  else if (keyboard.pressed("right") || keyboard.pressed("D"))  {
//     player.bb.max.x += 0.2;
//     filteredObjects = objects.filter(obj => obj.min.x > player.object.position.x);
//     playAction = true;
//     player.xSpeed = 0.1;
//     quaternion.setFromAxisAngle(new THREE.Vector3(0,1,0),THREE.MathUtils.degToRad(90));
//     player.object.quaternion.slerp(quaternion,0.1);
//   }
//   else if (keyboard.pressed("up") || keyboard.pressed("W")){
//     player.bb.min.z -= 0.2
//     filteredObjects = objects.filter(obj => obj.max.z < player.object.position.z);
//     playAction = true;
//     player.zSpeed = -0.1;
//     quaternion.setFromAxisAngle(new THREE.Vector3(0,1,0),THREE.MathUtils.degToRad(180));
//     player.object.quaternion.slerp(quaternion,0.1);
//   }
//   else if (keyboard.pressed("down") || keyboard.pressed("S"))  {
//     player.bb.max.z += 0.2;
//     filteredObjects = objects.filter(obj => obj.min.z > player.object.position.z);
//     playAction = true;
//     player.zSpeed = 0.1;
//     quaternion.setFromAxisAngle(new THREE.Vector3(0,1,0),THREE.MathUtils.degToRad(0));
//     player.object.quaternion.slerp(quaternion,0.1);
//   }
  // filteredObjects.forEach(obj => {
  //   if(checkCollisions(obj, player.bb)){
  //       if(keyboard.pressed("W") || keyboard.pressed("up")){
  //         console.log(player.bb.max.z-player.bb.min.z);
  //         player.bb.min.z += 0.2;
  //         player.zSpeed = 0;
  //       } 
  //       if(keyboard.pressed("D") || keyboard.pressed("right")){
  //         player.bb.max.x -= 0.2;
  //         player.xSpeed = 0;
  //       } 
  //       if(keyboard.pressed("A") || keyboard.pressed("left")){
  //         player.bb.min.x += 0.2;
  //         player.xSpeed = 0;
  //       } 
  //       if(keyboard.pressed("S") || keyboard.pressed("down")){
  //         player.bb.max.z -= 0.2;
  //         player.zSpeed = 0;
  //       }     
  //   }
  // });
  filteredObjects.forEach(obj => {
    if(obj.max.x < player.object.position.x){
      if(checkCollisions(obj, player.bb)){
        if(player.xSpeed < 0){
          console.log(player.bb, obj);
          //player.object.translateX(0.000001);
          player.bb.min.x += 0.2;
          player.xSpeed = 0;
        } 
      }
    }
    if(obj.max.z < player.object.position.z){
      if(checkCollisions(obj, player.bb)){
        if(player.zSpeed < 0){
          //player.object.translateZ(0.000001);
          player.bb.min.z += 0.2;
          player.zSpeed = 0;
        } 
      }
    }
    if(obj.min.x > player.object.position.x){
      if(checkCollisions(obj, player.bb)){
        if(player.xSpeed > 0){
          if(objectInWayX(player.bb, obj)){
            //player.object.translateX(-0.000001);
            player.bb.max.x -= 0.2;
            player.xSpeed = 0;
          }
        } 
      }
    }
    if(obj.min.z > player.object.position.z){
      if(checkCollisions(obj, player.bb)){
        if(player.zSpeed > 0){
            //player.object.translateZ(-0.00001);
          player.bb.max.z -= 0.2;
          player.zSpeed = 0;
        }  
      }
    }
    
  });
  cameraHolder.translateZ(player.zSpeed);
  cameraHolder.translateX(player.xSpeed);
  return playAction;
}

function objectInWayX(player, obj){
  return ((obj.min.z > player.min.z && obj.min.z < player.max.z) || (obj.max.z > player.min.z && obj.max.z < player.max.z) || (player.max.z > obj.min.z && player.max.z < obj.max.z) || (player.min.z > obj.min.z && player.min.z < obj.max.z));
}
