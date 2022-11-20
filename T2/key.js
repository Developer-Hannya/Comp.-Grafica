import * as THREE from  'three';
import {GLTFLoader} from '../build/jsm/loaders/GLTFLoader.js'
import { setDefaultMaterial } from '../libs/util/util.js';
import { chaves, createBBHelper, player, scene } from './trabalho02.js';

export class Key extends THREE.Mesh{
    constructor(x, y, z, color){
        super();
        this.position.x = x;
        this.position.y = y;
        this.position.z = z;
        this.color = color;
        loadKeyModel(this);
        // createBBHelper(this.bb, "blue");
        chaves.push(this);
    }

    static collectKeys(){
        for (let i = 0; i < chaves.length; i++) {
            const key = chaves[i];
            if(key.bb && player.bb.intersectsBox(key.bb)){
                player[key.color] = true;
                // console.log(key.color);
                scene.remove(key);
                chaves.splice(i, 1);
                i--;
            }
            
        }
    }
}

function loadKeyModel(key)
{
  var loader = new GLTFLoader( );
  loader.load( 'assets/key/scene.gltf', function ( gltf ) {
    var obj = gltf.scene;
    obj.traverse( function ( child ) {
      if ( child ) {
          child.castShadow = true;
      }
    });
    obj.traverse( function( node )
    {
      if( node.material ) node.material.side = THREE.DoubleSide;
    });

    obj.scale.x = 0.2;
    obj.scale.y = 0.2;
    obj.scale.z = 0.2;
    obj.translateY(1.5)   
    obj.rotateZ(-Math.PI/2);
    obj.children[0].children[0].children[0].children[0].material = setDefaultMaterial(key.color);
    key.add(obj);
    key.bb = new THREE.Box3();
    key.bb.setFromObject(key);
    });
}