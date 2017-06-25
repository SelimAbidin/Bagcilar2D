
import {Object2D} from './Object2D';
import {Default} from '../effects/Default';


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

        var f = 0.9;
        var vertices = [
             0.0,  f,  0.0,
            -f, -f,  0.0,
             f, -f,  0.0
        ];

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    },

    draw : function (gl){
        
        if(!this.buffer){
            this.upload(gl);
        }

        if(!this.material){
            this.updateMaterial(gl);
        }
        
        this.material.draw(gl);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(0);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

} );



export {Quad};