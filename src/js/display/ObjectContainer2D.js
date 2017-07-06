import {Object2D} from "./Object2D.js";


class ObjectContainer2D extends Object2D {
    
    constructor (){
        super();
        this.children = [];

    }

    addChild (child) {

        if(child instanceof Object2D) {
        
            child.stage = this.stage;
            child.context = this.context;
            this.children.push(child);
        
        } else {
        
            console.log("child should be Object2D instance");
        
        }
    }

    update (){
        
        super.update();
        for (var i = 0; i < this.children.length; i++) {
            this.children[i].update();
        }

    }
}

export {ObjectContainer2D};