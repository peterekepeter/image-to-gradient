
# image-to-gradient

[![Build Status](https://img.shields.io/npm/dt/image-to-gradient.svg)](https://www.npmjs.com/package/image-to-gradient)
[![Build Status](https://travis-ci.org/peterekepeter/image-to-gradient.svg?branch=master)](https://travis-ci.org/peterekepeter/image-to-gradient)

This project allows you to easily create CSS gradients from images. The step 
count is variable. Any angle is supported. Alpha channel is also processed.

This is my first NPM module ever.

![alt tag](example.png)


## Usage

There is one exported function with 3 parameters. You specify the path through
the first parameter, you pass in the options in the second parameter and you
pass in a callback function in the third parameter;

The example below creates a gradient from an image and generates a dummy html
file with the background set to the gradient.

    var imageToGradient = require('image-to-gradient');

    var options = {
        angle:10, // gradient angle in degrees
        steps:64  // number of steps
    }

    imageToGradient('testimage.jpg', options, function(err, cssGradient){
        if (err) throw err;
        var html = `
        <html>
            <head>
                <style>
                    html{
                        width:100%;
                        height:100%;
                        background:${cssGradient};
                    }
                </style>    
            </head>
            <body>
            </body>
        </html>`
        var fs = require('fs'); 
        fs.writeFile('output.html',html);
    });


## What can I use it for?

 - Need a background? Create a gradient from an image.
 - Optimise site loading speed by initially replacing images with gradients.
 - Make art! The gradients are beautiful.
 - Need a palette? Create a gradient form an image, use it as a palette.
