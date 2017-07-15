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


	class UniformObject extends EventableObject {

	    constructor (gl,program){
	        super();
	        this.uniMaps = {};
	        this._program = program;

	        var n = gl.getProgramParameter(this._program, gl.ACTIVE_UNIFORMS);
	        
	        for (var i = 0; i < n; i++) {
	            var uniformInfo = gl.getActiveUniform(this._program, i);
	            var location = gl.getUniformLocation(this._program, uniformInfo.name);
	            this.addUniform(location,uniformInfo);
	        }

	    }

	    getSetter (type) {
	        
	        switch (type) {
	            case 35675: // matrix3
	                return matrix3Fv;
	            case 35666:
	                return vector3Fv
	        
	            default:
	                break;
	        }
	        return 
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
	        // m[0] = c; m[1] = -s;
	        // m[3] = s; m[4] = c;

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
	var MAX_INSTANCE = 350000;

	var _materialInstance;
	class InstancedMaterial extends DefaultEffect {
	    
	    constructor (color) {
	        super();
	        this.count = 0;
	        this.id = "id_"+cccc++;
	        this.isUploaded = false;
	        this._color = color;
	        
	        this.offset = new Float32Array( 2 * MAX_INSTANCE);

	        // var osize = 2 * MAX_INSTANCE;
	        // this.offset = [];
	        // for (var i = 0; i < osize; i++) {
	        //     this.offset[i] = (Math.random() * 300) - 150
	            
	        // }
	        
	        this.colorArray = new Float32Array( 3 * MAX_INSTANCE);
	        this.rotateArray = new Float32Array(MAX_INSTANCE);
	        

	        for (var i = 0; i < this.colorArray.length; i+=3) {
	            
	            this.colorArray[i] = Math.random();
	            this.colorArray[i+1] = Math.random();
	            this.colorArray[i+2] = Math.random();
	            
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
	             var vertexShaderSRC =  document.getElementById( 'vertexShaderInstanced' ).textContent;

	            var fragmentShaderSRC = document.getElementById( 'fragmentShaderInstanced' ).textContent;
	            
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


	            var rotationLoc = gl.getAttribLocation(this.shaderProgram,"rotation");
	            this.rotateBuffer = gl.createBuffer();
	            gl.bindBuffer(gl.ARRAY_BUFFER, this.rotateBuffer);
	            gl.bufferData(gl.ARRAY_BUFFER, this.rotateArray, gl.DYNAMIC_DRAW);
	            gl.vertexAttribPointer(rotationLoc, 1, gl.FLOAT, false, 0, 0);
	            angExt.vertexAttribDivisorANGLE(rotationLoc , 1);

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
	            
	            this.offsetLocation = gl.getAttribLocation(this.shaderProgram,"offset");
	            this.rotationLocation = gl.getAttribLocation(this.shaderProgram,"rotation");
	            this.colorLocation = gl.getAttribLocation(this.shaderProgram,"color");
	            this.positionLocation =  gl.getAttribLocation(this.shaderProgram,"position");


	            this.isUploaded = true;
	        }
	       
	    }
	    
	    set color (value){
	        
	        this._color = value;
	    }

	    get color (){

	        return this._color;
	    }


	    draw (gl){


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
	        this.xPos = 0;
	        this.yPos = 0;
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
	            this.positionMatrix.translate(this.xPos, this.yPos);
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

	        set x (x) {
	            this.xPos = x;
	            this.isPositionDirty = true;
	        }

	        set y (y) {
	            this.yPos = y;
	            this.isPositionDirty = true;
	        }

	        get x () {
	            return this.xPos;
	        }

	        get y () {
	            return this.yPos;
	        }
	        

	        updateWorldMatrix (){
	            
	            this.worldMatrix.makeIdentity();
	            
	            this.updateScale();
	            this.updateRotation();
	            this.updatePosition();

	            this.worldMatrix.multiplyMatrix(this.positionMatrix);
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

	class Sprite extends ObjectContainer2D {

	    constructor () {
	        super();
	        
	        var f = 10;
	        this.vertices = [
	            -f,  f, // left - top
	            -f, -f, // left - bottom
	            f,  f, // right - top
	            f, -f, // right - bottom
	        ];

	        this.color = [Math.random(), Math.random(), Math.random(),1];
	         this.material = InstancedMaterial.getInstance();
	    }

	    updateMaterial (gl) {
	        
	       
	        
	        if(!this.material.isUploaded){
	            this.material.upload(gl);
	        }
	    }

	    upload (gl, material) {
	        
	        if(!Sprite._indexBuffer){
	            this.buffer = gl.createBuffer();
	            console.log("Sprite > Create Buffer");
	            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
	            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

	             var positionLocation = material.positionLocation;
	            
	            gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

	            this.indices = [0,1,2,  1,3,2];
	            this.indexBuffer = gl.createBuffer();
	            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
	            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);

	            
	            Sprite._indexBuffer = this.indexBuffer;
	            Sprite._vertexBuffer = this.buffer;

	           
	           
	        } else {

	            this.buffer = Sprite._vertexBuffer;
	            this.indexBuffer = Sprite._indexBuffer;
	        }
	        
	    }

	    update  () {
	        //super.update();   
	    }

	    draw  (gl, camera){

	        
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
	        this.exAngleInstance = gl.getExtension('ANGLE_instanced_arrays');
	    }

	    prepareForRender () {
	        this._materials.length = 0;
	        this.infoID++;
	    }

	    renderSingleObject (object, camera) {

	        var gl = this.gl;
	        var material = object.material;

	        this.useMaterial(material, camera);
	        
	        object.upload(gl , material);

	        
	        material.next();
	        //material.addRotation(object.rotation);
	        //material.addPosition(object.xPos, object.yPos);
	        /*
	        */

	        material.renderNumber = this.infoID;
	    }

	    useMaterial (material, camera) {

	        if(!material.isUploaded) {
	            var ext = this.exAngleInstance;
	            material.upload(this.gl, ext);
	        }

	        if(material.id != this.lastMaterialID) {

	            this.gl.useProgram(material.shaderProgram);
	            this.lastMaterialID = material.id;
	        }


	        var uniform = material.uniform;
	       
	        if(material.renderNumber !== this.infoID){
	            
	            material.reset();  
	            this._materials.push(material);
	            uniform.setValue("projectionMatrix", camera.projectionMatrix.matrixArray);
	            uniform.setValue("viewMatrix", camera.worldMatrix.matrixArray);
	            uniform.update(this.gl);

	        }
	    }

	    present () {

	        var gl = this.gl;
	        for (var i = 0; i < this._materials.length; i++) {

	                var material = this._materials[i];
	                
	                gl.enableVertexAttribArray(material.positionLocation);


	                gl.enableVertexAttribArray(material.rotationLocation);
	                gl.bindBuffer(gl.ARRAY_BUFFER, material.rotateBuffer);
	                gl.bufferSubData(gl.ARRAY_BUFFER, 0, material.rotateArray);
	                //gl.bufferData(gl.ARRAY_BUFFER, material.rotateArray, gl.DYNAMIC_DRAW);
	                // ROTATION

	                gl.enableVertexAttribArray(material.offsetLocation);
	                gl.bindBuffer(gl.ARRAY_BUFFER, material.offsetBuffer);
	                gl.bufferSubData(gl.ARRAY_BUFFER, 0, material.offset);
	                //gl.bufferData(gl.ARRAY_BUFFER, material.offset, gl.DYNAMIC_DRAW);
	                // OFFSET

	                gl.enableVertexAttribArray(material.colorLocation);

	                var size = 6;
	                this.exAngleInstance.drawElementsInstancedANGLE(gl.TRIANGLES, size, gl.UNSIGNED_SHORT, 0, material.getLenght());

	        }

	this._materials;
	    }

	    renderObject (object, camera) {


	         l = positionLocation;
	                gl.enableVertexAttribArray(l);
	                
	                // POSITION


	                l = rotationLocation;
	                gl.enableVertexAttribArray(l);
	                gl.bindBuffer(gl.ARRAY_BUFFER, material.rotateBuffer);
	                gl.bufferData(gl.ARRAY_BUFFER, material.rotateArray, gl.STATIC_DRAW);
	                // ROTATION
	                

	                l = offsetLocation;
	                gl.enableVertexAttribArray(l);
	                gl.bindBuffer(gl.ARRAY_BUFFER, material.offsetBuffer);
	                gl.bufferData(gl.ARRAY_BUFFER, material.offset, gl.STATIC_DRAW);
	                // OFFSET

	                gl.enableVertexAttribArray(colorLocation);

	                var size = 6;
	                this.exAngleInstance.drawElementsInstancedANGLE(gl.TRIANGLES, size, gl.UNSIGNED_SHORT, 0, objectList.length);



	    }

	    renderObjects (objectList, camera) {

	        var gl = this.gl;
	        if(objectList.length > 0) {

	            var o = objectList[0];

	            if(o instanceof Sprite){

	                var material = InstancedMaterial.getInstance();

	                if(!material.isUploaded) {
	                    var ext = this.exAngleInstance;
	                    material.upload(gl, ext);
	                }
	                
	                
	                
	                var camera = o.stage.camera;
	                var uniform = material.uniform;

	                 var positionLocation = material.positionLocation;
	                var offsetLocation = material.offsetLocation;
	                var rotationLocation = material.rotationLocation;
	                var colorLocation = material.colorLocation;

	                
	                if(this._lastUUID !== material.shaderProgram.__uuid){

	                    this._lastUUID = material.shaderProgram.__uuid;
	                }
	                
	                
	               
	                material.reset();
	                for(var i = 0; i < objectList.length; i++) {
	                    
	                    o = objectList[i];

	                    o.upload(gl , material);
	                    
	                    material.addRotation(o.rotation);
	                    material.addPosition(o.x, o.y);

	                    material.next();
	                    
	                }
	                
	                var positionBuffer = o.buffer;
	                
	                gl.useProgram(material.shaderProgram);
	                
	                uniform.setValue("projectionMatrix", camera.projectionMatrix.matrixArray);
	                uniform.setValue("viewMatrix", camera.worldMatrix.matrixArray);
	                uniform.update(gl);
	                
	                var l;

	                l = positionLocation;
	                gl.enableVertexAttribArray(l);
	                
	                // POSITION


	                l = rotationLocation;
	                gl.enableVertexAttribArray(l);
	                gl.bindBuffer(gl.ARRAY_BUFFER, material.rotateBuffer);
	                gl.bufferData(gl.ARRAY_BUFFER, material.rotateArray, gl.STATIC_DRAW);
	                // ROTATION
	                

	                l = offsetLocation;
	                gl.enableVertexAttribArray(l);
	                gl.bindBuffer(gl.ARRAY_BUFFER, material.offsetBuffer);
	                gl.bufferData(gl.ARRAY_BUFFER, material.offset, gl.STATIC_DRAW);
	                // OFFSET

	                gl.enableVertexAttribArray(colorLocation);

	                var size = 6;
	                this.exAngleInstance.drawElementsInstancedANGLE(gl.TRIANGLES, size, gl.UNSIGNED_SHORT, 0, objectList.length);

	            } else {

	                for(var i = 0; i < objectList.length; i++) {
	                    o = objectList[i];
	                    objectList[i].draw(this.gl, camera);
	                }
	            }
	            
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

	class Square extends ObjectContainer2D {
	        
	        static get ENTER_FRAME () { return "enterFrame"; }

	        constructor (canvasID) {
	            
	            super(canvasID);
	            this.min = 500000;
	            this.max = -500000;
	            this.stage = this;
	            if(canvasID !== undefined){
	                
	                var canvas =  document.getElementById(canvasID);
	                //var  gl = canvas.getContext("webgl2") || canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
	                var  gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");  // webgl2 disabled for now
	               
	                if(!gl){
	                
	                    var error = "WebGL isn't supported on device";
	                    this.dispatchEvent(Square.ERROR , { message : error });

	                } 

	                this.renderDom = canvas;
	                if(gl.hasOwnProperty("rawgl")){
	                    gl = gl.rawgl;
	                }
	                this.setWebGLContext(gl);
	                this.init();
	            }

	        }

	        init () {
	         
	            this.setAutoUpdate(true);
	        
	        }
	        
	        setWebGLContext (gl) {
	            this.context = gl;

	             if(gl instanceof WebGLRenderingContext) {
	                this.renderer = new WebGLRenderer(this,gl);

	                gl.enable(gl.DEPTH_TEST);
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
	            
	            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);



	            // Enable depth testing
	            //gl.enable(gl.DEPTH_TEST);
	            // Near things obscure far things
	            //gl.depthFunc(gl.LEQUAL);
	            // Clear the color as well as the depth buffer.

	           

	            /*
	            this._spriteRenderObjects = [];
	            this._renObjects = {};
	            this.collectObjects(this.children);
	            
	            this.renderSprites();
	         
	           this.renderOtherObjects();
	           */

	           this.renderer.prepareForRender();

	            this.renderChild();
	           //this.renderRecursively(this);
	          this.renderer.present();

	        }

	        renderChild () {

	            for (var i = 0; i < this.children.length; i++) {
	                
	                this.renderer.renderSingleObject(this.children[i], this.camera);
	                
	            }

	        }


	        renderRecursively (o) {

	            if(o instanceof Sprite) {

	                this.renderer.renderSingleObject(o);
	            }

	            if(o.children.length > 0) {
	            
	                for (var i = 0; i < o.children.length; i++) {
	                
	                    this.renderRecursively(o.children[i]);
	                
	                }
	            }

	          

	        }


	        renderOtherObjects () {
	             for (var str in this._renObjects) {
	                
	                if (this._renObjects.hasOwnProperty(str)){
	                    this.renderer.renderObjects(this._renObjects[str], this.camera);
	                }
	            }
	        }

	        renderSprites () {
	              this.renderer.renderObjects(this._spriteRenderObjects, this.camera);
	        }
	        
	        collectObjects (children) {

	            
	            for (var i = 0; i < children.length; i++) {
	                
	                var a = children[i];
	                
	                if(a instanceof Sprite){
	                    
	                    this._spriteRenderObjects.push(a);

	                } else {

	                    if(!this._renObjects.hasOwnProperty(a.material.id)){
	                        this._renObjects[a.material.id] = [];
	                    }

	                    var ar = this._renObjects[a.material.id];
	                    ar.push(a);

	                }

	            }

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

	        window.stats.begin();

	        for (var i = 0; i < _meydanInstances.length; i++) {
	            _meydanInstances[i].update2();
	        }
	        
	        if(_meydanInstances.length > 0){
	            requestAnimationFrame(updateMeydans);
	        }

	        window.stats.end();
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
	        
	         gl.enable(gl.DEPTH_TEST);
	         
	        this.updateMaterial(gl);
	        
	        
	        var uniform = this.material.uniform;
	        uniform.setValue("modelMatrix", this.worldMatrix.matrixArray);
	        uniform.setValue("projectionMatrix", camera.projectionMatrix.matrixArray);
	        uniform.setValue("viewMatrix", camera.worldMatrix.matrixArray);
	        this.material.draw(gl);
	        
	        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
	        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
	        gl.enableVertexAttribArray(0);
	        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER , this.indexBuffer);
	        let size = this.indices.length;
	        gl.drawElements(gl.TRIANGLES , size , gl.UNSIGNED_SHORT , 0);
	    }
	}

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
	                var vertexShaderSRC =  document.getElementById( 'vertexShader' ).textContent;

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
	            this.instanced = gl.getExtension('ANGLE_instanced_arrays');
	        } 

	        var f = 10;
	        var vertices = [
	            -f,  f, // left - top
	            -f, -f, // left - bottom
	            f,  f, // right - top
	            f, -f, // right - bottom
	        ];

	        var count = 27 * 27;
	        this.vs = [];
	        for (var i = 0; i < count; i++) {
	            
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
	        
	        for (var i = 0; i < offset.length; i++) {
	            offset[i] = 0;//(Math.random() * 400) - 300;
	        } 

	            var index = 0;
	         for (var i = 0; i < offset.length; i+=2) {

	            var column = index % 27;
	            var row = Math.floor(index / 27);
	            
	            offset[i] = (column * 22) - 290;
	            offset[i+1] = (row * 27) - 290;

	            index++;
	        }

	        var colorArray = new Float32Array( 4 * count );
	        for (var i = 0; i < colorArray.length; i+=4) {
	            
	            colorArray[i] = Math.random();//this.r;
	            colorArray[i+1] = Math.random();
	            colorArray[i+2] = Math.random();
	            colorArray[i+3] = 1;
	        }

	        var rotateArray = new Float32Array(count );
	        for (var i = 0; i < rotateArray.length; i++) {
	            rotateArray[i] = Math.random() * (Math.PI * 2);
	        }

	        var orderArray = new Float32Array(count );
	        for (var i = 0; i < orderArray.length; i++) {
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
	            this.instanced = gl.getExtension('ANGLE_instanced_arrays');
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
	exports.Matrix3 = Matrix3;
	exports.Color = Color;
	exports.WebGLRenderer = WebGLRenderer;
	exports.DefaultEffect = DefaultEffect;
	exports.ColorEffect = ColorEffect;
	exports.InstancedMaterial = InstancedMaterial;
	exports.Square = Square;
	exports.Object2D = Object2D;
	exports.ObjectContainer2D = ObjectContainer2D;
	exports.Sprite2D = Sprite2D;
	exports.Quad = Quad;
	exports.TestSprite = TestSprite;
	exports.Sprite = Sprite;
	exports.Camera = Camera;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
