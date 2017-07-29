
import {ObjectContainer2D} from "./ObjectContainer2D";
import {DefaultEffect} from "../effects/DefaultEffect";
import {InstancedMaterial} from "../effects/InstancedMaterial";
import {Matrix3} from "../Math/Matrix3";



class DenemeSprite extends ObjectContainer2D {

    constructor (params) {
        super();
        
        var f = 1;
        

        this.uv = []; 
        this.vertices = [];
        this.indices = [];

        var size = 10000;
        var vSize = 30 * 8;
        var trans;
        var transX;
        var indexCounter = 0;
        for (var i = 0; i < size; i++) 
        {
            trans = (Math.random() * 600) - 300;
            transX = (Math.random() * 600) - 300;

            this.vertices.push(-f + transX);
            this.vertices.push(f + trans);
            this.vertices.push(-f + transX);
            this.vertices.push(-f + trans);

            this.vertices.push(f + transX);
            this.vertices.push(f + trans);
            this.vertices.push(f + transX);
            this.vertices.push(-f + trans);

            this.uv.push(0);
            this.uv.push(1);

            this.uv.push(0);
            this.uv.push(0);

            this.uv.push(1);
            this.uv.push(1);

            this.uv.push(1);
            this.uv.push(0);


            this.indices.push(indexCounter);
            this.indices.push(indexCounter + 1);
            this.indices.push(indexCounter + 2);

            this.indices.push(indexCounter + 1);
            this.indices.push(indexCounter + 3);
            this.indices.push(indexCounter + 2);
            indexCounter += 4;
        }



        this.color = [Math.random(), Math.random(), Math.random(),1];
        
        for(var str in params){
            var param = str;
            this[param] = params[str];        
        }
        

        // var vv = [
        //     -f,  f, // left - top
        //     -f, -f, // left - bottom
        //     f,  f, // right - top
        //     f, -f, // right - bottom
        // ];

        // var uuvv =  [
        //     0,1,
        //     0,0,
        //     1,1,
        //     1,0
        // ];

        //  var iindi = [0,1,2,  1,3,2];

        //  this.vertices = vv;
        //  this.indices = iindi;
        //  this.uv = uuvv;

    }

    updateMaterial (gl) {
        
        if(!this.material.isUploaded){
            this.material.upload(gl);
        }
    }

    upload (gl, material) {
        

        return;
        if(!Sprite._indexBuffer){
            
            console.log("Sprite > Create Buffer");
           

        
            Sprite._indexBuffer = this.indexBuffer;
            Sprite._vertexBuffer = this.buffer;
            Sprite._uvBuffer = this.uvBuffer;
           
        } else {

            this.buffer = Sprite._vertexBuffer;
            this.uvBuffer = Sprite._uvBuffer;
            this.indexBuffer = Sprite._indexBuffer;
        }
        
    }

    update  () {
        //super.update();   
    }

    draw  (gl, camera){

        
    }

    uploadData2 (gl) {

        if(!this.isUploaded) {

            var vertexShaderSRC =  document.getElementById( 'vertexShader' ).textContent;
            var fragmentShaderSRC = document.getElementById( 'fragmentShader' ).textContent;


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

            if ( !gl.getShaderParameter(this.vertexSahderBuffer, gl.COMPILE_STATUS) ) {
                let info = gl.getShaderInfoLog( this.vertexSahderBuffer );
                throw "Could not compile WebGL program. \n\n" + info;
            }

            this.shaderProgram = gl.createProgram();
            gl.attachShader(this.shaderProgram, this.vertexSahderBuffer);
            gl.attachShader(this.shaderProgram, this.fragmentShaderBuffer);
            gl.linkProgram(this.shaderProgram);


            this.positionLocation = gl.getAttribLocation(this.shaderProgram,"position");
          //  this.uvLocation = gl.getAttribLocation(this.shaderProgram,"uv");


            this.vertexBuffer =  gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
            this.verticesTyped = new Float32Array(this.vertices);
            gl.bufferData(gl.ARRAY_BUFFER, this.verticesTyped,  gl.STREAM_DRAW);
            gl.vertexAttribPointer(this.positionLocation, 2, gl.FLOAT, false, 0, 0);

            gl.enableVertexAttribArray(this.positionLocation);

            // this.uvBuffer =  gl.createBuffer();
            // gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
            // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.uv),  gl.STATIC_DRAW);
            // gl.vertexAttribPointer(this.uvLocation, 2, gl.FLOAT, false, 0, 0);

            this.indexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);


            this.isUploaded = true;
            
        }

    }


    drawTest (gl) {

        var camera = this.stage.camera;

        this.uploadData2(gl);
        gl.useProgram(this.shaderProgram);


        var projLocation = gl.getUniformLocation(this.shaderProgram, "projectionMatrix");
        gl.uniformMatrix3fv(projLocation , false , camera.projectionMatrix.matrixArray);

        var worlLoca = gl.getUniformLocation(this.shaderProgram, "viewMatrix");
        gl.uniformMatrix3fv(worlLoca , false , camera.worldMatrix.matrixArray);



        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.verticesTyped);
        gl.vertexAttribPointer(this.positionLocation, 2, gl.FLOAT, false, 0, 0);

        

        gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
    }
}


export {DenemeSprite};