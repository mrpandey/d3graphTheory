var ui = (function() {
	// Environmental variables
	var backContext;
	var img;
	var env;

	// Animation states
	const animationStates = {
		idle		: 0,
		slideIn		: 1,
		slideOut	: 2,
		paint		: 3,
		switching	: 4,
		warp		: 5
	}
	var state = animationStates.idle;
	var nextState = animationStates.idle;

///////////////////////////////////////////////////////////////////////////////
//
// Public functions
//
///////////////////////////////////////////////////////////////////////////////

	function init(_env, _img, _backContext) {
		env = _env;
		img = _img;
		backContext = _backContext;

		// Create off-screen canvas for subgraphs
		for(var i = 0; i < maxCanvas; i++) {
			graphCanvas[i] = document.createElement("canvas");
		}

		// Turn on shadow at default
		shadow = 0;

		// Initialize paint animation variables
		paintState = -1;

		// Initialize overlap variables
		initOverlap();
		redrawReset();
	}

	function push() {
		warp.pushFade();
		if(warp.isWarping() == 1) {
			warp.pushWarp();
			if(warp.isWarping() == 0) {
				state = animationStates.idle;
			}
		} else {
			pushSlide();
		}

		panel.push();
		hud.push();
		dialog.push();

		var i, res = 1;
		if(state == animationStates.paint) {
			pushPaint();
			pushBeam();
			for(i = 0; i < graphRedraw.length; i++) {
				if(graphRedraw[i] != -1) {
					res = 0;
					break;
				}
			}
			if(res == 1) {
				state = animationStates.idle;
				paintState = -1;
			}
		} else {
			arm1.push();
			arm2.push();
		}

		if(state == animationStates.switching) {
			if(arm1.isSliding() == 0 && arm2.isSliding() == 0) {
				state = animationStates.idle;
			}
		}
	}

	function draw() {
		// Clear background
		backContext.drawImage(img.backgrounds[currentBackground], 0, 0);

		// If not warping, draw all subgraphs to backCanvas
		if(warp.isWarping() == 1) {
			warp.drawWarp();
		} else {
			drawBoard();
			hud.draw();
		}

		// Draw robotic arms
		arm2.draw();

		// Draw focus if in tutorial mode
		redrawGraph();
		arm1.draw();

		// Draw fade in/out effect
		warp.drawFade();

		// Draw panel
		panel.draw();

		// Draw laser beam
		drawBeam();

		// Draw dialogs
		redrawDialog();
	}

///////////////////////////////////////////////////////////////////////////////
//
// Board releted subroutines
//
///////////////////////////////////////////////////////////////////////////////

	// Game board variables
	const tileW = 40, tileH = 46;
	var maxCol, maxRow, maxGraph;
	var selected = -1;
	var shadow;

	// Slide-in animation variables
	const maxCanvas = 25;
	const startX = 20, startY = 20;
	const slideSpeed = 13;
	const glowRadius = 20;
	var slideState;
	var graphCanvas = new Array(maxCanvas);
	var graphContext = new Array();
	var graphTargetX = new Array();
	var graphX = new Array();
	var graphY = new Array();
	var graphZ = new Array();
	var graphRedraw = new Array();
	var graphTileFrames = new Array();
	const min = -99999;

	// Background
	var currentBackground = 0;

	// Paint animation variables
	var paintState;

	function resetSlideIn(moveArm1to, moveArm2to, moveHUDto, isWarp) {
		maxCol = ai.getMaxCol();
		maxRow = ai.getMaxRow();
		maxGraph = ai.getGraphSize();

		arm1.resetSliding(moveArm1to);
		arm2.resetSliding(moveArm2to);
		hud.resetSliding(moveHUDto);
		prepareSubGraph();
	
		if(isWarp == 1) {
			warp.resetFade(0);
		}

		setSelect(-1, 0);
		state = animationStates.slideIn;
		nextState = animationStates.idle;
		slideState = 1;
	}

	function resetSlideOut(moveArm1to, moveArm2to, moveHUDto, isWarp) {
		var i, x = Math.ceil(env.screenWidth * 1.2 / slideSpeed) * slideSpeed;
		for(i = 0; i < maxGraph; i++) {
			if(i%2 == 0) {
				graphTargetX[i] = graphX[i] - x;
			} else {
				graphTargetX[i] = graphX[i] + x;
			}
		}

		if(isWarp == 1) {
			arm1.resetSliding(0);
			arm2.resetSliding(0);
			warp.resetFade(1);
			nextState = animationStates.warp;
		} else {
			arm1.resetSliding(moveArm1to);
			arm2.resetSliding(moveArm2to);
			nextState = animationStates.idle;
		}
		hud.resetSliding(moveHUDto);
		setSelect(-1, 0);
		state = animationStates.slideOut;
		slideState = 4;
	}

	function resetPaint(groupID, color, turn) {
		if(groupID == -1) {
			return;
		}

		ai.setColor(groupID, color);

		var res = resetPaintTile(groupID);
		resetBeam(groupID, res[1], res[2], res[3], res[4], turn, color, res[0]);
		
		var i, black = ai.getBlackout();
		for(i = 0; i < black.length; i++) {
			ai.setColor(black[i], 0);
			resetPaintTile(black[i]);
		}

		setSelect(-1, 0);
		state = animationStates.paint;
		paintState = 0;
	}

	function resetPaintTile(groupID) {
		const delay = 3;
		var sub = ai.getSubGraph(groupID);
		var rect = ai.getBorder(groupID);
		var w = Math.floor(rect[1])-Math.floor(rect[3])+1, h = rect[2]-rect[0]+1;
		var t = rect[0], l = rect[3];
		var odd = (l-Math.floor(l) > 0)? 1: 0;
		var startX, startY, endX, endY, first, last;
		var i, cnt;

		graphTileFrames[groupID].length = 0;
		cnt = 0;
		first = -1;
		for(i = 0; i < w*h; i++) {
			if(sub[i] == ' ') {
				graphTileFrames[groupID].push(min);
			} else {
				graphTileFrames[groupID].push((-1)*delay*cnt);
				cnt++;
				last = i;
				if(first < 0) {
					first = i;
				}
			}
		}

		if(odd == 1) {
			offset = (t%2==0)? (-1)*tileW/2: 0;
		} else {
			offset = (t%2==1)? tileW/2: 0;
		}
		startX = first * tileW + tileW/2 + offset + glowRadius;
		startY = tileH/2+ glowRadius;

		if(odd == 1) {
			offset = ((t+h-1)%2==0)? (-1)*tileW/2: 0;
		} else {
			offset = ((t+h-1)%2==1)? tileW/2: 0;
		}
		endX = (last%w) * tileW + tileW/2 + offset + glowRadius;
		endY = h * tileH*0.75 + glowRadius;

		graphRedraw[groupID] = 0;
		return [(delay*cnt+10), startX, startY, endX, endY];
	}

	function pushPaint() {
		if(paintState != 1) {
			return;
		}

		var stop;
		var rect, w, h;
		var i, j;

		for(j = 0; j < graphRedraw.length; j++) {
			if(graphRedraw[j] != -1) {
				stop = -1;
				rect = ai.getBorder(j);
				w = Math.floor(rect[1])-Math.floor(rect[3])+1;
				h = rect[2]-rect[0]+1;
				
				for(i = 0; i < w*h; i++) {
					if(graphTileFrames[j][i] != min) {
						graphTileFrames[j][i]++;
						if(graphTileFrames[j][i] <= 10) {
							stop = 0;
						}
					}
				}
				graphRedraw[j] = stop;
			}
		}
	}

	function prepareSubGraph() {
		var i, j, curRow, rect;
		var x = Math.ceil(env.screenWidth * 1.2 / slideSpeed) * slideSpeed;

		graphContext.length = 0;
		graphTargetX.length = 0;
		graphX.length = 0;
		graphY.length = 0;
		graphZ.length = 0;
		graphRedraw.length = 0;
		graphTileFrames.length = 0;
		for(i = 0; i < maxGraph; i++) {
			rect = ai.getBorder(i);
			graphCanvas[i].width = (rect[1] - rect[3] + 1) * tileW + 2 * glowRadius;
			graphCanvas[i].height = (rect[2] - rect[0]) * tileH * 0.75 + tileH + 2 * glowRadius;
			graphContext.push(graphCanvas[i].getContext("2d"));

			graphTargetX.push(startX + rect[3] * tileW);
			if(i%2 == 1) {
				graphX.push(graphTargetX[i] - x);
			} else {
				graphX.push(graphTargetX[i] + x);
			}
			graphY.push(startY + rect[0] * tileH * 0.75);
			graphZ.push((maxGraph-i-1) * 0.02);
			graphRedraw.push(-1);
			graphTileFrames[i] = new Array();

			drawSubGraph(i, 0);
		}
	}
	
	function pushSlide() {
		var i, check;
		switch(slideState) {
		case 0:
			break;

		case 1:
			check = maxGraph;
			for(i = 0; i < maxGraph; i++) {
				if(graphX[i] < graphTargetX[i]) {
					graphX[i] += slideSpeed;
				} else if(graphX[i] > graphTargetX[i]) {
					graphX[i] -= slideSpeed;
				} else {
					check--;
				}
			}
			if(check == 0) {
				slideState = 2;
			}
			break;

		case 2:
			check = maxGraph;
			for(i = 0; i < maxGraph; i++) {
				if(graphZ[i] > 0) {
					graphZ[i] -= 0.01;
				} else {
					check--;
				}
			}
			if(check == 0) {
				state = animationStates.idle;
				slideState = 3;
			}
			break;

		case 3:
			break;

		case 4:
			check = maxGraph;
			for(i = 0; i < maxGraph; i++) {
				if(graphZ[i] < (maxGraph-i-1) * 0.02) {
					graphZ[i] += 0.01;
				} else {
					check--;
				}
			}
			if(check == 0) {
				slideState = 5;
			}
			break;

		case 5:
			check = maxGraph;
			for(i = 0; i < maxGraph; i++) {
				if(graphX[i] < graphTargetX[i]) {
					graphX[i] += slideSpeed;
				} else if(graphX[i] > graphTargetX[i]) {
					graphX[i] -= slideSpeed;
				} else {
					check--;
				}
			}
			if(nextState == animationStates.warp && warp.isFading() == 0) {
				arm1.reset();
				arm2.reset();
				warp.resetWarp();
				currentBackground = (currentBackground+1)%5;
				state = animationStates.warp;
				nextState = animationStates.idle;
				slideState = 0;
			} else if(check == 0) {
				state = animationStates.idle;
				nextState = animationStates.idle;
				slideState = 0;
			}
			break;
		}
	}

	function drawBoard() {
		var board = ai.getBoard();
		var i, dx, dy, dw, dh;
		for(i = 0; i < maxGraph; i++) {
			if(graphZ[i] > 0) {
				dx = (graphX[i] - env.screenWidth/2) * (1 - graphZ[i]) + env.screenWidth/2;
				dy = (graphY[i] - env.screenHeight/2) * (1 - graphZ[i]) + env.screenHeight/2;
				dw = graphCanvas[i].width * graphZ[i];
				dh = graphCanvas[i].height * graphZ[i];
				backContext.drawImage(graphCanvas[i], dx, dy, graphCanvas[i].width-dw, graphCanvas[i].height-dh);

				if(shadow == 1) {
					backContext.drawImage(img.shadow, dx, 300+130*(1-graphZ[i]), graphCanvas[i].width-dw, 50*(1-graphZ[i]));
				}
			} else {
				if(selected != i) {
					backContext.drawImage(graphCanvas[i], graphX[i], graphY[i]);				
				}
				if(graphRedraw[i] != -1) {
					drawSubGraph(i, 0);
				}
				if(shadow == 1) {
					backContext.drawImage(img.shadow, graphX[i], 430,  graphCanvas[i].width, 50);
				}
			}
		}
		if(selected >= 0 && (slideState == 0 || slideState == 3)) {
			backContext.drawImage(graphCanvas[selected], graphX[selected], graphY[selected]);
		}
	}

	function drawSubGraph(target, glowing) {
		if(target < 0) {
			return;
		}

		var rect = ai.getBorder(target);
		var w = Math.floor(rect[1])-Math.floor(rect[3])+1, h = rect[2]-rect[0]+1;
		var t = rect[0], l = rect[3];
		var odd = (l-Math.floor(l) > 0)? 1: 0;
		var subGraph = ai.getSubGraph(target);

		// Clean up subgraph rectangle
		graphContext[target].clearRect(0, 0, graphCanvas[target].width, graphCanvas[target].height);

		// Draw glow
		var i, j, curRow, offset;
		var x, y;
		if(glowing != 0) {
			for(i = 0; i < h; i++) {
				curRow = i * w;
				if(odd == 1) {
					offset = ((t+i)%2==0)? (-1)*tileW/2: 0;
				} else {
					offset = ((t+i)%2==1)? tileW/2: 0;
				}

				for(j = 0; j < w; j++) {
					if(subGraph[curRow+j] != ' ') {
						x = j * tileW + offset;
						y = i * tileH * 0.75;
						graphContext[target].drawImage(img.glow, 80*(glowing-1), 0, 80, 86, x, y, 80, 86);
					}
				}
			}
		}

		// Draw tiles
		var color = ai.getColor(target);
		var neighbor;
		var tmp;
		for(i = 0; i < h; i++) {
			curRow = i * w;
			if(odd == 1) {
				offset = ((t+i)%2==0)? (-1)*tileW/2: 0;
			} else {
				offset = ((t+i)%2==1)? tileW/2: 0;
			}

			for(j = 0; j < w; j++) {
				if(subGraph[curRow+j] != ' ') {
					tmp = curRow + j;
					x = glowRadius + j * tileW + offset;
					y = glowRadius + i * tileH * 0.75;

					// Draw tiles
					if(graphRedraw[target] != -1) {
						if(graphTileFrames[target][tmp] <= 0) {
							graphContext[target].drawImage(img.tiles, 0, 0, tileW, tileH, x, y, tileW, tileH);
						} else if(graphTileFrames[target][tmp] > 0 && graphTileFrames[target][tmp] <= 10) {
							graphContext[target].drawImage(img.tiles, tileW * graphTileFrames[target][tmp], tileH * color, tileW, tileH, x, y, tileW, tileH);
						} else {
							graphContext[target].drawImage(img.tiles, tileW * 10, tileH * color, tileW, tileH, x, y, tileW, tileH);
						}
					} else {
						if(color != -1) {
							graphContext[target].drawImage(img.tiles, tileW * 10, tileH * color, tileW, tileH, x, y, tileW, tileH);
						} else {
							graphContext[target].drawImage(img.tiles, 0, 0, tileW, tileH, x, y, tileW, tileH);
						}
					}
					
					// Draw target# for debug
					//graphContext[target].fillText(target, x + 15, y + 15);
					
					// Draw borders
					neighbor = checkNeighbor(subGraph, curRow+j, w, h, t);	
					if(neighbor[0] == 1) {
						graphContext[target].drawImage(img.tileBorder, 0, 0, tileW, tileH, x, y, tileW, tileH);
					}
					if(neighbor[1] == 1) {
						graphContext[target].drawImage(img.tileBorder, tileW, 0, tileW, tileH, x, y, tileW, tileH);
					}
					if(neighbor[2] == 1) {
						graphContext[target].drawImage(img.tileBorder, 2*tileW, 0, tileW, tileH, x, y, tileW, tileH);
					}
				}
			}
		}
		
		// Draw overlaps
		drawOverlap(target);
	}

	function checkNeighbor(subGraph, xy, w, h, t) {
		var output = [1, 1, 1];
		if(subGraph[xy] == ' ') {
			return output;
		}
		var col = xy % w;
		var row = Math.floor(xy / w);
		var target;

		if(col == (w-1)) {
		} else if(subGraph[xy+1]==' ') {
		} else {
			output[0] = 0;
		}

		target = ((t+row)%2 == 1)? xy + w + 1: xy + w;
		if(row == (h-1)) {
		} else if( ((t+row)%2 == 1) && (col == (w-1)) ) {
		} else if(subGraph[target] == ' ') {
		} else {
			output[1] = 0;
		}

		target = ((t+row)%2 == 1)? xy + w: xy + w - 1;
		if(row == (h-1)) {
		} else if( ((t+row)%2 == 0) && (col == 0) ) {
		} else if(subGraph[target] == ' ') {
		} else {
			output[2] = 0;
		}

		return output;
	}

	function selection(x, y) {
		var blockX = -1, blockY = -1;
		var i;

		for(i = 0; i < maxCol; i += 0.5) {
			if( (x >= startX+glowRadius+tileW*i) && (x < startX+glowRadius+tileW*(i+0.5)) ) {
				blockX = i;
				break;
			}
		}
		for(i = 0; i < maxRow; i++) {
			if( (y >= startY+glowRadius+tileH*i*0.75) && (y < startY+glowRadius+tileH*(i+1)*0.75) ) {
				blockY = i;
				break;
			}
		}
		if(blockX == -1 || blockY == -1 || blockY == 0) {
			return -1;
		}

		var odd = (blockX > Math.floor(blockX))? 1: 0;
		var cx1, cx2, cy1, cy2;
		cy1 = startY + glowRadius + blockY * tileH * 0.75 + tileH/2;
		cy2 = startY + glowRadius + (blockY-1) * tileH * 0.75 + tileH/2;
		if( ((blockY%2==0)&&(odd==0)) || ((blockY%2==1)&&(odd==1)) ) {
			cx2 = startX + glowRadius + blockX * tileW;
			cx1 = cx2 + tileW/2;
		} else {
			cx1 = startX + glowRadius + blockX * tileW;
			cx2 = cx1 + tileW/2;
		}

		var d1, d2, xy;
		d1 = (x-cx1)*(x-cx1) + (y-cy1)*(y-cy1);
		d2 = (x-cx2)*(x-cx2) + (y-cy2)*(y-cy2);
		if(d1 < d2) {
			xy = blockY * maxCol;
			if(blockY%2 == 1) {
				xy += Math.floor(blockX - 0.5);
			} else {
				xy += Math.floor(blockX);
			}
		} else {
			xy = (blockY-1) * maxCol;
			if(blockY%2 == 1) {
				xy += Math.floor(blockX);
			} else {
				xy += Math.floor(blockX - 0.5);
			}
		}

		var output = ai.findGroup(xy);
		if(output == -1) {
			return -1;
		} else if(ai.getColor(output) != -1) {
			return output*(-1)-1;
		} else {
			return output;
		}
	}

///////////////////////////////////////////////////////////////////////////////
//
// Overlap releted subroutines
//
///////////////////////////////////////////////////////////////////////////////

	// Overlap variables
	var overlap = new Array(maxCanvas);

	function initOverlap() {
		clearOverlap();
	}

	function setOverlap(target, str) {
		overlap[target] = str;
	}

	function clearOverlap() {
		for(var i = 0; i < maxCanvas; i++) {
			overlap[i] = "";
		}
	}

	function drawOverlap(target) {
		if(target < 0 || target >= maxCanvas) {
			return;
		}
		var x = graphCanvas[target].width/2;
		var y = graphCanvas[target].height/2;

		if(overlap[target] == "title") {
			graphContext[target].drawImage(img.title, 0, 0, 520, 80, x-260, y-45, 520, 80); 
		} else if(overlap[target] == "p1Game") {
			graphContext[target].drawImage(img.title, 0, 80, 190, 37, x-95, y-20, 190, 37);
		} else if(overlap[target] == "p2Game") {
			graphContext[target].drawImage(img.title, 260, 80, 216, 37, x-108, y-20, 216, 37);
		}
	}

///////////////////////////////////////////////////////////////////////////////
//
// Laser beam releted subroutines
//
///////////////////////////////////////////////////////////////////////////////

	// Beams variables
	var beamT, maxBeamT;
	var beamFromX, beamFromY, beamToX, beamToY;
	var beamSweepFromX, beamSweepFromY, beamSweepToX, beamSweepToY;
	var beamTarget, beamTurn, beamColor;
	var currentSpark;

	function resetBeam(target, startX, startY, endX, endY, turn, color, max) {
		beamTarget = target*(-1)-1;
		beamTurn = turn;
		beamColor = color-1;

		beamSweepFromX = graphX[target] + startX;
		beamSweepFromY = graphY[target] + startY;
		beamSweepToX = graphX[target] + endX;
		beamSweepToY = graphY[target] + endY;
		beamToX = beamSweepFromX;
		beamToY = beamSweepFromY;

		currentSpark = 0;
		beamT = 0;
		maxBeamT = max;

		if(turn == 0) {
			arm1.setTarget(beamSweepFromX, beamSweepFromY);
		} else {
			arm2.setTarget(beamSweepFromX, beamSweepFromY);
		}
	}

	function pushBeam() {
		if(paintState != 1) {
			if(beamTurn == 0) {
				arm1.push();
				if(arm1.isMoving() == 0) {
					paintState = 1;
				}
			} else {
				arm2.push();
				if(arm2.isMoving() == 0) {
					paintState = 1;
				}
			}
			return;
		}
		
		beamT++;
		if(beamT > maxBeamT) {
			return;
		}

		var t = beamT / maxBeamT;
		beamToX = beamSweepFromX + (beamSweepToX - beamSweepFromX) * t;
		beamToY = beamSweepFromY + (beamSweepToY - beamSweepFromY) * t;

		if(beamTurn == 0) {
			arm1.setTarget(beamToX, beamToY);
			arm1.push();
		} else {
			arm2.setTarget(beamToX, beamToY);
			arm2.push();
		}

		currentSpark += Math.floor(Math.random() * 7);
		currentSpark %= 7;
	}

	function drawBeam() {
		if(paintState != 1) {
			return;
		}
		if(beamT > maxBeamT) {
			return;
		}
		if(selection(beamToX, beamToY) != beamTarget) {
			return;
		}

		var xy;
		if(beamTurn == 0) {
			xy = arm1.getLaserHead();
			beamFromX = xy[0];
			beamFromY = xy[1];
		} else {
			xy = arm2.getLaserHead();
			beamFromX = xy[0];
			beamFromY = xy[1];
		}

		var l = Math.sqrt( (beamToX-beamFromX)*(beamToX-beamFromX) + (beamToY-beamFromY)*(beamToY-beamFromY) );
		var r = angle(beamFromX, beamFromY, beamToX, beamToY);

		backContext.save();
		backContext.setTransform(1, 0, 0, 1, 0, 0);
		backContext.translate(beamFromX, beamFromY);
		backContext.rotate(r);
		backContext.drawImage(img.beams, 0, 40*beamColor, l, 40, 0, -20, l, 40);
		backContext.drawImage(img.sparks, 128 * currentSpark, 0, 128, 128, l - 64, -64, 128, 128);
		backContext.restore();
	}

	function angle(ax, ay, bx, by) {
		var l = Math.sqrt((bx-ax)*(bx-ax)+(by-ay)*(by-ay));
		var r = Math.asin((by-ay) / l);
		if(bx < ax) {
			r = (-1)*r + Math.PI;
		}
		return r;
	}

///////////////////////////////////////////////////////////////////////////////
//
// Redraw focus releted subroutines
//
///////////////////////////////////////////////////////////////////////////////

	// Redraw focus vairables
	var focusPos, focusA;
	var focusTargets = new Array();

	function redrawReset() {
		focusPos = 0;
		focusA = 0;
		focusTargets.length = 0;
	}

	function redrawGraph() {
		if(focusPos != 1) {
			return;
		}

		backContext.fillStyle = "rgba(64, 64, 64, " + focusA + ")";
		backContext.fillRect(0, 0, env.screenWidth, env.screenHeight);
		for(var i = 0; i < focusTargets.length; i++) {
			t = focusTargets[i];
			backContext.drawImage(graphCanvas[t], graphX[t], graphY[t]);				
		}
	}

	function redrawDialog() {
		if(focusPos == 2) {
			backContext.fillStyle = "rgba(64, 64, 64, " + focusA + ")";
			backContext.fillRect(0, 0, env.screenWidth, env.screenHeight);
		}
		dialog.draw();
	}

///////////////////////////////////////////////////////////////////////////////
//
// Player switching releted subroutines
//
///////////////////////////////////////////////////////////////////////////////

	function resetSwitching(turn) {
		if(turn%2 == 0) {
			arm1.resetSliding(2);
			arm2.resetSliding(1);
		} else {
			arm1.resetSliding(1);
			arm2.resetSliding(2);
		}
		state = animationStates.switching;
	}

///////////////////////////////////////////////////////////////////////////////
//
// General utilities
//
///////////////////////////////////////////////////////////////////////////////

	function drawNumbers(targetCanvas, numbers, x, y, scale) {
		const w = 35, h = 54;
		var str = numbers.toString(), tmp;
		for(var i = 0; i < str.length; i++) {
			tmp = Number(str[i]);
			targetCanvas.drawImage(img.numbers, tmp*w, 0, w, h, x+(i*w*scale), y, w*scale, h*scale);
		}
	}

///////////////////////////////////////////////////////////////////////////////
//
// Setup public access
//
///////////////////////////////////////////////////////////////////////////////

	function setSelect(_selected, turn) {
		if(_selected == selected) {
			return;
		}

		if(_selected < 0 && selected >= 0) {
			drawSubGraph(selected, 0);
		} else if(_selected >= 0 && selected < 0) {
			drawSubGraph(_selected, turn+1);
		} else {
			drawSubGraph(selected, 0);
			drawSubGraph(_selected, turn+1);
		}
		selected = _selected;
	}

	function isIdle() {
		if(state != animationStates.idle) {
			return 0;
		} else {
			return 1;
		}
	}

	function setShadow(_shadow) { shadow = _shadow; }

	function setFocus(_p, _a) {
		if(_a > 0) {
			focusPos = _p;
		} else {
			focusPos = 0;
		}
		focusA = _a;
	}

	function setFocusTargets(_t) {
		focusTargets = _t.slice(0);
	}

	return {
		init : init,
		
		resetSlideIn : resetSlideIn,
		resetSlideOut : resetSlideOut,
		resetPaint : resetPaint,
		
		push : push,
		draw : draw,

		selection : selection,
		setSelect : setSelect,

		setOverlap : setOverlap,
		clearOverlap : clearOverlap,

		resetSwitching: resetSwitching,

		isIdle : isIdle,
		setShadow : setShadow,
		setFocus : setFocus,
		setFocusTargets : setFocusTargets,

		drawNumbers : drawNumbers
	};
})();

