

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

        this.x = ma[0] * this.x + ma[3] * this.y + ma[6] * this.w;
        this.y = ma[1] * this.x + ma[4] * this.y + ma[7] * this.w;
        this.w = ma[2] * this.x + ma[5] * this.y + ma[8] * this.w;

        return this;
    }
    
}

export {Vector3};