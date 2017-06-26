
import {Object2D} from "./Object2D";
import {Default} from "../effects/Default";


function Quad() {
    Object2D.apply(this, arguments);
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

        var f = 0.7;
        var vertices = [
            -f,  f,  0.0, // left - top
            -f, -f, 0.0, // left - bottom
            f,  f,  0.0, // right - top
            f, -f,  0.0, // right - bottom
        ];

        this.vertices = vertices;
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        // var indices = [0,1,2, 2, 4,0];
        // this.indexBuffer = gl.createBuffer();
        // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        // gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
        

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
        this.setScaleX(Math.cos(this.rad));
        this.setScaleY(Math.sin(this.rad));

        this.setRotation(this.getRotation() + 0.01);
        this.updateWorldMatrix();
        
        gl.uniformMatrix3fv(this.material.params.modelMatrix, false, this.worldMatrix.matrixArray);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(0);
        // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.vertices.length / 3);




        //this.setRotation(this.getRotation() + 0.01);
        // console.log(this.rotationMatrix.matrixArray);
    }

} );



export {Quad};