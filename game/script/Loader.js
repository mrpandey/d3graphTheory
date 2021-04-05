var loader = (function() {
	// Environmental variables
	var backContext;
	var img;
	var env;

///////////////////////////////////////////////////////////////////////////////
//
// Public functions
//
///////////////////////////////////////////////////////////////////////////////

	function init(_env, _img, _backContext) {
		env = _env;
		img = _img;
		backContext = _backContext;
	}

	function draw(percentage) {
		// Clear background
		backContext.fillStyle = "#cedfe7";
		backContext.fillRect(0, 0, env.screenWidth, env.screenHeight);
		
		// Print percentage
		backContext.textBaseline = "bottom";	
		backContext.fillStyle = "#000000";
		backContext.font = "14px monospace";
		backContext.textAlign = "center";
		backContext.fillText(percentage + "%", env.screenWidth/2, 200);

		// Draw progress bar
		var t = Math.floor(percentage/10);
		var color;
		if(percentage < 30) {
			color = 1;
		} else if(percentage < 60) {
			color = 2;
		} else {
			color = 3;
		}
		for(var i = 0; i < 10; i++) {
			if(i < t) {
				backContext.drawImage(img.tiles, 400, 46*color, 40, 46, 200+i*40, 240, 40, 46);
			} else if(i > t) {
				backContext.drawImage(img.tiles, 0, 0, 40, 46, 200+i*40, 240, 40, 46);
			} else {
				backContext.drawImage(img.tiles, (percentage-i*10)*40, 46*color, 40, 46, 200+i*40, 240, 40, 46);
			}
			backContext.drawImage(img.tileBorder, 40, 0, 40, 46, 200+i*40, 240, 40, 46);
			backContext.drawImage(img.tileBorder, 80, 0, 40, 46, 200+i*40, 240, 40, 46);
		}
		backContext.drawImage(img.tileBorder, 0, 0, 40, 46, 560, 240, 40, 46);
	}

///////////////////////////////////////////////////////////////////////////////
//
// Logo sliding functions
//
///////////////////////////////////////////////////////////////////////////////

	// Logo sliding variables
	var logoT, maxLogoT;
	var logoSpeed, logoAccel;
	var logoState;
	var x;
	var html5X, bgX;

	function resetLogoSliding(_img) {
		img = _img;

		logoSpeed = 0;
		logoAccel = 1;
		x = 0;
		html5X = x + env.screenWidth;
		bgX = html5X + env.screenWidth;
		
		logoState = 0;
		logoT = 59;
		maxLogoT = logoT;
	}

	function pushLogoSliding() {
		switch(logoState) {
		case 0:
			if(logoT > maxLogoT - 20) {
				logoSpeed = logoSpeed + logoAccel;
			} else if(logoT < 20) {
				logoSpeed = logoSpeed - logoAccel;
			}
			x -= logoSpeed;
			html5X = x + env.screenWidth;
			bgX = html5X + env.screenWidth;
			logoT--;

			if(logoT < 0) {
				logoState = 1;
				logoT = 9;
			}
			break;

		case 1:
			logoT--;
			if(logoT < 0) {
				logoState = 2;
				logoT = 59;
			}
			break;

		case 2:
			if(logoT > maxLogoT - 20) {
				logoSpeed = logoSpeed + logoAccel;
			} else if(logoT < 20) {
				logoSpeed = logoSpeed - logoAccel;
			}
			x -= logoSpeed;
			html5X = x + env.screenWidth;
			bgX = html5X + env.screenWidth;
			logoT--;

			if(logoT < 0) {
				logoState = 3;
				logoT = -1;
			}
			break;
		}

		if(logoT < 0 && logoState == 3) {
			return env.mainStates.resetTitile;
		} else {
			return env.mainStates.unknown;
		}
	}

	function drawLogoSliding() {
		// Clear background
		backContext.fillStyle = "#cedfe7";
		backContext.fillRect(0, 0, env.screenWidth, env.screenHeight);

		drawLoadCompleted();
		backContext.drawImage(img.html5, html5X+env.screenWidth/2-128, env.screenHeight/2-150);
		backContext.drawImage(img.background, bgX, 0);
	}

	function drawLoadCompleted() {
		// Print percentage (100%)
		backContext.textBaseline = "bottom";	
		backContext.fillStyle = "#000000";
		backContext.font = "14px monospace";
		backContext.textAlign = "center";
		backContext.fillText("100%", env.screenWidth/2+x, 200);

		// Draw progress bar
		color = 3;
		for(var i = 0; i < 10; i++) {
			backContext.drawImage(img.tiles, 400, 138, 40, 46, 200+i*40+x, 240, 40, 46);
			backContext.drawImage(img.tileBorder, 40, 0, 40, 46, 200+i*40+x, 240, 40, 46);
			backContext.drawImage(img.tileBorder, 80, 0, 40, 46, 200+i*40+x, 240, 40, 46);
		}
		backContext.drawImage(img.tileBorder, 0, 0, 40, 46, 560+x, 240, 40, 46);
	}

///////////////////////////////////////////////////////////////////////////////
//
// Setup public access
//
///////////////////////////////////////////////////////////////////////////////

	return {
		init : init,
		draw : draw,

		resetLogoSliding : resetLogoSliding,
		pushLogoSliding : pushLogoSliding,
		drawLogoSliding : drawLogoSliding
	};
})();

