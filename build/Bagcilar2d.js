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

	function Object2D(){
	    EventableObject.apply(this, arguments);
	}


	Object2D.prototype = Object.assign(Object.create(EventableObject.prototype), {

	    constructer : Object2D,

	    


	});

	function Sprite2D (){
	    Object2D.apply(this, []);
	}


	Sprite2D.prototype = Object.assign(Object.create(Object2D.prototype), {

	    constructor : Sprite2D,


	    
	     
	});

	function Default(){

	}


	Default.prototype = Object.assign(Default.prototype, {


	    upload : function(gl){

	        var vertexShaderSRC = "attribute vec3 position;"+      
	                                "void main() {"+        
	                                "   gl_Position = vec4(position, 1.0);"+     
	                                "}";

	        var fragmentShaderSRC =     "void main() {"+        
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

	        var f = 0.9;
	        var vertices = [
	             0.0,  f,  0.0,
	            -f, -f,  0.0,
	             f, -f,  0.0
	        ];

	        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

	    },

	    draw : function (gl){
	        
	        if(!this.buffer){
	            this.upload(gl);
	        }

	        if(!this.material){
	            this.updateMaterial(gl);
	        }
	        
	        this.material.draw(gl);

	        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
	        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
	        gl.enableVertexAttribArray(0);
	        gl.drawArrays(gl.TRIANGLES, 0, 3);
	    }

	} );

	exports.CoreObject = CoreObject;
	exports.EventableObject = EventableObject;
	exports.Vector2 = Vector2;
	exports.BagcilarMeydan = BagcilarMeydan;
	exports.Object2D = Object2D;
	exports.Sprite2D = Sprite2D;
	exports.Quad = Quad;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
