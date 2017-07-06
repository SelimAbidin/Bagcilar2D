
import {ObjectContainer2D} from "../display/ObjectContainer2D";
    
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

export {BagcilarMeydan};