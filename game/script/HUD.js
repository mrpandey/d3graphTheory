var hud = (function() {
	// Environmental variables
	var backContext;
	var img;
	var env;

	// Sliding movement variables
	var shiftY;
	var slideSpeed, slideAccel;
	var slideCurrentPos, slideTargetPos;
	var slideT, maxSlideT;
	
	// HUD variables
	var soundon;
	var playerCount, level, minimized;
	var mousePassSound, mousePassTitle;
	var menuIconX;

	// Sliding movement variables
	var shiftY;
	var slideSpeed, slideAccel;
	var slideCurrentPos, slideTargetPos;
	var slideT, maxSlideT;

	// Counter variables
	var counterY;
	var counterSpeed, counterAccel;

///////////////////////////////////////////////////////////////////////////////
//
// Public functions
//
///////////////////////////////////////////////////////////////////////////////

	function init(_env, _img, _backContext) {
		env = _env;
		img = _img;
		backContext = _backContext;

		reset();
	}

	function reset() {
		soundon = 0;
		playerCount = 2; level = 0; minimized = 0;
		mousePassSound = -1;
		mousePassTitle = -1;
		mousePassMinimized = -1;

		shiftY = -80;
		counterY = -160;
		slideT = -1;
		slideCurrentPos = 0;
		slideTargetPos = 0;
	}

	function resetSliding(targetPos) {
		if(targetPos > 2 || targetPos < 0 || targetPos == slideCurrentPos) {
			return;
		}

		slideTargetPos = targetPos;
		var diff = slideTargetPos - slideCurrentPos;
		if(diff > 0) {
			slideAccel = 0.1;
			counterAccel = 0.2;
		} else {
			slideAccel = -0.1;
			counterAccel = -0.2;
			diff = (-1)*diff;
		}

		if(diff == 2) {
			slideT = 59;
		} else {
			slideT = 39;
		}

		slideSpeed = 0;
		counterSpeed = 0;
		maxSlideT = slideT;
	}

	function push() {
		if(slideT < 0) {
			return;
		}
			
		if(slideT > maxSlideT - 20) {
			slideSpeed = slideSpeed + slideAccel;
			counterSpeed = counterSpeed + counterAccel;
		} else if(slideT < 20) {
			slideSpeed = slideSpeed - slideAccel;
			counterSpeed = counterSpeed - counterAccel;
		}
		shiftY += slideSpeed;
		counterY += counterSpeed;
		slideT--;

		if(slideT < 0) {
			slideCurrentPos = slideTargetPos;
		}
	}

	function draw() {
		// Draw HUD bar
		backContext.drawImage(img.hud, 0, 0, 800, 79, 0, shiftY, 800, 79);

		// Draw player & level infomation
		switch(playerCount) {
		case 0:
			backContext.drawImage(img.title, 0, 120, 190, 40, 20, shiftY+7, 95, 20);
			break;
		case 1:
			backContext.drawImage(img.title, 0, 80, 190, 40, 20, shiftY+7, 95, 20);
			backContext.drawImage(img.title, 260, 120, 190, 40, 490, shiftY+7, 95, 20);
			ui.drawNumbers(backContext, level, 560, shiftY+7, 0.36);
			break;
		case 2:
			backContext.drawImage(img.title, 260, 80, 216, 40, 20, shiftY+7, 108, 20);
			break;
		}

		// Draw title / minimized icon
		if(minimized == 0) {
			if(mousePassTitle >= 0) {
				backContext.drawImage(img.glow, mousePassTitle*80, 0, 80, 86, 745, shiftY-7, 40, 43);
			}
			backContext.drawImage(img.misc, 320, 0, 80, 64, 745, shiftY+3, 40, 32);
		} else {
			if(mousePassMinimized >= 0) {
				backContext.drawImage(img.glow, mousePassMinimized*80, 0, 80, 86, 745, shiftY-7, 40, 43);
			}
			backContext.drawImage(img.misc, 560, 0, 80, 64, 745, shiftY+3, 40, 32);
		}

		// Draw sound on/off icon
		if(mousePassSound >= 0) {
			backContext.drawImage(img.glow, mousePassSound*80, 0, 80, 86, 760, shiftY+30, 40, 43);
		}
		if(soundon == 1) {
			backContext.drawImage(img.misc, 160, 0, 80, 64, 760, shiftY+40, 40, 32);
		} else {
			backContext.drawImage(img.misc, 240, 0, 80, 64, 760, shiftY+40, 40, 32);
		}

		// Draw Counter
		var textW;
		if(ai.getUncoloredCount() > 9) {
			textW = 70;
		} else {
			textW = 36;
		}
		backContext.drawImage(img.hud, 801, 0, 152, 79, env.screenWidth/2-76, counterY, 152, 79);
		ui.drawNumbers(backContext, ai.getUncoloredCount(), env.screenWidth/2-textW/2, counterY+3, 1.0);
	}

	function checkMousePassTitle(x, y, turn) {
		if(x > 745 && x <= 800 && y > shiftY-10 && y <= shiftY+40) {
			mousePassTitle = turn;
		} else {
			mousePassTitle = -1;
		}
		return mousePassTitle;
	}

	function checkMousePassMinimized(x, y, turn) {
		if(x > 745 && x <= 800 && y > shiftY-10 && y <= shiftY+40) {
			mousePassMinimized = turn;
		} else {
			mousePassMinimized = -1;
		}
		return mousePassMinimized;
	}

	function checkMousePassSound(x, y, turn) {
		if(x > 760 && x <= 800 && y > shiftY+40 && y <= shiftY+72) {
			mousePassSound = turn;
		} else {
			mousePassSound = -1;
		}
		return mousePassSound;
	}

///////////////////////////////////////////////////////////////////////////////
//
// Setup public access
//
///////////////////////////////////////////////////////////////////////////////

	function setSoundon(_soundon) { soundon = _soundon; }
	function getSoundon() { return soundon; }

	function setInfo(_playerCount, _level) { 
		playerCount = _playerCount;
		level = _level;
	}

	function setMinimized(_mini) { minimized = _mini; }
	
	return {
		init : init,
		reset : reset,
		resetSliding : resetSliding,
		push : push,
		draw : draw,

		setSoundon : setSoundon,
		getSoundon : getSoundon,

		checkMousePassTitle : checkMousePassTitle,
		checkMousePassSound : checkMousePassSound,
		checkMousePassMinimized : checkMousePassMinimized,
		setInfo : setInfo,
		setMinimized : setMinimized
	};
})();

