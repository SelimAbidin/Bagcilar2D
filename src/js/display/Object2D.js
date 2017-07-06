
import {EventableObject} from "../core/EventableObject.js";
import {Matrix3} from "../math/Matrix3";


var Object2D = (function(){

    function Object2D(){
        EventableObject.apply(this, arguments);

        this.rotationMatrix = new Matrix3();
        this.scaleMatrix = new Matrix3();
        this.positionMatrix = new Matrix3();
        this.worldMatrix = new Matrix3();
    }

    Object2D.prototype = Object.assign(Object.create(EventableObject.prototype), {

        isRotationDirty : true,
        rotation : 0,
        stage : undefined,
        context : undefined,
        isScaleDirty : true,
        isPositionDirty : true,
        scaleX : 1, 
        scaleY : 1,
        xPos : 0,
        yPos : 0,
        needsCalculation : true,
        constructer : Object2D,

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
            
            this.worldMatrix.makeIdentity();
            
            this.updateScale();
            this.updateRotation();
            this.updatePosition();

            this.worldMatrix.multiplyMatrix(this.positionMatrix);
            this.worldMatrix.multiplyMatrix(this.rotationMatrix);
            this.worldMatrix.multiplyMatrix(this.scaleMatrix); 
            
        },

        update : function () {
            this.updateWorldMatrix();
        }


    });

    return Object2D;
})();

export {Object2D};