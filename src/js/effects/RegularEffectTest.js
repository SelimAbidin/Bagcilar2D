import {DefaultEffect} from "./DefaultEffect";
import {UniformObject} from "../core/UniformObject";
var cccc = 0;
var MAX_INSTANCE = 14000;

class RegularEffectTest extends DefaultEffect {
    
    constructor () {
        super();
        this.count = 0;
        this.id = "id_"+cccc++;
        this.isUploaded = false;

        this.textures = [];
        var f = 20;
  

        var index = 0;


        // 3 + 2 + 1 + 2
        var vertexDataCount = 8 + 4 + 8 + 12;
        this.vertexDataCount = vertexDataCount;
        this.vertices       = new Float32Array(vertexDataCount * MAX_INSTANCE);

        this.indices        = new Uint16Array(6 * MAX_INSTANCE);
        var r,g,b;

        for (let i = 0; i < this.vertices.length; i+=vertexDataCount) {
            

            var tId = Math.floor(Math.random() * 4);
            this.vertices[i]     = -f; this.vertices[i + 1] = f;  // Vertex 1
            
            
            this.vertices[i + 2] = tId;  // Texture 1

            this.vertices[i + 3] =  0; //  UV 1
            this.vertices[i + 4] =  1;//  UV 1
            

            r = Math.random();
            g = Math.random();
            b = Math.random();

            this.vertices[i + 5] =  r; //  Color 1
            this.vertices[i + 6] =  g;//  Color 1
            this.vertices[i + 7] =  b;//  Color 1
            

            this.vertices[i + 8] = -f; this.vertices[i + 9] = -f;  // Vertex 2

            this.vertices[i + 10] = tId;  // Texture 2
           
            this.vertices[i + 11] = 0;  // UV 2
            this.vertices[i + 12] = 0;  // UV 2


            this.vertices[i + 13] = r;  // COLOR 2 
            this.vertices[i + 14] = g; // COLOR 2 
            this.vertices[i + 15] = b;// COLOR 2 

            
            this.vertices[i + 16] =  f; this.vertices[i + 17] = f;  // Vectex 3

            this.vertices[i + 18] = tId;  // Texture 3


            this.vertices[i + 19] = 1;   // UV 3
            this.vertices[i + 20] = 1;   // UV 3

            this.vertices[i + 21] = r;  // COLOR 3 
            this.vertices[i + 22] = g; // COLOR 3
            this.vertices[i + 23] = b; // COLOR 3 
            


            this.vertices[i + 24] =  f; this.vertices[i + 25] = -f; // Vertex 4
        
            this.vertices[i + 26] = tId;  // Texture 4


            this.vertices[i + 27] = 1;  // UV 4
            this.vertices[i + 28] = 0;  // UV 4


            
            this.vertices[i + 29] = r;  // COLOR 3 
            this.vertices[i + 30] = g; // COLOR 3
            this.vertices[i + 31] = b; // COLOR 3 
            
        }

        
        for (let i = 0; i < this.indices.length; i+=6) {
            
            this.indices[i    ] = index;
            this.indices[i + 1] = index + 1;
            this.indices[i + 2] = index + 2;

            this.indices[i + 3] = index + 1;
            this.indices[i + 4] = index + 3;
            this.indices[i + 5] = index + 2;
            index += 4;
        }

    }



    
    appendVec2Verices (vertices, texture , colors) {

        var i = 0;
       
        if(this.textureIDHolder[texture.id] !== undefined) {
            i = this.textureIDHolder[texture.id];
        } else {
            this.textureIDHolder[texture.id] = this.textures.length;
            this.textures.push(texture);
        }


        var vertexIndex = this.count * this.vertexDataCount;
        

        // Vertex 1
        this.vertices[vertexIndex]     =  vertices[0].x;
        this.vertices[vertexIndex + 1] =  vertices[0].y;

        // Texture 1
        this.vertices[vertexIndex + 2] =  i;
        
        // UV  + 3   + 4

        // COLOR
        this.vertices[vertexIndex + 5] = colors[0];
        this.vertices[vertexIndex + 6] = colors[1];
        this.vertices[vertexIndex + 7] = colors[2];



        // Vertex 2
        this.vertices[vertexIndex + 8] =  vertices[1].x;
        this.vertices[vertexIndex + 9] =  vertices[1].y;

        // Texture 2
        this.vertices[vertexIndex + 10] =  i;

        // UV  +11   +12

        // COLOR 2
        this.vertices[vertexIndex + 13] = colors[3];
        this.vertices[vertexIndex + 14] = colors[4];
        this.vertices[vertexIndex + 15] = colors[5];

        

        // Vertex 3
        this.vertices[vertexIndex + 16] =  vertices[2].x;
        this.vertices[vertexIndex + 17] =  vertices[2].y;

        // Texture 3
        this.vertices[vertexIndex + 18] =  i;

        // UV  +19   +20

        // COLOR 3
        this.vertices[vertexIndex + 21] = colors[6];
        this.vertices[vertexIndex + 22] = colors[7];
        this.vertices[vertexIndex + 23] = colors[8];


        // Vertex 4
        this.vertices[vertexIndex + 24] =  vertices[3].x;
        this.vertices[vertexIndex + 25] =  vertices[3].y;

        // Texture 4
        this.vertices[vertexIndex + 26] =  i;

        // UV  +27   +28

        // COLOR 4
        this.vertices[vertexIndex + 29] = colors[9];
        this.vertices[vertexIndex + 30] = colors[10];
        this.vertices[vertexIndex + 31] = colors[11];
    }


