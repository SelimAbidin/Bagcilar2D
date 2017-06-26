
import {EventableObject} from "../core/EventableObject.js";
import {Matrix3} from "../Math/Matrix3.js";


var Object2D = (function(){

    function Object2D(){
        EventableObject.apply(this, arguments);
    }

    let rotation = 0;
    let isRotationDirty = true;
    let isScaleDirty = true;
    let isPositionDirty = true;
    let scaleX = 1, scaleY = 1;
    let xPos = 0, yPos = 0; 


    Object2D.prototype = Object.assign(Object.create(EventableObject.prototype), {

        constructer : Object2D,
        
        rotationMatrix : new Matrix3(),
        scaleMatrix : new Matrix3(),
        positionMatrix : new Matrix3(),
        worldMatrix : new Matrix3(),
        

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

        updatePosition : function(){
            this.positionMatrix.translate(xPos, yPos);
            isPositionDirty = false;
        },

        setScale : function (scale) {
            this.scaleX = scale;
            this.scaley = scale;
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

        setX : function(x) {
            xPos = x;
            isPositionDirty = true;
        },

        setY : function(y) {
            yPos = y;
            isPositionDirty = y;
        },

        getX : function() {
            return xPos;
        },

        getY : function() {
            return yPos;
        },
        

        updateWorldMatrix : function (){

            if(isScaleDirty || isPositionDirty || isRotationDirty){

                this.worldMatrix.makeIdentity();

                this.updateScale();
                this.updateRotation();
                this.updatePosition();

                this.worldMatrix.multiplyMatrix(this.scaleMatrix); 
                this.worldMatrix.multiplyMatrix(this.rotationMatrix);
                this.worldMatrix.multiplyMatrix(this.positionMatrix);
                
            }
            

        }


    });

    return Object2D;
})();

export {Object2D};