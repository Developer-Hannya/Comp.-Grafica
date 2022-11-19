import * as THREE from  'three';
import { CSG } from '../libs/other/CSGMesh.js';
import { setDefaultMaterial } from '../libs/util/util.js';
import { cameraHolder } from './camera.js';
import { createBBHelper, escadas, player } from './trabalho02.js';

function updateObject(mesh)
{
   mesh.matrixAutoUpdate = false;
   mesh.updateMatrix();
}
export function createStaircase() {
import { scene } from './trabalho02.js';
export function createLadder() {
    
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
    const ladderMaterial = new THREE.MeshBasicMaterial( {color: "rgb(182,144,95)"} );
    //plano em cima do degrau
    const stepPlaneGeometry = new THREE.BoxGeometry( 5, 0.02, 0.8 );
    const stepMaterial = new THREE.MeshBasicMaterial( {color: "rgb(222,184,135)"} );

    //ÁREA 1
    let stepHeight1 = 0.0;
    let stepPlaneHeight1 = 0.4;

    for(let i = -20.4; i >= -20 - 5; i -= 0.8){
        const step = new THREE.Mesh( geometry, ladderMaterial );
        step.position.set(0, stepHeight1, i);
        step.castShadow = true;
        step.receiveShadow = true;

        const stepPlane = new THREE.Mesh( stepPlaneGeometry, stepMaterial );
        stepPlane.position.set(0, stepPlaneHeight1, i);
        stepPlane.castShadow = true;
        stepPlane.receiveShadow = true;
        
        scene.add(step);
        stepHeight1 += 0.4;
        scene.add(stepPlane);
        stepPlaneHeight1 += 0.4;
    }

    //ÁREA 3 E ÁREA FINAL
    //degraus
    const geometry3 = new THREE.BoxGeometry( 0.8, 0.8, 5 );
    //const ladderMaterial3 = new THREE.MeshBasicMaterial( {color: "rgb(182,144,95)"} );
    const ladderMaterial3 = new THREE.MeshLambertMaterial({
        color: "rgb(182,144,95)",
    });

    //plano em cima do degrau
    const stepPlaneGeometry3 = new THREE.BoxGeometry( 0.8, 0.05, 5 );
    const stepMaterial3 = new THREE.MeshLambertMaterial({
        color: "rgb(222,184,135)",
    });


    //ÁREA 3
    let stepHeight3 = -0.4;
    let stepPlaneHeight3 = 0;
    
    for(let i = +39.6; i <= 40 + 10; i += 0.8){
        const step = new THREE.Mesh( geometry3, ladderMaterial3 );
        step.position.set(i, stepHeight3, 0);
        step.castShadow = true;
        step.receiveShadow = true;

        const stepPlane = new THREE.Mesh( stepPlaneGeometry3, stepMaterial3 );
        stepPlane.position.set(i, stepPlaneHeight3, 0);
        stepPlane.castShadow = true;
        stepPlane.receiveShadow = true;
        
        scene.add(step);
        stepHeight3 -= 0.8;
        scene.add(stepPlane);
        stepPlaneHeight3 -= 0.8;
    }

    //ÁREA final
    let stepHeight4 = 0;
    let stepPlaneHeight4 = 0.4;
    
    for(let i = -40.4; i >= -40 - 5; i -= 0.8){
        const step = new THREE.Mesh( geometry3, ladderMaterial3 );
        step.position.set(i, stepHeight4, 0);
        step.castShadow = true;
        step.receiveShadow = true;

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

        if(this.direction == "n"){
            this.staircaseBox.min.z += 1.2;
            // this.staircaseBox.max.z += 1.2;
        }
        if(this.direction == "s"){
            this.children[0].rotateY(Math.PI);
            // this.staircaseBox.min.z -= 1.2;
            this.staircaseBox.max.z -= 1.2;
        }
        if(this.direction == "w"){
            this.children[0].rotateY(Math.PI/2);
            this.staircaseBox.min.x += 1.2;
            // this.staircaseBox.max.x += 1.2;
        }
        if(this.direction == "e"){
            this.children[0].rotateY(3*Math.PI/2);
            // this.staircaseBox.min.x -= 1.2;
            this.staircaseBox.max.x -= 1.2;
        }
       
        createBBHelper(this.staircaseBox, 'yellow')
        escadas.push(this)
    }

    setPlayerYPos(){
        if(this.staircaseBox && player.bb.intersectsBox(this.staircaseBox)){
            //player.object.position seria a posição em relação ao cameraHolder(sempre 0, 0, 0)
            //local to world pega a posição do jogador, world to local pega a posição em relação à escada
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
        const stepPlane = new THREE.Mesh( stepPlaneGeometry3, stepMaterial3 );
        stepPlane.position.set(i, stepPlaneHeight4, 0);
        stepPlane.castShadow = true;
        stepPlane.receiveShadow = true;
        scene.add(step);
        stepHeight4 += 0.4;
        scene.add(stepPlane);
        stepPlaneHeight4 += 0.4;
    }
}