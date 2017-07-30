
import {ObjectContainer2D} from "./ObjectContainer2D";
import {DefaultEffect} from "../effects/DefaultEffect";
import {Matrix3} from "../math/Matrix3";
import {UniformObject} from "../core/UniformObject";



class TestSprite extends ObjectContainer2D {

    constructor (params) {
        super();
        this.r = 1;
        this.g = 0;
        this.b = 0;
        this.zv = 0;
        for(var str in params){
            var param = str;
            this[param] = params[str];        
        }
    }

    updateMaterial (gl) {

        


        if(!this.shaderProgram)
        {
            var vertexShaderSRC =  document.getElementById( "vertexShader" ).textContent;

            var fragmentShaderSRC =    "precision mediump float;"+
                                        "varying vec4 colorVar;" +
                                        "varying mat3 testVar;" +
                                        "varying vec3 posVar;" +
                                        "void main() {"+ 
                                        "   gl_FragColor = vec4(posVar.x, posVar.y , posVar.z, 1.0);"+     
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

            this.uniform = new UniformObject(gl,this.shaderProgram);
            this.color = this._color;
            this.uniform.setValue("color", [1,0,0,1]);
        }
    }

    upload (gl) {
        
        if(!this.instanced){
            this.instanced = gl.getExtension("ANGLE_instanced_arrays");
        } 

        var f = 10;
        // var vertices = [
        //     -f,  f, // left - top
        //     -f, -f, // left - bottom
        //     f,  f, // right - top
        //     f, -f, // right - bottom
        // ];

        var count = 27 * 27;
        this.vs = [];
        var i;
        for (i = 0; i < count; i++) {
            
            var speedX = Math.random() * 4; 
            var speedY = Math.random() * 4; 
            this.vs[i] = {x:speedX - 2, y:speedY - 2, rot:(Math.random() * .4) * -.2};
            this.vs[i].x = 0;
            this.vs[i].y = 0;
        }




        this.count = count;
        var vertices = new Float32Array( 2 * 4 );
        vertices[0] = -f;   vertices[1] = f;
        vertices[2] = -f;   vertices[3] = -f;
        vertices[4] = f;    vertices[5] = f;
        vertices[6] = f;    vertices[7] = -f;


        this.insVertices = vertices;        
        var offset = new Float32Array( 2 * count);
        
       
        for (i = 0; i < offset.length; i++) {
            offset[i] = 0;//(Math.random() * 400) - 300;
        } 

        var index = 0;
        for (i = 0; i < offset.length; i+=2) {

            var column = index % 27;
            var row = Math.floor(index / 27);
            
            offset[i] = (column * 22) - 290;
            offset[i+1] = (row * 27) - 290;

            index++;
        }

        var colorArray = new Float32Array( 4 * count );
        for (i = 0; i < colorArray.length; i+=4) {
            
            colorArray[i] = Math.random();//this.r;
            colorArray[i+1] = Math.random();
            colorArray[i+2] = Math.random();
            colorArray[i+3] = 1;
        }

        var rotateArray = new Float32Array(count );
        for (i = 0; i < rotateArray.length; i++) {
            rotateArray[i] = Math.random() * (Math.PI * 2);
        }

        var orderArray = new Float32Array(count );
        for (i = 0; i < orderArray.length; i++) {
            orderArray[i] = 0.0;//position;
        }

        this.colorArray = colorArray;
        this.offsetArray = offset;        
        this.vertices = vertices;
        this.rotateArray = rotateArray;
        this.orderArray = orderArray;
        
        this.buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        this.buffer.location = gl.getAttribLocation(this.shaderProgram,"position");
        
        this.offsetBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.offsetBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, offset, gl.STATIC_DRAW);
        this.offsetBuffer.location = gl.getAttribLocation(this.shaderProgram,"offset");

