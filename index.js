
/**
 * @typedef {{
 *      steps: number,
 *      angle: number,
 *      red: number[],
 *      green: number[],
 *      blue: number[],
 *      alpha: number[],
 *      unit: number[],
 * }} Gradient
 */

/**
 * Create a new gradient object with fixed amount of steps
 * @param {*} steps 
 * @param {*} angle 
 * @returns {Gradient} a gradient object
 */
function createGradient(steps, angle) {
    var gradient = { steps: steps, red: [], green: [], blue: [], alpha: [], unit: [], angle: angle };
    for (var i = 0; i < gradient.steps; i++) {
        gradient.red[i] = 0;
        gradient.green[i] = 0;
        gradient.blue[i] = 0;
        gradient.alpha[i] = 0;
        gradient.unit[i] = 0;
    }
    return gradient;
}

/**
 * Divides all components by the weight (aka unit). Resets unit to 1
 * @param {Gradient} gradient to modify
 */
function normalizeGradient(gradient) {
    // divide by unit
    for (var i = 0; i < gradient.steps; i++) {
        var unit = gradient.unit[i];
        gradient.red[i] /= unit;
        gradient.green[i] /= unit;
        gradient.blue[i] /= unit;
        gradient.alpha[i] /= unit;
        gradient.unit[i] = 1;
    }
}

/**
 * Mixes color into a given gradient step by the amount given by weight.
 * @param {Gradient} gradient target to modify
 * @param {number} index should be between 0 and number of steps in gradient
 * @param {number} red 
 * @param {number} green 
 * @param {number} blue 
 * @param {number} alpha 
 * @param {number} weight 
 */
function addToGradient(gradient, index, red, green, blue, alpha, weight) {
    var y = index;
    gradient.red[y] += red;
    gradient.green[y] += green;
    gradient.blue[y] += blue;
    gradient.alpha[y] += alpha;
    gradient.unit[y] += weight;
}

/**
 * Correct implementation of float modulo division.
 * @param {*} a to divide
 * @param {*} b divisor, expected to be positive number
 * @returns a modulo b, always positive and between 0..b
 */
function fmod(a, b) { return Number((a - (Math.floor(a / b) * b))); }

/**
 * reduce image to gradient
 * @param {Jimp} image 
 * @param {number} steps 
 * @param {number} angle 
 * @returns {Gradient} gradient
 */
function reduce(image, steps, angle) {
    var gradient = createGradient(steps, angle);
    var resized = image.resize(steps, steps);
    var cos = Math.cos(angle / 180.0 * Math.PI);
    var sin = Math.sin(angle / 180.0 * Math.PI);
    var fsteps = gradient.steps;
    var hsteps = fsteps * 0.5;
    resized.scan(0, 0, resized.bitmap.width, resized.bitmap.height, function (x, y, idx) {
        for (var i = 0; i < gradient.steps; i++) {
            var weight = fmod(sin * x + cos * y - i + hsteps, fsteps) - hsteps;
            weight = 1.0 - Math.abs(weight);
            if (weight <= 0) continue;
            addToGradient(gradient, i, resized.bitmap.data[idx] * weight, resized.bitmap.data[idx + 1] * weight, resized.bitmap.data[idx + 2] * weight, resized.bitmap.data[idx + 3] * weight, weight);
        }
    });
    return gradient;
}

/**
 * Converst a gradient object into CSS string
 * @param {Gradient} gradient 
 * @returns {string} a CSS gradient
 */
function gradientToCssString(gradient) {
    // build css gradient
    var str = ['linear-gradient'];
    var separator = '(';
    if (gradient.angle !== 0) {
        separator = '(' + gradient.angle + 'deg,';
    }
    for (i = 0; i < gradient.steps; i++) {
        var red = Math.floor(gradient.red[i]);
        var green = Math.floor(gradient.green[i]);
        var blue = Math.floor(gradient.blue[i]);
        var alpha = (gradient.alpha[i] / 255.0).toPrecision(2);
        str.push(separator + 'rgba(' + red + ',' + green + ',' + blue + ',' + alpha + ')');
        separator = ',';
    }
    str.push(')');
    return str.join('');
}

/**
 * Transforms an image to a CSS gradient
 * @param {string|Buffer|Jimp} imagePath accepts anything that Jimp.read accepts
 * @param {{angle?:number,steps?:number}|undefined} options 
 * @param {(err:Error|null,CSSGradient:string)=>void} callback 
 */
function imageToGradient(imagePath, options, callback) {

    if (options == null) options = {};

    // read options
    var optionAngle = options.angle;
    if (optionAngle == null) optionAngle = 0;
    var optionSteps = options.steps;
    if (optionSteps == null) optionSteps = 16;

    var Jimp = require("jimp");

    Jimp.read(imagePath, function (err, image) {
        if (err) {
            callback(err, null);
            return;
        }

        var gradient = reduce(image, optionSteps, optionAngle);
        normalizeGradient(gradient);
        var str = gradientToCssString(gradient);

        callback(null, str);
    });

}

module.exports = imageToGradient;
var exports = module.exports; //redefine exports

// backwards compatilibity
exports.imageToGradient = imageToGradient;

// export helper functions to make it test-able
exports.gradientToCssString = gradientToCssString;
exports.reduce = reduce;
exports.fmod = fmod;
exports.addToGradient = addToGradient;
exports.normalizeGradient = normalizeGradient;
exports.createGradient = createGradient;