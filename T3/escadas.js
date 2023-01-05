import * as THREE from  'three';
import { Vector3 } from '../build/three.module.js';
import { CSG } from '../libs/other/CSGMesh.js';
import { setDefaultMaterial } from '../libs/util/util.js';
import { cameraHolder } from './camera.js';
import { createBBHelper, escadas, parede, player } from './trabalho03.js';

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
        this.direction = direction;
        this.add(createStaircase());
        this.staircaseBox = new THREE.Box3();
        let size = new THREE.Vector3(5.6, 10, 5.6);
        this.staircaseBox.setFromCenterAndSize(this.position, size);
        this.paredeBb1 = new THREE.Box3();
        this.paredeBb2 = new THREE.Box3();
        let wallSize1 = new THREE.Vector3(1, 10, 7.6);
        let wallSize2 = new THREE.Vector3(7.6, 10, 1);

        if(this.direction == "n"){
            this.staircaseBox.min.z += 1.2;
            // this.staircaseBox.max.z += 1.2;
            let pos1 = new Vector3(this.position.x - 3.3, this.position.y, this.position.z + 0.5);
            let pos2 = new Vector3(this.position.x + 3.3, this.position.y, this.position.z + 0.5);
            this.paredeBb1.setFromCenterAndSize(pos1, wallSize1);
            this.paredeBb2.setFromCenterAndSize(pos2, wallSize1);
            //createBBHelper(this.paredeBb1, "green");
            //createBBHelper(this.paredeBb2, "green");
            parede.push({bb: this.paredeBb1}, {bb: this.paredeBb2})

        }
        if(this.direction == "s"){
            this.children[0].rotateY(Math.PI);
            // this.staircaseBox.min.z -= 1.2;
            this.staircaseBox.max.z -= 1.2;
            let pos1 = new Vector3(this.position.x - 3.3, this.position.y, this.position.z - 0.5);
            let pos2 = new Vector3(this.position.x + 3.3, this.position.y, this.position.z - 0.5);
            this.paredeBb1.setFromCenterAndSize(pos1, wallSize1);
            this.paredeBb2.setFromCenterAndSize(pos2, wallSize1);
            //createBBHelper(this.paredeBb1, "green");
            //createBBHelper(this.paredeBb2, "green");
            parede.push({bb: this.paredeBb1}, {bb: this.paredeBb2})
        }
        if(this.direction == "w"){
            this.children[0].rotateY(Math.PI/2);
            this.staircaseBox.min.x += 1.2;
            // this.staircaseBox.max.x += 1.2;
            let pos1 = new Vector3(this.position.x - 0.5, this.position.y, this.position.z - 3.3);
            let pos2 = new Vector3(this.position.x - 0.5, this.position.y, this.position.z + 3.3);
            this.paredeBb1.setFromCenterAndSize(pos1, wallSize2);
            this.paredeBb2.setFromCenterAndSize(pos2, wallSize2);
            //createBBHelper(this.paredeBb1, "green");
            //createBBHelper(this.paredeBb2, "green");
            parede.push({bb: this.paredeBb1}, {bb: this.paredeBb2})
        }
        if(this.direction == "e"){
            this.children[0].rotateY(3*Math.PI/2);
            // this.staircaseBox.min.x -= 1.2;
            this.staircaseBox.max.x -= 1.2;
            let pos1 = new Vector3(this.position.x - 0.5, this.position.y, this.position.z - 3.3);
            let pos2 = new Vector3(this.position.x - 0.5, this.position.y, this.position.z + 3.3);
            this.paredeBb1.setFromCenterAndSize(pos1, wallSize2);
            this.paredeBb2.setFromCenterAndSize(pos2, wallSize2);
            //createBBHelper(this.paredeBb1, "green");
            //createBBHelper(this.paredeBb2, "green");
            parede.push({bb: this.paredeBb1}, {bb: this.paredeBb2})
        }
       
        //createBBHelper(this.staircaseBox, 'yellow')
        escadas.push(this)
    }

    setPlayerYPos(){
        if(this.staircaseBox && player.bb.intersectsBox(this.staircaseBox)){
            //player.object.position seria a posição em relação ao cameraHolder(sempre 0, 0, 0)
            let playerGlobalPos = new THREE.Vector3();
            player.object.getWorldPosition(playerGlobalPos);
            let staircaseStartPos = this.position.clone();
            let yDiff;
            let playerX;
            let playerY;
            let playerZ;
            staircaseStartPos.y -= 1.4;

            switch (this.direction){
                case "n":
                    staircaseStartPos.z += 4;
                    playerZ = staircaseStartPos.z - playerGlobalPos.z ;
                    playerY = this.position.y - 1.4 + playerZ/2;
                    break;

                case "s":
                    staircaseStartPos.z -= 4;
                    playerZ = staircaseStartPos.z - playerGlobalPos.z ;
                    playerY = this.position.y - 1.4 + playerZ/2;
                    break;

                case "e":
                    staircaseStartPos.x -= 4;
                    playerX = staircaseStartPos.x - playerGlobalPos.x ;
                    playerY = this.position.y - 1.4 + playerX/2;
                    break;

                case "w":
                    staircaseStartPos.x += 4;
                    playerX = staircaseStartPos.x - playerGlobalPos.x ;
                    playerY = this.position.y - 1.4 + playerX/2;
                    break;
            }
         
            yDiff = playerY - playerGlobalPos.y;
            cameraHolder.translateY(yDiff);
        }     
    }

    static updatePlayerY(){
        escadas.forEach( escada => {
            escada.setPlayerYPos();
        });
    }
}