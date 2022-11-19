import * as THREE from  'three';
import { CSG } from '../libs/other/CSGMesh.js';
import { setDefaultMaterial } from '../libs/util/util.js';
import { cameraHolder } from './camera.js';
import { createBBHelper, player } from './trabalho02.js';

function updateObject(mesh)
{
   mesh.matrixAutoUpdate = false;
   mesh.updateMatrix();
}

export function createStaircase() {
    
    const geometry = new THREE.BoxGeometry( 5, 0.8, 0.8 );
    const staircaseMaterial = new THREE.MeshBasicMaterial( {color: "rgb(182,144,95)"} );

    let stepHeight1 = -1.2;
    let stepPlaneHeight1 = -0.8;
    let centerStep = new THREE.Mesh(geometry, staircaseMaterial);
    let centerStepCSG = CSG.fromMesh(centerStep);

    for(let i = -2.8; i <= 2.8; i += 0.8){
        if(i !== 0){
            let step = new THREE.Mesh( geometry, staircaseMaterial );
            step.position.set(0, stepHeight1, i);
            step.castShadow = true;
            step.receiveShadow = true;
            
            updateObject(step);
            let stepCSG = CSG.fromMesh(step);
            centerStepCSG = centerStepCSG.union(stepCSG);

            stepHeight1 += 0.4;
            stepPlaneHeight1 += 0.4;
        }
    }

    let auxMat = new THREE.Matrix4();
    centerStep = CSG.toMesh(centerStepCSG, auxMat);
    centerStep.material = setDefaultMaterial("rgb(222,184,135)");
    centerStep.receiveShadow = true;
    centerStep.rotateY(Math.PI);
    // scene.add(centerStep);
    return(centerStep);
    
   
}

export class Staircase extends THREE.Object3D{
    constructor(x, y, z, direction){
        super();
        this.translateX(x);
        this.translateY(y);
        this.translateZ(z);
        this.add(createStaircase());
        this.staircaseBox = new THREE.Box3();
        let size = new THREE.Vector3(5.6, 5.6, 5.6);
        this.staircaseBox.setFromCenterAndSize(this.position, size);
        if(direction == "s"){
            this.staircaseBox.min.z += 1.2;
            this.staircaseBox.max.z += 1.2;
        }
        if(direction == "n"){
            this.staircaseBox.min.z -= 1.2;
            this.staircaseBox.max.z -= 1.2;
        }
        if(direction == "w"){
            this.staircaseBox.min.x -= 1.2;
            this.staircaseBox.max.x -= 1.2;
        }
        if(direction == "e"){
            this.staircaseBox.min.x += 1.2;
            this.staircaseBox.max.x += 1.2;
        }
       
        createBBHelper(this.staircaseBox, 'yellow')
        
    }

    setPlayerYPos(){
        if(this.staircaseBox && player.bb.intersectsBox(this.staircaseBox)){
            let staircaseStartPos = this.position.clone();
            staircaseStartPos.y -= 1.4;
            staircaseStartPos.z += 2.8 +1.2;

            //player.object.position seria a posição em relação ao cameraHolder(sempre 0, 0, 0)
            //local to world pega a posição do jogador, world to local pega a posição em relação à escada
            let playerGlobalPos = new THREE.Vector3();
            player.object.getWorldPosition(playerGlobalPos);

            let playerZ = staircaseStartPos.z - playerGlobalPos.z ;
            let playerY = this.position.y - 1.4 + playerZ/2;

            let yDiff = playerY - playerGlobalPos.y;
            cameraHolder.translateY(yDiff);
        }
            
    }
}