import * as THREE from  'three';
import {scene} from './trabalho02.js';
import {cameraHolder} from './camera.js';

    var dirLightTarget = new THREE.Object3D();
    var dirLight = new THREE.DirectionalLight('white', 0.7);

export function loadLight(){
    //const light = new initDefaultBasicLight(scene, true, new THREE.Vector3(100,150,-50), 130, 4000, 0.1, 1000);
    //luz direcional
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 1000;
    dirLight.shadow.camera.left = -20;
    dirLight.shadow.camera.right = 20;
    dirLight.shadow.camera.bottom = -22;
    dirLight.shadow.camera.top = 20;
    scene.add(dirLight);
    //let dirLightHelper = new THREE.DirectionalLightHelper(dirLight);
    //scene.add(dirLightHelper);
    
    //objeto para onde a luz direcional aponta
    scene.add(dirLightTarget);
    cameraHolder.add(dirLightTarget);
    dirLightTarget.translateX(-10);
    dirLightTarget.translateY(-5);
    dirLightTarget.translateZ(10);
    dirLight.target = dirLightTarget;
    dirLight.target.updateMatrixWorld();
    
    // Luz ambiente
    let ambientLight = new THREE.AmbientLight('white', 0.45);
    scene.add(ambientLight);
}

//atualiza a posição da luz
export function updateLight() {
    let dirX = cameraHolder.position.x;
    let dirZ = cameraHolder.position.z;
    dirLight.position.set(dirX, 15, dirZ);
    //dirLightHelper.update();
  }