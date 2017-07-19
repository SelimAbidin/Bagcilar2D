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


        // gl.disable(gl.STENCIL_TEST);

            gl.enable(gl.BLEND);
            gl.blendColor(0, 0, 0, 0);
            gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
            gl.blendFuncSeparate(gl.ONE, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
            gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);
    }

    prepareForRender () {
        this._materials.length = 0;
        this.infoID++;
    }

    renderSingleObject (object, camera) {

        var gl = this.gl;
        var material = object.material;

        this.useMaterial(material, camera);
        
       // object.upload(gl , material);

        
        material.next();
        material.addRotation(object.rotation);
        material.addPosition(object.xPos, object.yPos);

        material.renderNumber = this.infoID;
    }

    useMaterial (material, camera) {

        if(!material.isUploaded) {
            var ext = this.exAngleInstance;
            material.upload(this.gl, ext);
        }

        if(material.id != this.lastMaterialID) {

            var gl = this.gl;
            //gl.useProgram(material.shaderProgram);
            //gl.activeTexture(gl.TEXTURE0);

            this.lastMaterialID = material.id;
        }


        var uniform = material.uniform;
       
        if(material.renderNumber !== this.infoID){
            
            material.reset();  
            this._materials.push(material);
            

        }
    }

    present (camera) {

        var gl = this.gl;
        for (var i = 0; i < this._materials.length; i++) {

                var material = this._materials[i];
                var gl = this.gl;

                gl.useProgram(material.shaderProgram);

                this.updateUniforms(material.uniform, camera);

                gl.enableVertexAttribArray(material.rotationLocation);
                gl.enableVertexAttribArray(material.positionLocation);
                gl.enableVertexAttribArray(material.colorLocation);
                gl.enableVertexAttribArray(material.uvLocation);
                gl.enableVertexAttribArray(material.offsetLocation);


                gl.bindBuffer(gl.ARRAY_BUFFER, material.buffer);
                gl.vertexAttribPointer(material.positionLocation, 2, gl.FLOAT, false, 0, 0);
                

                gl.bindBuffer(gl.ARRAY_BUFFER, material.rotateBuffer);
                gl.bufferSubData(gl.ARRAY_BUFFER, 0, material.rotateArray);
                gl.vertexAttribPointer(material.rotationLocation, 1, gl.FLOAT, false, 0, 0);
                
                // ROTATION


                gl.bindBuffer(gl.ARRAY_BUFFER, material.offsetBuffer);
                gl.bufferSubData(gl.ARRAY_BUFFER, 0, material.offset);
                gl.vertexAttribPointer(material.offsetLocation, 2, gl.FLOAT, false, 0, 0);
                
                // OFFSET
                
                gl.bindBuffer(gl.ARRAY_BUFFER, material.colorBuffer);
                gl.vertexAttribPointer(material.colorLocation, 3, gl.FLOAT, false, 0, 0);
                

                gl.bindBuffer(gl.ARRAY_BUFFER, material.uvBuffer);
                gl.vertexAttribPointer(material.uvLocation, 2, gl.FLOAT, false, 0, 0);
                
               

                //gl.activeTexture(gl.TEXTURE0);

                
                
                
                var size = 6;
                this.exAngleInstance.drawElementsInstancedANGLE(gl.TRIANGLES, size, gl.UNSIGNED_SHORT, 0, material.getLenght());


        }
        

    }



    updateUniforms (uniform, camera) {
        uniform.setValue("projectionMatrix", camera.projectionMatrix.matrixArray);
        uniform.setValue("viewMatrix", camera.worldMatrix.matrixArray);
        uniform.setValue("uSampler", 0);
        uniform.update(this.gl);
    }

}

export {WebGLRenderer}