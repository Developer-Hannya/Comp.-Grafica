import * as THREE from  'three';
import {scene, doorA3Open} from './trabalho02.js';
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
        this.shadow.mapSize.width = 1024;
        this.shadow.mapSize.height = 1024;

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
        this.shadow.mapSize.width = 128;
        this.shadow.mapSize.height = 128;

        this.shadow.camera.near = 0.1;
        this.shadow.camera.far = 50;
        this.position.copy(position);
        this.visible = true;
        this.loaded = false;
        this.doorOpen = false;
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
    // usando intensity e não visible, pois assim as luzes carregam logo no inicio
    visibleTrue(){
        return this.intensity = 0.8;
    }
    visibleFalse(){
        return this.intensity = 0;
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
    if(cameraHolder.position.y < 0 && cameraHolder.position.x > 35){
        let auxDirec = 0.8 + 0.17 * cameraHolder.position.y;
        let auxAmbient = 0.45 + 0.1 * cameraHolder.position.y;
        let auxSpot = 0 - 0.15 * cameraHolder.position.y;
        if (auxDirec >= 0.01)
            directlight.setIntensity(auxDirec);
        else 
            directlight.setIntensity(0);
        if(doorA3Open === true)
            ambientlight.setIntensity(0.2);
        else if (auxAmbient >= 0.01) {
            ambientlight.setIntensity(auxAmbient);
        }
        if(cameraHolder.position.y < -1){
            spotlightEscada.setIntensity(auxSpot);
        }
        else if(cameraHolder.position.y > -1){
            spotlightEscada.setIntensity(0);
        }
    }
    else{
        directlight.setIntensity(0.8);
        ambientlight.setIntensity(0.45);
    }
}

// cria luz ambiente
export var ambientlight = new ambientLight('white', 0.45);
// cira luz direcional
export var directlight = new directionalLight('white', 0.8);
// cria luz spotlight

export var spotlightEscada = new spotLight('white', 0, 20, 0.5, 0.9, 0.8, new THREE.Vector3(35.5, 8, 0), 0);

//var spotLightHelperEscada = new SpotLightHelper(spotlightEscada);

// adiciona as luzes na cena
export function loadLights(){
    scene.add(ambientlight);

    directlight.pointTo(-10, -5, 10);
    scene.add(directlight);

    spotlightEscada.pointTo(43, -6, 0);
    scene.add(spotlightEscada);
    //scene.add(spotLightHelperEscada);
    //spotLightHelperEscada.update();
}
