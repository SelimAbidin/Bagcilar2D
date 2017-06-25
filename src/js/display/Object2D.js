
import {EventableObject} from "../core/EventableObject.js";
import {Matrix2} from "../Math/Matrix2.js";


var Object2D = (function(){

    function Object2D(){
        EventableObject.apply(this, arguments);
    }

    let rotation = 0;
    let isRotationDirty = true;
    let isScaleDirty = true;
    let scaleX = 1, scaleY = 1;

    Object2D.prototype = Object.assign(Object.create(EventableObject.prototype), {

        constructer : Object2D,
        
        rotationMatrix : new Matrix2(),
        scaleMatrix : new Matrix2(),
        worldMatrix : new Matrix2(),
        

        setRotation : function (v){
            rotation = v;
            isRotationDirty = true;
        },

        getRotation : function(){
            return rotation;
        },

        updateRotation : function(){
            this.rotationMatrix.setRotationZ(rotation);
            isRotationDirty = false;
        },

        updateScale : function(){
            this.scaleMatrix.setScale(this.scaleX, this.scaleY);
            isScaleDirty = false;
        },

        setScale : function (scale) {
            this.scaleX = scale;
            this.scaley = scale;
            //this.scaleMatrix.setScale(scale, scale);
            isScaleDirty = true;
        },

        setScaleX : function (x) {
            this.scaleX = x;
            isScaleDirty = true;
        },

        setScaleY : function (y) {
            this.scaleY = y;
            isScaleDirty = true;
        },

        getScaleY : function(){
            return this.scaleY;
        },

        getScaleX : function(){
            return this.scaleX;
        },

        updateWorldMatrix : function (){

            this.worldMatrix.makeIdentity();

            if(isScaleDirty){
                this.updateScale();
                this.worldMatrix.multiplyMatrix2(this.scaleMatrix);            
            }

            if(isRotationDirty){
                this.updateRotation();
                this.worldMatrix.multiplyMatrix2(this.rotationMatrix);
            }  

        }


    });

    return Object2D;
})();

export {Object2D};