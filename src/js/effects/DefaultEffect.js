


function DefaultEffect(){

}


DefaultEffect.prototype = Object.assign(DefaultEffect.prototype, {

    params : {},
    isUploaded : false,
    upload : function(gl){
        
        var vertexShaderSRC =  "uniform mat3 modelMatrix;"+
                               "uniform mat3 projectionMatrix;"+
                               "uniform mat3 viewMatrix;"+
                                "attribute vec2 position;"+      
                                "void main() {"+
                                "   vec3 pos = vec3(position.x,position.y, 1.0);"+
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

        var params = {};
        params["modelMatrix"] = {};
        params["modelMatrix"].id = gl.getUniformLocation(this.shaderProgram, "modelMatrix");
        //params["modelMatrix"].value = undefined;

        params["projectionMatrix"] = {};
        params["projectionMatrix"].id = gl.getUniformLocation(this.shaderProgram, "projectionMatrix");
        //params["projectionMatrix"].value
        
        params["viewMatrix"] = {};
        params["viewMatrix"].id = gl.getUniformLocation(this.shaderProgram, "viewMatrix");
        //params["projectionMatrix"].value
        this.uniforms = params;

        this.isUploaded = true;
    },

    draw : function (gl){

        if(!this.shaderProgram){
            this.upload(gl);
        }
        gl.useProgram(this.shaderProgram);

        for(var str in this.uniforms){
            var uniform = this.uniforms[str];
            gl.uniformMatrix3fv(uniform.id , false , uniform.value);
        }
    }

});


export {DefaultEffect};