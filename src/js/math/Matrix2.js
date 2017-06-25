


function Matrix2() {
    
    this.matrixArray = [
        1,0,
        0,1
    ];
}



Matrix2.prototype = Object.assign(Matrix2.prototype, {
    
    makeIdentity : function (){

        this.setMatrix(1,0,0,1);
        
    } ,

    setMatrix : function (n00, n10, n01, n11){

        var m = this.matrixArray;
        m[0] = n00; m[1] = n10;
        m[2] = n01; m[3] = n11;
    },

    setRotationZ : function (radian){
        
        var m = this.matrixArray;
        m[0] = Math.cos(radian); m[1] = -Math.sin(radian);
        m[2] = Math.sin(radian); m[3] = Math.cos(radian);
        
    } 

});

export {Matrix2};