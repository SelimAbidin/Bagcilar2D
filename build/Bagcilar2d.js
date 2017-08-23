(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.Bagcilar = global.Bagcilar || {})));
}(this, (function (exports) { 'use strict';

	var CoreObject = (function(){

	    CoreObject.__indexCounter = 0;
	    function CoreObject() {
	        this.id = "id_" + (CoreObject.__indexCounter++);
	    }

	    Object.assign(CoreObject.prototype, {

	        toString : function () {
	            var functionName = this.constructor.toString();
	            functionName = functionName.substr("function".length);
	            functionName = functionName.substr(0, functionName.indexOf("("));
	            return "[" + functionName.trim() + " Object]";
	        }

	    });

	    return CoreObject;
	})();

	function Event(type, context, listener, priority){
	    
	    CoreObject.apply(this, arguments);
	    
	    if(priority === undefined) {
	        priority = 0;
	    }

	    this.priority   = priority;
	    this.type       = type;
	    this.listener   = listener;
	    this.context    = context;
	}

	Event.prototype = Object.assign(Object.create(CoreObject.prototype), {
	    
	    constructor : Event,

	});

	function EventableObject() {
	    CoreObject.apply(this, arguments);
	    this._listeners = {};
	}

	function orderPriority (a, b){
	    return a.priority < b.priority ? 1 : a.priority > b.priority ? -1 : 0;
	}


	EventableObject.prototype = Object.assign(Object.create(CoreObject.prototype), {

	    constructor : EventableObject,

	    addEventListener : function (type, scope ,listener, priority){

	        if(this._listeners === undefined){
	            this._listeners = {};
	        }

	        if(this._listeners[type] === undefined){
	            this._listeners[type] = [];   
	        }
	        
	        this._listeners[type].push(new Event(type, scope, listener,priority));
	        this._listeners[type].sort(orderPriority);
	    },

	    dispacthEvent : function (type,data){

	        if(this._listeners[type]) {

	            var a = this._listeners[type];
	            var element;

	            for (var i = 0; i < a.length; i++) {
	                element = a[i];
	                element.listener.apply(element.context, [{type:element.type, target:this, data:data}]);
	            }
	        }
	    }

	});

	function matrix3Fv(gl, uniObject){
	    gl.uniformMatrix3fv(uniObject.location , false , uniObject.value);
	}

	function vector3Fv(gl, uniObject){
	    gl.uniform4fv(uniObject.location , uniObject.value);
	}

	function uniform1i(gl, uniObject){

	    if(uniObject.value instanceof Int32Array) {
	        gl.uniform1iv(uniObject.location , uniObject.value);
	    } else {
	        gl.uniform1i(uniObject.location , uniObject.value);
	    }
	    
	}


	class UniformObject extends EventableObject {

	    constructor (gl,program){
	        super();
	        this.uniMaps = {};
	        this._program = program;

	        var n = gl.getProgramParameter(this._program, gl.ACTIVE_UNIFORMS);
	        
	        for (var i = 0; i < n; i++) {
	            var uniformInfo = gl.getActiveUniform(this._program, i);
	            var location = gl.getUniformLocation(this._program, uniformInfo.name);
	            this.addUniform(location , uniformInfo);
	        }

	    }

	    getSetter (type) {
	        
	        switch (type) {
	        case 35675: // matrix3
	            return matrix3Fv;
	        case 35666:
	            return vector3Fv;
	        case 35678: 
	            return uniform1i;
	        }
	        return; 
	    }

	    addUniform (location,uniformInfo) {
	        this.uniMaps[uniformInfo.name] = {setter:this.getSetter(uniformInfo.type), location:location};
	    }

	    setValue (name, value) {
	        if(this.uniMaps.hasOwnProperty(name)){
	            this.uniMaps[name].value = value;
	        }
	    }

	    getValue (name) {
	        if(this.uniMaps.hasOwnProperty(name)){
	            return this.uniMaps[name].value;
	        }
	    }

	    update (gl) {

	        for (var key in this.uniMaps) {
	            var element = this.uniMaps[key];
	            element.effect = this.effect;
	            element.setter(gl, element);
	        }
	    }

	}

	class Vector2 {

	    constructor (x,y) {
	        this.x = x;
	        this.y = y;
	    }
	    

	    mulMatrix3 (matrix3) {

	        var v1 = this.x;
	        var v2 = this.y;
	        
	        var ma = matrix3.matrixArray;

	        this.x = ma[0] * v1 + ma[3] * v2 + ma[6];
	        this.y = ma[1] * v1 + ma[4] * v2 + ma[7];
	        this.w = ma[2] * v1 + ma[5] * v2 + ma[8];

	    }
	}

	class Vector3 {
	    
	    constructor (x, y, w) {

	        this.x = x === undefined ? 0 : x;
	        this.y = y === undefined ? 0 : y;
	        this.w = w === undefined ? 0 : w;
	        
	    }

	    multiplyMat3 (matrix3){

	        var v1 = this.x;
	        var v2 = this.y;
	        var v3 = this.w;
	        
	        var ma = matrix3.matrixArray;

	        this.x = ma[0] * v1 + ma[3] * v2 + ma[6] * v3;
	        this.y = ma[1] * v1 + ma[4] * v2 + ma[7] * v3;
	        this.w = ma[2] * v1 + ma[5] * v2 + ma[8] * v3;

	        return this;
	    }
	    
	}

	class Matrix3 {
	    constructor() {
	        this.matrixArray = [
	            1,0,0,
	            0,1,0,
	            0,0,1
	        ];
	        
	        
	    }

	    makeIdentity (){
	        this.setMatrix(
	            1,0,0,
	            0,1,0,
	            0,0,1);
	    }

	    setMatrix  (    
	        n00, n10, n20, 
	        n01, n11, n21,
	        n02, n12, n22 
	    ){

	        var m = this.matrixArray;
	        m[0] = n00; m[1] = n10; m[2] = n20;
	        m[3] = n01; m[4] = n11; m[5] = n21;
	        m[6] = n02; m[7] = n12; m[8] = n22;
	    }

	    setRotationZ  (radian){
	        
	        var m = this.matrixArray;
	        let c = Math.cos(radian);
	        let s = Math.sin(radian);

	        m[0] = c; m[1] = s;
	        m[3] = -s; m[4] = c;
	    }

	    setScale  (x,y){
	        
	        var m = this.matrixArray;
	        m[0] = x;
	        m[4] = y;

	    }

	    translate (x,y) {

	        let m = this.matrixArray;
	        m[6] = x;
	        m[7] = y;

	    }

	    multiplyMatrix (matrix){

	        var m1 = this.matrixArray;
	        var m2 = matrix.matrixArray;

	        var a00 = m1[0], a01 = m1[3], a02 = m1[6];
	        var a10 = m1[1], a11 = m1[4], a12 = m1[7];
	        var a20 = m1[2], a21 = m1[5], a22 = m1[8];

	        var b00 = m2[0], b01 = m2[3], b02 = m2[6];
	        var b10 = m2[1], b11 = m2[4], b12 = m2[7];
	        var b20 = m2[2], b21 = m2[5], b22 = m2[8];

	        m1[0] = a00 * b00 + a01 * b10 + a02 * b20; 
	        m1[3] = a00 * b01 + a01 * b11 + a02 * b21; 
	        m1[6] = a00 * b02 + a01 * b12 + a02 * b22; 

	        m1[1] = a10 * b00 + a11 * b10 + a12 * b20; 
	        m1[4] = a10 * b01 + a11 * b11 + a12 * b21; 
	        m1[7] = a10 * b02 + a11 * b12 + a12 * b22; 
	        
	        m1[2] = a20 * b00 + a21 * b10 + a22 * b20; 
	        m1[5] = a20 * b01 + a21 * b11 + a22 * b21; 
	        m1[8] = a20 * b02 + a21 * b12 + a22 * b22; 
	        
	        return this;
	    }

	    makeOrtho (left, right,  top, bottom){

	        let m = this.matrixArray;

	        m[0] = 2 / (right - left); 
	        m[4] = 2 / (top - bottom);

	        m[6] = -((right + left) / (right - left));
	        m[7] = -((top + bottom) / (top - bottom));

	    }


	    multiplySRTMatrix (scaleMatrix, rotationMatrix, translateMatrix) {

	        scaleMatrix = scaleMatrix.matrixArray;
	        rotationMatrix = rotationMatrix.matrixArray;
	        translateMatrix = translateMatrix.matrixArray;
	        var a00 = scaleMatrix[0], a10 = scaleMatrix[3], a20 = scaleMatrix[6];
	        var a01 = scaleMatrix[1], a11 = scaleMatrix[4], a21 = scaleMatrix[7];
	        var a02 = scaleMatrix[2], a12 = scaleMatrix[5], a22 = scaleMatrix[8];

	        var b00 = rotationMatrix[0], b10 = rotationMatrix[3], b20 = rotationMatrix[6];
	        var b01 = rotationMatrix[1], b11 = rotationMatrix[4], b21 = rotationMatrix[7];
	        var b02 = rotationMatrix[2], b12 = rotationMatrix[5], b22 = rotationMatrix[8];

	        var c00 = translateMatrix[0], c10 = translateMatrix[3], c20 = translateMatrix[6];
	        var c01 = translateMatrix[1], c11 = translateMatrix[4], c21 = translateMatrix[7];
	        var c02 = translateMatrix[2], c12 = translateMatrix[5], c22 = translateMatrix[8];


	        var d00 = a00 * b00 + a10 * b01 + a20 * b02;
	        var d10 = a00 * b10 + a10 * b11 + a20 * b12;
	        var d20 = a00 * b20 + a10 * b21 + a20 * b22;

	        var d01 = a01 * b00 + a11 * b01 + a21 * b02;
	        var d11 = a01 * b10 + a11 * b11 + a21 * b12;
	        var d21 = a01 * b20 + a11 * b21 + a21 * b22;

	        var d02 = a02 * b00 + a12 * b01 + a22 * b02;
	        var d12 = a02 * b10 + a12 * b11 + a22 * b12;
	        var d22 = a02 * b20 + a12 * b21 + a22 * b22;

	        this.matrixArray[0] = d00 * c00 + d10 * c01 + d20 * c02;
	        this.matrixArray[1] = d00 * c10 + d10 * c11 + d20 * c12;
	        this.matrixArray[2] = d00 * c20 + d10 * c21 + d20 * c22;

	        this.matrixArray[3] = d01 * c00 + d11 * c01 + d21 * c02;
	        this.matrixArray[4] = d01 * c10 + d11 * c11 + d21 * c12;
	        this.matrixArray[5] = d01 * c20 + d11 * c21 + d21 * c22;

	        this.matrixArray[6] = d02 * c00 + d12 * c01 + d22 * c02;
	        this.matrixArray[7] = d02 * c10 + d12 * c11 + d22 * c12;
	        this.matrixArray[8] = d02 * c20 + d12 * c21 + d22 * c22;
	    }


	    



	}

	class Color extends EventableObject{

	    constructor (r,g,b,a){
	        
	        super();
	        this.elements = [];
	        this.elements[0] = r === undefined ? 1 : r;
	        this.elements[1] = g === undefined ? 1 : g;
	        this.elements[2] = b === undefined ? 1 : b;
	        this.elements[3] = a === undefined ? 1 : a;

	        
	    }


	}

	class DefaultEffect {

	    constructor () {
	        this.isUploaded = false;
	        
	    }

	    upload (gl) {
	        var vertexShaderSRC =  "uniform mat3 modelMatrix;"+
	                               "uniform mat3 projectionMatrix;"+
	                               "uniform mat3 viewMatrix;"+
	                                "attribute vec2 position;"+      
	                                "void main() {"+
	                                "   vec3 pos = vec3(position.x,position.y, 0.0);"+
	                                "   mat3 m =  projectionMatrix * (modelMatrix * viewMatrix);"+  
	                                "   vec3 pm = m * pos;"+     
	                                "   gl_Position = vec4(pm, 1.0);"+     
	                                "   gl_PointSize = 10.0;"+     
	                                "}";

	        var fragmentShaderSRC = ""+
	                                "void main() {"+        
	                                "   gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);"+     
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


	        this.uniform = new UniformObject(gl, this.shaderProgram);
	        

	        this.isUploaded = true;
	    }


	    draw  (gl){

	        if(!this.shaderProgram){
	            this.upload(gl);
	        }

	        gl.useProgram(this.shaderProgram);
	        this.uniform.update(gl);
	    }

	    
	}

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

	        // this.vertices       = new Float32Array(8 * MAX_INSTANCE);
	        // this.textureIds     = new Float32Array(4 * MAX_INSTANCE);
	        // this.uvs            = new Float32Array(8 * MAX_INSTANCE);
	        // this.colors         = new Float32Array(12 * MAX_INSTANCE);
	        
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



	    
	    appendVec2Verices (vertices, textureID , colors) {

	        var i = 0;
	       
	        if(this.textureIDHolder[textureID.id] !== undefined) {
	            i = this.textureIDHolder[textureID.id];
	        } else {
	            this.textureIDHolder[textureID.id] = this.textures.length;
	            this.textures.push(textureID);
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
                precision lowp float;
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

	class WebGLRenderer extends EventableObject
	{
	    constructor (square, gl) {
	        super();
	        this.infoID = 0;
	        this.gl = gl;
	        this._materials = [];
	        this.square = square;

	        this.typedArray = new Int32Array(16);
	        gl.disable(gl.STENCIL_TEST);
	        gl.disable(gl.DEPTH_TEST);
	        gl.enable(gl.BLEND);
	        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

	        this.regularEffect = new RegularEffectTest();

	    }

	    prepareForRender (camera) {

	        this.currentCamera = camera;
	        this.currentMaterial = undefined;
	        this.regularEffect.reset();
	        this.infoID++;
	    }

	    renderSprite (sprite) {

	        if(!this.regularEffect.hasRoom()) {
	            this.present3(this.currentCamera);
	            this.regularEffect.reset();
	        }
	        
	        this.regularEffect.upload(this.gl);
	        this.regularEffect.next();
	        this.regularEffect.appendVec2Verices(sprite.vertices, sprite.texture,  sprite.colors);
	    }

	    present3 (camera) {
	            
	        var gl = this.gl;
	        var material = this.regularEffect;

	        if(material.getLenght() <= 0) return;


	        var uniform = material.uniform;

	        gl.useProgram(material.shaderProgram);

	        uniform.setValue("projectionMatrix", camera.projectionMatrix.matrixArray);
	        uniform.setValue("viewMatrix", camera.worldMatrix.matrixArray);


	        var txts = material.textures;

	        for (var j = 0; j < txts.length; j++) {

	            var element = txts[j];
	            element.upload(gl);
	            gl.activeTexture(gl.TEXTURE0 + j);
	            gl.bindTexture(gl.TEXTURE_2D, element.textureBuffer);
	            this.typedArray[j] = j;
	        }

	        uniform.setValue("uSampler[0]", this.typedArray );
	        uniform.update(this.gl);

	        gl.bindBuffer(gl.ARRAY_BUFFER, material.vertexBuffer);
	        gl.bufferSubData(gl.ARRAY_BUFFER, 0, material.vertices);

	        //console.log(material.id,  material.vertices[0], material.vertices[1]);

	        gl.vertexAttribPointer(material.positionLocation, 2, gl.FLOAT, false,  32, 0);
	        gl.enableVertexAttribArray(material.positionLocation);

	        gl.vertexAttribPointer(material.textureIDLocation, 1, gl.FLOAT, false, 32, 8);
	        gl.enableVertexAttribArray(material.textureIDLocation);

	        gl.vertexAttribPointer(material.uvLocation, 2, gl.FLOAT, false, 32, 12);
	        gl.enableVertexAttribArray(material.uvLocation);

	        gl.vertexAttribPointer(material.colorLocation, 3, gl.FLOAT, false, 32, 20);
	        gl.enableVertexAttribArray(material.colorLocation);

	        var nsize = material.getLenght() * 6;

	        gl.drawElements(gl.TRIANGLES, nsize, gl.UNSIGNED_SHORT, 0);

	        this.currentMaterial = undefined;
	    }





	    present2 (camera) {

	        var gl = this.gl;

	        if(gl.isContextLost()) {
	            return;
	        }


	        for (var i = 0; i < this._materials.length; i++) {

	            var material =  this._materials[i];
	            var uniform = material.uniform;

	            gl.useProgram(material.shaderProgram);
	           
	            uniform.setValue("projectionMatrix", camera.projectionMatrix.matrixArray);
	            uniform.setValue("viewMatrix", camera.worldMatrix.matrixArray);
	            uniform.setValue("uSampler", 0);
	            uniform.update(this.gl);

	            gl.activeTexture(gl.TEXTURE0);
	            gl.bindTexture(gl.TEXTURE_2D, material.textureBuffer);
	            
	            gl.bindBuffer(gl.ARRAY_BUFFER, material.vertexBuffer);
	            gl.bufferSubData(gl.ARRAY_BUFFER, 0, material.vertices);
	            gl.vertexAttribPointer(material.positionLocation, 2, gl.FLOAT, false, 0, 0);


	            gl.bindBuffer(gl.ARRAY_BUFFER, material.colorBuffer);
	            gl.bufferSubData(gl.ARRAY_BUFFER, 0, material.colors);
	            gl.vertexAttribPointer(material.colorLocation, 3, gl.FLOAT, false, 0, 0);

	            gl.bindBuffer(gl.ARRAY_BUFFER, material.uvBuffer);
	            gl.vertexAttribPointer(material.uvLocation, 2, gl.FLOAT, false, 0,   0);

	            // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, material.indexBuffer);
	            var nsize = material.getLenght() * 6;

	            
	            gl.drawElements(gl.TRIANGLES, nsize, gl.UNSIGNED_SHORT, 0);

	            material.reset();
	        }
	    }




	}

	var cccc$1 = 0;
	class ColorEffect extends DefaultEffect {

	    constructor (color) {
	        super();
	        this.id = "id_"+cccc$1++;
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

	var cccc$2 = 0;
	var MAX_INSTANCE$1 = 350000;


	var _materialInstance;
	class InstancedMaterial extends DefaultEffect {
	    
	    constructor (color) {
	        super();
	        this.count = 0;
	        this.id = "id_"+cccc$2++;
	        this.isUploaded = false;
	        this._color = color;
	        
	        this.offset = new Float32Array( 2 * MAX_INSTANCE$1);
	        
	        this.colorArray = new Float32Array( 3 * MAX_INSTANCE$1);
	        this.rotateArray = new Float32Array(MAX_INSTANCE$1);
	        

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
	            var vertexShaderSRC =  document.getElementById( "vertexShaderInstanced" ).textContent;

	            var fragmentShaderSRC = document.getElementById( "fragmentShaderInstanced" ).textContent;
	            
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


	    draw (){


	        // if(!this.shaderProgram){
	        //     this.upload(gl);
	        // }
	        // console.log("use program");
	        // gl.useProgram(this.shaderProgram);
	        // this.uniform.update(gl);
	    }

	}

	class Object2D  extends EventableObject{

	    constructor (){

	        super();

	        this.isRotationDirty = true;
	        this.rotation = 0;
	        this.stage = undefined;
	        this.context = undefined;
	        this.isScaleDirty = true;
	        this.isPositionDirty = true;
	        this.scaleX = 1; 
	        this.scaleY = 1;
	        // this.xPos = 0;
	        // this.yPos = 0;

	        this.position = new Vector3(0,0,1);
	      

	        this.needsCalculation = true;
	        this.rotationMatrix = new Matrix3();
	        this.scaleMatrix = new Matrix3();
	        this.positionMatrix = new Matrix3();
	        this.worldMatrix = new Matrix3();
	    
	    }

	    setRotation (v){
	        this.rotation = v;
	        this.isRotationDirty = true;
	    }

	    getRotation (){
	        return this.rotation;
	    }

	    updateRotation (){
	        this.rotationMatrix.setRotationZ(this.rotation);
	        this.isRotationDirty = false;
	    }

	    updateScale (){
	        this.scaleMatrix.setScale(this.scaleX, this.scaleY);
	        this.isScaleDirty = false;
	    }

	    updatePosition (){
	        this.positionMatrix.translate(this.position.x, this.position.y);
	        this.isPositionDirty = false;
	    }

	    setScale (scale) {
	        this.scaleX = scale;
	        this.scaley = scale;
	        this.isScaleDirty = true;
	    }

	    setScaleX (x) {
	        this.scaleX = x;
	        this.isScaleDirty = true;
	    }

	    setScaleY (y) {
	        this.scaleY = y;
	        this.isScaleDirty = true;
	    }

	    getScaleY (){
	        return this.scaleY;
	    }

	    getScaleX (){
	        return this.scaleX;
	    }
	    
	    updateWorldMatrix (){
	            
	        this.worldMatrix.makeIdentity();
	            
	        this.updateScale();
	        this.updateRotation();
	        this.updatePosition();


	        this.worldMatrix.multiplyMatrix(this.positionMatrix);

	                                  //  console.log(this.this.positionMatrix.matrixArray);

	        this.worldMatrix.multiplyMatrix(this.rotationMatrix);
	        this.worldMatrix.multiplyMatrix(this.scaleMatrix); 
	            

	    }

	    update  () {
	        this.updateWorldMatrix();
	    }
	}

	class ObjectContainer2D extends Object2D {
	    
	    constructor (){

	        super();
	        this.children = [];

	    }

	    addChild (child) {

	        if(child instanceof Object2D) {
	            child.stage = this.stage;
	            child.parent = this;
	            child.context = this.context;
	            this.children.push(child);
	        
	        } else {
	        
	            throw "child should be Object2D instance";
	        
	        }
	    }

	    update (){
	        super.update();
	    }
	}

	class Square extends ObjectContainer2D {
	        
	    static get ENTER_FRAME () { return "enterFrame"; }

	    constructor (canvasID) {
	            
	        super(canvasID);
	        this.min = 500000;
	        this.max = -500000;
	        this.stage = this;
	        if(canvasID !== undefined){

	            var cAttributes = {
	                alpha: false,
	                antialias: false,
	                depth: false,
	                failIfMajorPerformanceCaveat: false,
	                premultipliedAlpha: false,
	                preserveDrawingBuffer: false,
	                stencil: true
	            };


	            var canvas =  document.getElementById(canvasID);
	                
	            //var  gl = canvas.getContext("webgl2") || canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
	            var  gl = canvas.getContext("webgl",cAttributes);// || canvas.getContext("experimental-webgl", {stencil:true});  // webgl2 disabled for now
	            if(!gl){
	                    
	                var error = "WebGL isn't supported on device";
	                this.dispatchEvent(Square.ERROR , { message : error });
	                throw error;
	            } 

	            gl.clearColor(1, 1, 1, 1);
	            gl.clear(gl.COLOR_BUFFER_BIT);

	            this.renderDom = canvas;
	            if(gl.hasOwnProperty("rawgl")){
	                gl = gl.rawgl;
	            }
	            this.setWebGLContext(gl);
	            this.init();
	        } else {

	            throw "no canvas found";

	        }

	    }

	    init () {
	         
	        this.setAutoUpdate(true);
	        
	    }
	        
	    setWebGLContext (gl) {
	        this.context = gl;

	        if(gl instanceof WebGLRenderingContext) {
	            this.renderer = new WebGLRenderer(this,gl);

	            // gl.enable(gl.DEPTH_TEST);
	            gl.viewport(0, 0, this.renderDom.width, this.renderDom.height);
	            gl.clearColor(0.6, 0.6, 0.6, 1.0);
	        }
	    }

	    setAutoUpdate (b) {

	        if(_autoUpdate !== b) {
	            _autoUpdate = b;

	            if(b){
	                addMeydan(this);
	            } else {
	                removeMeydan(this);
	            }
	        }
	    }

	    // TODO silinecek. Testing method 
	    // addQuadForTest (quad) {
	    //     if(!this.testChilderen) {
	    //         this.testChilderen = [];
	    //     }
	    //     this.testChilderen.push(quad);
	    // }

	    update2 () {
	            
	        // this.update();

	            

	        this.dispacthEvent(Square.ENTER_FRAME, undefined);
	        var gl = this.context;

	        //gl.DEPTH_BUFFER_BIT
	        gl.clearColor(0.3,0.3,0.3,1);
	            

	        gl.clear(gl.COLOR_BUFFER_BIT);
	            

	        this.renderer.prepareForRender(this.camera);
	        //this.renderEachChildren();
	        this.renderReqursively(this.children);
	        this.renderer.present3(this.camera);
	    }

	    renderReqursively (children) {

	        for (var i = 0; i < children.length; i++) {
	            children[i].update();
	            this.renderReqursively(children[i].children);
	            this.renderer.renderSprite(children[i]);
	        }
	    }

	    renderEachChildren () {
	            
	        for (var i = 0; i < this.children.length; i++) {
	            this.children[i].update();
	            this.renderer.renderSprite(this.children[i]);
	        }
	    }


	}


	// function drawObjects(renderer, objects, context, camera) {

	//     renderer.renderObject();

	//     for (var i = 0; i < objects.length; i++) {
	//         var element = objects[i];
	//         this.list.push(element);
	//         drawObjects(element.children, context, camera);
	//     }
	// }


	var _autoUpdate;

	var _meydanInstances = [];
	function addMeydan(meydan){
	    if(_meydanInstances.indexOf(meydan) == -1){
	        _meydanInstances.push(meydan);
	        requestAnimationFrame(updateMeydans);
	    }
	}

	function removeMeydan(meydan){
	    _meydanInstances.splice(_meydanInstances.indexOf(meydan), 1);
	}

	function updateMeydans(){


	    for (var i = 0; i < _meydanInstances.length; i++) {
	        _meydanInstances[i].update2();
	    }
	        
	    if(_meydanInstances.length > 0){
	        requestAnimationFrame(updateMeydans);
	    }

	}

	class ImageObject extends EventableObject {

	    constructor (url) {

	        super();

	        if(url !== undefined) {
	            
	            this.setImageUrl(url);
	        }
	         
	    }

	    setImageUrl (url) {
	        this.url = url;
	        this._srcImage = new Image();
	        this._srcImage.onload = this.onLoadImage.bind(this);
	        this._srcImage.onerror = this.onErrorImage.bind(this);
	        this._srcImage.src = url;

	    }

	    onLoadImage (event) {
	        this.dispacthEvent(ImageObject.COMPLETE, {rawEvent:event});
	    }

	    onErrorImage (event) {
	        this.dispacthEvent(ImageObject.ERROR, {rawEvent:event});
	    }

	    upload (gl) {

	        if(!this.textureBuffer) {
	            
	            this.textureBuffer = gl.createTexture();
	            this.textureBuffer.url = this.url;
	            gl.bindTexture(gl.TEXTURE_2D, this.textureBuffer);
	            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this._srcImage);
	            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	        }
	        
	    }
	    


	}

	ImageObject.COMPLETE = "onImageComplete";
	ImageObject.ERROR = "onImageError";

	class Transform2D {

	    constructor (array) {
	        
	        this.x = 0;
	        this.y = 0;

	        this.scaleX = 1;
	        this.scaleY = 1;

	        this.rotation = 0;
	        
	        this.width = 10;
	        this.height = 10;

	        this._tx = 0;
	        this._ty = 0;

	        this._scaleMatrix = new Matrix3();
	        this._translateMatrix = new Matrix3();
	        this._rotationMatrix = new Matrix3();

	        this.worldMatrix = new Matrix3();


	        this.a = 1;

	        if(array === undefined) {
	            array = [
	                1, 0, 0,
	                0, 1, 0,
	                0, 0, 0
	            ];
	        }

	        this.elements = new Float32Array(array);
	    }
	    

	    updateWorldMatrix () {
	        
	        this._scaleMatrix.scale(this.scaleX, this.scaleY);
	        this._rotationMatrix.setRotationZ(this.rotation);
	        this._translateMatrix.translate(this.x, this.y);
	        
	        this.worldMatrix.multiplySRTMatrix(this._scaleMatrix,this._rotationMatrix, this._translateMatrix);

	    }


	    


	    

	}

	class NormalSprite extends ObjectContainer2D {

	    constructor (texture) {
	        
	        super();

	        this.translate = new Transform2D();
	        this.width = 10;
	        this.height = 30;
	        
	        var f = 16;
	        this.texture = texture;
	      
	        // this.vertices  = [
	        //     -f,  f, // left - top
	        //     -f, -f, // left - bottom
	        //     f,  f, // right - top
	        //     f, -f, // right - bottom
	        // ];

	         this.vertices  = [
	            new Vector2(-f,  f), // left - top
	            new Vector2(-f, -f), // left - bottom
	            new Vector2(f,  f), // right - top
	            new Vector2(f, -f), // right - bottom
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

	        super.update();
	        var rotation = this.rotation;

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

	class Camera extends Object2D{

	    constructor (){
	        super();
	        this.projectionMatrix = new Matrix3();
	        //this.projectionMatrix.makeOrtho(-250, 250, -250, 250);
	        this.projectionMatrix.makeOrtho(-300, 300, -300, 300);
	        
	    }



	    updateWorldMatrix (){
	        
	        super.updateWorldMatrix();
	    }

	}

	exports.CoreObject = CoreObject;
	exports.EventableObject = EventableObject;
	exports.UniformObject = UniformObject;
	exports.Vector2 = Vector2;
	exports.Vector3 = Vector3;
	exports.Matrix3 = Matrix3;
	exports.Color = Color;
	exports.WebGLRenderer = WebGLRenderer;
	exports.DefaultEffect = DefaultEffect;
	exports.ColorEffect = ColorEffect;
	exports.InstancedMaterial = InstancedMaterial;
	exports.Square = Square;
	exports.Object2D = Object2D;
	exports.ObjectContainer2D = ObjectContainer2D;
	exports.ImageObject = ImageObject;
	exports.NormalSprite = NormalSprite;
	exports.Camera = Camera;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
