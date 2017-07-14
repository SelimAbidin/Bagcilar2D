import {EventableObject} from "../core/EventableObject";
import {InstancedMaterial} from "../effects/InstancedMaterial";
import {Sprite} from "../display/Sprite";

class WebGLRenderer extends EventableObject
{
    constructor (square, gl) {
        super();
        this.gl = gl;
        this.square = square;
        this.exAngleInstance = gl.getExtension('ANGLE_instanced_arrays');
    }

    renderObject (object, camera) {


    }

    renderObjects (objectList, camera) {

        var gl = this.gl;
        if(objectList.length > 0) {

            var o = objectList[0];

            
            
            
            if(o instanceof Sprite){


                var material = InstancedMaterial.getInstance();

                if(!material.isUploaded) {
                    var ext = this.exAngleInstance;
                    material.upload(gl, ext);
                }
                
                
                
                var camera = o.stage.camera;
                var uniform = material.uniform;

                 var positionLocation = material.positionLocation;
                var offsetLocation = material.offsetLocation;
                var rotationLocation = material.rotationLocation;
                var colorLocation = material.colorLocation;

                
                if(this._lastUUID !== material.shaderProgram.__uuid){

                    this._lastUUID = material.shaderProgram.__uuid;

                    
                }
                
                
               
                material.reset();
                for(var i = 0; i < objectList.length; i++) {
                    
                    o = objectList[i];

                    o.upload(gl , material);
                    
                    material.addRotation(o.rotation);
                    material.addPosition(o.x, o.y);

                    material.next();
                    
                }
                
                var positionBuffer = o.buffer;
                
                gl.useProgram(material.shaderProgram);
                
                uniform.setValue("projectionMatrix", camera.projectionMatrix.matrixArray);
                uniform.setValue("viewMatrix", camera.worldMatrix.matrixArray);
                uniform.update(gl);
                
                var l;

                l = positionLocation;
                gl.enableVertexAttribArray(l);
                gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
                gl.vertexAttribPointer(l, 2, gl.FLOAT, false, 0, 0);
                // POSITION


                l = rotationLocation;
                gl.enableVertexAttribArray(l);
                gl.bindBuffer(gl.ARRAY_BUFFER, material.rotateBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, material.rotateArray, gl.STATIC_DRAW);
                // ROTATION
                

                l = offsetLocation;
                gl.enableVertexAttribArray(l);
                gl.bindBuffer(gl.ARRAY_BUFFER, material.offsetBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, material.offset, gl.STATIC_DRAW);
                // OFFSET

                gl.enableVertexAttribArray(colorLocation);

                var size = 6;
                this.exAngleInstance.drawElementsInstancedANGLE(gl.TRIANGLES, size, gl.UNSIGNED_SHORT, 0, objectList.length);

            } else {

                for(var i = 0; i < objectList.length; i++) {
                    o = objectList[i];
                    objectList[i].draw(this.gl, camera);
                }
            }
            
            
            
           
            
        }

    }
}

export {WebGLRenderer}