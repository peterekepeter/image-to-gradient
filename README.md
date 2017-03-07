
# image-to-gradient

This project allows you to easily create CSS gradients from images. As of version 1.1.0 a gradient of any angle can be made.

![alt tag](example.png)


## Usage

    var imageToGradient = require('image-to-gradient');
    var options = {
        angle:10, // gradient angle in degrees
        steps:64  // number of steps
    }

    imageToGradient('testimage.jpg', null, function(err, cssGradient){
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
