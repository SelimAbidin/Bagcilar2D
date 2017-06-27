
import {Object2D} from "./Object2D";
import {Default} from "../effects/Default";
import {Matrix3} from "../Math/Matrix3";


function Quad() {
    Object2D.apply(this, arguments);
    this.camera = undefined;
}



Quad.prototype = Object.assign(Object.create(Object2D.prototype), {

    constructor : Quad,


    updateMaterial : function(gl){

        this.material = new Default();
        this.material.upload(gl);

    },

    upload : function (gl){
        
        this.buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);

        var f = 0.5;
        var vertices = [
            -f,  f,  0.0, // left - top
            -f, -f, 0.0, // left - bottom
            f,  f,  0.0, // right - top
            f, -f,  0.0, // right - bottom
        ];

        this.vertices = vertices;
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

         this.indices = [0,1,2,  1,3,2];
         this.indexBuffer = gl.createBuffer();
         gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
         gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
        

    },

    draw : function (gl){
        
        if(!this.buffer){
            this.upload(gl);
        }

        if(!this.material){
            this.updateMaterial(gl);
        }
        
        this.material.draw(gl);

        if(this.rad === undefined){
            this.rad = 0;
        }

        this.rad += 0.01;
        // this.setScaleX(10);
        //  this.setScaleY(10);
        // this.setScaleX(Math.cos(this.rad) * 500);
        // this.setScaleY(Math.sin(this.rad) * 500);

        this.setX(Math.cos(this.rad) * 2);

        //this.setRotation(this.getRotation() + 0.01);
        //this.camera.projectionMatrix.matrixArray[4] = 100;
       // this.camera.setRotation(this.camera.getRotation() + 0.01);
        //this.camera.setX(100);
        this.camera.updateWorldMatrix();

        //console.log(this.camera.worldMatrix.matrixArray);

        this.updateWorldMatrix();
        //console.log( this.worldMatrix.matrixArray);
        
        var mvMatrix = [1,0,0,  0,1,0,  0,0,1];
        var camera = [1,0,0, 0,1,0,   1,0,1];
        
        //this.worldMatrix.matrixArray;
        gl.uniformMatrix3fv(this.material.params.modelMatrix, false, mvMatrix);
        gl.uniformMatrix3fv(this.material.params.projectionMatrix, false, camera);//this.camera.projectionMatrix.matrixArray);


        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

    
        let size = this.indices.length;
        gl.drawElements(gl.TRIANGLES ,size , gl.UNSIGNED_SHORT, 0);
         // gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.vertices.length / 3);
        //gl.drawArrays(gl.POINTS, 0, this.vertices.length / 3);

        //this.setRotation(this.getRotation() + 0.01);
        // console.log(this.rotationMatrix.matrixArray);
    }

} );



export {Quad};