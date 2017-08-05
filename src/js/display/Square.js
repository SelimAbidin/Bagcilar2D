
import {ObjectContainer2D} from "../display/ObjectContainer2D";
import {WebGLRenderer} from "../renderer/WebGLRenderer";
    
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
        this.renderEachChildren();
        this.renderer.present3(this.camera);
         

        //  
        //this.renderChild();
        //this.renderRecursively(this);
        //this.renderer.present(this.camera);

    }

    renderEachChildren () {
            
        for (var i = 0; i < this.children.length; i++) {
            this.children[i].update();
            this.renderer.renderSprite(this.children[i]);
        }

    }

    renderChild () {    

        for (var i = 0; i < this.children.length; i++) {
                
            this.children[i].drawTest(this.context);
            // this.renderer.renderSingleObject(this.children[i], this.camera);
                
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

export {Square};