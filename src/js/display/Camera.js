import {Matrix3} from  "../math/Matrix3.js";
import {Object2D} from  "./Object2D.js";


class Camera extends Object2D{

    constructor (){
        super();
        this.projectionMatrix = new Matrix3();
        //this.projectionMatrix.makeOrtho(-250, 250, -250, 250);
        this.projectionMatrix.makeOrtho(-250, 250, 250, -250);
        
    }



    updateWorldMatrix (){
        
        super.updateWorldMatrix();
    }

}

export {Camera};