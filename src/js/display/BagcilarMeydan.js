
import {EventableObject} from '../core/EventableObject';

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


export {BagcilarMeydan};