
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

        this.uv = [
            0,1,
            0,0,
            1,1,
            1,0
        ];
        

        this.color = [Math.random(), Math.random(), Math.random(),1];
         this.material = InstancedMaterial.getInstance();
    }

    updateMaterial (gl) {
        
       
        
        if(!this.material.isUploaded){
            this.material.upload(gl);
        }
    }

    upload (gl, material) {
        
        if(!Sprite._indexBuffer){
            this.buffer = gl.createBuffer();
            console.log("Sprite > Create Buffer");
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

            var positionLocation = material.positionLocation;
            gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

            this.indices = [0,1,2,  1,3,2];
            this.indexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);

            this.uvBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.uv), gl.STATIC_DRAW);
            gl.vertexAttribPointer(material.uvLocation, 2, gl.FLOAT, false, 0, 0);

        
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