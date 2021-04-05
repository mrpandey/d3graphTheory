var panel = (function() {
	// Environmental variables
	var backContext;
	var img;
	var env;

	// Panel variables
	const maxPanelT = 4;
	const panelW = 100, panelH = 90;
	var panelState;
	var panelT;
	var panelX, panelY;
	var panelCanvas, panelContext;
	const bottonW = 80, bottonH = 20;
	var bottonShowed;
	var bottonPress;

///////////////////////////////////////////////////////////////////////////////
//
// Public functions
//
///////////////////////////////////////////////////////////////////////////////

	function init(_env, _img, _backContext) {
		env = _env;
		img = _img;
		backContext = _backContext;

		// Initialize panel variables
		panelState = 0;
		panelT = -1;
		bottonShowed = [0, 1, 2];
	
		// Create off-screen canvas for panel
		panelCanvas = document.createElement("canvas");
		panelCanvas.width = panelW;
		panelCanvas.height = panelH;
		panelContext = panelCanvas.getContext("2d");
	}
	
	function popup(x, y, sel, _bottonShowed) {
		bottonShowed = _bottonShowed.slice(0);

		if(bottonShowed[0] == 0 && ai.isColorOK(sel, 1) == 0) {
			bottonShowed[0] = 3;
		}
		if(bottonShowed[1] == 1 && ai.isColorOK(sel, 2) == 0) {
			bottonShowed[1] = 4;
		}
		if(bottonShowed[2] == 2 && ai.isColorOK(sel, 3) == 0) {
			bottonShowed[2] = 5;
		}
		bottonPress = -1;

		panelX = x;
		panelY = y - panelH;
		panelT = 0;
		panelState = 1;
	}

	function close() {
		panelState = 3;
		panelT = maxPanelT;
	}

	function select(x, y) {
		if(panelState != 2) {
			return -2;
		}

		if(x > panelX && x < panelX+panelW && y > panelY && y <= panelY+32 && bottonShowed[0] != 3) {
			bottonPress = 0;
		} else if(x > panelX && x < panelX+panelW && y > panelY+32 && y <= panelY+58 && bottonShowed[1] != 4) {
			bottonPress = 1;
		} else if(x > panelX && x < panelX+panelW && y > panelY+58 && y < panelY+panelH && bottonShowed[2] != 5) {
			bottonPress = 2;
		} else {
			bottonPress = -1;
		}

		return bottonPress;
	}
	
	function push() {
		if(panelT < 0) {
			return;
		}

		switch(panelState) {
		case 0:
			break;
		case 1:
			panelT++;
			if(panelT == maxPanelT) {
				panelState++;
			}
			break;
		case 2:
			break;
		case 3:
			panelT--;
			if(panelT < 0) {
				panelState = 0;
			}
			break;
		}
	}


	function draw() {
		if(panelState == 0) {
			return;
		}

		var w, h;
		panelContext.drawImage(img.panel, 0, 0);
		if(bottonPress == 0) {
			panelContext.drawImage(img.bottons, bottonW, bottonH * bottonShowed[0], bottonW, bottonH, 10, 10, bottonW, bottonH);
		} else {
			panelContext.drawImage(img.bottons, 0, bottonH * bottonShowed[0], bottonW, bottonH, 10, 10, bottonW, bottonH);
		}
		if(bottonPress == 1) {
			panelContext.drawImage(img.bottons, bottonW, bottonH * bottonShowed[1], bottonW, bottonH, 10, 35, bottonW, bottonH);
		} else {
			panelContext.drawImage(img.bottons, 0, bottonH * bottonShowed[1], bottonW, bottonH, 10, 35, bottonW, bottonH);
		}
		if(bottonPress == 2) {
			panelContext.drawImage(img.bottons, bottonW, bottonH * bottonShowed[2], bottonW, bottonH, 10, 60, bottonW, bottonH);
		} else {
			panelContext.drawImage(img.bottons, 0, bottonH * bottonShowed[2], bottonW, bottonH, 10, 60, bottonW, bottonH);
		}
		
		if(panelState == 2) {
			backContext.drawImage(panelCanvas, panelX, panelY);
		} else if(panelState == 1 || panelState == 3) {
			w = (panelW - 20) / maxPanelT * panelT;
			h = (panelH - 20) / maxPanelT * panelT;
		
			backContext.drawImage(panelCanvas, 0, panelH-10, 10+w, 10, panelX, panelY+panelH-10, 10+w, 10);
			backContext.drawImage(panelCanvas, panelW-10, panelH-10, 10, 10, panelX+10+w, panelY+panelH-10, 10, 10);
			backContext.drawImage(panelCanvas, 0, 0, 10+w, 10+h, panelX, panelY+panelH-20-h, 10+w, 10+h);
			backContext.drawImage(panelCanvas, panelW-10, 0, 10, 10+h, panelX+10+w, panelY+panelH-20-h, 10, 10+h);
		}
	}

///////////////////////////////////////////////////////////////////////////////
//
// Setup public access
//
///////////////////////////////////////////////////////////////////////////////

	function setBottonPress(_bottonPress) { bottonPress = _bottonPress; }

	return {
		init : init,
		popup : popup,
		close : close,
		push : push,
		draw : draw,

		select : select,
		setBottonPress : setBottonPress
	};
})();

