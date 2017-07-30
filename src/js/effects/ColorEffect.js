import {DefaultEffect} from "./DefaultEffect";
import {Color} from "../math/Color";
import {UniformObject} from "../core/UniformObject";
var cccc = 0;
class ColorEffect extends DefaultEffect {

    constructor (color) {
        super();
        this.id = "id_"+cccc++;
        this.isUploaded = false;
        this._color = color;
    }

    upload (gl){
        
        var vertexShaderSRC =  "uniform mat3 modelMatrix;"+
                               "uniform mat3 projectionMatrix;"+
                               "uniform mat3 viewMatrix;"+
                                "attribute vec2 position;"+      
                                "void main() {"+
                                "   vec3 pos = vec3(position.x,position.y, 1.0);"+
                                "   mat3 m =  projectionMatrix * (modelMatrix * viewMatrix);"+  
                                "   vec3 pm = m * pos;"+     
                                "   gl_Position = vec4(pm.x,pm.y, 0, 1.0);"+     
                                "   gl_PointSize = 10.0;"+     
                                "}";

        var fragmentShaderSRC =   "precision mediump float;"+
                                    "uniform vec4 color;"+
                                    "void main() {"+        
                                    "   gl_FragColor = color;"+     
                                    "}";

        this.fragmentShaderBuffer = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource( this.fragmentShaderBuffer, fragmentShaderSRC );
        gl.compileShader( this.fragmentShaderBuffer );
        
        if ( !gl.getShaderParameter(this.fragmentShaderBuffer, gl.COMPILE_STATUS) ) {
            let finfo = gl.getShaderInfoLog( this.fragmentShaderBuffer );
            throw "Could not compile WebGL program. \n\n" + finfo;
        }

        this.vertexSahderBuffer = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource( this.vertexSahderBuffer, vertexShaderSRC );
        gl.compileShader( this.vertexSahderBuffer );

        if ( !gl.getShaderParameter(this.fragmentShaderBuffer, gl.COMPILE_STATUS) ) {
            let info = gl.getShaderInfoLog( this.fragmentShaderBuffer );
            throw "Could not compile WebGL program. \n\n" + info;
        }


        this.shaderProgram = gl.createProgram();
        gl.attachShader(this.shaderProgram, this.vertexSahderBuffer);
        gl.attachShader(this.shaderProgram, this.fragmentShaderBuffer);
        gl.linkProgram(this.shaderProgram);
        this.isUploaded = true;

        this.uniform = new UniformObject(gl,this.shaderProgram);
        this.color = this._color;
        this.uniform.setValue("color", this.color.elements);
    }
    
    set color (value){
        
        this._color = value;
    }

    get color (){

        return this._color;
    }


    draw (gl){

        if(!this.shaderProgram){
            this.upload(gl);
        }
        
        gl.useProgram(this.shaderProgram);
        this.uniform.update(gl);
    }

}


export {ColorEffect};