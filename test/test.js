

var blanket = require('blanket')({
    pattern: '/'
});

var assert = require('assert');
var imageToGradient = require('../');

describe('image-to-gradient', function () {
    describe('fmod', function () {
        it('fmod(1,1) should return 0', function () {
            assert.equal(0, imageToGradient.fmod(1, 1));
        });
        it('fmod(-1,1) should return 0', function () {
            assert.equal(0, imageToGradient.fmod(-1, 1));
        });
        it('always return a number less than the second parameter', function () {
            var x, y;
            for (x = 1; x < 10; x += 1) {
                for (y = 1; y < 10; y += 1) {
                    assert(imageToGradient.fmod(x, y) < y);
                }
            }
        });
        it('should always return a positive number', function () {
            for (var x = -2; x < 2; x += 0.1) {
                assert(imageToGradient.fmod(x, 1) >= 0);
            }
        });
    });

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

    describe('samples', function () {
        it('should resolve top white to black in 2 steps as white to black', function (done) {
            imageToGradient('test/images/T-FFF_000.png', { steps: 2, angle: 0 }, function (error, result) {
                assert.equal(result, 'linear-gradient(rgba(255,255,255,1.0),rgba(0,0,0,1.0))', 'result was undefined');
                done();
            });
        });

        it('should resolve top white to black in 2 steps with 90deg as grey', function (done) {
            imageToGradient('test/images/T-FFF_000.png', { steps: 2, angle: 90 }, function (error, result) {
                assert.equal(result, 'linear-gradient(90deg,rgba(127,127,127,1.0),rgba(127,127,127,1.0))', 'result was undefined');
                done();
            });
        });

        it('should resolve top white to black in 10 steps as white to black with distinct center', function (done) {
            imageToGradient('test/images/T-FFF_000.png', { steps: 10, angle: 0 }, function (error, result) {
                assert.equal(result, 'linear-gradient(rgba(255,255,255,1.0),rgba(255,255,255,1.0),rgba(255,255,255,1.0),rgba(255,255,255,1.0),rgba(255,255,255,1.0),rgba(0,0,0,1.0),rgba(0,0,0,1.0),rgba(0,0,0,1.0),rgba(0,0,0,1.0),rgba(0,0,0,1.0))', 'result was undefined');
                done();
            });
        });

        it('should resolve left black to white in 2 steps as black to white', function (done) {
            imageToGradient('test/images/L-000_FFF.png', { steps: 2, angle: 90 }, function (error, result) {
                assert.equal(result, 'linear-gradient(90deg,rgba(0,0,0,1.0),rgba(255,255,255,1.0))', 'result was undefined');
                done();
            });
        });

        it('should resolve left black to white in 10 steps as black to white with distinct center', function (done) {
            imageToGradient('test/images/L-000_FFF.png', { steps: 10, angle: 90 }, function (error, result) {
                assert.equal(result, 'linear-gradient(90deg,rgba(0,0,0,1.0),rgba(0,0,0,1.0),rgba(0,0,0,1.0),rgba(0,0,0,1.0),rgba(0,0,0,1.0),rgba(255,255,255,1.0),rgba(255,255,255,1.0),rgba(255,255,255,1.0),rgba(255,255,255,1.0),rgba(255,255,255,1.0))', 'result was undefined');
                done();
            });
        });
        //------------
        it('should resolve bottom rainbow in 2 steps into two average colors', function (done) {
            imageToGradient('test/images/B-E50022_E04000_DC9E00_B7D800_57D400_00CF04_00CB5C_00C7B1_0083C3_002EBF.png', { steps: 2, angle: 180 }, function (error, result) {
                assert.equal(result, 'linear-gradient(180deg,rgba(0,157,132,1.0),rgba(189,130,7,1.0))', 'result was undefined');
                done();
            });
        });

        it('should resolve bottom rainbow in 2 steps with 270deg a single average color', function (done) {
            imageToGradient('test/images/B-E50022_E04000_DC9E00_B7D800_57D400_00CF04_00CB5C_00C7B1_0083C3_002EBF.png', { steps: 2, angle: 270 }, function (error, result) {
                assert.equal(result, 'linear-gradient(270deg,rgba(94,143,69,1.0),rgba(94,143,69,1.0))', 'result was undefined');
                done();
            });
        });

        it('should resolve bottom rainbow in 10 steps into a smoother average color gradient', function (done) {
            imageToGradient('test/images/B-E50022_E04000_DC9E00_B7D800_57D400_00CF04_00CB5C_00C7B1_0083C3_002EBF.png', { steps: 10, angle: 180 }, function (error, result) {
                assert.equal(result, 'linear-gradient(180deg,rgba(0,46,191,1.0),rgba(228,0,34,1.0),rgba(224,63,0,1.0),rgba(220,158,0,1.0),rgba(183,216,0,1.0),rgba(87,212,0,1.0),rgba(0,207,4,1.0),rgba(0,203,92,1.0),rgba(0,199,177,1.0),rgba(0,131,194,1.0))', 'result was undefined');
                done();
            });
        });

        it('should resolve right rainbow in 2 steps into two average colors', function (done) {
            imageToGradient('test/images/R-E50022_E04000_DC9E00_B7D800_57D400_00CF04_00CB5C_00C7B1_0083C3_002EBF.png', { steps: 2, angle: 270 }, function (error, result) {
                assert.equal(result, 'linear-gradient(270deg,rgba(0,157,132,1.0),rgba(189,130,7,1.0))', 'result was undefined');
                done();
            });
        });

        it('should resolve right rainbow to white in 10 steps into a smoother average color gradient', function (done) {
            imageToGradient('test/images/R-E50022_E04000_DC9E00_B7D800_57D400_00CF04_00CB5C_00C7B1_0083C3_002EBF.png', { steps: 10, angle: 270 }, function (error, result) {
                assert.equal(result, 'linear-gradient(270deg,rgba(0,45,190,1.0),rgba(229,0,33,1.0),rgba(223,64,0,1.0),rgba(219,158,0,1.0),rgba(183,216,0,1.0),rgba(86,212,0,1.0),rgba(0,207,4,1.0),rgba(0,203,92,1.0),rgba(0,198,177,1.0),rgba(0,130,195,1.0))', 'result was undefined');
                done();
            });
        });
    });

});

