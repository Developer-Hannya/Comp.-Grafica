import * as THREE from  'three';
import { CSG } from '../libs/other/CSGMesh.js';
import { createBBHelper, objects, scene } from './trabalho02.js';

export class Portal extends THREE.Object3D{
   constructor(x, y, z, direction, color = "white"){
       super();
       this.translateX(x);
       this.translateY(y);
       this.translateZ(z);
       let rightSideBox, leftSideBox;

       const geometry = new THREE.SphereGeometry( 0.7, 32, 32 );
       const material = new THREE.MeshLambertMaterial( { color: color } );
       const sphere = new THREE.Mesh( geometry, material );
       sphere.translateY(3.5);

      if(direction == "z"){
         rightSideBox = new THREE.Box3(new THREE.Vector3(x - 3.5, y - 5, z - 0.5), new THREE.Vector3(x - 2.5, y + 2, z + 0.5));
         //createBBHelper(rightSideBox, "yellow");
         leftSideBox = new THREE.Box3(new THREE.Vector3(x + 2.5, y - 5, z - 0.5), new THREE.Vector3(x + 3.5, y + 2, z + 0.5));
         //createBBHelper(leftSideBox, "red");
      }
      else if(direction == "x"){
         this.rotateY(Math.PI * 0.5);
         rightSideBox = new THREE.Box3(new THREE.Vector3(x - 0.5, y - 5, z - 3.5), new THREE.Vector3(x + 0.5, y + 2, z - 2.5));
         //createBBHelper(rightSideBox, "yellow");
         leftSideBox = new THREE.Box3(new THREE.Vector3(x - 0.5, y - 5, z + 2.5), new THREE.Vector3(x + 0.5, y + 2, z + 3.5));
         //createBBHelper(leftSideBox, "red");
      }

      objects.push({bb: rightSideBox}, {bb: leftSideBox});
      this.add(createPortals());
      this.add(sphere);
   }
}

export function createPortals(){

    let mesh;
    //let rectangle
    let auxMat = new THREE.Matrix4();
   
   // Base objects
   let externalRectangleMesh = new THREE.Mesh(new THREE.BoxGeometry(7, 6, 1))
   let internalRectangleMesh = new THREE.Mesh(new THREE.BoxGeometry(5, 3, 1))
   let cylinderMesh = new THREE.Mesh( new THREE.CylinderGeometry(2.5, 2.5, 1, 64)).rotateX(-Math.PI * 0.5)
   let cylinder2Mesh = new THREE.Mesh( new THREE.CylinderGeometry(4, 4, 1, 64)).rotateX(-Math.PI * 0.5)  
   let subRectangle1Mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 6, 1))
   let subRectangle2Mesh =  new THREE.Mesh(new THREE.BoxGeometry(1, 6, 1))

   // CSG holders
   let csgObject, externalRectangleCSG, internalRectangleCSG, cylinderCSG, cylinder2CSG, subRectangle1CSG,subRectangle2CSG;

   //adiciona cilindro externo
   cylinder2Mesh.position.set(0, 1, 0)
   updateObject(cylinder2Mesh)
   cylinder2CSG = CSG.fromMesh(cylinder2Mesh)
   externalRectangleCSG = CSG.fromMesh(externalRectangleMesh)
   csgObject = externalRectangleCSG.union(cylinder2CSG)

   //subtrai retângulo menor
   internalRectangleMesh.position.set(0, -1.5, 0)
   updateObject(internalRectangleMesh) // update internal coords
   internalRectangleCSG = CSG.fromMesh(internalRectangleMesh)     
   csgObject = csgObject.subtract(internalRectangleCSG) // Execute subtraction

   //subtrai cilindro 
   cylinderMesh.position.set(0, 0, 0)
   updateObject(cylinderMesh)
   cylinderCSG = CSG.fromMesh(cylinderMesh)
   csgObject = csgObject.subtract(cylinderCSG)

   //subtrai restos do cilindro externo
   subRectangle1Mesh.position.set(-4, 0, 0)
   subRectangle2Mesh.position.set(4, 0, 0)
   updateObject(subRectangle1Mesh) // update internal coords
   updateObject(subRectangle2Mesh)
   subRectangle1CSG = CSG.fromMesh(subRectangle1Mesh)  
   subRectangle2CSG = CSG.fromMesh(subRectangle2Mesh)   
   csgObject = csgObject.subtract(subRectangle1CSG).subtract(subRectangle2CSG) // Execute subtraction
   mesh = CSG.toMesh(csgObject, auxMat)

   mesh.material = new THREE.MeshPhongMaterial({color: 'rgb(182,144,95)'})
   mesh.position.set(0, 0, 0)
   return mesh;
}

function updateObject(mesh)
{
   mesh.matrixAutoUpdate = false;
   mesh.updateMatrix();
}