        this.colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, colorArray, gl.STATIC_DRAW); 
        this.colorBuffer.location = gl.getAttribLocation(this.shaderProgram, "color");


        this.rotateBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.rotateBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, rotateArray, gl.STATIC_DRAW);
        this.rotateBuffer.location = gl.getAttribLocation(this.shaderProgram, "rotation");

        this.orderBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.orderBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, orderArray, gl.STATIC_DRAW);
        this.orderBuffer.location = gl.getAttribLocation(this.shaderProgram, "order");




        this.indices = [0,1,2,  1,3,2];
        this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
    }

    update  () {
        super.update();   
    }


    draw  (gl, camera){

        
        if(!this.instanced){
            this.instanced = gl.getExtension("ANGLE_instanced_arrays");
        } 


        this.updateMaterial(gl);       
       
        if(!this.buffer){
            this.upload(gl);
        }
        
        gl.disable(gl.DEPTH_TEST);



        for(var i = 0; i < this.vs.length ; i++){

            let index = i * 2;
            this.offsetArray[index]     += this.vs[i].x * .1;
            this.offsetArray[index+1]   += this.vs[i].y * .1;

            this.rotateArray[i] += this.vs[i].rot;
        }
 
        var uniform = this.uniform;
        uniform.setValue("modelMatrix", this.worldMatrix.matrixArray);
        uniform.setValue("projectionMatrix", camera.projectionMatrix.matrixArray);
        uniform.setValue("viewMatrix", camera.worldMatrix.matrixArray);
        

        var mm = new Matrix3();
        mm.makeIdentity();
        
        mm.multiplyMatrix(this.worldMatrix);
        mm.multiplyMatrix(camera.worldMatrix);
        mm.multiplyMatrix(camera.projectionMatrix);

        uniform.setValue("ppMatrix", mm.matrixArray);
        

        
        gl.useProgram(this.shaderProgram);
 
        
        this.uniform.update(gl);

        var l;
        l = this.rotateBuffer.location;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.rotateBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.rotateArray, gl.STATIC_DRAW);
        gl.enableVertexAttribArray(l);
        gl.vertexAttribPointer(l, 1, gl.FLOAT, false, 0, 0);
        this.instanced.vertexAttribDivisorANGLE(l , 1);

        l = this.orderBuffer.location;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.orderBuffer);
        //gl.bufferData(gl.ARRAY_BUFFER, this.orderArray, gl.STATIC_DRAW);
        gl.enableVertexAttribArray(l);
        gl.vertexAttribPointer(l, 1, gl.FLOAT, false, 0, 0);
        this.instanced.vertexAttribDivisorANGLE(l , 1);

        l = this.buffer.location;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.enableVertexAttribArray(l);
        gl.vertexAttribPointer(l, 2, gl.FLOAT, false, 0, 0);
        
        

        gl.bindBuffer(gl.ARRAY_BUFFER, this.offsetBuffer);
        //gl.bufferData(gl.ARRAY_BUFFER, this.offsetArray, gl.STATIC_DRAW);
        l = this.offsetBuffer.location;
        gl.enableVertexAttribArray(l);
        gl.vertexAttribPointer(l, 2, gl.FLOAT, false, 0, 0);
        this.instanced.vertexAttribDivisorANGLE(l , 1);
        

        l = this.colorBuffer.location;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        //gl.bufferData(gl.ARRAY_BUFFER, this.colorArray, gl.STATIC_DRAW);
        gl.enableVertexAttribArray(l);
        gl.vertexAttribPointer(l, 4, gl.FLOAT, false, 0, 0);
        this.instanced.vertexAttribDivisorANGLE(l ,1);

        
        
        

     
        //    var position =  gl.getActiveAttrib(this.shaderProgram,this.buffer.location );
        //    var offset =  gl.getActiveAttrib(this.shaderProgram,this.offsetBuffer.location );
        //     var color =  gl.getActiveAttrib(this.shaderProgram,this.colorBuffer.location );
        //     var rotate =  gl.getActiveAttrib(this.shaderProgram,this.rotateBuffer.location );

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER , this.indexBuffer);
        let size = this.indices.length;
        
        this.instanced.drawElementsInstancedANGLE(gl.TRIANGLES, size, gl.UNSIGNED_SHORT, 0,this.count);
        //this.instanced.drawArraysInstancedANGLE(gl.TRIANGLES, 0, 4, this.count * 2);

        //  gl.drawElements(gl.TRIANGLES , size , gl.UNSIGNED_SHORT , 0);

    }
}


export {TestSprite};