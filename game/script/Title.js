var title = (function() {
	// Environmental variables
	var backContext;
	var img;
	var env;
	var mouseX, mouseY;

	// Title states
	const titleStates = {
		unknown		: -1,
		animating	: 0,
		selecting	: 1,
		modeSelect	: 2,
		quit		: 3,
		leaving		: 4
	};
	var state;
	var nextTitleState;

	// Return variables
	var playerCount;
	var startLevel;

	// Selecting state variables
	var selected;

///////////////////////////////////////////////////////////////////////////////
//
// Public functions
//
///////////////////////////////////////////////////////////////////////////////

	function init(_env, _img, _backContext) {
		env = _env;
		img = _img;
		backContext = _backContext;
		mouseX = env.screenWidth/2;
		mouseY = env.screenHeight/2;
	}

	function reset() {
		var tmpBoard = [
			-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
			  -1, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, -1, -1,
			-1, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, -1,
			  -1, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, -1, -1,
			-1, -1, -1, 67, 67, 67, 62, 62, 62, 62, 62, 62, 68, 68, -1, -1, -1, -1,
			  -1, -1, -1, -1, -1, -1, 63, 63, 63, 63, 63, -1, -1, 69, -1, -1, -1, -1,
			-1, -1, -1, -1, -1, 64, 63, 63, 63, 63, 63, 63, 65, 69, 70, 70, -1, -1,
			  -1, -1, -1, -1, 64, 64, 63, 63, 63, 63, 63, 65, 65, -1, 70, -1, -1, -1,
			-1, -1, -1, -1, -1, 64, 66, 66, 66, 66, 66, 66, 65, 71, -1, 70, -1, -1,
			  -1, -1, -1, -1, -1, 66, 66, 66, 66, 66, 66, 66, -1, 71, 71, 72, -1, -1,
			-1, -1, -1, -1, -1, -1, 66, 66, 66, 66, 66, 66, -1, -1, -1, 72, -1, -1,
			  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
		];
		ai.presetBoard(12, tmpBoard, 1, 1);
		ai.setColor(1, 0);
		ai.setColor(3, 2);
		ai.setColor(4, 1);
		ai.setColor(7, 3);
		ui.setOverlap(0, "title");
		ui.setOverlap(2, "p1Game");
		ui.setOverlap(5, "p2Game");
		ui.resetSlideIn(2, 0, 1, 0);

		state = titleStates.animating;
		nextTitleState = titleStates.selecting;
		playerCount = 0;
		startLevel = 0;
	}

	function push() {
		ui.push();
		if(ui.isIdle() == 1 && state == titleStates.animating) {
			changeState(nextTitleState);
		}

		if(state == titleStates.leaving) {
			return [env.mainStates.game, playerCount, startLevel];
		} else {
			return [env.mainStates.unknown, playerCount, startLevel];
		}
	}

	function draw() {
		ui.draw();
	}

///////////////////////////////////////////////////////////////////////////////
//
// Private functions
//
///////////////////////////////////////////////////////////////////////////////

	function changeState(next) {
		state = next;
		switch(state) {
		case titleStates.quit:
			ui.resetSlideOut(2, 0, 1, 0);
			state = titleStates.animating;
			nextTitleState = titleStates.leaving;
			break;

		case titleStates.leaving:
			ui.clearOverlap();
			break;	
		}
	}

///////////////////////////////////////////////////////////////////////////////
//
// Event functions
//
///////////////////////////////////////////////////////////////////////////////

	function eventMouseMove(x, y) {
		mouseX = x;
		mouseY = y;

		switch(state) {
		case titleStates.selecting:
			arm1.setTarget(x, y);
			hud.checkMousePassSound(x, y, 0);
			selected = ui.selection(x, y);
			ui.setSelect(selected, 0);
			break;

		case titleStates.modeSelect:
			panel.select(x, y);
			break;
		}
	}
	
	function eventMouseClick(e) {
		var res;

		switch(state) {
		case titleStates.selecting:
			if(hud.checkMousePassSound(mouseX, mouseY, 0) >= 0) {
				hud.setSoundon((hud.getSoundon()+1)%2);
			}
			if(selected == 2) {
				panel.popup(mouseX, mouseY, selected, [7, 8, 9]);
				state = titleStates.modeSelect;
			} else if(selected == 5) {
				panel.popup(mouseX, mouseY, selected, [0, 1, 6]);
				state = titleStates.modeSelect;
			} else if(selected >= 0) {
				panel.popup(mouseX, mouseY, selected, [0, 1, 2]);
				state = titleStates.modeSelect;
			}
			break;

		case titleStates.modeSelect:
			res = panel.select(mouseX, mouseY);
			if(res == -1) {
				panel.close();
				state = titleStates.selecting;
				selected = ui.selection(mouseX, mouseY);
				ui.setSelect(selected, 0);
			} else if(res >= 0) {
				panel.close();
				if(selected == 2) {
					ui.resetPaint(selected, 3, 0);
					playerCount = 1;
					if(res == 0) {
						startLevel = 1;
					} else if(res == 1) {
						startLevel = 5;
					} else {
						startLevel = 9;
					}
					nextTitleState = titleStates.quit;
				} else if(selected == 5) {
					ui.resetPaint(selected, 3, 0);
					playerCount = 2;
					startLevel = 1;
					nextTitleState = titleStates.quit;
				} else {
					ui.resetPaint(selected, res+1, 0);
					nextTitleState = titleStates.selecting;
				}
				selected = -1;
				ui.setSelect(-1, 0);
				state = titleStates.animating;
			}
			break;
		}
	}

///////////////////////////////////////////////////////////////////////////////
//
// Setup public access
//
///////////////////////////////////////////////////////////////////////////////

	return {
		init : init,
		reset : reset,
		push : push,
		draw : draw,
		eventMouseMove : eventMouseMove,
		eventMouseClick : eventMouseClick
	};
})();

