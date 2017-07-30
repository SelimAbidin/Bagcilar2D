import {DefaultEffect} from "./DefaultEffect";
import {UniformObject} from "../core/UniformObject";
var cccc = 0;
var MAX_INSTANCE = 14000;


var _currentEmptyInstance;
var _instancedMaterials = [];
class RegularEffect extends DefaultEffect {
    
    constructor () {
        super();
        this.count = 0;
        this.id = "id_"+cccc++;
        this.isUploaded = false;

        var f = 20;
        // var vv  = [
        //     -f,  f, // left - top
        //     -f, -f, // left - bottom
        //     f,  f, // right - top
        //     f, -f, // right - bottom
        // ];

        var index = 0;
        var indexCounter    = 0;
        var uvCounter       = 0;
        this.vertices       = new Float32Array(8 * MAX_INSTANCE);
        this.uvs            = new Float32Array(8 * MAX_INSTANCE);
        this.colors         = new Float32Array(12 * MAX_INSTANCE);
        this.indices        = new Uint16Array(6 * MAX_INSTANCE);

        var r,g,b;
        var i;
        for (i = 0; i < this.colors.length; i+=12) {
            
            r = Math.random();
            g = Math.random();
            b = Math.random();

            this.colors[i] = r;
            this.colors[i + 1] = g;
            this.colors[i + 2] = b;


            this.colors[i + 3] = r;
            this.colors[i + 4] = g;
            this.colors[i + 5] = b;


            this.colors[i + 6] = r;
            this.colors[i + 7] = g;
            this.colors[i + 8] = b;


            this.colors[i + 9] = r;
            this.colors[i + 10] = g;
            this.colors[i + 11] = b;

            
        }
        
        
        for (i = 0; i < this.vertices.length; i+=8) {
            this.vertices[i] = 0;
        }

        for (i = 0; i < this.vertices.length; i+=8) {
            
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
            this.uvs[uvCounter + 7] = 0;

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
        

    }


    appendVerices (vertices) {
        var vertexIndex = this.count * 8;
        
        this.vertices[vertexIndex] = vertices[0];
        this.vertices[vertexIndex + 1] = vertices[1];
        this.vertices[vertexIndex + 2] = vertices[2];
        this.vertices[vertexIndex + 3] = vertices[3];
        this.vertices[vertexIndex + 4] = vertices[4];
        this.vertices[vertexIndex + 5] = vertices[5];
        this.vertices[vertexIndex + 6] = vertices[6];
        this.vertices[vertexIndex + 7] = vertices[7];

    }


    appendColors (colors) {

        var vertexIndex = this.count * 12;
        this.colors[vertexIndex] = colors[0];
        this.colors[vertexIndex + 1] = colors[1];
        this.colors[vertexIndex + 2] = colors[2];
        this.colors[vertexIndex + 3] = colors[3];
        this.colors[vertexIndex + 4] = colors[4];
        this.colors[vertexIndex + 5] = colors[5];
        this.colors[vertexIndex + 6] = colors[6];
        this.colors[vertexIndex + 7] = colors[7];
        this.colors[vertexIndex + 8] = colors[8];
        this.colors[vertexIndex + 9] = colors[9];
        this.colors[vertexIndex + 10] = colors[10];
        this.colors[vertexIndex + 11] = colors[11];
    }

    hasRoom () {

        return this.getLenght() < MAX_INSTANCE;

    }




    static getEmptyInstance () {
        
        if(_currentEmptyInstance === undefined || !_currentEmptyInstance.hasRoom()) {

            for (var i = 0; i < _instancedMaterials.length; i++) {
                var element = _instancedMaterials[i];

                if(element.hasRoom()) {
                    _currentEmptyInstance = element;
                    return _currentEmptyInstance;
                }
                
            }
            
            
            _currentEmptyInstance = new RegularEffect();
            _instancedMaterials.push(_currentEmptyInstance);
        }
        
        return _currentEmptyInstance;
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
        

        if(!this.isUploaded){


            var vertexShaderSRC =  `
                uniform mat3 projectionMatrix; 
                uniform mat3 viewMatrix;
                attribute vec2 position;
                attribute vec2 uv;
                attribute vec3 color;
                varying vec3 colorVar;
                varying vec2 uvData;
                void main() {
                    uvData = uv;
                    colorVar = color;
                    vec3 newPos = vec3(position.x, position.y, 1.0 ) * (projectionMatrix * viewMatrix);
                    gl_Position = vec4(newPos , 1.0);
                }
            `;

            var fragmentShaderSRC = `
                precision lowp float;
                uniform sampler2D uSampler;
                varying vec2 uvData;
                varying vec3 colorVar;
                void main() { 
                    vec4 c = texture2D(uSampler,uvData) * vec4(colorVar, 1.0);
                    gl_FragColor = c;
                }
            `;
            
            //var vertexShaderSRC =  document.getElementById( 'vertexShader' ).textContent;
            //var fragmentShaderSRC = document.getElementById( 'fragmentShader' ).textContent;
            
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
            this.uvLocation = gl.getAttribLocation(this.shaderProgram,"uv");
            this.colorLocation = gl.getAttribLocation(this.shaderProgram,"color");

  
            this.vertexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STREAM_DRAW);
            gl.enableVertexAttribArray(this.positionLocation);
            gl.vertexAttribPointer(this.positionLocation, 2, gl.FLOAT, false, 0, 0);


            this.uvBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, this.uvs, gl.STATIC_DRAW);
            gl.enableVertexAttribArray(this.uvLocation);
            gl.vertexAttribPointer(this.uvLocation, 2, gl.FLOAT, false, 0, 0);
           

            this.colorBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.STREAM_DRAW);
            gl.vertexAttribPointer(this.colorLocation, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(this.colorLocation);

            this.indexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);


            // var n = gl.getProgramParameter(this.shaderProgram, gl.ACTIVE_ATTRIBUTES);
            // for (var i = 0; i < n; i++) {
            //     gl.getActiveAttrib(this.shaderProgram, i);
            // }

            var texture = gl.createTexture();
            var image = window.flame;
            // gl.bindTexture(gl.TEXTURE_2D, texture);
            // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            // gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);

            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            // gl.generateMipmap(gl.TEXTURE_2D);

            this.textureBuffer = texture;
            this.uniform = new UniformObject(gl, this.shaderProgram);
            this.isUploaded = true;
        }
       
    }
   


    draw (){

       

    }

}


export {RegularEffect};