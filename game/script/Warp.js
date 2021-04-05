var warp = (function() {
	// Environmental variables
	var backContext;
	var img;
	var env;
	const padding = 25;
	var canvasWidth, canvasHeight;

///////////////////////////////////////////////////////////////////////////////
//
// Public functions
//
///////////////////////////////////////////////////////////////////////////////

	function init(_env, _img, _backContext) {
		env = _env;
		img = _img;
		backContext = _backContext;
		canvasWidth = env.screenWidth + padding * 2;
		canvasHeight = env.screenHeight + padding * 2;

		// Create off-screen canvas for camera shaking effect
		shakeCanvas = document.createElement("canvas");
		shakeCanvas.width = canvasWidth;
		shakeCanvas.height = canvasHeight;
		shakeContext = shakeCanvas.getContext("2d");

		reset();
	}

	function reset() {
		fadeT = -1;
		warpT = -1;
	}

///////////////////////////////////////////////////////////////////////////////
//
// Fade in/out subroutines
//
///////////////////////////////////////////////////////////////////////////////

	// Fade-in/out variables
	var fadeState, fadeAlpha;
	var fadeT;

	function resetFade(fadeout) {
		if(fadeout == 1) {
			fadeAlpha = 0.0;
			fadeState = 0;
		} else {
			fadeAlpha = 1.0;
			fadeState = 2;
		}
		fadeT = 0;
	}

	function pushFade() {
		if(fadeT < 0) {
			return;
		}

		switch(fadeState) {
		case 0:
			fadeAlpha = fadeAlpha + 0.1;
			if(fadeAlpha > 1.0) {
				fadeAlpha = 1.0;
				fadeT = 30;
				fadeState = 1;
			}
			break;

		case 1:
			fadeT--;
			break;

		case 2:
			fadeAlpha = fadeAlpha - 0.01;
			if(fadeAlpha < 0.0) {
				fadeAlpha = 0.0;
				fadeT = -1;
			}
			break;
		}
	}

	function drawFade() {
		if(fadeT < 0) {
			return;
		}

		// Draw fading square
		backContext.fillStyle = "rgba(255, 255, 255, "+fadeAlpha+")";
		backContext.fillRect(0, 0, env.screenWidth, env.screenHeight);
	}

///////////////////////////////////////////////////////////////////////////////
//
// Warp effect subroutines
//
///////////////////////////////////////////////////////////////////////////////

	// Warp variables
	const warpMaxT = 250;
	var warpT;

	// Line variables
	const maxLine = 144;
	var linePattern = 2;
	var lineTemp;
	var lineNormX = new Array(maxLine);
	var lineNormY = new Array(maxLine);
	var linePosX = new Array(maxLine);
	var linePosY = new Array(maxLine);
	var lineT = new Array(maxLine);
	var lineR = new Array(maxLine);
	var lineV = new Array(maxLine);

	// Star variables
	const maxStar = 80;
	var starNormX = new Array(maxStar);
	var starNormY = new Array(maxStar);
	var starPosX = new Array(maxStar);
	var starPosY = new Array(maxStar);
	var starV = new Array(maxStar);

	function resetWarp() {
		linePattern++;
		linePattern = linePattern % 3;
		resetLines();
		var i;
		switch(linePattern) {
		case 0:
			for(i = 0; i < 20; i++) {
				createLine(Math.random() * 2 * Math.PI, Math.random() * 14 + 6);
			}
			break;
		case 1:
			for(i = 0; i < 24; i++) {
				createLine(i * 0.26, 14);
			}
			break;
		case 2:
			break;
		}
		resetStars();
		resetCameraShake();
		resetFade(0);
		resetHalo();
		warpT = 0;
	}

	function pushWarp() {
		if(warpT >= warpMaxT) {
			warpT = -1;
		}
		if(warpT < 0) {
			return;
		}
		warpT++;

		if(warpT == warpMaxT - 40) {
			resetFade(1);
		}

		// Caculate the position of lines
		var i;
		for(i = 0; i < maxLine; i++) {
			pushLine(i);
		}
		switch(linePattern) {
		case 0:
			break;
		case 1:
			if(warpT % 25 == 0) {
				for(i = 0; i < 24; i++) {
					createLine(i * 0.26, 14);	
				}
			}
			break;
		case 2:
			if(warpT % 2 == 0) {
				createLine(lineTemp * 0.31, 14);
				createLine(lineTemp * 0.31 + Math.PI, 14);
				lineTemp++;
			}
			break;
		}

		// Caculate the position of stars
		for(i = 0; i < maxStar; i++) {
			pushStar(i);
		}

		// Caculate the camera shaking effect
		pushCameraShake();
	}

	function drawWarp() {
		// Clear Background
		shakeContext.fillStyle = "#000000";
		shakeContext.fillRect(0, 0, canvasWidth, canvasHeight);

		// Draw halo animation
		switch(haloFrame) {
		case 0:
			shakeContext.drawImage(img.halo, 0, 0, 512, 512, (canvasWidth - 512) / 2 - shakeOffsetX, (canvasHeight - 512) / 2 - shakeOffsetY, 512, 512);
			break;
		case 1:
			shakeContext.drawImage(img.halo, 512, 0, 512, 512, (canvasWidth - 512) / 2 - shakeOffsetX, (canvasHeight - 512) / 2 - shakeOffsetY, 512, 512);
			break;
		case 2:
			shakeContext.drawImage(img.halo, 0, 512, 512, 512, (canvasWidth - 512) / 2 - shakeOffsetX, (canvasHeight - 512) / 2 - shakeOffsetY, 512, 512);
			break;
		case 3:
			shakeContext.drawImage(img.halo, 512, 512, 512, 512, (canvasWidth - 512) / 2 - shakeOffsetX, (canvasHeight - 512) / 2 - shakeOffsetY, 512, 512);
			break;
		}

		// Draw stars
		var i;
		for(i = 0; i < maxStar; i++) {
			if(starV[i] >= 0) {
				shakeContext.drawImage(img.dot, starPosX[i], starPosY[i]);
			}
		}

		// Draw warp lines
		var s;
		for(i = 0; i < maxLine; i++) {
			if(lineT[i] >= 0) {
				shakeContext.save();
				shakeContext.setTransform(1, 0, 0, 1, 0, 0);
				shakeContext.translate(linePosX[i], linePosY[i]);
				shakeContext.rotate(lineR[i]);
				s = lineV[i] * lineV[i] / 600;
				shakeContext.drawImage(img.warpLine, 0, 0, 203*lineT[i]*s/100, 9*lineT[i]*s/100);
				shakeContext.restore();
			}
		}

		// Flip & do camera shake
		backContext.drawImage(shakeCanvas, (-25 + shakeOffsetX), (-25 + shakeOffsetY));
	}

	function resetLines() {
		var i;
		for(i = 0; i < maxLine; i++) {
			lineNormX[i] = -1;
			lineNormY[i] = -1;
			linePosX[i] = -1;
			linePosY[i] = -1;
			lineT[i] = -1;
			lineR[i] = -1;
			lineV[i] = -1;
		}
		lineTemp = 0;
	}

	function createLine(radian, speed) {
		var i, tmp;
		var target = findAvailableLine();
		if(target < 0) {
			return;
		}

		lineR[target] = radian;
		lineT[target] = 1;
		lineV[target] = speed;

		lineNormX[target] = Math.cos(radian);
		lineNormY[target] = Math.sin(radian);
		linePosX[target] = canvasWidth / 2;
		linePosY[target] = canvasHeight / 2;
	}

	function findAvailableLine() {
		var i;
		for(i = 0; i < maxLine; i++) {
			if(lineT[i] < 0) {
				return i;
			}
		}
		return -1;
	}

	function pushLine(target) {
		if(lineT[target] < 0) {
			return;
		}
		
		lineV[target] += 0.5;
		lineT[target] += lineV[target];
		linePosX[target] = lineNormX[target] * lineT[target] + canvasWidth / 2;
		linePosY[target] = lineNormY[target] * lineT[target] + canvasHeight / 2;

		var x = linePosX[target];
		var y = linePosY[target];
		if(x < 0 || x > canvasWidth || y < 0 || y > canvasHeight) {
			lineT[target] = -1;
			if(linePattern == 0) {
				createLine(Math.random() * 2 * Math.PI, Math.random() * 14 + 6);
			}
		}
	}

	function resetStars() {
		var i, l, x, y;
		for(i = 0; i < maxStar; i++) {
			x = Math.random() * canvasWidth;
			y = Math.random() * canvasHeight;
			l = Math.sqrt(x * x + y * y);
			
			starNormX[i] = (x-canvasWidth/2) / l;
			starNormY[i] = (y-canvasHeight/2) / l;
			starPosX[i] = x;
			starPosY[i] = y;
			starV[i] = Math.random() * 8 + 2;
		}
	}

	function createStar(target, radian) {
		var i, tmp;

		starV[target] = Math.random() * 8 + 2;
		starNormX[target] = Math.cos(radian);
		starNormY[target] = Math.sin(radian);
		starPosX[target] = starNormX[target] * starV[target] * 5 + canvasWidth / 2;
		starPosY[target] = starNormY[target] * starV[target] * 5 + canvasHeight / 2;
	}

	function pushStar(target) {
		if(starV[target] < 0) {
			return;
		}

		starPosX[target] += starNormX[target] * starV[target];
		starPosY[target] += starNormY[target] * starV[target];

		var x = starPosX[target];
		var y = starPosY[target];
		if(x < 0 || x > canvasWidth || y < 0 || y > canvasHeight) {
			createStar(target, Math.random() * 2 * Math.PI);
		}
	}

	function resetHalo() {
		haloFrame = Math.floor(Math.random() * 4);
	}

///////////////////////////////////////////////////////////////////////////////
//
//  Camera shaking effect subroutines
//
///////////////////////////////////////////////////////////////////////////////

	// Camera shake variables
	var shakeFreqX, shakeFreqY;
	var shakeAmpX, shakeAmpY;
	var shakeOffsetX, shakeOffsetY;
	var shakeT;
	var shakeCanvas, shakeContext;

	function resetCameraShake() {
		shakeFreqX = Math.random() + 0.01;
		shakeFreqY = Math.random() + 0.01;
		shakeAmpX = Math.random() * 4 + 1;
		shakeAmpY = Math.random() * 4 + 1;
		shakeOffsetX = 0;
		shakeOffsetY = 0;
		shakeT = 0;
	}

	function pushCameraShake() {
		if(shakeT < 0) {
			return;
		}
		shakeT += 1.0;

		var s = warpT / warpMaxT;
		shakeOffsetX = shakeAmpX * s * Math.cos(shakeT / shakeFreqX);
		shakeOffsetY = shakeAmpY * s * Math.cos(shakeT / shakeFreqY);
	}

///////////////////////////////////////////////////////////////////////////////
//
// Setup public access
//
///////////////////////////////////////////////////////////////////////////////

	function isFading() {
		if(fadeT < 0) {
			return 0;
		} else {
			return 1;
		}
	}

	function isWarping() {
		if(warpT < 0) {
			return 0;
		} else {
			return 1;
		}
	}

	return {
		init : init,

		resetFade : resetFade,
		pushFade : pushFade,
		drawFade : drawFade,
		isFading : isFading,

		resetWarp : resetWarp,
		pushWarp : pushWarp,
		drawWarp : drawWarp,
		isWarping : isWarping
	};
})();

