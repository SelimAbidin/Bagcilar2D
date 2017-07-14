
import {ObjectContainer2D} from "./ObjectContainer2D";
import {DefaultEffect} from "../effects/DefaultEffect";
import {InstancedMaterial} from "../effects/InstancedMaterial";
import {Matrix3} from "../Math/Matrix3";



class Sprite extends ObjectContainer2D {

    constructor () {
        super();
        
        var f = 10;
        this.vertices = [
            -f,  f, // left - top
            -f, -f, // left - bottom
            f,  f, // right - top
            f, -f, // right - bottom
        ];

        this.color = [Math.random(), Math.random(), Math.random(),1];
    }

    updateMaterial (gl) {
        
        if(!this.material){
            this.material = new InstancedMaterial();
        }
        
        if(!this.material.isUploaded){
            this.material.upload(gl);
        }
    }

    upload (gl) {
        
        if(!Sprite._indexBuffer){
            this.buffer = gl.createBuffer();
            console.log("Sprite > Create Buffer");
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

            this.indices = [0,1,2,  1,3,2];
            this.indexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);

            Sprite._indexBuffer = this.indexBuffer;
            Sprite._vertexBuffer = this.buffer;
           
        } else {

            this.buffer = Sprite._vertexBuffer;
            this.indexBuffer = Sprite._indexBuffer;
        }
        
    }

    update  () {
        super.update();   
    }

    draw  (gl, camera){

        
    }
}


export {Sprite};