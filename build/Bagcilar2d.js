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
	                element.listener.apply(element.context, [{type:element.type, target:this, data:data}]);
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
	                n02, n12, n22,
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
	        m[0] = c; m[1] = -s;
	        m[3] = s; m[4] = c;
	    }

	    setScale  (x,y){
	        
	        var m = this.matrixArray;
	        m[0] = x;
	        m[4] = y;

	    }

	    translate (x,y) {
	        let m = this.matrixArray;
	        
	        let m00 = m[0], m10 = m[3], m20 = m[6];
	        let m01 = m[1], m11 = m[4], m21 = m[7];
	        let m02 = m[2], m12 = m[5], m22 = m[8];

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

	        // m[0] = 2 / (right - left); 
	        // m[2] = -((right + left) / (right - left));
	        // m[4] = 2 / (top-bottom);
	        // m[5] = -((top + bottom) / (top - bottom));
	        

	    }




	}

	function DefaultEffect(){

	}


	DefaultEffect.prototype = Object.assign(DefaultEffect.prototype, {

	    params : {},
	    isUploaded : false,
	    upload : function(gl){
	        
	        var vertexShaderSRC =  "uniform mat3 modelMatrix;"+
	                               "uniform mat3 projectionMatrix;"+
	                               "uniform mat3 viewMatrix;"+
	                                "attribute vec2 position;"+      
	                                "void main() {"+
	                                "   vec3 pos = vec3(position.x,position.y, 1.0);"+
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

	        var params = {};
	        params["modelMatrix"] = {};
	        params["modelMatrix"].id = gl.getUniformLocation(this.shaderProgram, "modelMatrix");
	        //params["modelMatrix"].value = undefined;

	        params["projectionMatrix"] = {};
	        params["projectionMatrix"].id = gl.getUniformLocation(this.shaderProgram, "projectionMatrix");
	        //params["projectionMatrix"].value
	        
	        params["viewMatrix"] = {};
	        params["viewMatrix"].id = gl.getUniformLocation(this.shaderProgram, "viewMatrix");
	        //params["projectionMatrix"].value
	        this.uniforms = params;

	        this.isUploaded = true;
	    },

	    draw : function (gl){

	        if(!this.shaderProgram){
	            this.upload(gl);
	        }
	        gl.useProgram(this.shaderProgram);

	        for(var str in this.uniforms){
	            var uniform = this.uniforms[str];
	            gl.uniformMatrix3fv(uniform.id , false , uniform.value);
	        }
	    }

	});

	var Object2D = (function(){

	    function Object2D(){
	        EventableObject.apply(this, arguments);

	        this.rotationMatrix = new Matrix3();
	        this.scaleMatrix = new Matrix3();
	        this.positionMatrix = new Matrix3();
	        this.worldMatrix = new Matrix3();
	    }

	    Object2D.prototype = Object.assign(Object.create(EventableObject.prototype), {

	        isRotationDirty : true,
	        rotation : 0,
	        stage : undefined,
	        context : undefined,
	        isScaleDirty : true,
	        isPositionDirty : true,
	        scaleX : 1, 
	        scaleY : 1,
	        xPos : 0,
	        yPos : 0,
	        needsCalculation : true,
	        constructer : Object2D,

	        setRotation : function (v){
	            this.rotation = v;
	            this.isRotationDirty = true;
	        },

	        getRotation : function(){
	            return this.rotation;
	        },

	        updateRotation : function(){
	            this.rotationMatrix.setRotationZ(this.rotation);
	            this.isRotationDirty = false;
	        },

	        updateScale : function(){
	            this.scaleMatrix.setScale(this.scaleX, this.scaleY);
	            this.isScaleDirty = false;
	        },

	        updatePosition : function(){
	            this.positionMatrix.translate(this.xPos, this.yPos);
	            this.isPositionDirty = false;
	        },

	        setScale : function (scale) {
	            this.scaleX = scale;
	            this.scaley = scale;
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

	        setX : function(x) {
	            this.xPos = x;
	            this.isPositionDirty = true;
	        },

	        setY : function(y) {
	            this.yPos = y;
	            this.isPositionDirty = y;
	        },

	        getX : function() {
	            return this.xPos;
	        },

	        getY : function() {
	            return this.yPos;
	        },
	        

	        updateWorldMatrix : function (){
	            
	            this.worldMatrix.makeIdentity();
	            
	            this.updateScale();
	            this.updateRotation();
	            this.updatePosition();

	            this.worldMatrix.multiplyMatrix(this.positionMatrix);
	            this.worldMatrix.multiplyMatrix(this.rotationMatrix);
	            this.worldMatrix.multiplyMatrix(this.scaleMatrix); 
	            
	        },

	        update : function () {
	            this.updateWorldMatrix();
	        }


	    });

	    return Object2D;
	})();

	class ObjectContainer2D extends Object2D {
	    
	    constructor (){
	        super();
	        this.children = [];

	    }

	    addChild (child) {

	        if(child instanceof Object2D) {
	        
	            child.stage = this.stage;
	            child.context = this.context;
	            this.children.push(child);
	        
	        } else {
	        
	            console.log("child should be Object2D instance");
	        
	        }
	    }

	    update (){
	        
	        super.update();
	        for (var i = 0; i < this.children.length; i++) {
	            this.children[i].update();
	        }

	    }
	}

	class BagcilarMeydan extends ObjectContainer2D {
	        
	        static get ENTER_FRAME () { return "enterFrame"; }

	        constructor (canvasID) {
	            
	            super(canvasID);
	            this.stage = this;
	            if(canvasID !== undefined){
	                
	                var canvas =  document.getElementById(canvasID);
	                var  gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
	                
	                if(!gl){
	                
	                    var error = "WebGL isn't supported on device";
	                    this.dispatchEvent(BagcilarMeydan.ERROR , { message : error });

	                } 

	                this.renderDom = canvas;
	                this.setWebGLContext(gl);
	                this.init();
	            }

	        }

	        init () {
	         
	            this.setAutoUpdate(true);
	        
	        }
	        
	        setWebGLContext (gl) {
	            this.context = gl; 
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

	        update () {
	            
	            
	            this.dispacthEvent(BagcilarMeydan.ENTER_FRAME, undefined);
	            var gl = this.context;
	            
	            gl.viewport(0, 0, this.renderDom.width, this.renderDom.height);
	            gl.clearColor(0.0, 0.0, 0.0, 1.0);
	            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	            // Enable depth testing
	            //gl.enable(gl.DEPTH_TEST);
	            // Near things obscure far things
	            //gl.depthFunc(gl.LEQUAL);
	            // Clear the color as well as the depth buffer.

	            super.update();

	            
	            drawObjects(this.children, gl, this.camera);
	            
	            // if(this.testChilderen){

	            //     for (var i = 0; i < this.testChilderen.length; i++) {
	            //         this.testChilderen[i].draw(gl);
	            //     }
	            // }



	        }

	    }


	    function drawObjects(objects, context, camera) {
	        
	        for (var i = 0; i < objects.length; i++) {
	            var element = objects[i];
	            element.draw(context, camera);
	            drawObjects(element.children, context, camera);
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

	function Sprite2D (){
	    Object2D.apply(this, []);
	}


	Sprite2D.prototype = Object.assign(Object.create(Object2D.prototype), {

	    constructor : Sprite2D,


	    
	     
	});

	class Quad extends ObjectContainer2D {

	    constructor (params) {
	        super();
	        
	        for(var str in params){
	            var param = str;
	            this[param] = params[str];        
	        }
	    }

	    updateMaterial (gl) {

	        if(!this.material){
	            this.material = new DefaultEffect();
	        }
	        
	        if(!this.material.isUploaded){
	            this.material.upload(gl);
	        }
	    }

	    upload (gl) {
	        
	        this.buffer = gl.createBuffer();
	        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);

	        var f = 10;
	        var vertices = [
	            -f,  f, // left - top
	            -f, -f, // left - bottom
	            f,  f, // right - top
	            f, -f, // right - bottom
	        ];

	        this.vertices = vertices;
	        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

	        this.indices = [0,1,2,  1,3,2];
	        this.indexBuffer = gl.createBuffer();
	        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
	        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);

	    }

	    update  () {
	        super.update();   
	    }


	    draw  (gl, camera){

	        if(!this.buffer){
	            this.upload(gl);
	        }
	        
	        this.updateMaterial(gl);
	        
	        this.material.uniforms["modelMatrix"].value = this.worldMatrix.matrixArray;
	        this.material.uniforms["projectionMatrix"].value = camera.projectionMatrix.matrixArray;
	        this.material.uniforms["viewMatrix"].value = camera.worldMatrix.matrixArray;
	        this.material.draw(gl);
	        
	        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
	        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
	        gl.enableVertexAttribArray(0);
	        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER , this.indexBuffer);
	        let size = this.indices.length;
	        gl.drawElements(gl.TRIANGLES , size , gl.UNSIGNED_SHORT , 0);
	    }
	}

	class Camera extends Object2D{

	    constructor (){
	        super();
	        this.projectionMatrix = new Matrix3();
	        //this.projectionMatrix.makeOrtho(-250, 250, -250, 250);
	        this.projectionMatrix.makeOrtho(-250, 250, 250, -250);
	        
	    }



	    updateWorldMatrix (){
	        
	        super.updateWorldMatrix();
	    }

	}

	exports.CoreObject = CoreObject;
	exports.EventableObject = EventableObject;
	exports.Vector2 = Vector2;
	exports.Matrix3 = Matrix3;
	exports.DefaultEffect = DefaultEffect;
	exports.BagcilarMeydan = BagcilarMeydan;
	exports.Object2D = Object2D;
	exports.ObjectContainer2D = ObjectContainer2D;
	exports.Sprite2D = Sprite2D;
	exports.Quad = Quad;
	exports.Camera = Camera;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
