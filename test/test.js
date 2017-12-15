

var blanket = require('blanket')({
    pattern:'/'
});

var assert = require('assert');
var imageToGradient = require('../');

describe('image-to-gradient', function() {
  describe('fmod', function() {
    it('fmod(1,1) should return 0', function() {
      assert.equal(0, imageToGradient.fmod(1,1));
    });
    it('fmod(-1,1) should return 0', function() {
      assert.equal(0, imageToGradient.fmod(-1,1));
    });
    it('always return a number less than the second parameter', function() {
      var x,y;
      for (x=1; x<10; x+=1){
        for (y=1; y<10; y+=1){
            assert(imageToGradient.fmod(x,y) < y);
        }
      }

    describe('callback', function () {
        it('should execute only once', function (done) {
            var count = 0;
            imageToGradient('doesnotexist.png', {}, function (error, result) {
                if (count == 0) {
                    setTimeout(function () {
                        assert.equal(count, 1, 'called more than once');
                        done();
                    }, 100);
                }
                count++;
            });
        });

        it('should execute without result if image was not found', function (done) {
            imageToGradient('doesnotexist.png', {}, function (error, result) {
                assert.equal(result, undefined);
                done();
            });
        });

        it('should execute with error if image was not found', function (done) {
            imageToGradient('doesnotexist.png', {}, function (error, result) {
                assert.notEqual(error, undefined, 'error was undefined');
                done();
            });
        });

        it('should execute with result if image exists', function (done) {
            imageToGradient('test/images/T-FFF_000.png', {}, function (error, result) {
                assert.notEqual(result, undefined, 'result was undefined');
                done();
            });
        });
    });
    it('should always return a positive number', function(){
        for(var x=-2; x<2; x+=0.1){
            assert(imageToGradient.fmod(x, 1) >= 0);
        }
    });
  });
});

