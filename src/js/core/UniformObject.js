import {EventableObject} from "./EventableObject";


function matrix3Fv(gl, uniObject){
    gl.uniformMatrix3fv(uniObject.location , false , uniObject.value);
}

function vector3Fv(gl, uniObject){
    gl.uniform4fv(uniObject.location , uniObject.value);
}

function uniform1i(gl, uniObject){

    if(uniObject.value instanceof Int32Array) {
        gl.uniform1iv(uniObject.location , uniObject.value);
    } else {
        gl.uniform1i(uniObject.location , uniObject.value);
    }
    
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
            this.addUniform(location , uniformInfo);
        }

    }

    getSetter (type) {
        
        switch (type) {
        case 35675: // matrix3
            return matrix3Fv;
        case 35666:
            return vector3Fv;
        case 35678: 
            return uniform1i;
        }
        return; 
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

export {UniformObject};