
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
        rotationMatrix : new Matrix2(),

        setRotation : function (v){
            rotation = v;
            this.isRotationDirty = true;
        },

        getRotation : function(){
            return rotation;
        },

        updateRotation : function(){

            if(this.isRotationDirty){
                this.rotationMatrix.setRotationZ(rotation);
                this.isRotationDirty = false;
            }
            
        }


    });

return Object2D;
})();

export {Object2D};