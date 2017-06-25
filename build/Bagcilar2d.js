(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.Bagcilar = global.Bagcilar || {})));
}(this, (function (exports) { 'use strict';

	var CoreObject = (function(){

	    function CoreObject() {
	        
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
	                element.listener.apply(element.context, {type:element.type, target:this, data:data});
	            }
	        }
	    }

	});

	function Vector2 (x,y){
	    this.x = x;
	    this.y = y;
	}

	Vector2.prototype = Object.assign(Vector2.prototype, {


	});

	function Matrix2() {
	    
	    this.matrixArray = [
	        1,0,
	        0,1
	    ];
	}



	Matrix2.prototype = Object.assign(Matrix2.prototype, {
	    
	    makeIdentity : function (){

	        this.setMatrix(1,0,0,1);
	        
	    } ,

	    setMatrix : function (n00, n10, n01, n11){

	        var m = this.matrixArray;
	        m[0] = n00; m[1] = n10;
	        m[2] = n01; m[3] = n11;
	    },

	    setRotationZ : function (radian){
	        
	        var m = this.matrixArray;
	        m[0] = Math.cos(radian); m[1] = -Math.sin(radian);
	        m[2] = Math.sin(radian); m[3] = Math.cos(radian);

	    },
	    

	    setScale : function (x,y){
	        
	        var m = this.matrixArray;
	        m[0] = x;
	        m[3] = y;

	    }, 


	    multiplyMatrix2 : function(matrix){

	        var m1 = this.matrixArray;
	        var m2 = matrix.matrixArray;

	        var n0 = m1[0] * m2[0] + m1[1] * m2[2]; 
	        var n1 = m1[0] * m2[1] + m1[1] * m2[3];
	        
	        var n2 = m1[2] * m2[0] + m1[3] * m2[2]; 
	        var n3 = m1[2] * m2[1] + m1[3] * m2[3];

	        m1[0] = n0; m1[1] = n1;
	        m1[2] = n2; m1[3] = n3;
	    },



	});

	var BagcilarMeydan = (function(){

	    function BagcilarMeydan(canvasID) {

	        EventableObject.apply(this, arguments);
	        
	        if(canvasID !== undefined){
	            
	            var canvas =  document.getElementById(canvasID);
	            var  gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
	            
	            if(!gl){
	             
	                var error = "WebGL isn't supported on device";
	                this.dispatchEvent(BagcilarMeydan.ERROR, {message:error});
	            
	            }
	            

	            this.renderDom = canvas;
	            this.setWebGLContext(gl);
	            this.init();
	        }
	    }

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
	            _meydanInstances[i].update();
	        }
	        
	        if(_meydanInstances.length > 0){
	            requestAnimationFrame(updateMeydans);
	        }
	    }

	    //Object.defineProperty(BagcilarMeydan, );
	    
	    BagcilarMeydan.prototype = Object.assign(Object.create(EventableObject.prototype), {

	        constructor : BagcilarMeydan,
	        
	        init : function (){
	           this.setAutoUpdate(true);
	        },

	        setWebGLContext : function (gl){
	            this.context = gl; 
	        },

	        setAutoUpdate : function(b) {

	            if(_autoUpdate !== b){
	                _autoUpdate = b;

	                if(b){
	                    addMeydan(this);
	                } else {
	                    removeMeydan(this);
	                }
	            }
	        },


	        // TODO silinecek. Testing method 
	        addQuadForTest : function (quad){
	            if(!this.testChilderen) {
	                this.testChilderen = [];
	            }
	            this.testChilderen.push(quad);
	        } ,

	        update : function (){

	            var gl = this.context;
	            
	            //console.log(this.renderDom);
	            
	            gl.viewport(0, 0, this.renderDom.width, this.renderDom.height);
	            gl.clearColor(0.0, 0.0, 0.0, 1.0);
	            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	            // Enable depth testing
	            //gl.enable(gl.DEPTH_TEST);
	            // Near things obscure far things
	            //gl.depthFunc(gl.LEQUAL);
	            // Clear the color as well as the depth buffer.

	            
	            
	            if(this.testChilderen){
	                
	                for (var i = 0; i < this.testChilderen.length; i++) {
	                    this.testChilderen[i].draw(gl);
	                }
	            }



	        }
	    });

	    return BagcilarMeydan;
	})();

	function Matrix2$1() {
	    
	    this.matrixArray = [
	        1,0,
	        0,1
	    ];
	}



	Matrix2$1.prototype = Object.assign(Matrix2$1.prototype, {
	    
	    makeIdentity : function (){

	        this.setMatrix(1,0,0,1);
	        
	    } ,

	    setMatrix : function (n00, n10, n01, n11){

	        var m = this.matrixArray;
	        m[0] = n00; m[1] = n10;
	        m[2] = n01; m[3] = n11;
	    },

	    setRotationZ : function (radian){
	        
	        var m = this.matrixArray;
	        m[0] = Math.cos(radian); m[1] = -Math.sin(radian);
	        m[2] = Math.sin(radian); m[3] = Math.cos(radian);

	    },
	    

	    setScale : function (x,y){
	        
	        var m = this.matrixArray;
	        m[0] = x;
	        m[3] = y;

	    }, 


	    multiplyMatrix2 : function(matrix){

	        var m1 = this.matrixArray;
	        var m2 = matrix.matrixArray;

	        var n0 = m1[0] * m2[0] + m1[1] * m2[2]; 
	        var n1 = m1[0] * m2[1] + m1[1] * m2[3];
	        
	        var n2 = m1[2] * m2[0] + m1[3] * m2[2]; 
	        var n3 = m1[2] * m2[1] + m1[3] * m2[3];

	        m1[0] = n0; m1[1] = n1;
	        m1[2] = n2; m1[3] = n3;
	    },



	});

	var Object2D = (function(){

	    function Object2D(){
	        EventableObject.apply(this, arguments);
	    }

	    var rotation = 0;

	    Object2D.prototype = Object.assign(Object.create(EventableObject.prototype), {

	        constructer : Object2D,
	        isRotationDirty : true,
	        isScaleDirty : true,
	        rotationMatrix : new Matrix2$1(),
	        scaleMatrix : new Matrix2$1(),
	        worldMatrix : new Matrix2$1(),
	        scaleX :1, 
	        scaleY :1, 

	        setRotation : function (v){
	            rotation = v;
	            this.isRotationDirty = true;
	        },

	        getRotation : function(){
	            return rotation;
	        },

	        updateRotation : function(){
	                this.rotationMatrix.setRotationZ(rotation);
	                this.isRotationDirty = false;
	        },

	        updateScale : function(){
	                this.scaleMatrix.setScale(this.scaleX, this.scaleY);
	                this.isScaleDirty = false;
	        },

	        setScale : function (scale) {
	            this.scaleX = scale;
	            this.scaley = scale;
	            //this.scaleMatrix.setScale(scale, scale);
	            this.isScaleDirty = true;
	        },

	        setScaleX : function (x) {
	            this.scaleX = x;
	            this.isScaleDirty = true;
	        },

	        setScaleY : function (y) {
	            this.scaleY = y;
	            this.isScaleDirty = true;
	        },

	        getScaleY : function(){
	            return this.scaleY;
	        },

	        getScaleX : function(){
	            return this.scaleX;
	        },

	        updateWorldMatrix : function (){

	            this.worldMatrix.makeIdentity();

	            if(this.isScaleDirty){
	                this.updateScale();
	                //console.log(this.scaleMatrix.matrixArray);
	                this.worldMatrix.multiplyMatrix2(this.scaleMatrix);
	            }

	            if(this.isRotationDirty){

	                this.updateRotation();
	                this.worldMatrix.multiplyMatrix2(this.rotationMatrix);
	            }  

	            

	            
	        }


	    });

	return Object2D;
	})();

	function Sprite2D (){
	    Object2D.apply(this, []);
	}


	Sprite2D.prototype = Object.assign(Object.create(Object2D.prototype), {

	    constructor : Sprite2D,


	    
	     
	});

	function Default(){

	}


	Default.prototype = Object.assign(Default.prototype, {

	    params : {},

	    upload : function(gl){

	        var vertexShaderSRC =   "uniform mat2 modelMatrix;"+
	                                "attribute vec3 position;"+      
	                                "void main() {"+  
	                                "   vec2 pm = modelMatrix * position.xy;"+     
	                                "   gl_Position = vec4(pm,position.z, 1.0);"+     
	                                "}";

	        var fragmentShaderSRC = ""+
	                                "void main() {"+        
	                                "   gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);"+     
	                                "}";


	        this.fragmentShaderBuffer = gl.createShader(gl.FRAGMENT_SHADER);
	        gl.shaderSource( this.fragmentShaderBuffer, fragmentShaderSRC );
	        gl.compileShader( this.fragmentShaderBuffer );
	        
	        if ( !gl.getShaderParameter(this.fragmentShaderBuffer, gl.COMPILE_STATUS) ) {
	            var info = gl.getShaderInfoLog( this.fragmentShaderBuffer );
	            throw 'Could not compile WebGL program. \n\n' + info;
	        }

	        this.vertexSahderBuffer = gl.createShader(gl.VERTEX_SHADER);
	        gl.shaderSource( this.vertexSahderBuffer, vertexShaderSRC );
	        gl.compileShader( this.vertexSahderBuffer );

	         if ( !gl.getShaderParameter(this.fragmentShaderBuffer, gl.COMPILE_STATUS) ) {
	            var info = gl.getShaderInfoLog( this.fragmentShaderBuffer );
	            throw 'Could not compile WebGL program. \n\n' + info;
	        }


	        this.shaderProgram = gl.createProgram();
	        gl.attachShader(this.shaderProgram, this.vertexSahderBuffer);
	        gl.attachShader(this.shaderProgram, this.fragmentShaderBuffer);

	        gl.linkProgram(this.shaderProgram);

	        this.params.modelMatrix = gl.getUniformLocation(this.shaderProgram, "modelMatrix");
	        

	        
	        
	    },

	    draw : function (gl){

	        if(!this.shaderProgram){
	            this.upload(gl);
	        }
	        gl.useProgram(this.shaderProgram);



	    }

	});

	function Quad() {
	    Object2D.apply(this, arguments);
	}



	Quad.prototype = Object.assign(Object.create(Object2D.prototype), {

	    constructor : Quad,


	    updateMaterial : function(gl){

	        this.material = new Default();
	        this.material.upload(gl);

	    },

	    upload : function (gl){
	        
	        this.buffer = gl.createBuffer();
	        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);

	        var f = 0.7;
	        var vertices = [
	            -f,  f,  0.0, // left - top
	            -f, -f, 0.0, // left - bottom
	             f,  f,  0.0, // right - top
	             f, -f,  0.0, // right - bottom
	        ];

	        this.vertices = vertices;
	        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

	        // var indices = [0,1,2, 2, 4,0];
	        // this.indexBuffer = gl.createBuffer();
	        // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
	        // gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
	        

	    },

	    draw : function (gl){
	        
	        if(!this.buffer){
	            this.upload(gl);
	        }

	        if(!this.material){
	            this.updateMaterial(gl);
	        }
	        
	        this.material.draw(gl);


	        if(this.rad === undefined){
	            this.rad = 0;
	        }
	        this.rad += 0.01;
	        this.setScaleX(Math.cos(this.rad));
	        this.setScaleY(Math.sin(this.rad));

	        this.setRotation(this.getRotation() + 0.01);
	        this.updateWorldMatrix();
	        gl.uniformMatrix2fv(this.material.params.modelMatrix, false, this.worldMatrix.matrixArray);

	        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
	        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
	        gl.enableVertexAttribArray(0);
	       // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
	        gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.vertices.length / 3);




	        //this.setRotation(this.getRotation() + 0.01);
	       // console.log(this.rotationMatrix.matrixArray);
	    }

	} );

	exports.CoreObject = CoreObject;
	exports.EventableObject = EventableObject;
	exports.Vector2 = Vector2;
	exports.Matrix2 = Matrix2;
	exports.BagcilarMeydan = BagcilarMeydan;
	exports.Object2D = Object2D;
	exports.Sprite2D = Sprite2D;
	exports.Quad = Quad;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
