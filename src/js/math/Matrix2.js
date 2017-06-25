


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

    },
    

    setScale : function (x,y){
        
        var m = this.matrixArray;
        m[0] = x;
        m[3] = y;

    }, 


    multiplyMatrix2 : function(matrix){

        var m1 = this.matrixArray;
        var m2 = matrix.matrixArray;

        var n0 = m1[0] * m2[0] + m1[1] * m2[2]; 
        var n1 = m1[0] * m2[1] + m1[1] * m2[3];
        
        var n2 = m1[2] * m2[0] + m1[3] * m2[2]; 
        var n3 = m1[2] * m2[1] + m1[3] * m2[3];

        m1[0] = n0; m1[1] = n1;
        m1[2] = n2; m1[3] = n3;
    },



});

export {Matrix2};