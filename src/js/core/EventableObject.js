
import {CoreObject} from "./CoreObject.js";
import {Event} from "../events/Event.js";


function EventableObject() {
    CoreObject.apply(this, arguments);
}

function orderPriority (a, b){
    return a.priority < b.priority ? 1 : a.priority > b.priority ? -1 : 0;
}


EventableObject.prototype = Object.assign(Object.create(CoreObject.prototype), {

    constructor : EventableObject,

    addEventListener : function (type, scope ,listener, priority){

        if(this._listeners === undefined){
            this._listeners = {};
        }

        if(this._listeners[type] === undefined){
            this._listeners[type] = [];   
        }
        
        this._listeners[type].push(new Event(type, scope, listener,priority));
        this._listeners[type].sort(orderPriority);
    },

    dispacthEvent : function (type,data){

        if(this._listeners[type]) {

            var a = this._listeners[type];
            var element;

            for (var i = 0; i < a.length; i++) {
                element = a[i];
                element.listener.apply(element.context, [{type:element.type, target:this, data:data}]);
            }
        }
    }

});

export {EventableObject};