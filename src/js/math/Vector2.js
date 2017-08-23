


class Vector2 {

    constructor (x,y) {
        this.x = x;
        this.y = y;
    }
    

    mulMatrix3 (matrix3) {

        var v1 = this.x;
        var v2 = this.y;
        
        var ma = matrix3.matrixArray;

        this.x = ma[0] * v1 + ma[3] * v2 + ma[6];
        this.y = ma[1] * v1 + ma[4] * v2 + ma[7];
        this.w = ma[2] * v1 + ma[5] * v2 + ma[8];

    }
}


export {Vector2};
