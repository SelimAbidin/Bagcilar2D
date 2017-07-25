import {EventableObject} from "../core/EventableObject";
import {InstancedMaterial} from "../effects/InstancedMaterial";
import {RegularEffect} from "../effects/RegularEffect";
import {Sprite} from "../display/Sprite";

class WebGLRenderer extends EventableObject
{
    constructor (square, gl) {
        super();
        this.infoID = 0;
        this.gl = gl;
        this._materials = [];
        this.square = square;

        this.material = new RegularEffect();

        gl.disable(gl.STENCIL_TEST);
        gl.disable(gl.DEPTH_TEST);
        
        gl.scissor(0, 0, 200, 200);
        
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

    renderSprite (sprite) {

        var material = RegularEffect.getEmptyInstance();

        // if(this._materials.indexOf(material) == -1) {

        //     this._materials.push(material);
        // }

        if(this.infoID != material.renderID) {
            this._materials.push(material);
            material.upload(this.gl);
        }


        material.renderID = this.infoID;
        material.next();


        
        material.appendVerices(sprite.vertices);
      //  material.appendColors(sprite.colors);
    }


    present2 (camera) {

        var gl = this.gl;

        for (var i = 0; i < this._materials.length; i++) {

            var material =  this._materials[i];
            var uniform = material.uniform;

            gl.useProgram(material.shaderProgram);
           
            uniform.setValue("projectionMatrix", camera.projectionMatrix.matrixArray);
            uniform.setValue("viewMatrix", camera.worldMatrix.matrixArray);
            uniform.setValue("uSampler", 0);
            uniform.update(this.gl);

            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, material.textureBuffer);
            
            gl.bindBuffer(gl.ARRAY_BUFFER, material.vertexBuffer);
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, material.vertices);
            gl.vertexAttribPointer(material.positionLocation, 2, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, material.uvBuffer);
            gl.vertexAttribPointer(material.uvLocation, 2, gl.FLOAT, false, 0,   0);

           // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, material.indexBuffer);
            var size = material.indices.length;
            var nsize = material.getLenght() * 6;

            
            gl.drawElements(gl.TRIANGLES, nsize, gl.UNSIGNED_SHORT, 0);

            material.reset();


        }

        
      
    }




}

export {WebGLRenderer}