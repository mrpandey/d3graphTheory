var dialog = (function() {
	// Environmental variables
	var backContext;
	var img;
	var sound;
	var env;

	// Dialog variables
	const panelW = 100, panelH = 90;
	var dialogT, maxDialogT;
	var dialogCanvas, dialogContext;
	var dialogState;
	var x, y, w, h, a;
	var dx, dy, dw, dh, da;

	// Dialog dimension parameters
	const dialogTypes = {
		unknown 	: -1,
		p1Wins		: 1,
		p2Wins		: 2,
		aiWins		: 3,
		playerWins	: 4,
		quit		: 5,
		level		: 6,
		tutorial1	: 7,
		tutorial2	: 8,
		tutorial3	: 9,
		tutorial4	: 10,
		tutorial5	: 11,
		tutorial6	: 12,
	};
	const params = [
		[dialogTypes.unknown,	"unknown",		400, 240, 20, 20],
		[dialogTypes.p1Wins,	"p1Wins",		400, 240, 450, 200],
		[dialogTypes.p2Wins,	"p2Wins",		400, 240, 450, 200],
		[dialogTypes.aiWins,	"aiWins",		400, 240, 450, 200],
		[dialogTypes.playerWins,"playerWins",	400, 240, 450, 200],

		[dialogTypes.quit,		"quit",			400, 240, 340, 165],
		[dialogTypes.level,		"level",		400, 240, 370, 180],

		[dialogTypes.tutorial1,	"tutorial1",	400, 240, 370, 180],
		[dialogTypes.tutorial2,	"tutorial2",	600, 320, 300, 60],
		[dialogTypes.tutorial3,	"tutorial3",	540, 400, 300, 130],
		[dialogTypes.tutorial4,	"tutorial4",	540, 300, 220, 80],
		[dialogTypes.tutorial5,	"tutorial5",	400, 400, 560, 140],
		[dialogTypes.tutorial6,	"tutorial6",	400, 240, 360, 200]
	];
	var param;

	// Icon dimension parameters
	const icon = {
		none	: -1,
		next	: 0,
		skip	: 80,
		soundon	: 160,
		soundoff: 240,
		title	: 320,
		cancel	: 400,
		replay	: 480,
		view	: 560
	};
	const iconW = 80, iconH = 64;
	var iconSlot1, iconSlot2, iconSlot3;
	var iconPass1, iconPass2, iconPass3;

///////////////////////////////////////////////////////////////////////////////
//
// Public functions
//
///////////////////////////////////////////////////////////////////////////////

	function init(_env, _img, _sound, _backContext) {
		env = _env;
		img = _img;
		sound = _sound;
		backContext = _backContext;

		// Initialize dialog variables
		dialogState = 0;
		dialogT = -1;
	
		// Create off-screen canvas for dialog
		dialogCanvas = document.createElement("canvas");
		dialogCanvas.width = env.screenWidth;
		dialogCanvas.height = env.screenHeight;
		dialogContext = dialogCanvas.getContext("2d");
	}

	function popup(type, options) {
		x = 0; y = 0; w = 20; h = 20; a = 0;
		maxDialogT = 10;
		prepareDialog(type, options);
		x = param[2]; y = param[3]; dx = 0; dy = 0;
		da = 0.5/maxDialogT;
		dialogState = 1;
		dialogT = 0;

		if(param[0] >= dialogTypes.p1Wins && param[0] <= dialogTypes.playerWins) {
			playSound();
		}
	}

	function close() {
		maxDialogT = 10;
		dx = 0; dy = 0;
		dw = param[4]/maxDialogT;
		dh = param[5]/maxDialogT;
		da = 0.5/maxDialogT;
		dialogState = 3;
		dialogT = 0;
	}

	function transform(type, options) {
		if(dialogState != 2) {
			return;
		}

		maxDialogT = 15;
		prepareDialog(type, options);
		da = 0;
		dialogState = 1;
		dialogT = 0;

		if(param[0] == dialogTypes.tutorial6) {
			playSound();
		}
	}

	function minimize() {
		if(dialogState != 2) {
			return;
		}

		maxDialogT = 15;
		dx = (765-param[2])/maxDialogT;
		dy = (17-param[3])/maxDialogT;
		dw = (param[4]-20)/maxDialogT;
		dh = (param[5]-20)/maxDialogT;
		da = 0.5/maxDialogT;
		dialogState = 4;
		dialogT = 0;
	}

	function restore() {
		if(dialogState != 5) {
			return;
		}

		maxDialogT = 15;
		dx = (param[2]-765)/maxDialogT;
		dy = (param[3]-17)/maxDialogT;
		dw = (param[4]-20)/maxDialogT;
		dh = (param[5]-20)/maxDialogT;
		da = 0.5/maxDialogT;
		dialogState = 6;
		dialogT = 0;
	}

	function push() {
		if(dialogT < 0) {
			return;
		}

		var focusPos;
		if(param[0] > dialogTypes.tutorial1 && param[0] < dialogTypes.tutorial6) {
			focusPos = 1;
		} else {
			focusPos = 2;
		}

		switch(dialogState) {
		case 0:
			break;
		case 1:
			x += dx; y += dy; w += dw; h += dh; a += da;
			dialogT++;
			if(dialogT == maxDialogT) {
				a = 0.5;
				dialogState++;
			}
			ui.setFocus(focusPos, a);
			break;
		case 2:
			break;
		case 3:
			x -= dx; y -= dy; w -= dw; h -= dh; a -= da;
			dialogT++;
			if(dialogT == maxDialogT) {
				a = 0;
				dialogState = 0;
				dialogT = -1;
			}
			ui.setFocus(focusPos, a);
			break;
		case 4:
			x += dx; y += dy; w -= dw; h -= dh; a -= da;
			dialogT++;
			if(dialogT == maxDialogT) {
				a = 0;
				dialogState++;
				dialogT = -1;
			}
			ui.setFocus(focusPos, a);
			break;
		case 5:
			break;
		case 6:
			x += dx; y += dy; w += dw; h += dh; a += da;
			dialogT++;
			if(dialogT == maxDialogT) {
				a = 0.5;
				dialogState = 2;
			}
			ui.setFocus(focusPos, a);
			break;
		}
	}

	function draw() {
		if(dialogState == 0 || dialogState == 5) {
			return;
		}

		// Draw dialog
		if(dialogState == 1 || dialogState == 3 || dialogState == 4 || dialogState == 6) {
			// Draw conners
			backContext.drawImage(dialogCanvas, 0, 0, 10, 10, x-w/2, y-h/2, 10, 10);
			backContext.drawImage(dialogCanvas, param[4]-10, 0, 10, 10, x+w/2-10, y-h/2, 10, 10);
			backContext.drawImage(dialogCanvas, param[4]-10, param[5]-10, 10, 10, x+w/2-10, y+h/2-10, 10, 10);
			backContext.drawImage(dialogCanvas, 0, param[5]-10, 10, 10, x-w/2, y+h/2-10, 10, 10);

			// Draw sides
			if(h-20 > 0) {
				backContext.drawImage(dialogCanvas, 0, 10, 10, param[5]-20, x-w/2, y-h/2+10, 10, h-20);
				backContext.drawImage(dialogCanvas, param[4]-10, 10, 10, param[5]-20, x+w/2-10, y-h/2+10, 10, h-20);
			}
			if(w-20 > 0) {
				backContext.drawImage(dialogCanvas, 10, 0, param[4]-20, 10, x-w/2+10, y-h/2, w-20, 10);
				backContext.drawImage(dialogCanvas, 10, param[5]-10, param[4]-20, 10, x-w/2+10, y+h/2-10, w-20, 10);
			}

			// Fill center
			if(h-20 > 0 && w-20 > 0) {
				backContext.drawImage(img.panel, 10, 10, 10, 10,  x-w/2+10, y-h/2+10, w-20, h-20);
			}
		} else {
			backContext.drawImage(dialogCanvas, x-w/2, y-h/2);
			drawIcons();
		}
	}

	function drawIcons() {
		if(dialogState != 2) {
			return;
		}

		// Draw icon slot#1
		var iconX, iconY;
		if(iconSlot1 != icon.none) {
			iconX = x-w/3-iconW/2;
			iconY = y-h/2+(h-iconH-10);
			if(iconPass1 >= 0) {
				backContext.drawImage(img.glow, iconPass1*80, 0, 80, 86, iconX, iconY-20, 80, 86);
			}
			backContext.drawImage(img.misc, iconSlot1, 0, 80, 64, iconX, iconY, 80, 64);
		}

		// Draw icon slot#2
		if(iconSlot2 != icon.none) {
			iconX = x-iconW/2;
			iconY = y-h/2+(h-iconH-10);
			if(iconPass2 >= 0) {
				backContext.drawImage(img.glow, iconPass2*80, 0, 80, 86, iconX, iconY-20, 80, 86);
			}
			backContext.drawImage(img.misc, iconSlot2, 0, 80, 64, iconX, iconY, 80, 64);
		}

		// Draw icon slot#3
		if(iconSlot3 != icon.none) {
			iconX = x+w/3-iconW/2;
			iconY = y-h/2+(h-iconH-10);
			if(iconPass3 >= 0) {
				backContext.drawImage(img.glow, iconPass3*80, 0, 80, 86, iconX, iconY-20, 80, 86);
			}
			backContext.drawImage(img.misc, iconSlot3, 0, 80, 64, iconX, iconY, 80, 64);
		}
	}

	function checkPassSlot1(mouseX, mouseY, turn) {
		if(dialogState != 2) {
			return -1;
		}

		if(mouseX > x-w/2 && mouseX <= x-w/6 && mouseY > y-h/2+(h-iconH-10) && mouseY < y+h/2) {
			iconPass1 = turn;
		} else {
			iconPass1 = -1;
		}

		return iconPass1;
	}

	function checkPassSlot2(mouseX, mouseY, turn) {
		if(dialogState != 2) {
			return -1;
		}

		if(mouseX > x-w/6 && mouseX <= x+w/6 && mouseY > y-h/2+(h-iconH-10) && mouseY < y+h/2) {
			iconPass2 = turn;
		} else {
			iconPass2 = -1;
		}

		return iconPass2;
	}

	function checkPassSlot3(mouseX, mouseY, turn) {
		if(dialogState != 2) {
			return -1;
		}

		if(mouseX > x+w/6 && mouseX <= x+w/2 && mouseY > y-h/2+(h-iconH-10) && mouseY < y+h/2) {
			iconPass3 = turn;
		} else {
			iconPass3 = -1;
		}

		return iconPass3;
	}

///////////////////////////////////////////////////////////////////////////////
//
// Private functions
//
///////////////////////////////////////////////////////////////////////////////

	function prepareDialog(type, options) {
		param = getType(type);
		iconSlot1 = icon.none;
		iconSlot2 = icon.none;
		iconPass1 = -1;
		iconPass2 = -1;
		iconPass3 = -1;

		// Clean up subgraph rectangle
		dialogContext.clearRect(0, 0, dialogCanvas.width, dialogCanvas.height);

		// Draw conners
		dialogContext.drawImage(img.panel, 0, 0, 10, 10, 0, 0, 10, 10);
		dialogContext.drawImage(img.panel, panelW-10, 0, 10, 10, param[4]-10, 0, 10, 10);
		dialogContext.drawImage(img.panel, panelW-10, panelH-10, 10, 10, param[4]-10, param[5]-10, 10, 10);
		dialogContext.drawImage(img.panel, 0, panelH-10, 10, 10, 0, param[5]-10, 10, 10);

		// Draw sides
		dialogContext.drawImage(img.panel, 0, 10, 10, panelH-20, 0, 10, 10, param[5]-20);
		dialogContext.drawImage(img.panel, 10, 0, panelW-20, 10, 10, 0, param[4]-20, 10);
		dialogContext.drawImage(img.panel, panelW-10, 10, 10, panelH-20, param[4]-10, 10, 10, param[5]-20);
		dialogContext.drawImage(img.panel, 10, panelH-10, panelW-20, 10, 10, param[5]-10, param[4]-20, 10);

		// Fill center
		dialogContext.drawImage(img.panel, 10, 10, 10, 10, 10, 10, param[4]-20, param[5]-20);

		// Draw content
		switch(param[0]) {
		case dialogTypes.p1Wins:
			dialogContext.drawImage(img.dialog, 0, 0, 228, 28, param[4]/2-228/2, 20, 228, 28);
			dialogContext.drawImage(img.dialog, 0, 25, 72, 50, param[4]/2-252/2, 50, 72, 50);
			dialogContext.drawImage(img.dialog, 0, 75, 144, 50, param[4]/2-252/2+108, 50, 144, 50);
			iconSlot1 = icon.title;		iconSlot2 = icon.view; 		iconSlot3 = icon.next;
			break;

		case dialogTypes.p2Wins:
			dialogContext.drawImage(img.dialog, 0, 0, 228, 28, param[4]/2-228/2, 20, 228, 28);
			dialogContext.drawImage(img.dialog, 72, 25, 72, 50, param[4]/2-252/2, 50, 72, 50);
			dialogContext.drawImage(img.dialog, 0, 75, 144, 50, param[4]/2-252/2+108, 50, 144, 50);
			iconSlot1 = icon.title;		iconSlot2 = icon.view; 		iconSlot3 = icon.next;
			break;

		case dialogTypes.aiWins:
			dialogContext.drawImage(img.dialog, 0, 0, 228, 28, param[4]/2-228/2, 20, 228, 28);
			dialogContext.drawImage(img.dialog, 360, 25, 72, 50, param[4]/2-252/2, 50, 72, 50);
			dialogContext.drawImage(img.dialog, 0, 75, 144, 50, param[4]/2-252/2+108, 50, 144, 50);
			iconSlot1 = icon.title;		iconSlot2 = icon.view; 		iconSlot3 = icon.replay;
			break;

		case dialogTypes.playerWins:
			dialogContext.drawImage(img.dialog, 0, 0, 228, 28, param[4]/2-228/2, 20, 228, 28);
			dialogContext.drawImage(img.dialog, 144, 25, 216, 50, param[4]/2-396/2, 50, 216, 50);
			dialogContext.drawImage(img.dialog, 0, 75, 144, 50, param[4]/2-396/2+252, 50, 144, 50);
			iconSlot1 = icon.title;		iconSlot2 = icon.view; 		iconSlot3 = icon.next;
			break;

		case dialogTypes.quit:
			dialogContext.drawImage(img.dialog, 0, 130, 300, 60, param[4]/2-150, 15, 300, 60);
			iconSlot1 = icon.title;		iconSlot2 = icon.replay; 		iconSlot3 = icon.cancel;
			break;

		case dialogTypes.level:
			var textW;
			if(options >= 100) {
				textW = 35*3;
			} else if(options >= 10) {
				textW = 35*2;
			} else {
				textW = 35;
			}
			dialogContext.drawImage(img.dialog, 144, 75, 180, 50, param[4]/2-(215+textW)/2, 30, 180, 50);
			ui.drawNumbers(dialogContext, options, param[4]/2-(215+textW)/2+215, 28, 1.0);
			iconSlot1 = icon.none;		iconSlot2 = icon.next; 		iconSlot3 = icon.none;
			break;

		case dialogTypes.tutorial1:
			dialogContext.drawImage(img.dialog, 0, 190, 286, 50, param[4]/2-286/2, 30, 286, 50);
			iconSlot1 = icon.skip;		iconSlot2 = icon.none;		iconSlot3 = icon.next;
			break;

		case dialogTypes.tutorial2:
			dialogContext.drawImage(img.dialog, 286, 214, 264, 26, param[4]/2-264/2, 17, 264, 26);
			iconSlot1 = icon.none;		iconSlot2 = icon.none;		iconSlot3 = icon.none;
			break;

		case dialogTypes.tutorial3:
			dialogContext.drawImage(img.dialog, 0, 240, 264, 94, param[4]/2-264/2, 15, 264, 94);
			iconSlot1 = icon.none;		iconSlot2 = icon.none;		iconSlot3 = icon.none;
			break;

		case dialogTypes.tutorial4:
			dialogContext.drawImage(img.dialog, 380, 240, 170, 54, param[4]/2-170/2, 13, 170, 54);
			iconSlot1 = icon.none;		iconSlot2 = icon.none;		iconSlot3 = icon.none;
			break;

		case dialogTypes.tutorial5:
			dialogContext.drawImage(img.dialog, 0, 334, 530, 56, param[4]/2-530/2, 15, 530, 56);
			iconSlot1 = icon.none;		iconSlot2 = icon.next;		iconSlot3 = icon.none;
			break;

		case dialogTypes.tutorial6:
			dialogContext.drawImage(img.dialog, 270, 294, 280, 40, param[4]/2-280/2, 15, 280, 40);
			dialogContext.drawImage(img.dialog, 442, 25, 108, 50, param[4]/2-252/2, 65, 108, 50);
			dialogContext.drawImage(img.dialog, 0, 75, 108, 50, param[4]/2-252/2+144, 65, 108, 50);
			iconSlot1 = icon.replay;	iconSlot2 = icon.none;		iconSlot3 = icon.next;
			break;
		}

		dx = (param[2]-x)/maxDialogT;
		dy = (param[3]-y)/maxDialogT;
		dw = (param[4]-w)/maxDialogT;
		dh = (param[5]-h)/maxDialogT;
	}

	function getType(input) {
		var i, output = params[0];

		for(i = 0; i < params.length; i++) {
			if(params[i][1] == input) {
				output = params[i];
				break;
			}
		}

		return output;
	}

///////////////////////////////////////////////////////////////////////////////
//
// Audio functions
//
///////////////////////////////////////////////////////////////////////////////

	// Audio variables
	var currentSound = 2;

	function playSound() {
		if(hud.getSoundon() == 0) {
			return;
		}
		
		switch(currentSound) {
		case 0:
			sound.result0.currentTime = 0;
			sound.result0.play();
			break;
		case 1:
			sound.result1.currentTime = 0;
			sound.result1.play();
			break;
		case 2:
			sound.result2.currentTime = 0;
			sound.result2.play();
			break;
		}

		currentSound = (currentSound+1)%3;
	}

///////////////////////////////////////////////////////////////////////////////
//
// Setup public access
//
///////////////////////////////////////////////////////////////////////////////

	return {
		init : init,
		popup : popup,
		close : close,
		transform : transform,
		minimize : minimize,
		restore : restore,
		push : push,
		draw : draw,
		checkPassSlot1 : checkPassSlot1,
		checkPassSlot2 : checkPassSlot2,
		checkPassSlot3 : checkPassSlot3
	};
})();

