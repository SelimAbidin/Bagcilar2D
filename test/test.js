var assert = require('assert');
var Bagcilar2D = require("../build/Bagcilar2d");


describe('Array', function() {

  describe('#indexOf()', function() {

    it('should return -1 when the value is not present', function() {
       
        assert.equal(-1, [1,2,3].indexOf(4));

    });

  });

});


describe("Bagcilar2D.Square" , function () {

    describe ("Basic Scene", function () {

       
        it("should return true if basic square created", function() {

             try {

                var canvas = document.createElement("canvas");
                var scene = new Bagcilar2D.Square(canvas);
                assert.ok(true);
            } catch (e) {
                assert.fail(e.message);
            } 
            

        });
      


    });

});



