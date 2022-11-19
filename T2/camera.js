import * as THREE from  'three';
import {SecondaryBox} from "../libs/util/util.js";


var message = new SecondaryBox("press 'C' to change camera type");
  var camLook = new THREE.Vector3(-1.0, -1.0, -1.0);
  var camPos  = new THREE.Vector3(10, 10, 10);
  var camUp   = new THREE.Vector3(0, 1, 0);
  var aspect = window.innerWidth / window.innerHeight;
  var d = 6.7;
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
  } else {
    // PerspectiveCamera( fov, aspect, near, far)
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  }
  camera.position.copy(posit);
  camera.lookAt(cameraHolder.position);
  cameraHolder.add(camera);
}

export function updateCamera()
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
