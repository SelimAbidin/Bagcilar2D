import {DefaultEffect} from "./DefaultEffect";
import {Color} from "../math/Color";
import {UniformObject} from "../core/UniformObject";
var cccc = 0;
var MAX_INSTANCE = 1;


var _materialInstance;
class RegularEffect extends DefaultEffect {
    
    constructor (color) {
        super();
        this.count = 0;
        this.id = "id_"+cccc++;
        this.isUploaded = false;
        

        var f = 10;
        var vv  = [
            -f,  f, // left - top
            -f, -f, // left - bottom
            f,  f, // right - top
            f, -f, // right - bottom
        ];

        var index = 0;
        var indexCounter    = 0;
        var uvCounter       = 0;
        this.vertices       = new Float32Array(8 * MAX_INSTANCE);
        this.uvs            = new Float32Array(8 * MAX_INSTANCE);
        this.indices        = new Float32Array(6 * MAX_INSTANCE);

        for (var i = 0; i < this.vertices.length; i+=8) {
            
            this.vertices[i]     = -f; this.vertices[i + 1] = f;
            this.vertices[i + 2] = -f; this.vertices[i + 3] = -f;
            this.vertices[i + 4] =  f; this.vertices[i + 5] = f;
            this.vertices[i + 6] =  f; this.vertices[i + 7] = -f;

            this.uvs[uvCounter]     = 0;
            this.uvs[uvCounter + 1] = 1;

            this.uvs[uvCounter + 2] = 0;
            this.uvs[uvCounter + 3] = 0;

            this.uvs[uvCounter + 4] = 1;
            this.uvs[uvCounter + 5] = 1;

            this.uvs[uvCounter + 6] = 1;
            this.uvs[uvCounter + 7] = 1;

            uvCounter += 8; 
            
            this.indices[indexCounter    ] = index;
            this.indices[indexCounter + 1] = index + 1;
            this.indices[indexCounter + 2] = index + 2;

            this.indices[indexCounter + 3] = index + 1;
            this.indices[indexCounter + 4] = index + 3;
            this.indices[indexCounter + 5] = index + 2;

            index += 4;
            indexCounter += 6;
        }
        

        console.log(this.vertices);
        console.log(this.indices);
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
   
    next () {
        this.count++;
    }

    getLenght () {
        return this.count + 1;
    }

    upload (gl){
        

        if(!this.isUploaded)
        {
            var vertexShaderSRC =  document.getElementById( 'vertexShader' ).textContent;
            var fragmentShaderSRC = document.getElementById( 'fragmentShader' ).textContent;
            
            this.fragmentShaderBuffer = gl.createShader(gl.FRAGMENT_SHADER);
            gl.shaderSource( this.fragmentShaderBuffer, fragmentShaderSRC );
            gl.compileShader( this.fragmentShaderBuffer );
            if ( !gl.getShaderParameter(this.fragmentShaderBuffer, gl.COMPILE_STATUS) ) {
                let finfo = gl.getShaderInfoLog( this.fragmentShaderBuffer );
                throw "Could not compile WebGL program. \n\n" + finfo;
            }

            
            this.vertexShaderBuffer = gl.createShader(gl.VERTEX_SHADER);
            gl.shaderSource( this.vertexShaderBuffer, vertexShaderSRC );
            gl.compileShader( this.vertexShaderBuffer );
            if ( !gl.getShaderParameter(this.vertexShaderBuffer, gl.COMPILE_STATUS) ) {
                let finfo = gl.getShaderInfoLog( this.vertexShaderBuffer );
                throw "Could not compile WebGL program. \n\n" + finfo;
            }

            this.shaderProgram = gl.createProgram();

            gl.attachShader(this.shaderProgram, this.vertexShaderBuffer);
            gl.attachShader(this.shaderProgram, this.fragmentShaderBuffer);
            gl.linkProgram(this.shaderProgram);


            this.positionLocation = gl.getAttribLocation(this.shaderProgram,"position");

            this.vertexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STREAM_DRAW);
            gl.vertexAttribPointer(this.positionLocation, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(this.positionLocation);


            this.indexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);


            this.uniform = new UniformObject(gl, this.shaderProgram);

            this.isUploaded = true;
        }
       
    }
   


    draw (gl){

       

    }

}


export {RegularEffect};