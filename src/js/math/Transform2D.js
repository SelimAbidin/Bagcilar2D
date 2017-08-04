import {Matrix3} from "./Matrix3.js";


class Transform2D {

    constructor (array) {
        
        this.x = 0;
        this.y = 0;

        this.scaleX = 1;
        this.scaleY = 1;

        this.rotation = 0;
        
        this.width = 10;
        this.height = 10;

        this._tx = 0;
        this._ty = 0;


        this._scaleMatrix = new Matrix3();
        this._translateMatrix = new Matrix3();
        this._rotationMatrix = new Matrix3();

        this.worldMatrix = new Matrix3();

      

        if(array === undefined) {
            array = [
                1, 0, 0,
                0, 1, 0,
                0, 0, 0
            ];
        }

        this.elements = new Float32Array(array);
    }
    

    updateWorldMatrix () {
        
        this._scaleMatrix.scale(this.scaleX, this.scaleY);
        this._rotationMatrix.setRotationZ(this.rotation);
        this._translateMatrix.translate(this.x, this.y);
        
        this.worldMatrix.multiplySRTMatrix(this._scaleMatrix,this._rotationMatrix, this._translateMatrix);

    }


    


    

}

export {Transform2D};