
exports.imageToGradient = function(imagePath, options, callback){

    if (options = null) options = {};

    var Jimp = require("jimp");
    
    Jimp.read("testimage.jpg", function (err, image) {
        callback(err,null);
            
        var gradient = {
            red : [],
            green : [],
            blue : [],
            alpha : [],
            unit: 0
        }

        image = image.resize(16,16);
        gradient.unit = image.bitmap.width;

        for (let i=0; i<image.bitmap.height; i++)
        {
            gradient.red[i] = 0;
            gradient.green[i] = 0;
            gradient.blue[i] = 0;
            gradient.alpha[i] = 0;
        }

        // acumulate
        image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
            // x, y is the position of this pixel on the image 
            // idx is the position start position of this rgba tuple in the bitmap Buffer 
            // this is the image 
        
            var red   = this.bitmap.data[ idx + 0 ];
            var green = this.bitmap.data[ idx + 1 ];
            var blue  = this.bitmap.data[ idx + 2 ];
            var alpha = this.bitmap.data[ idx + 3 ];
        
            gradient.red[y] += red;
            gradient.green[y] += green;
            gradient.blue[y] += blue;
            gradient.alpha[y] += alpha;

            // rgba values run from 0 - 255 
            // e.g. this.bitmap.data[idx] = 0; // removes red from this pixel   
        });


        // normalize
        for (let i=0; i<image.bitmap.height; i++)
        {
            gradient.red[i] /= gradient.unit;
            gradient.green[i] /= gradient.unit;
            gradient.blue[i] /= gradient.unit;
            gradient.alpha[i] /= gradient.unit;
        }
        gradient.unit = 1;

        // build css gradient
        var str = 'linear-gradient';
        var separator = '(';
        for (let i=0; i<image.bitmap.height; i++)
        {
            var red = Math.floor(gradient.red[i]);
            var green = Math.floor(gradient.green[i]);
            var blue = Math.floor(gradient.blue[i]);
            var alpha = Math.floor(gradient.alpha[i])/255.0; 
            str += `${separator}rgba(${red},${green},${blue},${alpha})`;
            separator = ', ';
        }
        str +=')';

        callback(null, str);
    });

}

