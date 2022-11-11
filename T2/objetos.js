import * as THREE from  'three';
import {scene} from './trabalho02.js';
import {cameraHolder} from './camera.js';
import {spotLight} from './luz.js';

export class LuminousButton extends THREE.Mesh{
    constructor(position, spotlight){
        let geometry  = new THREE.BoxGeometry(0.25, 0.15, 0.1);
        let material = new THREE.MeshPhongMaterial({
            shininess: "100",
            specular: "white",
            color: "yellow",
            emissive: "yellow",
            emissiveIntensity: 0.4
        });
        super(geometry, material);
        this.position.copy(position);
        this.castShadow = true;
        this.receiveShadow = true;
        this.bb = new THREE.Box3().setFromObject(this);
        this.bbSize = new THREE.Vector3(7, 5, 12);
        this.bb.setFromCenterAndSize( this.position, this.bbSize );
        this.bbHelper = new THREE.Box3Helper(this.bb, 'yellow');
        this.spotlight = spotlight;
        scene.add(this.spotlight);
        scene.add(this.bbHelper);
        this.bbHelper.visible = false;
    }
    activeteLight(){
        this.spotlight.visibility = true;
    }
    activateBBHelper(){
        this.bbHelper.visible = true;
    }
}


