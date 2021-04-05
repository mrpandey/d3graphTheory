var tutorial = (function() {
	// Environmental variables
	var backContext;
	var img;
	var env;
	var mouseX, mouseY;

	// tutorial states
	const tutorialStates = {
		unknown		: -1,
		animating	: 0,
		dialog1		: 1,
		dialog2		: 2,
		dialog3		: 3,
		switchToAI	: 4,
		aiPaint		: 5,
		switchBack	: 6,
		dialog4		: 7,
		selectColor : 8,
		switchToAI2 : 9,
		dialog5		: 10,
		dialog6		: 11,
		leaving		: 12
	};
	var state;
	var nextTutorialState;

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
			  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
			-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
			  -1, -1, -1, -1, -1, -1, 61, 61, 62, 62, 62, -1, -1, -1, -1, -1, -1, -1,
			-1, -1, -1, -1, -1, -1, 61, 61, 62, 62, 62, 62, -1, -1, -1, -1, -1, -1,
			  -1, -1, -1, -1, -1, -1, 61, 61, 63, 63, 63, -1, -1, -1, -1, -1, -1, -1,
			-1, -1, -1, -1, -1, 65, 64, 64, 64, 63, 63, -1, -1, -1, -1, -1, -1, -1,
		 	  -1, -1, -1, -1, -1, 65, 64, 64, 63, 63, 63, -1, -1, -1, -1, -1, -1, -1,
			-1, -1, -1, -1, -1, -1, 66, 66, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
			  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
			-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
			  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
		];
		ai.presetBoard(6, tmpBoard, 5, 3);
		ai.setColor(4, 2);
		ai.setColor(5, 3);
		hud.setInfo(0, 1);

		state = tutorialStates.animating;
		nextTutorialState = tutorialStates.dialog1;
	}

	function push() {
		ui.push();
		if(ui.isIdle() == 1 && state == tutorialStates.animating) {
			changeState(nextTutorialState);
		}

		if(state == tutorialStates.leaving) {
			return env.mainStates.game;
		} else {
			return env.mainStates.unknown;
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
		case tutorialStates.dialog1:
			dialog.popup("tutorial1");
			break;

		case tutorialStates.dialog2:
			dialog.popup("tutorial2", 0);
			ui.setFocusTargets([3]);
			break;

		case tutorialStates.dialog3:
			dialog.transform("tutorial3", 0);
			ui.setFocusTargets([4, 5, 3]);
			break;

		case tutorialStates.switchToAI:
			ui.resetSwitching(1);
			state = tutorialStates.animating;
			nextTutorialState = tutorialStates.aiPaint;
			break;

		case tutorialStates.aiPaint:
			ui.resetPaint(1, 3, 1);
			state = tutorialStates.animating;
			nextTutorialState = tutorialStates.switchBack;
			break;

		case tutorialStates.switchBack:
			ui.resetSwitching(0);
			state = tutorialStates.animating;
			nextTutorialState = tutorialStates.dialog4;
			break;

		case tutorialStates.dialog4:
			dialog.popup("tutorial4");
			ui.setFocusTargets([0]);
			break;

		case tutorialStates.selectColor:
			ui.setFocusTargets([1, 3, 0]);
			break;

		case tutorialStates.switchToAI2:
			ui.resetSwitching(1);
			state = tutorialStates.animating;
			nextTutorialState = tutorialStates.dialog5;
			break;

		case tutorialStates.dialog5:
			dialog.popup("tutorial5");
			ui.setFocusTargets([2]);
			ui.setSelect(2, 0);
			break;

		case tutorialStates.dialog6:
			dialog.transform("tutorial6");
			ui.setFocusTargets([]);
			break;

		case tutorialStates.leaving:
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
		case tutorialStates.dialog1:
			dialog.checkPassSlot1(x, y, 0);
			dialog.checkPassSlot3(x, y, 0);
			break;

		case tutorialStates.dialog2:
			arm1.setTarget(x, y);
			selected = ui.selection(x, y);
			if(selected == 3) {
				ui.setSelect(selected, 0);
			} else {
				ui.setSelect(-1, 0);
				selected = -1;
			}
			break;

		case tutorialStates.dialog3:
			panel.select(x, y);
			break;

		case tutorialStates.dialog4:
			arm1.setTarget(x, y);
			selected = ui.selection(x, y);
			if(selected == 0) {
				ui.setSelect(selected, 0);
			} else {
				ui.setSelect(-1, 0);
				selected = -1;
			}
			break;

		case tutorialStates.selectColor:
			panel.select(x, y);			
			break;

		case tutorialStates.dialog5:
			dialog.checkPassSlot2(x, y, 0);
			break;

		case tutorialStates.dialog6:
			dialog.checkPassSlot1(x, y, 0);
			dialog.checkPassSlot3(x, y, 0);
			break;
		}
	}

	function eventMouseClick(e) {
		switch(state) {
		case tutorialStates.dialog1:
			if(dialog.checkPassSlot1(mouseX, mouseY, 0) >= 0) {
				dialog.close();
				state = tutorialStates.animating;
				nextTutorialState = tutorialStates.leaving;
			}
			if(dialog.checkPassSlot3(mouseX, mouseY, 0) >= 0) {
				dialog.close();
				ui.resetSlideIn(2, 1, 2, 0);
				state = tutorialStates.animating;
				nextTutorialState = tutorialStates.dialog2;
			}
			break;

		case tutorialStates.dialog2:
			if(selected == 3) {
				panel.popup(mouseX, mouseY, selected, [0, 1, 2]);
				state = tutorialStates.animating;
				nextTutorialState = tutorialStates.dialog3;
			}
			break;

		case tutorialStates.dialog3:
			res = panel.select(mouseX, mouseY);
			if(res == -1) {
				panel.close();
				state = tutorialStates.animating;
				nextTutorialState = tutorialStates.dialog2;
			} else if(res >= 0) {
				panel.close();
				dialog.close();
				ui.resetPaint(selected, res+1, 0);
				selected = -1;
				ui.setSelect(-1, 0);
				state = tutorialStates.animating;
				nextTutorialState = tutorialStates.switchToAI;
			}
			break;

		case tutorialStates.dialog4:
			if(selected == 0) {
				panel.popup(mouseX, mouseY, selected, [0, 1, 2]);
				state = tutorialStates.animating;
				nextTutorialState = tutorialStates.selectColor;
			}
			break;

		case tutorialStates.selectColor:
			res = panel.select(mouseX, mouseY);
			if(res == -1) {
				panel.close();
				ui.setFocusTargets([0]);
				state = tutorialStates.dialog4;
				eventMouseMove(mouseX, mouseY);
			} else if(res >= 0) {
				panel.close();
				dialog.close();
				ui.resetPaint(selected, res+1, 0);
				selected = -1;
				ui.setSelect(-1, 0);
				state = tutorialStates.animating;
				nextTutorialState = tutorialStates.switchToAI2;
			}
			break;

		case tutorialStates.dialog5:
			if(dialog.checkPassSlot2(mouseX, mouseY, 0) >= 0) {
				ui.setSelect(-1, 0);
				state = tutorialStates.animating;
				nextTutorialState = tutorialStates.dialog6;
			}
			break;

		case tutorialStates.dialog6:
			if(dialog.checkPassSlot1(mouseX, mouseY, 0) >= 0) {
				dialog.close();
				ui.resetSlideOut(2, 1, 1, 0);
				reset();
				state = tutorialStates.animating;
				nextTutorialState = tutorialStates.dialog1;
			}
			if(dialog.checkPassSlot3(mouseX, mouseY, 0) >= 0) {
				dialog.close();
				ui.resetSlideOut(2, 1, 1, 0);
				state = tutorialStates.animating;
				nextTutorialState = tutorialStates.leaving;
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

