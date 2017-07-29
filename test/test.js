

(function() {
	'use strict';
    var canvas = document.createElement("canvas");
    canvas.id = "testCanvas";
    canvas.width = 500;    
    canvas.height = 500;
    document.body.appendChild(canvas);
})();



describe('Canvas Test', function() {

   
    var d = document.getElementById("testCanvas");
    it('Should exist', function() {
        expect(d.nodeName).toBe('CANVAS');
    });

});


describe('Basic Scene', () => {


   it("Should be sucessfully created", function (){

        try {
            var bagcilar = new Bagcilar.Square("testCanvas");
            expect(1).toBe(1);
        } catch (e) {
            console.log(e.message);
            expect(false).toBe(true);
        
        } 
   });
    
});
