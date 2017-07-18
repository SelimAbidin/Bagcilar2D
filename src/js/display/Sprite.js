
import {ObjectContainer2D} from "./ObjectContainer2D";
import {DefaultEffect} from "../effects/DefaultEffect";
import {InstancedMaterial} from "../effects/InstancedMaterial";
import {Matrix3} from "../Math/Matrix3";



class Sprite extends ObjectContainer2D {

    constructor (params) {
        super();
        
        var f = 10;
        this.vertices = [
            -f,  f, // left - top
            -f, -f, // left - bottom
            f,  f, // right - top
            f, -f, // right - bottom
        ];

        this.uv = [
            0,1,
            0,0,
            1,1,
            1,0
        ];
        
        this.indices = [0,1,2,  1,3,2];
        this.color = [Math.random(), Math.random(), Math.random(),1];
        
        for(var str in params){
            var param = str;
            this[param] = params[str];        
        }
        

        if(!this.material){
            this.material = InstancedMaterial.getInstance();
        }
        
    }

    updateMaterial (gl) {
        
       
        
        if(!this.material.isUploaded){
            this.material.upload(gl);
        }
    }

    upload (gl, material) {
        

        return;
        if(!Sprite._indexBuffer){
            
            console.log("Sprite > Create Buffer");
           

        
            Sprite._indexBuffer = this.indexBuffer;
            Sprite._vertexBuffer = this.buffer;
            Sprite._uvBuffer = this.uvBuffer;
           
        } else {

            this.buffer = Sprite._vertexBuffer;
            this.uvBuffer = Sprite._uvBuffer;
            this.indexBuffer = Sprite._indexBuffer;
        }
        
    }

    update  () {
        //super.update();   
    }

    draw  (gl, camera){

        
    }
}


export {Sprite};