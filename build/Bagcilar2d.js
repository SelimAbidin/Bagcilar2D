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

	    function BagcilarMeydan(canvas) {
	        EventableObject.apply(this, arguments);
	        
	        if(canvas !== undefined){
	            this.renderDom = document.getElementById(canvas);
	            var  gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
	            
	            if(!gl){
	                var error = "WebGL isn't supported on device";
	                this.dispatchEvent(BagcilarMeydan.ERROR, {message:error});
	            }

	            this.setWebGLContext(gl);
	            this.init();
	        }
	    }

	    var _autoUpdate;

	    var _meydanInstances = [];
	    function addMeydan(meydan){
	        console.log("meydan added");
	        if(_meydanInstances.indexOf(meydan) == -1){
	            _meydanInstances.push(meydan);
	            requestAnimationFrame(updateMeydans);
	        }
	    }

	    function removeMeydan(meydan){
	        _meydanInstances.splice(_meydanInstances.indexOf(meydan), 1);
	    }

	    function updateMeydans(){

	        console.log("update");
	        for (var i = 0; i < _meydanInstances.length; i++) {
	            _meydanInstances[i].update();
	        }
	        
	        if(updateMeydans.length > 0){
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

	        update : function (){

	            console.log("update");
	            var gl = this.context;
	            gl.clearColor(1.0, 1.0, 0.0, 0.2);
	            // Enable depth testing
	            gl.enable(gl.DEPTH_TEST);
	            // Near things obscure far things
	            gl.depthFunc(gl.LEQUAL);
	            // Clear the color as well as the depth buffer.
	            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	        }
	    });

	    return BagcilarMeydan;
	})();

	exports.CoreObject = CoreObject;
	exports.EventableObject = EventableObject;
	exports.Vector2 = Vector2;
	exports.BagcilarMeydan = BagcilarMeydan;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
