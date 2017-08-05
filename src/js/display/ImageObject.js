import {EventableObject} from "../core/EventableObject.js";

class ImageObject extends EventableObject {

    constructor (url) {

        super();

        if(url !== undefined) {
            
            this.setImageUrl(url);
        }
         
    }

    setImageUrl (url) {
        this.url = url;
        this._srcImage = new Image();
        this._srcImage.onload = this.onLoadImage.bind(this);
        this._srcImage.onerror = this.onErrorImage.bind(this);
        this._srcImage.src = url;

    }

    onLoadImage (event) {
        this.dispacthEvent(ImageObject.COMPLETE, {rawEvent:event});
    }

    onErrorImage (event) {
        this.dispacthEvent(ImageObject.ERROR, {rawEvent:event});
    }

    upload (gl) {

        if(!this.textureBuffer) {
            
            this.textureBuffer = gl.createTexture();
            this.textureBuffer.url = this.url;
            gl.bindTexture(gl.TEXTURE_2D, this.textureBuffer);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this._srcImage);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        }
        
    }
    


}

ImageObject.COMPLETE = "onImageComplete";
ImageObject.ERROR = "onImageError";

export {ImageObject};