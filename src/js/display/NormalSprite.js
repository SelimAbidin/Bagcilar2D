import {Transform2D} from "../math/Transform2D";
import {Vector2} from "../math/Vector2";
import {ObjectContainer2D} from "./ObjectContainer2D.js";
import {Square} from "./Square.js";


class NormalSprite extends ObjectContainer2D {

    constructor (texture) {
        
        super();

        this.translate = new Transform2D();
        this.width = 10;
        this.height = 30;
        
        var f = 16;
        this.texture = texture;

        this.vertices  = [
            new Vector2(-f,  f), // left - top
            new Vector2(-f, -f), // left - bottom
            new Vector2(f,  f), // right - top
            new Vector2(f, -f), // right - bottom
        ];
        
        this.colors = [];

        this.colors[0] = 1;
        this.colors[1] = 1;
        this.colors[2] = 1;


        this.colors[3] = 1;
        this.colors[4] = 1;
        this.colors[5] = 1;


        this.colors[6] = 1;
        this.colors[7] = 1;
        this.colors[8] = 1;


        this.colors[9]  = 1;
        this.colors[10] = 1;
        this.colors[11] = 1;
    }

    setTintColor (r,g,b) {

        for (var i = 0; i < this.colors.length; i+=3) {
            
            this.colors[i] = r;
            this.colors[i + 1] = g;
            this.colors[i + 2] = b;
            
        }


    }

    update () {

        super.update();

        var bh = 18;
        var bw = 15;
        
        var w = bw * this.scaleX;
        var h = bh * this.scaleY;

        var posX = this.position.x;
        var posY = this.position.y;

        var p1x = -w; 
        var p1y = h;

        var p2x = -w;
        var p2y = -h;

        var p3x = w; 
        var p3y = h;

        var p4x = w; 
        var p4y = -h;
        
        var rot = this.rotation;

        
        

        var mm00 = Math.cos(rot);
        var mm01 = Math.sin(rot);
        var mm10 = -mm01;
        var mm11 =  mm00;

        p1x = posX + (p1x * mm00) + (mm10 * p1y); 
        p1y = posY + (-w * mm01) + (mm11 * p1y); 
        
        p2x = posX + (p2x * mm00) + (mm10 * p2y); 
        p2y = posY + (-w * mm01) + (mm11 * p2y); 

        p3x = posX +  (p3x * mm00) + (mm10 * p3y); 
        p3y = posY + (w * mm01) + (mm11 * p3y); 
        
        p4x = posX + (p4x * mm00) + (mm10 * p4y); 
        p4y = posY + (w * mm01) + (mm11 * p4y); 
       

        var pv1 = this.vertices[0];
        var pv2 = this.vertices[1];
        var pv3 = this.vertices[2];
        var pv4 = this.vertices[3];

        pv1.x = p1x; 
        pv1.y = p1y; 

        pv2.x = p2x;//p2x; 
        pv2.y = p2y;

        pv3.x = p3x; 
        pv3.y = p3y;//p3y; 

        pv4.x = p4x;
        pv4.y = p4y;

        if(!(this.parent instanceof Square)) {

            pv1.mulMatrix3(this.parent.worldMatrix);
            pv2.mulMatrix3(this.parent.worldMatrix);
            pv3.mulMatrix3(this.parent.worldMatrix);
            pv4.mulMatrix3(this.parent.worldMatrix);
        }

    }

}

export {NormalSprite};