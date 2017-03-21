

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
    });
    it('should always return a positive number', function(){
        for(var x=-2; x<2; x+=0.1){
            assert(imageToGradient.fmod(x, 1) >= 0);
        }
    });
  });
});

