import * as THREE from  'three';
import { CSG } from '../libs/other/CSGMesh.js';
import { setDefaultMaterial } from '../libs/util/util.js';
import { scene } from './trabalho02.js';

function updateObject(mesh)
{
   mesh.matrixAutoUpdate = false;
   mesh.updateMatrix();
}

export function createLadder() {
    
    // ÁREAS 1 E 2
    //degraus
    const geometry = new THREE.BoxGeometry( 5, 0.8, 0.8 );
    const ladderMaterial = new THREE.MeshBasicMaterial( {color: "rgb(182,144,95)"} );

    //ÁREA 1
    let stepHeight1 = -1.2;
    let stepPlaneHeight1 = -0.8;
    let centerStep = new THREE.Mesh(geometry, ladderMaterial);
    let centerStepCSG = CSG.fromMesh(centerStep);

    for(let i = -2.8; i <= 2.8; i += 0.8){
        if(i !== 0){
            let step = new THREE.Mesh( geometry, ladderMaterial );
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

    let stepHeight2 = 1.2;
    let stepPlaneHeight2 = 0.8;
    let centerStep2 = new THREE.Mesh(geometry, ladderMaterial);
    let centerStepCSG2 = CSG.fromMesh(centerStep2);

    for(let i = 0.8; i <= 2.8; i += 0.8){
        if(i !== 0){
            let step = new THREE.Mesh( geometry, ladderMaterial );
            step.translateX(-10);
            step.rotateX(90);
            step.position.set(0, stepHeight2, i);
            step.castShadow = true;
            step.receiveShadow = true;
            
            updateObject(step);
            let stepCSG2 = CSG.fromMesh(step);
            centerStepCSG2 = centerStepCSG2.union(stepCSG2);

            stepHeight2 += 0.4;
            stepPlaneHeight2 += 0.4;
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
    constructor(){
        super();
        this.add(createLadder());
    }
}