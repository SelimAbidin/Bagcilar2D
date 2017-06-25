
import {Object2D} from './Object2D.js'

function Sprite2D (){
    Object2D.apply(this, []);
}


Sprite2D.prototype = Object.assign(Object.create(Object2D.prototype), {

    constructor : Sprite2D,


    
     
});


export {Sprite2D};