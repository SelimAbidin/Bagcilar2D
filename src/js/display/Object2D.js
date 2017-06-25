
import {EventableObject} from '../core/EventableObject.js';

function Object2D(){
    EventableObject.apply(this, arguments);
}


Object2D.prototype = Object.assign(Object.create(EventableObject.prototype), {

    constructer : Object2D,

    


});

export {Object2D};