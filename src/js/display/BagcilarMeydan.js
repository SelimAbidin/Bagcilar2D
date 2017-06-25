
import {EventableObject} from '../core/EventableObject';

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


export {BagcilarMeydan};