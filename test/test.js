

(function() {
	'use strict';
    var canvas = document.createElement("canvas");
    canvas.id = "testCanvas";
    canvas.width = 500;    
    canvas.height = 500;
    document.body.appendChild(canvas);
})();


describe('Canvas Test', () => {

   
    var d = document.getElementById("testCanvas");
    it('Should exist', function() {
        expect(d.nodeName).toBe('CANVAS');
    });

});


var bagcilar;
var testSprite;
describe('Basic Scene', () => {

   it("Should be sucessfully created", function (){

        try {
            bagcilar = new Bagcilar.Square("testCanvas");
            var camera = new Bagcilar.Camera();
            bagcilar.camera = camera;
            // testSprite = new Bagcilar.NormalSprite();
            // bagcilar.addChild(testSprite);
            expect(1).toBe(1);
        } catch (e) {
            console.log(e.message);
            expect(false).toBe(true);
        } 
   });

});



// describe('Sprite Update', () => {

//    it("Sh", function (){

//         try {
            
//             testSprite.x = 100;
//             testSprite.y = 150;
//             expect(1).toBe(1);
//         } catch (e) {
//             console.log(e.message);
//             expect(false).toBe(true);
//         } 
//    });

// });






