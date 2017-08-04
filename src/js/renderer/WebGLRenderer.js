import {EventableObject} from "../core/EventableObject";
import {RegularEffectTest} from "../effects/RegularEffectTest";

class WebGLRenderer extends EventableObject
{
    constructor (square, gl) {
        super();
        this.infoID = 0;
        this.gl = gl;
        this._materials = [];
        this.square = square;

        this.typedArray = new Int32Array(16);
        gl.disable(gl.STENCIL_TEST);
        gl.disable(gl.DEPTH_TEST);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        
        this._deadEffects = [];
        this._activeEffects = [];

        

        for (var i = 0; i < 50; i++) {

            var effect = new RegularEffectTest();
            effect.reset();
            this._deadEffects.push(effect);
        }

    }

    prepareForRender () {

        this.currentMaterial = undefined;

        for (var i = 0; i < this._activeEffects.length; i++) {
            this._deadEffects.push(this._activeEffects[i]);
            this._activeEffects[i].reset();
        }
        
        this._activeEffects.length = 0;
        this._materials.length = 0;
        this.infoID++;
    }

    renderSprite (sprite) {

        //var material = RegularEffect.getEmptyInstance();

        if(this.currentMaterial === undefined || !this.currentMaterial.hasRoom()) {
            
           // this.present3(meydan.camera);

            this.currentMaterial = this._deadEffects[0];
            this.currentMaterial.upload(this.gl);
            this._activeEffects.push(this.currentMaterial);
            this._deadEffects.splice(0,1);
        }
        
        // if(this.infoID != material.renderID) {
        //     this._materials.push(material);
        //     material.upload(this.gl);
        // }

        this.currentMaterial.renderID = this.infoID;
        this.currentMaterial.next();

        this.currentMaterial.appendVerices2(sprite.vertices, sprite.texture,  sprite.colors);
        // this.currentMaterial.appendVerices(sprite.vertices);
        // this.currentMaterial.appendColors(sprite.colors);
        // this.currentMaterial.appendTextureID(sprite.texture);
        
    }

     present3 (camera) {

        var gl = this.gl;

        for (var i = 0; i < this._activeEffects.length; i++) {
            
             var material = this._activeEffects[i];
            var uniform = material.uniform;

            gl.useProgram(material.shaderProgram);
           
            uniform.setValue("projectionMatrix", camera.projectionMatrix.matrixArray);
            uniform.setValue("viewMatrix", camera.worldMatrix.matrixArray);
          
            
            var txts = material.textures;

            for (var j = 0; j < txts.length; j++) {

                var element = txts[j];
                element.upload(gl);
                gl.activeTexture(gl.TEXTURE0 + j);
                gl.bindTexture(gl.TEXTURE_2D, element.textureBuffer);
                this.typedArray[j] = j;
            }
            
            uniform.setValue("uSampler[0]", this.typedArray );
            uniform.update(this.gl);
            
            gl.bindBuffer(gl.ARRAY_BUFFER, material.vertexBuffer);
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, material.vertices);

            //console.log(material.id,  material.vertices[0], material.vertices[1]);

            gl.vertexAttribPointer(material.positionLocation, 2, gl.FLOAT, false,  32, 0);
            gl.enableVertexAttribArray(material.positionLocation);

            gl.vertexAttribPointer(material.textureIDLocation, 1, gl.FLOAT, false, 32, 8);
            gl.enableVertexAttribArray(material.textureIDLocation);

            gl.vertexAttribPointer(material.uvLocation, 2, gl.FLOAT, false, 32, 12);
            gl.enableVertexAttribArray(material.uvLocation);

            gl.vertexAttribPointer(material.colorLocation, 3, gl.FLOAT, false, 32, 20);
            gl.enableVertexAttribArray(material.colorLocation);

            //gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, material.indexBuffer);
            var nsize = material.getLenght() * 6;

            gl.drawElements(gl.TRIANGLES, nsize, gl.UNSIGNED_SHORT, 0);

        }

        this.currentMaterial = undefined;

        if(this.currentMaterial !== undefined) {
            
           

        }

            
    }









    present2 (camera) {

        var gl = this.gl;

        if(gl.isContextLost()) {
            return;
        }


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


            gl.bindBuffer(gl.ARRAY_BUFFER, material.colorBuffer);
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, material.colors);
            gl.vertexAttribPointer(material.colorLocation, 3, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, material.uvBuffer);
            gl.vertexAttribPointer(material.uvLocation, 2, gl.FLOAT, false, 0,   0);

            // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, material.indexBuffer);
            var nsize = material.getLenght() * 6;

            
            gl.drawElements(gl.TRIANGLES, nsize, gl.UNSIGNED_SHORT, 0);

            material.reset();
        }
    }




}

export {WebGLRenderer};