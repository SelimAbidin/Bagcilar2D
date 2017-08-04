import {Transform2D} from "../math/Transform2D";
import {ObjectContainer2D} from "./ObjectContainer2D.js";



class NormalSprite extends ObjectContainer2D {

    constructor (texture) {
        
        super();

        this.translate = new Transform2D();
        this.width = 10;
        this.height = 30;
        
        var f = 16;

        this.texture = texture;
      
        this.vertices  = [
            -f,  f, // left - top
            -f, -f, // left - bottom
            f,  f, // right - top
            f, -f, // right - bottom
        ];
        
       // this.vertices = new Float32Array(this.vertices);

        this.colors = [];
        var r,g,b;
        r = Math.random();
        g = Math.random();
        b = Math.random();

        this.colors[0] = r;
        this.colors[1] = g;
        this.colors[2] = b;


        this.colors[3] = r;
        this.colors[4] = g;
        this.colors[5] = b;


        this.colors[6] = r;
        this.colors[7] = g;
        this.colors[8] = b;


        this.colors[9] = r;
        this.colors[10] = g;
        this.colors[11] = b;
    }


    update () {
        
        var bh = 18;
        var bw = 15;

        var mm00 = Math.cos(this.rotation);
        var mm01 = Math.sin(this.rotation);
        var mm10 = -mm01;
        var mm11 =  mm00;


        var w = bw * this.scaleX;
        var h = bh * this.scaleY;

        var p1x = -w; 
        var p1y = h;


        var p2x = -w;
        var p2y = -h;

        var p3x = w; 
        var p3y = h;

        var p4x = w; 
        var p4y = -h;

        p1x = this.x + (p1x * mm00) + (mm10 * p1y); 
        p1y = this.y +  (-w * mm01) + (mm11 * p1y); 
        
        p2x = this.x + (p2x * mm00) + (mm10 * p2y); 
        p2y = this.y + (-w * mm01) + (mm11 * p2y); 

        p3x = this.x +  (p3x * mm00) + (mm10 * p3y); 
        p3y = this.y + (w * mm01) + (mm11 * p3y); 
        
        p4x = this.x + (p4x * mm00) + (mm10 * p4y); 
        p4y = this.y + (w * mm01) + (mm11 * p4y); 
       

        this.vertices[0] = p1x; 
        this.vertices[1] = p1y; 

        this.vertices[2] = p2x;//p2x; 
        this.vertices[3] = p2y;

        this.vertices[4] = p3x; 
        this.vertices[5] = p3y;//p3y; 

        this.vertices[6] = p4x;
        this.vertices[7] = p4y; 

    }

}

export {NormalSprite};