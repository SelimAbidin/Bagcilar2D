

class Vector3 {
    
    constructor (x, y, w) {

        this.x = x === undefined ? 0 : x;
        this.y = y === undefined ? 0 : y;
        this.w = w === undefined ? 0 : w;
        
    }

    multiplyMat3 (matrix3){

        var v1 = this.x;
        var v2 = this.y;
        var v3 = this.w;
        
        var ma = matrix3.matrixArray;

        this.x = ma[0] * v1 + ma[3] * v2 + ma[6] * v3;
        this.y = ma[1] * v1 + ma[4] * v2 + ma[7] * v3;
        this.w = ma[2] * v1 + ma[5] * v2 + ma[8] * v3;
        
        return this;
    }
    
}

export {Vector3};