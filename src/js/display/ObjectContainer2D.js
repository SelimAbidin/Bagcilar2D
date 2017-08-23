import {Object2D} from "./Object2D.js";


class ObjectContainer2D extends Object2D {
    
    constructor (){

        super();
        this.children = [];

    }

    addChild (child) {

        if(child instanceof Object2D) {
            child.stage = this.stage;
            child.parent = this;
            child.context = this.context;
            this.children.push(child);
        
        } else {
        
            throw "child should be Object2D instance";
        
        }
    }

    update (){
        super.update();
    }
}

export {ObjectContainer2D};