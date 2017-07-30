
import {ObjectContainer2D} from "./ObjectContainer2D";
import {DefaultEffect} from "../effects/DefaultEffect";



class Quad extends ObjectContainer2D {

    constructor (params) {
        super();
        
        for(var str in params){
            var param = str;
            this[param] = params[str];        
        }
    }

    updateMaterial (gl) {

        if(!this.material){
            this.material = new DefaultEffect();
        }
        
        if(!this.material.isUploaded){
            this.material.upload(gl);
        }
    }

    upload (gl) {
        
        this.buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);

        var f = 10;
        var vertices = [
            -f,  f, // left - top
            -f, -f, // left - bottom
            f,  f, // right - top
            f, -f, // right - bottom
        ];

        this.vertices = vertices;
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        this.indices = [0,1,2,  1,3,2];
        this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);

    }

    update  () {
        super.update();   
    }


    draw  (gl, camera){

        if(!this.buffer){
            this.upload(gl);
        }
        
        gl.enable(gl.DEPTH_TEST);
         
        this.updateMaterial(gl);
        
        
        var uniform = this.material.uniform;
        uniform.setValue("modelMatrix", this.worldMatrix.matrixArray);
        uniform.setValue("projectionMatrix", camera.projectionMatrix.matrixArray);
        uniform.setValue("viewMatrix", camera.worldMatrix.matrixArray);
        this.material.draw(gl);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER , this.indexBuffer);
        let size = this.indices.length;
        gl.drawElements(gl.TRIANGLES , size , gl.UNSIGNED_SHORT , 0);
    }
}


export {Quad};