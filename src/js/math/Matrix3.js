

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
                n02, n12, n22 
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

        m[0] = c; m[1] = s;
        m[3] = -s; m[4] = c;
    }

    setScale  (x,y){
        
        var m = this.matrixArray;
        m[0] = x;
        m[4] = y;

    }

    translate (x,y) {

        let m = this.matrixArray;
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

    }


    multiplySRTMatrix (scaleMatrix, rotationMatrix, translateMatrix) {

        scaleMatrix = scaleMatrix.matrixArray;
        rotationMatrix = rotationMatrix.matrixArray;
        translateMatrix = translateMatrix.matrixArray;
        var a00 = scaleMatrix[0], a10 = scaleMatrix[3], a20 = scaleMatrix[6];
        var a01 = scaleMatrix[1], a11 = scaleMatrix[4], a21 = scaleMatrix[7];
        var a02 = scaleMatrix[2], a12 = scaleMatrix[5], a22 = scaleMatrix[8];

        var b00 = rotationMatrix[0], b10 = rotationMatrix[3], b20 = rotationMatrix[6];
        var b01 = rotationMatrix[1], b11 = rotationMatrix[4], b21 = rotationMatrix[7];
        var b02 = rotationMatrix[2], b12 = rotationMatrix[5], b22 = rotationMatrix[8];

        var c00 = translateMatrix[0], c10 = translateMatrix[3], c20 = translateMatrix[6];
        var c01 = translateMatrix[1], c11 = translateMatrix[4], c21 = translateMatrix[7];
        var c02 = translateMatrix[2], c12 = translateMatrix[5], c22 = translateMatrix[8];


        var d00 = a00 * b00 + a10 * b01 + a20 * b02;
        var d10 = a00 * b10 + a10 * b11 + a20 * b12;
        var d20 = a00 * b20 + a10 * b21 + a20 * b22;

        var d01 = a01 * b00 + a11 * b01 + a21 * b02;
        var d11 = a01 * b10 + a11 * b11 + a21 * b12;
        var d21 = a01 * b20 + a11 * b21 + a21 * b22;

        var d02 = a02 * b00 + a12 * b01 + a22 * b02;
        var d12 = a02 * b10 + a12 * b11 + a22 * b12;
        var d22 = a02 * b20 + a12 * b21 + a22 * b22;

        console.log(a00, d01, d02);

        this.matrixArray[0] = d00 * c00 + d10 * c01 + d20 * c02;
        this.matrixArray[1] = d00 * c10 + d10 * c11 + d20 * c12;
        this.matrixArray[2] = d00 * c20 + d10 * c21 + d20 * c22;

        this.matrixArray[3] = d01 * c00 + d11 * c01 + d21 * c02;
        this.matrixArray[4] = d01 * c10 + d11 * c11 + d21 * c12;
        this.matrixArray[5] = d01 * c20 + d11 * c21 + d21 * c22;

        this.matrixArray[6] = d02 * c00 + d12 * c01 + d22 * c02;
        this.matrixArray[7] = d02 * c10 + d12 * c11 + d22 * c12;
        this.matrixArray[8] = d02 * c20 + d12 * c21 + d22 * c22;
    }




}


export {Matrix3};
