import * as THREE from  'three';
import {scene} from './trabalho02.js';
import {cameraHolder} from './camera.js';
import { color } from '../libs/util/dat.gui.module.js';
import { SpotLightHelper } from '../build/three.module.js';

// classe de luz ambiente
export class ambientLight extends THREE.AmbientLight{
    constructor(cor, intensidade){
        super(cor, intensidade);
        this.castShadow = false;
    }
    setIntensity(value){
        this.intensity = value;
    }
}

//classe de luz direcional
export class directionalLight extends THREE.DirectionalLight{
    constructor(color, intensity){
        super(color, intensity);
        this.castShadow = true;
        this.shadow.mapSize.width = 2048;
        this.shadow.mapSize.height = 2048;
        this.shadow.camera.near = 0.1;
        this.shadow.camera.far = 1000;
        this.shadow.camera.left = -20;
        this.shadow.camera.right = 20;
        this.shadow.camera.bottom = -22;
        this.shadow.camera.top = 20;
    }
    pointTo(x , y, z) {
        var dirLightTarget = new THREE.Object3D();
        scene.add(dirLightTarget);
        cameraHolder.add(dirLightTarget);
        dirLightTarget.position.set(x, y, z);
        this.target = dirLightTarget;
        this.target.updateMatrixWorld();
    }
    updateLight() {
        let dirX = cameraHolder.position.x;
        let dirZ = cameraHolder.position.z;
        this.position.set(dirX, 15, dirZ);
        this.castShadow = true;
        //dirLightHelper.update();
    }
    setIntensity(value){
        return this.intensity = value;
    }
}

//classe de spotlight
export class spotLight extends THREE.SpotLight{
    constructor(color, intensity, distance, angle, penumbra, decay, position, type){
        super(color, intensity, distance, angle, penumbra, decay);
        this.castShadow = true;
        this.shadow.mapSize.width = 512;
        this.shadow.mapSize.height = 512;
        this.shadow.camera.near = 0.1;
        this.shadow.camera.far = 10;
        this.position.copy(position);
        this.visible = true;
        this.loaded = false;
        this.target.position.copy(this.position);
        this.target.position.y = this.position.y - 6;
        this.target.updateMatrixWorld();
    }
    pointTo(x , y, z) {
        this.target.position.set(x, y, z);
        this.target.updateMatrixWorld();
    }
    updateLight() {
        this.castShadow = true;
    }
    setIntensity(value){
        return this.intensity = value;
    }
    visibilityTrue(){
        return this.visible = true;
    }
    visibilityFalse(){
        return this.visible = false;
    }
    loadLight(){
        this.loaded = true;
    }
    isLoaded(){
        return this.loaded = true;
    }
}

// diminui a intensidade da luz de acordo com a posição do personagem (entrada area A3)
export function lightDowngrade(){
    if(cameraHolder.position.y < 0){
        let auxDirec = 0.8 + 0.132 * cameraHolder.position.y;
        let auxAmbient = 0.45 + 0.074 * cameraHolder.position.y;
        let auxSpot = 0.01 - 0.15 * cameraHolder.position.y;
        if (auxDirec >= 0.03)
            directlight.setIntensity(auxDirec);
        else 
            directlight.setIntensity(0);
        if (auxAmbient >= 0.02) {
            ambientlight.setIntensity(auxAmbient);
        }
        if(cameraHolder.position.y < -5.8)
            spotlightEscada.setIntensity(auxSpot);
        }if(cameraHolder.position.y > -5.8)
        spotlightEscada.setIntensity(0.01);
}

// cria luz ambiente
export var ambientlight = new ambientLight('white', 0.45);
// cira luz direcional
export var directlight = new directionalLight('white', 0.8);
// cria luz spotlight

export var spotlightEscada = new spotLight('white', 0.01, 20, 0.5, 0.9, 0.8, new THREE.Vector3(38, 8, 0), 0);
//var spotLightHelperEscada = new SpotLightHelper(spotlightEscada);

// adiciona as luzes na cena
export function loadLights(){
    scene.add(ambientlight);

    directlight.pointTo(-10, -5, 10);
    scene.add(directlight);

    spotlightEscada.pointTo(43, -6, 0);
    scene.add(spotlightEscada);
    //spotlightEscada.visibilityTrue();
    //scene.add(spotLightHelperEscada);
    //spotLightHelperEscada.update();
}
