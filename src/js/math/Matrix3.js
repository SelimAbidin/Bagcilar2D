


class Matrix3 {
    constructor() {
        this.matrixArray = [
                            1,0,0,
                            0,1,0,
                            0,0,1
                            ];
    }

    makeIdentity (){
        this.setMatrix(
                        1,0,0,
                        0,1,0,
                        0,0,1);
    }

    setMatrix  (    
                n00, n10, n20, 
                n01, n11, n21,
                n02, n12, n22,
                ){

        var m = this.matrixArray;
        m[0] = n00; m[1] = n10; m[2] = n20;
        m[3] = n01; m[4] = n11; m[5] = n21;
        m[6] = n02; m[7] = n12; m[8] = n22;
    }

    setRotationZ  (radian){
        
        var m = this.matrixArray;
        let c = Math.cos(radian);
        let s = Math.sin(radian);
        m[0] = c; m[1] = -s;
        m[3] = s; m[4] = c;
    }

    setScale  (x,y){
        
        var m = this.matrixArray;
        m[0] = x;
        m[4] = y;

    }

    translate (x,y) {
        let m = this.matrixArray;
        
        let m00 = m[0], m10 = m[3], m20 = m[6];
        let m01 = m[1], m11 = m[4], m21 = m[7];
        let m02 = m[2], m12 = m[5], m22 = m[8];

        m[6] = x;
        m[7] = y;
   
    }

    multiplyMatrix (matrix){

        var m1 = this.matrixArray;
        var m2 = matrix.matrixArray;

        var a00 = m1[0], a01 = m1[3], a02 = m1[6];
        var a10 = m1[1], a11 = m1[4], a12 = m1[7];
        var a20 = m1[2], a21 = m1[5], a22 = m1[8];

        var b00 = m2[0], b01 = m2[3], b02 = m2[6];
        var b10 = m2[1], b11 = m2[4], b12 = m2[7];
        var b20 = m2[2], b21 = m2[5], b22 = m2[8];

        m1[0] = a00 * b00 + a01 * b10 + a02 * b20; 
        m1[3] = a00 * b01 + a01 * b11 + a02 * b21; 
        m1[6] = a00 * b02 + a01 * b12 + a02 * b22; 

        m1[1] = a10 * b00 + a11 * b10 + a12 * b20; 
        m1[4] = a10 * b01 + a11 * b11 + a12 * b21; 
        m1[7] = a10 * b02 + a11 * b12 + a12 * b22; 
        
        m1[2] = a20 * b00 + a21 * b10 + a22 * b20; 
        m1[5] = a20 * b01 + a21 * b11 + a22 * b21; 
        m1[8] = a20 * b02 + a21 * b12 + a22 * b22; 
        
        return this;

    }

    makeOrtho (left, right,  top, bottom){

        let m = this.matrixArray;


        m[0] = 2 / (right - left); 
        m[4] = 2 / (top - bottom);

        m[6] = -((right + left) / (right - left));
        m[7] = -((top + bottom) / (top - bottom));

        // m[0] = 2 / (right - left); 
        // m[2] = -((right + left) / (right - left));
        // m[4] = 2 / (top-bottom);
        // m[5] = -((top + bottom) / (top - bottom));
        

    }




}


export {Matrix3};
