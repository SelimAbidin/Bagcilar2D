
import {EventableObject} from "../core/EventableObject.js";
import {Matrix3} from "../math/Matrix3";


var Object2D = (function(){

    function Object2D(){
        EventableObject.apply(this, arguments);
    }




    Object2D.prototype = Object.assign(Object.create(EventableObject.prototype), {

        isRotationDirty : true,
        rotation : 0,
        isScaleDirty : true,
        isPositionDirty : true,
        scaleX : 1, 
        scaleY : 1,
        xPos : 0,
        yPos : 0,

        constructer : Object2D,
        
        rotationMatrix : new Matrix3(),
        scaleMatrix : new Matrix3(),
        positionMatrix : new Matrix3(),
        worldMatrix : new Matrix3(),
        

        setRotation : function (v){
            this.rotation = v;
            this.isRotationDirty = true;
        },

        getRotation : function(){
            return this.rotation;
        },

        updateRotation : function(){
            this.rotationMatrix.setRotationZ(this.rotation);
            this.isRotationDirty = false;
        },

        updateScale : function(){
            this.scaleMatrix.setScale(this.scaleX, this.scaleY);
            this.isScaleDirty = false;
        },

        updatePosition : function(){
            this.positionMatrix.translate(this.xPos, this.yPos);
            this.isPositionDirty = false;
        },

        setScale : function (scale) {
            this.scaleX = scale;
            this.scaley = scale;
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

        setX : function(x) {
            this.xPos = x;
            this.isPositionDirty = true;
        },

        setY : function(y) {
            this.yPos = y;
            this.isPositionDirty = y;
        },

        getX : function() {
            return this.xPos;
        },

        getY : function() {
            return this.yPos;
        },
        

        updateWorldMatrix : function (){
            
            
            if(this.isScaleDirty || this.isPositionDirty || this.isRotationDirty){

                this.worldMatrix.makeIdentity();
                
                this.updateScale();
                this.updateRotation();
                this.updatePosition();

               // this.worldMatrix.multiplyMatrix(this.scaleMatrix); 
              //  this.worldMatrix.multiplyMatrix(this.rotationMatrix);
                this.worldMatrix.multiplyMatrix(this.positionMatrix);

            }

        }


    });

    return Object2D;
})();

export {Object2D};