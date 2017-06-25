


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


export {Default};