import * as THREE from  'three';
import { scene } from './trabalho02.js';

export function createLadder() {
    
    // ÁREAS 1 E 2
    //degraus
    const geometry = new THREE.BoxGeometry( 5, 0.8, 0.8 );
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

    //ÁREA 2
    let stepHeight2 = -0.4;
    let stepPlaneHeight2 = 0;
    
    for(let i = +20.4; i <= 20 + 5; i += 0.8){
        const step = new THREE.Mesh( geometry, ladderMaterial );
        step.position.set(0, stepHeight2, i);
        step.castShadow = true;
        step.receiveShadow = true;

        const stepPlane = new THREE.Mesh( stepPlaneGeometry, stepMaterial );
        stepPlane.position.set(0, stepPlaneHeight2, i);
        stepPlane.castShadow = true;
        stepPlane.receiveShadow = true;
        
        scene.add(step);
        stepHeight2 -= 0.4;
        scene.add(stepPlane);
        stepPlaneHeight2 -= 0.4;
    }

    //ÁREA 3 E ÁREA FINAL
    //degraus
    const geometry3 = new THREE.BoxGeometry( 0.8, 0.8, 5 );
    const ladderMaterial3 = new THREE.MeshBasicMaterial( {color: "rgb(182,144,95)"} );
    //plano em cima do degrau
    const stepPlaneGeometry3 = new THREE.BoxGeometry( 0.8, 0.02, 5 );
    const stepMaterial3 = new THREE.MeshBasicMaterial( {color: "rgb(222,184,135)"} );


    //ÁREA 3
    let stepHeight3 = -0.4;
    let stepPlaneHeight3 = 0;
    
    for(let i = +40.4; i <= 40 + 5; i += 0.8){
        const step = new THREE.Mesh( geometry3, ladderMaterial3 );
        step.position.set(i, stepHeight3, 0);
        step.castShadow = true;
        step.receiveShadow = true;

        const stepPlane = new THREE.Mesh( stepPlaneGeometry3, stepMaterial3 );
        stepPlane.position.set(i, stepPlaneHeight3, 0);
        stepPlane.castShadow = true;
        stepPlane.receiveShadow = true;
        
        scene.add(step);
        stepHeight3 -= 0.4;
        scene.add(stepPlane);
        stepPlaneHeight3 -= 0.4;
    }

    //ÁREA final
    let stepHeight4 = 0;
    let stepPlaneHeight4 = 0.4;
    
    for(let i = -40.4; i >= -40 - 5; i -= 0.8){
        const step = new THREE.Mesh( geometry3, ladderMaterial3 );
        step.position.set(i, stepHeight4, 0);
        step.castShadow = true;
        step.receiveShadow = true;

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