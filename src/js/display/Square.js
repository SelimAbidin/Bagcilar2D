
import {ObjectContainer2D} from "../display/ObjectContainer2D";
import {WebGLRenderer} from "../renderer/WebGLRenderer";
import {ImageObject} from "../display/ImageObject";
    
class Square extends ObjectContainer2D {
        
    static get ENTER_FRAME () { return "enterFrame"; }

    constructor (canvasID) {
            
        super(canvasID);
        this.allowAutoClear = true;
        this.userFrameBuffer = false;
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
        if(this._autoUpdate !== b) {
           this._autoUpdate = b;

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

    createFrameBufferTexture () {

        var gl = this.context;
        var frameBuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
        var frameBufferTexture  = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, frameBufferTexture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 600, 600, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, frameBufferTexture, 0);
        
        this.frameBuffer = frameBuffer;
        return new ImageObject(frameBufferTexture);
    }

    clear () {

        var gl = this.context;
        gl.viewport(0,0,600,600);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }

    update () {
            
        this.dispacthEvent(Square.ENTER_FRAME, undefined);
        var gl = this.context;
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        if(this.frameBuffer) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
        }
        
        this.renderer.prepareForRender(this.camera);
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

var isUpdateWorking = false;
var _meydanInstances = [];
function addMeydan(meydan){
    if(_meydanInstances.indexOf(meydan) == -1){
        _meydanInstances.push(meydan);

        if(!isUpdateWorking) {
            isUpdateWorking = true;
            requestAnimationFrame(updateMeydans);
        }
        
    }
}

function removeMeydan(meydan){
    _meydanInstances.splice(_meydanInstances.indexOf(meydan), 1);
}

function updateMeydans(){

    for (var i = 0; i < _meydanInstances.length; i++) {
        
        if(_meydanInstances[i].allowAutoClear) {
            _meydanInstances[i].clear();
        }
        _meydanInstances[i].update();
    }
        
    if(_meydanInstances.length > 0){
        requestAnimationFrame(updateMeydans);
    } else {
        isUpdateWorking = false;
    }

}

export {Square};