    hasRoom () {

        return this.getLenght() < MAX_INSTANCE;

    }
    
    reset () {
        this.count = -1;
        this.textureIDHolder = {};
        this.textures.length = 0;

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
                attribute float textureID;
                varying vec3 colorVar;
                varying vec2 uvData;
                varying float textureIDVar;
                void main() {
                    uvData = uv;
                    colorVar = color;
                    textureIDVar = textureID;
                    vec3 newPos = vec3(position.x, position.y, 1.0 ) * (projectionMatrix * viewMatrix);
                    gl_Position = vec4(newPos , 1.0);
                }
            `;

            var fragmentShaderSRC = `
                precision mediump float;
                uniform sampler2D uSampler[16];
                varying vec2 uvData;
                varying vec3 colorVar;
                varying float textureIDVar;
                void main() { 
                    
                    vec4 c;
                    int f = int(textureIDVar);
                    if(f == 0) {
                        c = texture2D(uSampler[0],uvData);
                    } else if(f == 1) {
                        c = texture2D(uSampler[1],uvData);
                    } else if(f == 2) {
                        c = vec4(1,1,0,1);
                    } else if(f == 3) {
                        c = vec4(0,1,0,1);
                    } 
                    
                    c.xyz *= colorVar;
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

  
            this.vertexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STREAM_DRAW);
            
            this.positionLocation = 0;
            this.textureIDLocation = 1;
            this.uvLocation = 2;
            this.colorLocation = 3;

            gl.vertexAttribPointer(this.positionLocation, 2, gl.FLOAT, false,  32, 0);
            gl.enableVertexAttribArray(this.positionLocation);

            gl.vertexAttribPointer(this.textureIDLocation, 1, gl.FLOAT, false, 32, 8);
            gl.enableVertexAttribArray(this.textureIDLocation);

            gl.vertexAttribPointer(this.uvLocation, 2, gl.FLOAT, false, 32, 12);
            gl.enableVertexAttribArray(this.uvLocation);

            gl.vertexAttribPointer(this.colorLocation, 3, gl.FLOAT, false, 32, 20);
            gl.enableVertexAttribArray(this.colorLocation);


            

            gl.bindAttribLocation(this.shaderProgram, 0, "position");
            gl.bindAttribLocation(this.shaderProgram, 1, "textureID");
            gl.bindAttribLocation(this.shaderProgram, 2, "uv");
            gl.bindAttribLocation(this.shaderProgram, 3, "color");
            

            gl.attachShader(this.shaderProgram, this.vertexShaderBuffer);
            gl.attachShader(this.shaderProgram, this.fragmentShaderBuffer);
            gl.linkProgram(this.shaderProgram);

            this.positionLocation = gl.getAttribLocation(this.shaderProgram,"position");
            this.textureIDLocation = gl.getAttribLocation(this.shaderProgram,"textureID");
            this.uvLocation = gl.getAttribLocation(this.shaderProgram,"uv");
            this.colorLocation = gl.getAttribLocation(this.shaderProgram,"color");

            this.indexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);

            this.uniform = new UniformObject(gl, this.shaderProgram);
            this.isUploaded = true;
        }
       
    }
   


    draw (){

       

    }

}


export {RegularEffectTest};