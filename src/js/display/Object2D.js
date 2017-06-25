
import {EventableObject} from '../core/EventableObject.js';
import {Matrix2} from '../Math/Matrix2.js';


var Object2D = (function(){

    function Object2D(){
        EventableObject.apply(this, arguments);
    }

    var rotation = 0;

    Object2D.prototype = Object.assign(Object.create(EventableObject.prototype), {

        constructer : Object2D,
        isRotationDirty : true,
        isScaleDirty : true,
        rotationMatrix : new Matrix2(),
        scaleMatrix : new Matrix2(),
        worldMatrix : new Matrix2(),
        scaleX :1, 
        scaleY :1, 

        setRotation : function (v){
            rotation = v;
            this.isRotationDirty = true;
        },

        getRotation : function(){
            return rotation;
        },

        updateRotation : function(){
                this.rotationMatrix.setRotationZ(rotation);
                this.isRotationDirty = false;
        },

        updateScale : function(){
                this.scaleMatrix.setScale(this.scaleX, this.scaleY);
                this.isScaleDirty = false;
        },

        setScale : function (scale) {
            this.scaleX = scale;
            this.scaley = scale;
            //this.scaleMatrix.setScale(scale, scale);
            this.isScaleDirty = true;
        },

        setScaleX : function (x) {
            this.scaleX = x;
            this.isScaleDirty = true;
        },

        setScaleY : function (y) {
            this.scaleY = y;
            this.isScaleDirty = true;
        },

        getScaleY : function(){
            return this.scaleY;
        },

        getScaleX : function(){
            return this.scaleX;
        },

        updateWorldMatrix : function (){

            this.worldMatrix.makeIdentity();

            if(this.isScaleDirty){
                this.updateScale();
                //console.log(this.scaleMatrix.matrixArray);
                this.worldMatrix.multiplyMatrix2(this.scaleMatrix);
            }

            if(this.isRotationDirty){

                this.updateRotation();
                this.worldMatrix.multiplyMatrix2(this.rotationMatrix);
            }  

            

            
        }


    });

return Object2D;
})();

export {Object2D};