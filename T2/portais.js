import * as THREE from  'three';
import { CSG } from '../libs/other/CSGMesh.js';
import { scene } from './trabalho02.js';

export function createPortals(){

    let mesh1, mesh2, mesh3, mesh4;
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
   mesh1 = CSG.toMesh(csgObject, auxMat)

   //subtrai retângulo menor
   internalRectangleMesh.position.set(0, -1.5, 0)
   updateObject(internalRectangleMesh) // update internal coords
   internalRectangleCSG = CSG.fromMesh(internalRectangleMesh)     
   csgObject = csgObject.subtract(internalRectangleCSG) // Execute subtraction
   mesh2 = CSG.toMesh(csgObject, auxMat)

   //subtrai cilindro 
   cylinderMesh.position.set(0, 0, 0)
   updateObject(cylinderMesh)
   cylinderCSG = CSG.fromMesh(cylinderMesh)
   csgObject = csgObject.subtract(cylinderCSG)
   mesh3 = CSG.toMesh(csgObject, auxMat)

   //subtrai restos do cilindro externo
   subRectangle1Mesh.position.set(-4, 0, 0)
   subRectangle2Mesh.position.set(4, 0, 0)
   updateObject(subRectangle1Mesh) // update internal coords
   updateObject(subRectangle2Mesh)
   subRectangle1CSG = CSG.fromMesh(subRectangle1Mesh)  
   subRectangle2CSG = CSG.fromMesh(subRectangle2Mesh)   
   csgObject = csgObject.subtract(subRectangle1CSG).subtract(subRectangle2CSG) // Execute subtraction
   mesh4 = CSG.toMesh(csgObject, auxMat)

   mesh4.material = new THREE.MeshPhongMaterial({color: 'lightgreen'})
   mesh4.position.set(0, 3, 20)
   scene.add(mesh4)
}

function updateObject(mesh)
{
   mesh.matrixAutoUpdate = false;
   mesh.updateMatrix();
}