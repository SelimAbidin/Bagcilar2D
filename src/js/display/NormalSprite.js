import {Transform2D} from "../math/Transform2D";
import {ObjectContainer2D} from "./ObjectContainer2D.js";


class NormalSprite extends ObjectContainer2D {

    constructor () {
        
        super();

        this.translate = new Transform2D();
        this.width = 10;
        this.height = 30;
        
        var f = 16;

      
        this.vertices  = [
            -f,  f, // left - top
            -f, -f, // left - bottom
            f,  f, // right - top
            f, -f, // right - bottom
        ];
        
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

        //super.update();
        //console.log(this.positionMatrix.matrixArray);
        //this.updateWorldMatrix();
        //this.updateScale();
        //this.updateRotation();
        //this.updatePosition();
        //this.translate


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

        p1x = this.xPos + (p1x * mm00) + (mm10 * p1y); 
        p1y = this.yPos +  (-w * mm01) + (mm11 * p1y); 
        
        var p2x = -w;
        var p2y = -h;

        p2x = this.xPos + (p2x * mm00) + (mm10 * p2y); 
        p2y = this.yPos + (-w * mm01) + (mm11 * p2y); 

        var p3x = w; 
        var p3y = h;
        
        p3x = this.xPos +  (p3x * mm00) + (mm10 * p3y); 
        p3y = this.yPos + (w * mm01) + (mm11 * p3y); 
        

        var p4x = w; 
        var p4y = -h;

        p4x = this.xPos + (p4x * mm00) + (mm10 * p4y); 
        p4y = this.yPos + (w * mm01) + (mm11 * p4y); 

        // this.p1x = p1x;
        // this.p2x = p2x;
        // this.p3x = p3x;
        // this.p4x = p4x;

        // this.p1y = p1y;
        // this.p2y = p2y;
        // this.p3y = p3y;
        // this.p4y = p4y;

        this.vertices[0] = p1x; 
        this.vertices[1] = p1y; 

        this.vertices[2] = p2x;//p2x; 
        this.vertices[3] = p2y;

        this.vertices[4] = p3x; 
        this.vertices[5] = p3y;//p3y; 

        this.vertices[6] = p4x;
        this.vertices[7] = p4y; 

        
        // this.vertices[0] = -f + this.xPos; 
        // this.vertices[1] =  f + this.yPos; 

        // this.vertices[2] = -f + this.xPos; 
        // this.vertices[3] =  -f + this.yPos;

        // this.vertices[4] = f + this.xPos; 
        // this.vertices[5] =  f + this.yPos; 

        // this.vertices[6] = f + this.xPos; 
        // this.vertices[7] =  -f + this.yPos; 

    }






}

export {NormalSprite};