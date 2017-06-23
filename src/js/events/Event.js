
import {CoreObject} from '../core/CoreObject.js';


function Event(type, context, listener, priority){
    
    CoreObject.apply(this, arguments);
    
    if(priority === undefined) {
        priority = 0;
    }

    this.priority   = priority;
    this.type       = type;
    this.listener   = listener;
    this.context    = context;
}

Event.prototype = Object.assign(Object.create(CoreObject.prototype), {
    
    constructor : Event

});

export {Event};
