import {EventableObject} from "../core/EventableObject";
import {InstancedMaterial} from "../effects/InstancedMaterial";
import {Sprite} from "../display/Sprite";

class WebGLRenderer extends EventableObject
{
    constructor (square, gl) {
        super();
        this.infoID = 0;
        this.gl = gl;
        this._materials = [];
        this.square = square;
        this.exAngleInstance = gl.getExtension('ANGLE_instanced_arrays');
    }

    prepareForRender () {
        this._materials.length = 0;
        this.infoID++;
    }

    renderSingleObject (object, camera) {

        var gl = this.gl;
        var material = object.material;

        this.useMaterial(material, camera);
        
        object.upload(gl , material);

        
        material.next();
        material.addRotation(object.rotation);
        material.addPosition(object.xPos, object.yPos);
        /*
        */

        material.renderNumber = this.infoID;
    }

    useMaterial (material, camera) {

        if(!material.isUploaded) {
            var ext = this.exAngleInstance;
            material.upload(this.gl, ext);
        }

        if(material.id != this.lastMaterialID) {

            this.gl.useProgram(material.shaderProgram);
            this.lastMaterialID = material.id;
        }


        var uniform = material.uniform;
       
        if(material.renderNumber !== this.infoID){
            
            material.reset();  
            this._materials.push(material);
            uniform.setValue("projectionMatrix", camera.projectionMatrix.matrixArray);
            uniform.setValue("viewMatrix", camera.worldMatrix.matrixArray);
            uniform.update(this.gl);

        }
    }

    present () {

        var gl = this.gl;
        for (var i = 0; i < this._materials.length; i++) {

                var material = this._materials[i];
                
                gl.enableVertexAttribArray(material.positionLocation);


                gl.enableVertexAttribArray(material.rotationLocation);
                gl.bindBuffer(gl.ARRAY_BUFFER, material.rotateBuffer);
                gl.bufferSubData(gl.ARRAY_BUFFER, 0, material.rotateArray);
                //gl.bufferData(gl.ARRAY_BUFFER, material.rotateArray, gl.DYNAMIC_DRAW);
                // ROTATION

                gl.enableVertexAttribArray(material.offsetLocation);
                gl.bindBuffer(gl.ARRAY_BUFFER, material.offsetBuffer);
                gl.bufferSubData(gl.ARRAY_BUFFER, 0, material.offset);
                // OFFSET

                gl.enableVertexAttribArray(material.colorLocation);

                var size = 6;
                this.exAngleInstance.drawElementsInstancedANGLE(gl.TRIANGLES, size, gl.UNSIGNED_SHORT, 0, material.getLenght());

        }

this._materials
    }

    renderObject (object, camera) {


         l = positionLocation;
                gl.enableVertexAttribArray(l);
                
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