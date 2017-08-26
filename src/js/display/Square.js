
import {ObjectContainer2D} from "../display/ObjectContainer2D";
import {WebGLRenderer} from "../renderer/WebGLRenderer";
    
class Square extends ObjectContainer2D {
        
    static get ENTER_FRAME () { return "enterFrame"; }

    constructor (canvasID) {
            
        super(canvasID);
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
            
        this.dispacthEvent(Square.ENTER_FRAME, undefined);
        var gl = this.context;

        

        gl.clearColor(0.3,0.3,0.3,1);


        if(this.userFrameBuffer ) {

            if(this.frameBuffer === undefined) {
                
                this.createBuffer();
                
            }
        }
                    
        if(this.frameBuffer) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
        }
        

        gl.viewport(0,0,600,600);


        gl.clear(gl.COLOR_BUFFER_BIT);
              
       

        this.renderer.prepareForRender(this.camera);
        this.renderReqursively(this.children);
        this.renderer.present3(this.camera);

        // if(this.frameBuffer) {

        //     gl.bindTexture(gl.TEXTURE_2D, null);
        //     gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        // }


       

       
    

        if(this.frameBuffer) {
          

            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            
            gl.clearColor(0.3,0.3,0.3,1);
            gl.viewport(0,0,600,600);
            gl.clear(gl.COLOR_BUFFER_BIT);
            
            gl.useProgram(this.fshaderProgram);

            gl.activeTexture(gl.TEXTURE0 );
            gl.bindTexture(gl.TEXTURE_2D, this.frameBufferTexture);
            
            gl.bindBuffer(gl.ARRAY_BUFFER, this.framePosBuffer);
            gl.vertexAttribPointer(this.frameBufferPositionLocation, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(this.frameBufferPositionLocation);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.frameUVBuffer);
            gl.vertexAttribPointer(this.frameBufferUVLocation, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(this.frameBufferUVLocation);


            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.frameIndices);

            gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);


        }

    }



    createBuffer () {

        var gl = this.context;
        this.frameBuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);

        this.frameBufferTexture  = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.frameBufferTexture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 600, 600, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.frameBufferTexture, 0);

        var vertexSTR = `

            attribute vec2 position;
            attribute vec2 uv;
            varying vec2 uvData;
            void main () {
                uvData = uv;
                gl_Position = vec4(position.x, position.y, 0.1 , 1.0);
                
            }
        `;

        var fragmentSTR = `
                    precision lowp float;
                    varying vec2 uvData;
                    uniform sampler2D uSampler;
                    void main () {
                        gl_FragColor = texture2D(uSampler,uvData);
                    }
                `;

        // var fragmentSTR = `
        //         precision lowp float;
        //         varying vec2 uvData;
        //         uniform sampler2D uSampler;
        //         void main () {
        //             gl_FragColor = vec4(1,1,0,1);
        //         }
        //     `;
            
        this.frameVertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(this.frameVertexShader, vertexSTR);
        gl.compileShader(this.frameVertexShader);
        if ( !gl.getShaderParameter(this.frameVertexShader, gl.COMPILE_STATUS) ) {
            let finfo = gl.getShaderInfoLog( this.frameVertexShader );
            throw "Could not compile WebGL program. \n\n" + finfo;
        }


        this.framePixelShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(this.framePixelShader, fragmentSTR);
        gl.compileShader(this.framePixelShader);
        if ( !gl.getShaderParameter(this.framePixelShader, gl.COMPILE_STATUS) ) {
            let finfo = gl.getShaderInfoLog( this.framePixelShader );
            throw "Could not compile WebGL program. \n\n" + finfo;
        }

        this.fshaderProgram = gl.createProgram();
        gl.attachShader(this.fshaderProgram, this.frameVertexShader);
        gl.attachShader(this.fshaderProgram, this.framePixelShader);
        gl.linkProgram(this.fshaderProgram);

        this.frameBufferPositionLocation = gl.getAttribLocation(this.fshaderProgram,"position");
        this.frameBufferUVLocation = gl.getAttribLocation(this.fshaderProgram,"uv");

        
        
        var f = 1;
        var vertices  = [
            -f,  f, // left - top
            -f, -f, // left - bottom
            f,  f, // right - top
            f, -f, // right - bottom
        ];
        
       

        var indices = [0,1,2, 1,3,2];
        var frameIndices = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, frameIndices);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
        


        var framePosBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, framePosBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        gl.vertexAttribPointer(this.frameBufferPositionLocation, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.frameBufferPositionLocation);

        var uv = [0,1, 0,0,  1,1,  1,0];
        var frameUVBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, frameUVBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.STATIC_DRAW);
        gl.vertexAttribPointer(this.frameBufferUVLocation, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.frameBufferUVLocation);


        this.framePosBuffer = framePosBuffer;
        this.frameIndices = frameIndices;
        this.frameUVBuffer = frameUVBuffer;
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