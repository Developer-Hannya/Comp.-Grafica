import * as THREE from  'three';
import {keyboard, renderer, scene} from './trabalho02.js';
import {SecondaryBox} from "../libs/util/util.js";

var message = new SecondaryBox("press 'C' to change camera type - Orthographic");
  //var camLook = new THREE.Vector3(-1.0, -1.0, -1.0);
  var camPos  = new THREE.Vector3(10,10,10);
  //setFromSphericalCoords(distance, angle, angle)
  camPos.setFromSphericalCoords(18, Math.PI / 3, Math.PI / 4); // changes the angle of the camera to an dimetric perspective
  var camUp   = new THREE.Vector3(0, 1, 0);
  var aspect = window.innerWidth / window.innerHeight;
  var d = 6.8;
  export var camera = new THREE.OrthographicCamera(- d * aspect, d * aspect, d, - d, 0.1, 1000);
  export var cameraHolder = new THREE.Object3D();
  cameraHolder.position.set(0,0,0);
  cameraHolder.add(camera);
  camera.lookAt(cameraHolder);

export function changeProjection()
{
  // store the previous position of the camera
  var posit = new THREE.Vector3().copy(camera.position);

  if (camera instanceof THREE.PerspectiveCamera)
  {
    // OrthographicCamera( left, right, top, bottom, near, far )
    camera = new THREE.OrthographicCamera(- d * aspect, d * aspect, d, - d, 0.1, 1000);
    message.changeMessage("press 'C' to change camera type - Orthographic");
  } else {
    // PerspectiveCamera( fov, aspect, near, far)
    camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
    message.changeMessage("press 'C' to change camera type - Perspective");
  }
  camera.position.copy(posit);
  camera.lookAt(cameraHolder.position);
  cameraHolder.add(camera);
}

export function updateCamera()
{
  // atualiza a câmera
  //onWindowResize(camera, renderer);
  camera.position.copy(camPos); 
  if(keyboard.pressed("pageup")){
    camera.translateY(0.1);
    camPos.y += 0.1;
  }
  if(keyboard.pressed("pagedown")){
    camera.translateY(-0.1);
    camPos.y += -0.1;
  }
  camera.up.copy(camUp);
  if(!keyboard.pressed("Q"))
    camera.lookAt(cameraHolder.position);

  //var pos = new THREE.Vector3();
  //cameraHolder.getWorldPosition(pos); // salva a posição global do objeto na variavel 'pos'
  // message.changeMessage("Pos: {" + pos.x + ", " + pos.y + ", " + pos.z + "} " + 
  //                        "/ Quaternion: {" + quaternion.w + "} ");
}

// Responde as mudanças de proporção da janela
window.addEventListener( 'resize', function(){
  if (camera instanceof THREE.PerspectiveCamera)
  {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
  }
  else {
    let newAspect = window.innerWidth / window.innerHeight;
    camera.left = - d * newAspect;
    camera.right = d * newAspect;
    camera.top = d;
    camera.bottom = -d;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
  }
} );
