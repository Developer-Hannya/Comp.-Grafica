import * as THREE from  'three';
import { CSG } from '../libs/other/CSGMesh.js';
import { createBBHelper, objects, player} from './trabalho03.js';
import { doorSoundEffect } from './sons.js';

export let closedDoors = [];
let openingDoors = [];

export class Door extends THREE.Object3D{
    constructor(x, y, z, direction, color = undefined){
        super();
        this.translateX(x);
        this.translateY(y);
        this.translateZ(z);

        if(color)
            this.color = color;

        this.openPosition = new THREE.Vector3(this.position.x, this.position.y - 6, this.position.z);

        this.add(createDoor());
        
        if(direction == "x"){
            this.rotateY(Math.PI * 0.5);
        }

        this.bBox = new THREE.Box3().setFromObject(this);
        //createBBHelper(this.bBox, "green")
        
        this.openingBox = new THREE.Box3();
        let size = new THREE.Vector3(5, 5, 5);
        this.openingBox.setFromCenterAndSize(this.position, size);
        //createBBHelper(this.openingBox, "blue")

        objects.push({bb: this.bBox});
        closedDoors.push(this);
    }

    static openDoors(){
        for (let index = 0; index < closedDoors.length; index++) {
            const door = closedDoors[index];
            if(player.bb.intersectsBox(door.openingBox)){
                // door.bBox.max = door.bBox.min;
                if(door.color && !player[door.color]){
                    return;
                }
                closedDoors.splice(index, 1);
                index--;
                openingDoors.push(door);
                doorSoundEffect.play();
            } 
        }
    
        for(let i = 0; i < openingDoors.length; i++){
            const door = openingDoors[i];
            door.bBox.setFromObject(door);
            door.position.lerp(door.openPosition, 0.01);
            if(door.position.y == door.openPosition.y){
                openingDoors.splice(i, 1);
                i--;
            }
        }
    
    }
}

export function createDoor(){

    let mesh;
    //let rectangle
    let auxMat = new THREE.Matrix4();
   
   // Base objects
   let internalRectangleMesh = new THREE.Mesh(new THREE.BoxGeometry(5, 3, 0.3))
   let cylinderMesh = new THREE.Mesh( new THREE.CylinderGeometry(2.5, 2.5, 0.3, 64)).rotateX(-Math.PI * 0.5)

   // CSG holders
   let csgObject, internalRectangleCSG, cylinderCSG;

   //adiciona cilindro externo
   cylinderMesh.position.set(0, 1.5, 0)
   updateObject(cylinderMesh)
   cylinderCSG = CSG.fromMesh(cylinderMesh)
   internalRectangleCSG = CSG.fromMesh(internalRectangleMesh)
   csgObject = internalRectangleCSG.union(cylinderCSG)
   mesh = CSG.toMesh(csgObject, auxMat)

   mesh.material = new THREE.MeshPhongMaterial({color: 'rgb(115,89,49)'})
   mesh.position.set(0, -1.5, 0)
   return mesh;
}

function updateObject(mesh)
{
   mesh.matrixAutoUpdate = false;
   mesh.updateMatrix();
}


