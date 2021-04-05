var gameLogic = (function() {
	// Environmental variables
	var backContext;
	var img;
	var env;
	var mouseX, mouseY;

	// Game states
	const gameStates = {
		unknown		: -1,
		reset		: 0,
		level		: 1,
		animating	: 2,
		selecting	: 3,
		colorSelect	: 4,
		aiSelect	: 5,
		switching	: 6,
		resulting	: 7,
		viewing		: 8,
		quit		: 9,
		leaving		: 10
	};
	var state;
	var nextGameState;

	// Game variables
	var playerCount;
	var currentPlayer;
	var level;
	var warp;

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
		warp = 0;
	}

	function reset(_playerCount, _startLevel) {
		playerCount = _playerCount;
		level = _startLevel;
		
		var groupCnt, px, py, aiAbility;
		if(playerCount == 1) {
			if(level < 11) {
				groupCnt = level + 4;
			} else if(level < 23) {
				groupCnt = level + 3;
			} else {
				groupCnt = 25;
			}

			if(level < 16) {
				px = 6 - Math.floor((level-1)/3);
			} else {
				px = 1;
			}

			if(level < 17) {
				py = 3 - Math.floor((level-1)/8);
			} else {
				py = 1;
			}

			if(level < 13) {
				aiAbility = -20 + (level-1)*10;
			} else {
				aiAbility = 100;
			}
		} else {
			groupCnt = 20;
			px = 1; py = 1;
			aiAbility = 100;
		}
		ai.setupBoard(groupCnt, px, py);
		ai.setAIability(aiAbility);

		hud.setInfo(playerCount, level);
		if(level%2 == 1) {
			ui.resetSlideIn(2, 1, 2, warp);
			currentPlayer = 0;
		} else {
			ui.resetSlideIn(1, 2, 2, warp);
			currentPlayer = 1;
		}
		warp = 0;

		state = gameStates.animating;
		if(playerCount == 1) {
			nextGameState = gameStates.level;
		} else {
			nextGameState = gameStates.selecting;
		}
		selected = -1;
	}

	function push() {
		ui.push();
		if(ui.isIdle() == 1 && state == gameStates.animating) {
			changeState(nextGameState);
		}

		if(state == gameStates.leaving) {
			return env.mainStates.resetTitle;
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
		case gameStates.reset:
			reset(playerCount, level+1);
			break;

		case gameStates.level:
			dialog.popup("level", level);
			break;

		case gameStates.selecting:
			eventMouseMove(mouseX, mouseY);
			break;

		case gameStates.aiSelect:
			var tmp;
			tmp = ai.aiPick();
			ui.resetPaint(Math.floor(tmp/10), tmp%10, currentPlayer);
			selected = -1;
			ui.setSelect(-1, 0);
			state = gameStates.animating;
			nextGameState = gameStates.switching;
			break;

		case gameStates.switching:
			currentPlayer = (currentPlayer+1)%2;
			ui.resetSwitching(currentPlayer);
			state = gameStates.animating;
			if(ai.getUncoloredCount() == 0) {
				nextGameState = gameStates.resulting;
			} else {
				if(playerCount == 1 && currentPlayer == 1) {
					nextGameState = gameStates.aiSelect;
				} else {
					nextGameState = gameStates.selecting;
				}
			}
			break;

		case gameStates.resulting:
			if(playerCount == 2) {
				if(currentPlayer == 1) {
					dialog.popup("p1Wins");
				} else {
					dialog.popup("p2Wins");
				}
			} else {
				if(currentPlayer == 1) {
					dialog.popup("playerWins");
				} else {
					dialog.popup("aiWins");
				}
			}
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
		case gameStates.level:
			dialog.checkPassSlot2(x, y, 0);
			break;

		case gameStates.selecting:
			hud.checkMousePassSound(x, y, currentPlayer);
			hud.checkMousePassTitle(x, y, currentPlayer);

			if(currentPlayer == 0) {
				arm1.setTarget(x, y);
			} else {
				arm2.setTarget(x, y);
			}
			
			selected = ui.selection(x, y);
			ui.setSelect(selected, currentPlayer);
			break;

		case gameStates.colorSelect:
			panel.select(x, y);
			break;

		case gameStates.resulting:
			dialog.checkPassSlot1(x, y, (currentPlayer+1)%2);
			dialog.checkPassSlot2(x, y, (currentPlayer+1)%2);
			dialog.checkPassSlot3(x, y, (currentPlayer+1)%2);
			break;

		case gameStates.viewing:
			hud.checkMousePassSound(x, y, (currentPlayer+1)%2);
			hud.checkMousePassMinimized(x, y, (currentPlayer+1)%2);
			break;

		case gameStates.quit:
			dialog.checkPassSlot1(x, y, currentPlayer);
			dialog.checkPassSlot2(x, y, currentPlayer);
			dialog.checkPassSlot3(x, y, currentPlayer);
			break;
		}
	}
	
	function eventMouseClick(e) {
		var res;

		switch(state) {
		case gameStates.level:
			if(dialog.checkPassSlot2(mouseX, mouseY, 0) >= 0) {
				dialog.close();
				state = gameStates.animating;
				if(level%2 == 1) {  
					nextGameState = gameStates.selecting;
				} else {
					nextGameState = gameStates.aiSelect;
				}
			}
			break;

		case gameStates.selecting:
			if(hud.checkMousePassSound(mouseX, mouseY, currentPlayer) >= 0) {
				hud.setSoundon((hud.getSoundon()+1)%2);
			}
			if(hud.checkMousePassTitle(mouseX, mouseY, currentPlayer) >= 0) {
				dialog.popup("quit");
				state = gameStates.quit;
				nextGameState = gameStates.selecting;
			}
			if(selected >= 0) {
				panel.popup(mouseX, mouseY, selected, [0, 1, 2]);
				state = gameStates.colorSelect;
			}
			break;

		case gameStates.colorSelect:
			res = panel.select(mouseX, mouseY);
			if(res == -1) {
				panel.close();
				state = gameStates.selecting;
				selected = ui.selection(mouseX, mouseY);
				ui.setSelect(selected, currentPlayer);
			} else if(res >= 0) {
				panel.close();
				ui.resetPaint(selected, res+1, currentPlayer);
				selected = -1;
				ui.setSelect(-1, 0);
				state = gameStates.animating;
				nextGameState = gameStates.switching;
			}
			break;

		case gameStates.resulting:
			if(dialog.checkPassSlot1(mouseX, mouseY, currentPlayer) >= 0) {
				dialog.close();
				ui.resetSlideOut(2, 0, 1, 0);
				state = gameStates.animating;
				nextGameState = gameStates.leaving;
			} else if(dialog.checkPassSlot2(mouseX, mouseY, currentPlayer) >= 0) {
				dialog.checkPassSlot2(0, 0, 0);
				dialog.minimize();
				hud.setMinimized(1);
				state = gameStates.viewing;
				nextGameState = gameStates.viewing;
			} else if(dialog.checkPassSlot3(mouseX, mouseY, currentPlayer) >= 0) {
				dialog.close();
				var nextLevel, replay;
				if(playerCount == 1 && currentPlayer == 0) {
					nextLevel = level;
					level--;
					replay = 1;
				} else {
					nextLevel = level+1;
					replay = 0;
				}
				if(nextLevel%3 == 1 && replay == 0) {
					warp = 1;
					ui.resetSlideOut(0, 0, 0, 1);
				} else {
					warp = 0;
					if(nextLevel%2 == 1) {
						ui.resetSlideOut(2, 1, 2, 0);
					} else {
						ui.resetSlideOut(1, 2, 2, 0);
					}
				}
				state = gameStates.animating;
				nextGameState = gameStates.reset;
			}
			break;

		case gameStates.viewing:
			if(hud.checkMousePassSound(mouseX, mouseY, (currentPlayer+1)%2) >= 0) {
				hud.setSoundon((hud.getSoundon()+1)%2);
			}
			if(hud.checkMousePassMinimized(mouseX, mouseY, (currentPlayer+1)%2) >= 0) {
				dialog.restore();
				hud.setMinimized(0);
				hud.checkMousePassMinimized(0, 0, 0);
				state = gameStates.resulting;
			}
			break;

		case gameStates.quit:
			if(dialog.checkPassSlot1(mouseX, mouseY, currentPlayer) >= 0) {
				dialog.close();
				ui.resetSlideOut(2, 0, 1, 0);
				hud.checkMousePassSound(mouseX, mouseY, currentPlayer);
				hud.checkMousePassTitle(mouseX, mouseY, currentPlayer);
				state = gameStates.animating;
				nextGameState = gameStates.leaving;
			} else if(dialog.checkPassSlot2(mouseX, mouseY, currentPlayer) >= 0) {
				dialog.close();
				hud.checkMousePassSound(0, 0, 0);
				hud.checkMousePassTitle(0, 0, 0);
				level--;
				warp = 0;
				if((level+1)%2 == 1) {
					ui.resetSlideOut(2, 1, 2, 0);
				} else {
					ui.resetSlideOut(1, 2, 2, 0);
				}
				state = gameStates.animating;
				nextGameState = gameStates.reset;
			} else if(dialog.checkPassSlot3(mouseX, mouseY, currentPlayer) >= 0) {
				dialog.close();
				state = nextGameState;
			}
			break;
		}
	}

//////////////////////////////////////////////////////////////////////////////
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

