


describe('ImageObject Creation', () => {
    
    it('if no error', function() {
        var imageObject = new Bagcilar.ImageObject();
    });

});



describe('ImageObject image load Event', () => {
    
    var isLoaded = false;
    beforeEach(function (done) {

            var imageObject = new Bagcilar.ImageObject("base/test/bunny.png");
            imageObject.addEventListener(Bagcilar.ImageObject.COMPLETE, this, function(){
                isLoaded = true;
                console.log("İmage found");
                done();
            });

            imageObject.addEventListener(Bagcilar.ImageObject.ERROR, this, function(event){
                isLoaded = false;
                console.log("İmage not found",  event.data.rawEvent);
                done();
            });

        });

    it('if loaded ', function() {

        expect(isLoaded).toEqual(true);

    });

});



describe('Image error event', () => {
    
    var isLoaded = false;
    beforeEach(function (done) {

            var imageObject = new Bagcilar.ImageObject("base/test/no-real-image-adress.png");
            imageObject.addEventListener(Bagcilar.ImageObject.COMPLETE, this, function(){
                isLoaded = true;
                console.log("İmage found");
                done();
            });

            imageObject.addEventListener(Bagcilar.ImageObject.ERROR, this, function(event){
                isLoaded = false;
                console.log("İmage not found",  event.data.rawEvent);
                done();
            });

        });

    it('if error', function() {

        expect(isLoaded).toEqual(false);

    });

});