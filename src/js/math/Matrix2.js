


function Matrix2() {
    
    this._matrix = [
        1,0,
        0,1
    ];
}



Matrix2.prototype = Object.assign(Matrix2.prototype, {
    
    makeIdentity : function (){

        this.setMatrix(1,0,0,1);
        
    } ,

    setMatrix : function (n00, n10, n01, n11){

        var m = this._matrix;
        m[0] = n00; m[1] = n10;
        m[2] = n01; m[3] = n11;
        
    }

});

export {Matrix2};