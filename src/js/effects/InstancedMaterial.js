import {DefaultEffect} from "./DefaultEffect";
import {Color} from "../math/Color";
import {UniformObject} from "../core/UniformObject";
var cccc = 0;
var MAX_INSTANCE = 350000;


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
        

        var f = 10;
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
        
        this.indices = [2,1,0,  1,3,2];
        this.color = [Math.random(), Math.random(), Math.random(),1];
        var r = Math.random();
        var g = Math.random();
        var b = Math.random();
        for (var i = 0; i < this.colorArray.length; i+=3) {
            
            this.colorArray[i] = r;
            this.colorArray[i+1] = g;
            this.colorArray[i+2] = b;
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
            
            gl.useProgram(this.shaderProgram);

            this.uniform = new UniformObject(gl,this.shaderProgram);

            this.offsetLocation = gl.getAttribLocation(this.shaderProgram,"offset");
            this.rotationLocation = gl.getAttribLocation(this.shaderProgram,"rotation");
            this.colorLocation = gl.getAttribLocation(this.shaderProgram,"color");
            this.positionLocation =  gl.getAttribLocation(this.shaderProgram,"position");
            this.uvLocation =  gl.getAttribLocation(this.shaderProgram,"uv");
          //  this.texture0Location =  gl.getUniformLocation(this.shaderProgram,"uSampler");

            this.rotateBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.rotateBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, this.rotateArray, gl.DYNAMIC_DRAW);
            gl.vertexAttribPointer(this.rotationLocation, 1, gl.FLOAT, false, 0, 0);
            angExt.vertexAttribDivisorANGLE(this.rotationLocation , 1);

            var offsetLoc = gl.getAttribLocation(this.shaderProgram,"offset");
            this.offsetBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.offsetBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, this.offset, gl.DYNAMIC_DRAW);
            gl.vertexAttribPointer(offsetLoc, 2, gl.FLOAT, false, 0, 0);
            angExt.vertexAttribDivisorANGLE(offsetLoc , 1);


            var colorLoc = gl.getAttribLocation(this.shaderProgram,"color");
            this.colorBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, this.colorArray, gl.STATIC_DRAW);
            gl.vertexAttribPointer(colorLoc, 3, gl.FLOAT, false, 0, 0);
            angExt.vertexAttribDivisorANGLE(colorLoc , 1);
            
            



            this.buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

            var positionLocation = this.positionLocation;
            gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

            
            this.indexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);

            this.uvBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.uv), gl.STATIC_DRAW);
            gl.vertexAttribPointer(this.uvLocation, 2, gl.FLOAT, false, 0, 0);



            var texture = gl.createTexture();
            var image = window.flame;
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.bindTexture(gl.TEXTURE_2D, texture);


            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
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