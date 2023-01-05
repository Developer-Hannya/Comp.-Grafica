import * as THREE from  'three';
<<<<<<< HEAD
<<<<<<< HEAD:mobile/objetos.js
import {scene, objects} from './appMobile.js';
=======
import {scene, objects} from './trabalho03.js';
>>>>>>> juliana:T3/objetos.js
=======
import {scene, objects} from './appMobile.js';
>>>>>>> juliana
import {cameraHolder} from './camera.js';
import {spotLight} from './luz.js';

// objeto botão iluminado
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
    activateBBHelper(){
        this.bbHelper.visible = true;
    }
}

// objeto cubo selecionavel
export class SelectableCube extends THREE.Mesh{
    constructor(position, geometry, material){
        // let geometry  = new THREE.BoxGeometry(1, 1, 1);
        // let material = new THREE.MeshPhongMaterial({
        //     shininess: "200",
        //     specular: "white",
        //     color: "gray",
        // });
        super(geometry, material);
        this.position.copy(position);
        this.newPos = null;
        this.selected = false;
        this.castShadow = true;
        this.receiveShadow = true;
        this.pressing = false;
        this.isPressing = null;
        this.bb = new THREE.Box3().setFromObject(this);
        this.bbSize = new THREE.Vector3(1.1, 1.1, 1.1);
        this.bb.setFromCenterAndSize( this.position, this.bbSize );
        this.bbHelper = new THREE.Box3Helper(this.bb, 'yellow');
        this.bbHelper.visible = false;
        objects.push({bb:this.bb});
        scene.add(this.bbHelper);
    }
    isSelected(){
        this.material.color("green");
    }
    updateBlockBB(){
        this.bb.setFromObject(this); 
    }
}

export class PressurePlate extends THREE.Mesh{
    constructor(position, geometry, material){
        super(geometry, material);
        this.position.copy(position);
        this.Y = position.y;
<<<<<<< HEAD
<<<<<<< HEAD:mobile/objetos.js
        this.audioPlayed = false;
=======
>>>>>>> juliana:T3/objetos.js
=======
        this.audioPlayed = false;
>>>>>>> juliana
        this.castShadow = true;
        this.receiveShadow = true;
        this.pressed = false;
        this.pressedBy = null;
        this.bb = new THREE.Box3().setFromObject(this);
        this.bbSize = new THREE.Vector3(1.1, 1.1, 1.1);
        this.bb.setFromCenterAndSize( this.position, this.bbSize );
        this.bbHelper = new THREE.Box3Helper(this.bb, 'yellow');
        this.bbHelper.visible = false;
<<<<<<< HEAD
        this.sound = true;
=======
>>>>>>> juliana
        objects.push({bb:this.bb});
        scene.add(this.bbHelper);
    }
    updatePressPlateBB(){
        this.bb.setFromObject(this);
    }
    getYNotPressed(){
        return this.Y;
    }
    getYPressed(){
        return this.Y - 0.45;
    }
}
