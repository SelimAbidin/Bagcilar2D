import {Object2D} from "./Object2D.js";


class ObjectContainer2D extends Object2D {
    
    constructor (){
        this.children = [];
    }

    addChild (object2D) {
        if(object2D instanceof Object2D){
            this.children.push(object);
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