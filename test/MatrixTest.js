


describe('Matrix3 Creation Is Identity', () => {
    
    var matrix = new Bagcilar.Matrix3();

    it('passes if equal', function() {

        var exampleIdentityArray = [
                                    1,0,0,
                                    0,1,0,
                                    0,0,1
                                    ];
        expect(matrix.matrixArray).toEqual(exampleIdentityArray);
    
    });

});


describe('Matrix3->setMatrix', () => {

    it('passes if equal', function() {

        var matrix = new Bagcilar.Matrix3();
        matrix.setMatrix(1,2,3,4,5,6,7,8,9);
        expect(matrix.matrixArray).toEqual([1,2,3,4,5,6,7,8,9]);
    
    });

});

describe('Matrix3->makeIdentity', () => {
    
    it('passes if equal', function() {

        var matrix = new Bagcilar.Matrix3();
        matrix.setMatrix(1,2,3,4,5,6,7,8, 9);
        matrix.makeIdentity();
        expect(matrix.matrixArray).toEqual([    
                                            1,0,0,
                                            0,1,0,
                                            0,0,1]);
    
    });

});


describe('Matrix3->setRotationZ', () => {

    var matrix = new Bagcilar.Matrix3();
    it('passes if rotation set with no error', function () {
        matrix.setRotationZ(Math.PI / 2);

    })

    it('passes if equal', function() {

        
        expect(matrix.matrixArray).toEqual(    
                                            [ 6.123233995736766e-17, 1, 0,
                                             -1, 6.123233995736766e-17, 0,
                                              0, 0, 1]);
                                                
    });

    it('passes if array[0] is equal to array[4]' ,function () {
        expect(matrix.matrixArray[0]).toBe(matrix.matrixArray[4]);
    })

    it('passes if array[0] is equal to array[4]' ,function () {
        expect(matrix.matrixArray[1]).toBe(-matrix.matrixArray[3]);
    })

});


describe ('Matrix3::setScale', function () {
    
    var matrix = new Bagcilar.Matrix3();
    var scaleX = 100;
    var scaleY = 101;
    it('if scale set possible', function () {
        matrix.setScale(scaleX, scaleY);
    });

    it('if element 0 is equal to ' + scaleX, function () {
        expect(matrix.matrixArray[0]).toBe(scaleX);
    });

    it('if element 4 is equal to ' + scaleY, function () {
        
        expect(matrix.matrixArray[4]).toBe(scaleY);
    
    });

});

describe ('Matrix3::translate', function () {
    
    var matrix = new Bagcilar.Matrix3();
    var posX = 100;
    var posY = 101;
    it('if translate set possible', function () {
        matrix.translate(posX, posY);
    });

    it('if element 6 is equal to ' + posX, function () {
        expect(matrix.matrixArray[6]).toBe(posX);
    });

    it('if element 7 is equal to ' + posY, function () {
        
        expect(matrix.matrixArray[7]).toBe(posY);
    
    });

});

describe ('Matrix3::multiplyMatrix', function () {
    
    var matrix1 = new Bagcilar.Matrix3();
    matrix1.setMatrix(1,2,3,4,5,6,7,8,9);
    var matrix2 = new Bagcilar.Matrix3();
    matrix2.setMatrix(11,2,3,4,5,6,7,8,9);
    
    it('if multiplyMatrix is possible', function () {
        
         matrix1.multiplyMatrix(matrix2);
    });


    it('if result is correct', function () {
        
        var array = [
                40,     56,  72,
                66,    81,  96,
                102,    126, 150,
        ];

        expect(matrix1.matrixArray).toEqual(array);
    });

});

describe ('Matrix3::makeOrtho', function () {
    
    var matrix = new Bagcilar.Matrix3();
   
    it('if makeOrtho is possible', function () {
         matrix.makeOrtho(-300, 300, -300, 300);
    });

    it('if result is correct', function () {
        var array = [0.0033333333333333335, 0, 0, 0, -0.0033333333333333335, 0, -0, 0, 1];
        expect(matrix.matrixArray).toEqual(array);
    });

});

describe ('Matrix3::multiplySRTMatrix', function () {
    
    it('if Scale . Rotation . Translate = result is correct', function () {
         
        var matrix = new Bagcilar.Matrix3();
        matrix.makeIdentity();

        var smatrix = new Bagcilar.Matrix3();
        smatrix.setScale(125, 155);
        
        var rmatrix = new Bagcilar.Matrix3();
        rmatrix.setMatrix(
                                5, 10, 0, 
                                -10, 5, 0, 
                                0,  0,  1, 
                            );

        var tmatrix = new Bagcilar.Matrix3();
        tmatrix.translate(30, 50);

        matrix.multiplySRTMatrix(smatrix, rmatrix, tmatrix);
        
        expect(matrix.matrixArray).toEqual([625, -1250, -43750, 1550, 775, 85250, 0, 0, 1]);
    });

});


