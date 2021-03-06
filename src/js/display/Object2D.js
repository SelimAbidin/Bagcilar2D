
import {EventableObject} from "../core/EventableObject.js";
import {Matrix3} from "../math/Matrix3";
import {Vector3} from "../math/Vector3";


class Object2D  extends EventableObject{

    constructor (){

        super();

        this.isRotationDirty = true;
        this.rotation = 0;
        this.stage = undefined;
        this.context = undefined;
        this.isScaleDirty = true;
        this.isPositionDirty = true;
        this.scaleX = 1; 
        this.scaleY = 1;
        // this.xPos = 0;
        // this.yPos = 0;

        this.position = new Vector3(0,0,1);
      

        this.needsCalculation = true;
        this.rotationMatrix = new Matrix3();
        this.scaleMatrix = new Matrix3();
        this.positionMatrix = new Matrix3();
        this.worldMatrix = new Matrix3();
    
    }

    setRotation (v){
        this.rotation = v;
        this.isRotationDirty = true;
    }

    getRotation (){
        return this.rotation;
    }

    updateRotation (){
        this.rotationMatrix.setRotationZ(this.rotation);
        this.isRotationDirty = false;
    }

    updateScale (){
        this.scaleMatrix.setScale(this.scaleX, this.scaleY);
        this.isScaleDirty = false;
    }

    updatePosition (){
        this.positionMatrix.translate(this.position.x, this.position.y);
        this.isPositionDirty = false;
    }

    setScale (scale) {
        this.scaleX = scale;
        this.scaley = scale;
        this.isScaleDirty = true;
    }

    setScaleX (x) {
        this.scaleX = x;
        this.isScaleDirty = true;
    }

    setScaleY (y) {
        this.scaleY = y;
        this.isScaleDirty = true;
    }

    getScaleY (){
        return this.scaleY;
    }

    getScaleX (){
        return this.scaleX;
    }
    
    updateWorldMatrix (){
            
        this.worldMatrix.makeIdentity();
            
        this.updateScale();
        this.updateRotation();
        this.updatePosition();

        this.worldMatrix.multiplyMatrix(this.positionMatrix);

        this.worldMatrix.multiplyMatrix(this.rotationMatrix);
        this.worldMatrix.multiplyMatrix(this.scaleMatrix); 

    }

    update  () {
        this.updateWorldMatrix();
    }
}
export {Object2D};