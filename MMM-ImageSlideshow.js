/* global Module */

/* MMM-ImageSlideshow.js
 * 
 * Magic Mirror
 * Module: MMM-ImageSlideshow
 * 
 * Magic Mirror By Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 * 
 * Module MMM-ImageSlideshow By Adam Moses http://adammoses.com
 * MIT Licensed.
 */
 
Module.register("MMM-ImageSlideshow", {
	// Default module config.
	defaults: {
        // an array of strings, each is a path to a directory with images
        imagePaths: [ 'modules/MMM-ImageSlideshow/exampleImages' ],
        // the speed at which to switch between images, in milliseconds
		slideshowSpeed: 10 * 1000,
        // if zero do nothing, otherwise set width to a pixel value
        fixedImageWidth: 0,
        // if zero do nothing, otherwise set height to a pixel value        
        fixedImageHeight: 0,
        // if true randomize image order, otherwise do alphabetical
        randomizeImageOrder: false,
        // if true combine all images in all the paths
        // if false each path with be viewed seperately in the order listed
        treatAllPathsAsOne: false,
        // if true, all images will be made grayscale, otherwise as they are
        makeImagesGrayscale: false,
        // list of valid file extensions, seperated by commas
        validImageFileExtensions: 'bmp,jpg,gif,png',
		// a delay timer after all images have been shown, to wait to restart (in ms)
		delayUntilRestart: 0,
	},
    // load function
	start: function () {

		this.imageIndex = -1;
		this.imageList = [];

		// Schedule update
		var self = this;
		setInterval(function() {
            self.fetchData();
		}, 0.5 * 1000);


		setInterval(function() {
            self.updateDom(2 * 1000);
		}, 10 * 1000);
	},

	fetchData: function() {
        
        var self = this;
        fetch('https://script.google.com/macros/s/AKfycbwAsbAMX3LiBGL3mKWacPCutAFmSu518nwftRt3Una1a9qDxNm7/exec?action=latest')
            .then(function(response) {
                return response.json();
            })
            .then(function(myJson) {

                // // Fetch data from Spread sheet, and update the config.
                // var numberArray = [];
                // var labelArray  = [];
                // var chartTitle  = "運命を変えよう";
                // for (var i = 0; i < myJson.length; i+=1) {
                //     // numberArray.push(Math.floor(Math.random() * (100)));
                //     const val = myJson[i]["status"] == 0 ? 1 : 0;
                //     if (myJson[i]["status"] == 0) {
                //         chartTitle= myJson[i]["ads"];
                //     }
                //     numberArray.push(val);
                //     labelArray.push(myJson[i]["product_name"]);
				// }

				var _message = "";
				var _img_dir_name = "";
				for (var i = 0; i < myJson.length; i+=1) {
                    // numberArray.push(Math.floor(Math.random() * (100)));
                    const val = myJson[i]["status"] == 0 ? 1 : 0;
                    if (myJson[i]["status"] == 0) {
						_message = myJson[i]["ads"];
						_img_dir_name = myJson[i]["image_dir"];
						break;
                    }
				}
				
				if (self.message != _message) {
					self.message = _message;
					self.imageList = [];
					for (var i = 1; i <= 3; i += 1) {
						var _path = "modules/MMM-ImageSlideshow/" + _img_dir_name + "/" + i + ".png";
						self.imageList.push(_path);
					}

					self.imageIndex = -1;
					self.updateDom(3 * 1000);

				}
            });        
	},



	// Define required scripts.
	getStyles: function() {
        // the css contains the make grayscale code
		return ["imageslideshow.css"];
	},    

	// Override dom generator.
	getDom: function () {
		var wrapper = document.createElement("div");

		// set the image location
		this.imageIndex += 1;

		if (this.imageList.length == 0) {
			return wrapper;
		}

		// return if all images are played
		if (this.imageIndex >= this.imageList.length) {
			return wrapper;
		}

		var message = "";
		message = this.message;
		const additionalWrapper = document.createElement("div");
		additionalWrapper.innerHTML = "<p>" + message + "</p>"

		wrapper.appendChild(additionalWrapper);

		var image = document.createElement("img");
		// image.className = "desaturate";

		// create an empty string
		var styleString = '';
		// if width or height or non-zero, add them to the style string
		if (this.config.fixedImageWidth != 0)
			styleString += 'width:' + this.config.fixedImageWidth + 'px;';
		if (this.config.fixedImageHeight != 0)
			styleString += 'height:' + this.config.fixedImageHeight + 'px;';
		// if style string has antyhing, set it
		if (styleString != '')
			image.style = styleString;

		
		
		image.src = this.imageList[this.imageIndex];
		// ad the image to the dom
		wrapper.appendChild(image);	

        // return the dom
		return wrapper;
	}
});
