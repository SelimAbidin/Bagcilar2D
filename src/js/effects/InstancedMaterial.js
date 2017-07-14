import {DefaultEffect} from "./DefaultEffect";
import {Color} from "../math/Color";
import {UniformObject} from "../core/UniformObject";
var cccc = 0;
var MAX_INSTANCE = 1000000;

var _materialInstance;
class InstancedMaterial extends DefaultEffect {
    
    constructor (color) {
        super();
        this.count = 0;
        this.id = "id_"+cccc++;
        this.isUploaded = false;
        this._color = color;
        
        this.offset = new Float32Array( 2 * MAX_INSTANCE);
        this.colorArray = new Float32Array( 3 * MAX_INSTANCE);
        this.rotateArray = new Float32Array(MAX_INSTANCE);
        

        for (var i = 0; i < this.colorArray.length; i+=3) {
            
            this.colorArray[i] = Math.random();
            this.colorArray[i+1] = Math.random();
            this.colorArray[i+2] = Math.random();
            
        }

    }

    
    static getInstance() {

        if(!_materialInstance){
            _materialInstance = new InstancedMaterial();
        }

        return _materialInstance;
    }
    
    reset () {
        this.count = -1;
    }
    
    addPosition (x, y) {

        var index = this.count * 2;
        this.offset[index] = x;
        this.offset[index + 1] = y;
    }

    addRotation (radian) {
        this.rotateArray[this.count] = radian;
    }

    next () {
        this.count++;
    }

    getLenght () {
        return this.count + 1;
    }

    upload (gl, angExt){
        

        if(!this.isUploaded)
        {
             var vertexShaderSRC =  document.getElementById( 'vertexShaderInstanced' ).textContent;

            var fragmentShaderSRC = document.getElementById( 'fragmentShaderInstanced' ).textContent;
            
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
            
            
            this.uniform = new UniformObject(gl,this.shaderProgram);


            var rotationLoc = gl.getAttribLocation(this.shaderProgram,"rotation");
            this.rotateBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.rotateBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, this.rotateArray, gl.STATIC_DRAW);
            gl.vertexAttribPointer(rotationLoc, 1, gl.FLOAT, false, 0, 0);
            angExt.vertexAttribDivisorANGLE(rotationLoc , 1);

            var offsetLoc = gl.getAttribLocation(this.shaderProgram,"offset");
            this.offsetBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.offsetBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, this.offset, gl.STATIC_DRAW);
            gl.vertexAttribPointer(offsetLoc, 2, gl.FLOAT, false, 0, 0);
            angExt.vertexAttribDivisorANGLE(offsetLoc , 1);


            var colorLoc = gl.getAttribLocation(this.shaderProgram,"color");
            this.colorBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, this.colorArray, gl.STATIC_DRAW);
            gl.vertexAttribPointer(colorLoc, 3, gl.FLOAT, false, 0, 0);
            angExt.vertexAttribDivisorANGLE(colorLoc , 1);
            
            this.offsetLocation = gl.getAttribLocation(this.shaderProgram,"offset");
            this.rotationLocation = gl.getAttribLocation(this.shaderProgram,"rotation");
            this.colorLocation = gl.getAttribLocation(this.shaderProgram,"color");
            this.positionLocation =  gl.getAttribLocation(this.shaderProgram,"position");


            this.isUploaded = true;
        }
       
    }
    
    set color (value){
        
        this._color = value;
    }

    get color (){

        return this._color;
    }


    draw (gl){


        // if(!this.shaderProgram){
        //     this.upload(gl);
        // }
        // console.log("use program");
        // gl.useProgram(this.shaderProgram);
        // this.uniform.update(gl);
    }

}


export {InstancedMaterial};