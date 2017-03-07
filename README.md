
# image-to-gradient

This project allows you to easily create CSS gradients from images. Currently only vertical gradients are made. 

![alt tag](example.png)


## Usage

    var module = require('image-to-gradient');

    module.imageToGradient('testimage.jpg', null, function(err, cssGradient){
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
