import {EventableObject} from "../core/EventableObject";

class Color extends EventableObject{

    constructor (r,g,b,a){
        
        super();
        this.elements = [];
        this.elements[0] = r === undefined ? 1 : r;
        this.elements[1] = g === undefined ? 1 : g;
        this.elements[2] = b === undefined ? 1 : b;
        this.elements[3] = a === undefined ? 1 : a;

        
    }


}

export {Color};