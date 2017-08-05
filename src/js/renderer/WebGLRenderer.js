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

     

        this.regularEffect = new RegularEffectTest();

       

    }

    prepareForRender (camera) {

        this.currentCamera = camera;
        this.currentMaterial = undefined;
        this.regularEffect.reset();
        this.infoID++;
    }

    renderSprite (sprite) {

        if(!this.regularEffect.hasRoom()) {
            this.present3(this.currentCamera);
            this.regularEffect.reset();
        }
        
        this.regularEffect.upload(this.gl);
        this.regularEffect.next();
        this.regularEffect.appendVerices2(sprite.vertices, sprite.texture,  sprite.colors);
    }

    present3 (camera) {
            
        var gl = this.gl;
        var material = this.regularEffect;

        if(material.getLenght() <= 0) return;


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

        this.currentMaterial = undefined;
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