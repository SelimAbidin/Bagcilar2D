
import {ObjectContainer2D} from "./ObjectContainer2D";
import {InstancedMaterial} from "../effects/InstancedMaterial";



class Sprite extends ObjectContainer2D {

    constructor (params) {
        super();
        
        var f = 20;
        this.vertices = [
            -f,  f, // left - top
            -f, -f, // left - bottom
            f,  f, // right - top
            f, -f, // right - bottom
        ];

        this.uv = [
            0,1,
            0,0,
            1,1,
            1,0
        ];
        
        this.indices = [0,1,2,  1,3,2];
        this.color = [Math.random(), Math.random(), Math.random(),1];
        
        for(var str in params){
            var param = str;
            this[param] = params[str];        
        }
        

        if(!this.material){
            this.material = InstancedMaterial.getInstance();
        }
        
    }

    updateMaterial (gl) {
        
       
        
        if(!this.material.isUploaded){
            this.material.upload(gl);
        }
    }

    upload () {
        

    }

    update  () {
        //super.update();   
    }

    draw  (){

        
    }
}


export {Sprite};