


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
        m[0] = Math.cos(radian); m[1] = -Math.sin(radian);
        m[3] = Math.sin(radian); m[4] = Math.cos(radian);

    }

    setScale  (x,y){
        
        var m = this.matrixArray;
        m[0] = x;
        m[4] = y;

    }

    translate (x,y) {
        let m = this.matrixArray;
        m[2] = x;
        m[5] = y;
    }

    multiplyMatrix (matrix){

        var m1 = this.matrixArray;
        var m2 = matrix.matrixArray;

        var n0 = m1[0] * m2[0] + m1[1] * m2[3] + m1[2] * m2[6]; 
        var n1 = m1[0] * m2[1] + m1[1] * m2[4] + m1[2] * m2[7]; 
        var n2 = m1[0] * m2[2] + m1[1] * m2[5] + m1[2] * m2[8]; 
        
        var n3 = m1[3] * m2[0] + m1[4] * m2[3] + m1[5] * m2[6]; 
        var n4 = m1[3] * m2[1] + m1[4] * m2[4] + m1[5] * m2[7]; 
        var n5 = m1[3] * m2[2] + m1[4] * m2[5] + m1[5] * m2[8]; 
        
        var n6 = m1[6] * m2[0] + m1[7] * m2[3] + m1[8] * m2[6]; 
        var n7 = m1[6] * m2[1] + m1[7] * m2[4] + m1[8] * m2[7]; 
        var n8 = m1[6] * m2[2] + m1[7] * m2[5] + m1[8] * m2[8]; 
        
        
        m1[0] = n0; m1[1] = n1; m1[2] = n2;
        m1[3] = n3; m1[4] = n4; m1[5] = n5;
        m1[6] = n6; m1[7] = n7; m1[8] = n8;
    }




}


export {Matrix3};
