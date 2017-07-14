
import {ObjectContainer2D} from "../display/ObjectContainer2D";
import {Sprite} from "../display/Sprite";
import {WebGLRenderer} from "../renderer/WebGLRenderer";
    
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

        update () {
            
            
            var up = performance.now();
            this.dispacthEvent(Square.ENTER_FRAME, undefined);
            var gl = this.context;
            
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            // Enable depth testing
            //gl.enable(gl.DEPTH_TEST);
            // Near things obscure far things
            //gl.depthFunc(gl.LEQUAL);
            // Clear the color as well as the depth buffer.

            super.update();

            this._renObjects = undefined;
            this._spriteRenderObjects = undefined;
            this.collectObjects(this.children);
            
            this.renderer.renderObjects(this._spriteRenderObjects, this.camera);

            for (var str in this._renObjects) {
                
                if (this._renObjects.hasOwnProperty(str)){
                    this.renderer.renderObjects(this._renObjects[str], this.camera);
                }

            }

            if(this.inf === undefined){
                this.inf = 0;
            }

            up = performance.now() - up;
            this.inf += 0.1;
            if(up < this.min && this.inf > 1){
                this.min = up;
                this.inf = 0;
                console.log("updated");
                document.getElementById("framef").innerHTML = up;
            }
            
            if(this.isFirst && up > this.max){
                this.max = up;
                document.getElementById("frameMax").innerHTML = up;
            }

            this.isFirst = true;
            
            
            //console.log(this._renObjects);
            //drawObjects(this.renderer, this.children, gl, this.camera);
            // if(this.testChilderen){

            //     for (var i = 0; i < this.testChilderen.length; i++) {
            //         this.testChilderen[i].draw(gl);
            //     }
            // }

        }
        
        collectObjects (children) {

            if(!this._renObjects){
                this._renObjects = {};
            }

            if(!this._spriteRenderObjects){
                this._spriteRenderObjects = [];
            }

            
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


    function drawObjects(renderer, objects, context, camera) {

        renderer.renderObject();

        for (var i = 0; i < objects.length; i++) {
            var element = objects[i];
            this.list.push(element);
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

export {Square};