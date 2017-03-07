


function imageToGradient(imagePath, options, callback){

    if (options == null) options = {};

    // read options
    var optionAngle = options.angle;
    if (optionAngle == null) optionAngle = 0;
    var optionSteps = options.steps;
    if (optionSteps == null) optionSteps = 16;


    //helpers

    // create a new gradient object with fixed amount of steps
    function createGradient(steps, angle){
        var gradient = { steps:steps, red:[], green:[], blue:[], alpha:[], unit:[], angle:angle };
        for (var i=0; i<gradient.steps; i++)
        {
            gradient.red[i] = 0;
            gradient.green[i] = 0;
            gradient.blue[i] = 0;
            gradient.alpha[i] = 0;
            gradient.unit[i] = 0;
        }
        return gradient;
    }

    // normalize a gradient
    function normalizeGradient(gradient)
    {
        // divide by unit
        for (var i=0; i<gradient.steps; i++)
        {
            var unit = gradient.unit[i];
            gradient.red[i] /= unit;
            gradient.green[i] /= unit;
            gradient.blue[i] /= unit;
            gradient.alpha[i] /= unit;
            gradient.unit[i] = 1;
        }
    }

    // add color to gradient
    function addToGradient(gradient, index, red, green, blue, alpha, weight)
    {   
        var y = index;
        gradient.red[y] += red;
        gradient.green[y] += green;
        gradient.blue[y] += blue;
        gradient.alpha[y] += alpha;
        gradient.unit[y] += weight;
    }

    function fmod(a,b) { return Number((a - (Math.floor(a / b) * b))); }

    // reduce image to gradient
    function reduce(image, steps, angle)
    {
        var gradient = createGradient(steps, angle);
        var resized = image.resize(steps, steps);
        var cos = Math.cos(angle/180.0*Math.PI);
        var sin = Math.sin(angle/180.0*Math.PI);
        var fsteps = gradient.steps;
        var hsteps = fsteps * 0.5;
        resized.scan(0, 0, resized.bitmap.width, resized.bitmap.height, function(x, y, idx){
            for (var i=0; i<gradient.steps; i++){
                var weight = fmod(sin*x + cos*y - i + hsteps, fsteps) - hsteps;
                weight = 1.0 - Math.abs(weight);
                if (weight <= 0) continue;
                addToGradient(gradient, i, resized.bitmap.data[idx]*weight, resized.bitmap.data[idx+1]*weight, resized.bitmap.data[idx+2]*weight, resized.bitmap.data[idx+3]*weight, weight);
            }
        });
        return gradient;
    }

    // convert a gradient to css gradient string
    function gradientToCssString(gradient){
        // build css gradient
        var str = ['linear-gradient'];
        var separator = '(';
        if(gradient.angle !== 0){
            separator = `(${gradient.angle}deg,`;
        }
        for (i=0; i<gradient.steps; i++)
        {
            var red = Math.floor(gradient.red[i]);
            var green = Math.floor(gradient.green[i]);
            var blue = Math.floor(gradient.blue[i]);
            var alpha = (gradient.alpha[i]/255.0).toPrecision(2); 
            str.push(`${separator}rgba(${red},${green},${blue},${alpha})`);
            separator = ',';
        }
        str.push(')');
        return str.join('');
    }

    var Jimp = require("jimp");
    
    Jimp.read("testimage.jpg", function (err, image) {
        if (err) callback(err,null);

        var gradient = reduce(image, optionSteps, optionAngle);
        normalizeGradient(gradient);
        var str = gradientToCssString(gradient);

        callback(null, str);
    });

}

module.exports = imageToGradient;
var exports = module.exports; //redefine exports
exports.imageToGradient = imageToGradient; // backwards compatilibity