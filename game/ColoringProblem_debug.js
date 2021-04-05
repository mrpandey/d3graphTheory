var ai = (function() {
	// The board
	const maxRow = 12;
	const maxCol = 18;
	const maxSeed = 25;
	var board = new Array(maxCol * maxRow);
	var groups = new Array();
	var graph = new Array();
	var subgraphs = new Array();
	var borders = new Array();
	var uncolored = new Array();
	var paddingX, paddingY;

///////////////////////////////////////////////////////////////////////////////
//
// AI related utilites
//
///////////////////////////////////////////////////////////////////////////////

	// AI variables
	var aiAbility = 100;

	function aiPick() {
		var candidates = new Array();
		var res;
		var output;
		var i, j;

		// Setup candidates
		for(i = 0; i < uncolored.length; i++) {
			for(j = 1; j <= 3; j++) {
				if(isColorOK(uncolored[i], j) == 1) {
					candidates.push(uncolored[i]*10+j);
				}
			}
		}
		var bkpCandidates = candidates.slice(0);
		console.log("candidates = ", candidates);

		// Use defensivePick() tool to pick cirtical areas
		defensivePick(candidates, uncolored.length);
		console.log("candidates after defensivePick() = ", candidates);

		// Use offensivePick() tool to minimize cirtical areas for opponent
		offensivePick(candidates);
		console.log("candidates after offensivePick() = ", candidates);
		
		// Use monopolyPick() tool to minimize variability (50%)
		if(Math.random() < 0.5) {
			monopolyPick(candidates);
			console.log("candidates after monopolyPick() = ", candidates);
		}

		// Pick the worst one for lowering difficulty
		if(Math.random()*100 >= aiAbility) {
			var diff = new Array();
			for(i = 0; i < bkpCandidates.length; i++) {
				if(candidates.indexOf(bkpCandidates[i]) == -1) {
					diff.push(bkpCandidates[i]);
				}
			}
			if(diff.length > 0) {
				candidates = diff;
			}
			console.log("candidates after inverse = ", candidates);
		}

		// Random pick one from the candidates
		output = randomPick(candidates);

		return output;
	}

	function defensivePick(candidates) {
		var output = new Array();
		var breakthrough = 0;
		var i, score;
		var scores = new Array();

		for(i = 0; i < candidates.length; i++) {
			score = evalute(candidates[i]);
			scores.push(score);
			if(score > 0 && uncolored.length%2 == score%2) {
				output.push(candidates[i]);
			}
		}

		if(output.length > 0) {
			candidates.length = output.length;
			for(i = 0; i < output.length; i++) {
				candidates[i] = output[i];
			}
			if(uncolored.length%2 == 0) {
				breakthrough = 1;
			}
		}

		return breakthrough;
	}

	function offensivePick(candidates) {
		var newCandidates = new Array();
		var scores = new Array();
		var output = new Array();
		var i, j, k, min;
		var groupID, color;
		var breakthrough;

		// Backup the whole board
		var bkpBoard = board.slice(0);
		var bkpUncolored = uncolored.slice(0);

		// Start evalution
		for(j = 0; j < candidates.length; j++) {
			groupID = Math.floor(candidates[j]/10);
			color = candidates[j]%10;

			// Paint the current candidate
			setColor(groupID, color);
			blackout();

			// Setup new candidates
			newCandidates.length = 0;
			for(k = 0; k < uncolored.length; k++) {
				for(i = 1; i <= 3; i++) {
					if(isColorOK(uncolored[k], i) == 1) {
						newCandidates.push(uncolored[k]*10+i);
					}
				}
			}

			// Scoring
			breakthrough = defensivePick(newCandidates);
			if(breakthrough == 0) {
				scores.push(-1);
			} else {
				scores.push(newCandidates.length);
			}

			// Restore the board
			board = bkpBoard.slice(0);
			uncolored = bkpUncolored.slice(0);
		}

		// Find the candidates with minimum score
		min = 0;
		output.push(candidates[0]);
		for(i = 1; i < scores.length; i++) {
			if(scores[i] == scores[min]) {
				output.push(candidates[i]);
			} else if(scores[i] < scores[min]) {
				min = i;
				output.length = 0;
				output.push(candidates[i]);
			}
		}

		// Copy output array to candidates array
		if(output.length > 0) {
			candidates.length = output.length;
			for(i = 0; i < output.length; i++) {
				candidates[i] = output[i];
			}
		}

		return;
	}

	function monopolyPick(candidates) {
		if(candidates.length <= 1) {
			return;
		}
		
		// Find out witch graph has largest link count (graph[].length)
		var graphID, maxGraphID = Math.floor(candidates[0]/10);
		var output = new Array();
		var i, max = 0;
		output.push(candidates[0]);
		for(i = 1; i < candidates.length; i++) {
			graphID = Math.floor(candidates[i]/10);
			if(graph[graphID].length > graph[maxGraphID].length) {
				max = i;
				maxGraphID = graphID;
				output.length = 0;
				output.push(candidates[i]);
			} else if(graph[graphID].length == graph[maxGraphID].length) {
				output.push(candidates[i]);
			}
		}

		// Copy output array to candidates array
		if(output.length > 0) {
			candidates.length = output.length;
			for(i = 0; i < output.length; i++) {
				candidates[i] = output[i];
			}
		}

		return;
	}

	function randomPick(candidates) {
		return candidates[Math.floor(Math.random()*candidates.length)];
	}

	function evalute(groupColor) {
		var groupID = Math.floor(groupColor/10);
		var color = groupColor%10;
		var blackoutCnt = 0, tmp;

		if(getColor(groupID) != -1 || isColorOK(groupID, color) == 0) {
			return 0;
		}

		tmp = board[groups[groupID][0]];
		paint(groupID, color);
		for(i = 0; i < graph[groupID].length; i++) {
			if(getColor(graph[groupID][i]) == -1 && isBlack(graph[groupID][i]) == 1) {
				blackoutCnt++;
			}
		}
		paint(groupID, tmp);		

		return blackoutCnt+1;
	}

///////////////////////////////////////////////////////////////////////////////
//
// Board setup subroutines
//
///////////////////////////////////////////////////////////////////////////////

	function presetBoard(seed, _board, _paddingX, _paddingY) {
		// Step 0. Prepare variables
		board = _board.slice(0);
		paddingX = _paddingX;
		paddingY = _paddingY;

		// Step 1. Empty groups[][] and graph[][]
		groups.length = seed;
		graph.length = seed;
		for(i = 0; i < seed; i++) {
			groups[i] = new Array();
			graph[i] = new Array();
		}

		// Step 2. Confirm groups
		var i, j;
		for(i = 0; i < maxCol*maxRow; i++) {
			if(board[i] >= 61) {
				groups[board[i]-61].push(i);
			}
		}

		// Step 3. Confirm the graph
		for(i = 0; i < seed-1; i++) {
			for(j = i+1; j < seed; j = j+1) {
				if(isNeighborG2G(groups[i], groups[j]) == 1) {
					graph[i].push(j);
					graph[j].push(i);
				}
			}
		}

		// Step 4. Extract subgraphs
		subgraphs.length = 0;
		borders.length = 0;
		for(i = 0; i < seed; i++) {
			subgraphs.push(subGraph(i + 61));
			borders.push(findBorder(i + 61));
		}

		// Step 5. Fill the uncolored array
		uncolored.length = 0;
		for(i = 0; i < seed; i++) {
			uncolored.push(i);
		}
	}

	function setupBoard(seed, _paddingX, _paddingY) {
		// Step 0. Prepare variables
		if(seed > maxSeed) {
			seed = maxSeed;
		}
		if(_paddingX > maxCol/2-3) {
			paddingX =  maxCol/2-3;
		} else {
			paddingX = _paddingX;
		}
		if(_paddingY > maxRow/2-3) {
			paddingY =  maxRow/2-3;
		} else {
			paddingY = _paddingY;
		}
		const removed = 5;
		var emptyCells = new Array();
		var setupSeq = new Array(maxCol * maxRow);
		var i, j, tmp;

		// Step 1. Empty the board
		emptyBoard(emptyCells);
		groups.length = seed;
		graph.length = seed;
		for(i = 0; i < seed; i++) {
			groups[i] = new Array();
			graph[i] = new Array();
		}

		// Step 2. Remove some cells for randomize
		var repeated, remove = new Array();
		i = 0;
		while(i < removed) {
			tmp = emptyCells[Math.floor(Math.random()*emptyCells.length)];
			repeated = 0;
			for(j = 0; j < remove.length; j++) {
				if(isNeighborP2P(tmp, remove[j]) == 1 || tmp == remove[j]) {
					repeated = 1;
					break;
				}
			}
			if(repeated == 0) {
				remove.push(tmp);
				board[tmp] = ' ';
				emptyCells.splice(emptyCells.indexOf(tmp), 1);
				i++;
			}
		}

		// Step 3. Generate grouping seeds
		setupSeq = emptyCells.slice(0);
		shuffle(setupSeq);
		for(i = 0; i < seed; i++) {
			board[setupSeq[i]] = i + 61;
			groups[i].push(setupSeq[i]);
			emptyCells.splice(emptyCells.indexOf(setupSeq[i]), 1);
		}

		// Step 4. Grouping for cells that ungrouped
		while(emptyCells.length > 0) {
			j = emptyCells.length;
			setupSeq = emptyCells.slice(0);
			shuffle(setupSeq);

			for(i = 0; i < j; i++) {
				tmp = grouping(setupSeq[i]);
				if(tmp >= 0) {
					board[setupSeq[i]] = tmp + 61;
					groups[tmp].push(setupSeq[i]);
					emptyCells.splice(emptyCells.indexOf(setupSeq[i]), 1);
				}
			}
		}

		// Step 5. Confirm the graph
		for(i = 0; i < seed-1; i++) {
			for(j = i+1; j < seed; j = j+1) {
				if(isNeighborG2G(groups[i], groups[j]) == 1) {
					graph[i].push(j);
					graph[j].push(i);
				}
			}
		}

		// Step 6. Extract subgraphs
		subgraphs.length = 0;
		borders.length = 0;
		for(i = 0; i < seed; i++) {
			subgraphs.push(subGraph(i + 61));
			borders.push(findBorder(i + 61));
		}

		// Step 7. Fill the uncolored array
		uncolored.length = 0;
		for(i = 0; i < seed; i++) {
			uncolored.push(i);
		}
	}

	function emptyBoard(emptyCells) {
		var i;

		emptyCells.length = 0;
		for(i = 0; i < maxCol*maxRow; i++) {
			if(isEdge(i) == 1) {
				board[i] = ' ';
			} else {
				board[i] = '0';
				emptyCells.push(i);
			}
		}
	}

///////////////////////////////////////////////////////////////////////////////
//
// Setup related utilities
//
///////////////////////////////////////////////////////////////////////////////

	function grouping(xy) {
		var candidates = new Array();
		var i, min;

		for(i = 0; i < groups.length; i++) {
			if(isNeighborG2P(groups[i], xy) == 1) {
				candidates.push(i);
			}
		}

		if(candidates.length < 1) {
			return -1;
		} else if(candidates.length == 1) {
			return candidates[0];
		} else {
			min = 0;
			for(i = 1; i < candidates.length; i++) {
				if(groups[i].length < groups[min].length) {
					min = i;
				}
			}
			return candidates[min];
		}
	}

	function isNeighborG2G(g1, g2) {
		for(var i = 0; i < g2.length; i++) {
			if(isNeighborG2P(g1, g2[i]) == 1) {
				return 1;
			}
		}
		return 0;
	}

	function isNeighborG2P(g, xy) {
		for(var i = 0; i < g.length; i++) {
			if(isNeighborP2P(g[i], xy) == 1) {
				return 1;
			}
		}
		return 0;
	}

	function isNeighborP2P(xy1, xy2) {
		var row = Math.floor(xy1 / maxCol);
		var odd;
		if(row % 2 == 1) {
			odd = 1;
		} else {
			odd = -1;
		}

		if(xy1+1 == xy2 || xy1-1 == xy2
			|| xy1-maxCol == xy2 || xy1-maxCol+odd == xy2 
			|| xy1+maxCol == xy2 || xy1+maxCol+odd == xy2) {
			return 1;
		} else {
			return 0;
		}
	}

	function isEdge(xy) {	
		if(xy < maxCol*paddingY || xy >= (maxRow-paddingY)*maxCol) {
			return 1;
		}
		if(xy%maxCol < paddingX || xy%maxCol >= maxCol-paddingX) {
			return 1;
		}
		if(Math.floor(xy/maxCol)%2 == 1 && xy%maxCol == maxCol-paddingX-1) {
			return 1;
		}
		return 0;
	}

	function subGraph(groupID) {
		var w, h;
		var i, j, k, curRow;
		var rect = findBorder(groupID);
		var t = rect[0], r = rect[1], b = rect[2], l = rect[3];
		w = Math.floor(r) - Math.floor(l) + 1;
		h = b - t + 1;

		var subGraph = new Array(maxCol * maxRow);
		k = 0;
		for(i = t; i <= b; i++) {
			curRow = i * maxCol;
			for(j = Math.floor(l); j <= Math.floor(r); j++) {
				if(board[curRow+j] == groupID) {
					subGraph[k] = board[curRow+j];
				} else {
					subGraph[k] = ' ';
				}
				k++;
			}
		}

		return subGraph;
	}

	function findBorder(groupID) {
		var i, j, curRow, curCol;
		var t = -1, b = -1, l = -1, r = -1;

		// Find top
   		for(i = 0; i < maxRow; i++) {
			curRow = i * maxCol;
			for(j = 0; j < maxCol; j++) {
				if(groupID == board[curRow+j]) {
					t = i;
					break;
				}
			}
	   		if(t > -1) {
				break;
			}
		}
	
		// Find bottom
		for(; i < maxRow; i++) {
			curRow = i * maxCol;
			for(j = 0; j < maxCol; j++) {
				if(groupID == board[curRow+j]) {
					b = i;
					break;
				}
			}
			if(b < i) {
				break;
			}
		}
	
		// Find left
		for(i = 0; i < 2 * maxCol; i++) {
			curCol = (i%2)? (maxCol + (i-1)/2): i/2;
			for(j = curCol; j < maxCol * maxRow; j += maxCol * 2) {
				if(groupID == board[j]) {
					l = i/2;
					break;
				}
			}
			if(l > -1) {
				break;
			}
		}	
	
		// Find right
		for(i = 2 * maxCol - 1; i >= 0; i--) {
			curCol = (i%2)? (maxCol + (i-1)/2): i/2;
			for(j = curCol; j < maxCol * maxRow; j += maxCol * 2) {
				if(groupID == board[j]) {
					r = i/2;
					break;
				}
			}
			if(r > -1) {
				break;
			}		
		}

		return [t, r, b, l];
	}

///////////////////////////////////////////////////////////////////////////////
//
// Game related utilities
//
///////////////////////////////////////////////////////////////////////////////

	function getColor(groupID) {
		if(board[groups[groupID][0]] > 3 || board[groups[groupID][0]] < 0) {
			return -1;
		} else {
			return board[groups[groupID][0]];
		}
	}

	function setColor(groupID, color) {
		paint(groupID, color);
		uncolored.splice(uncolored.indexOf(groupID), 1);
	}

	function paint(groupID, color) {
		for(var i = 0; i < groups[groupID].length; i++) {
			board[groups[groupID][i]] = color;
		}
	}

	function isColorOK(groupID, color) {
		var i;
		for(i = 0; i < graph[groupID].length; i++) {
			if(board[groups[ graph[groupID][i] ][0]] == color) {
				return 0;
			}
		}
		return 1;
	}

	function isBlack(groupID) {
		if(isColorOK(groupID, 1) == 0 && isColorOK(groupID, 2) == 0 && isColorOK(groupID, 3) == 0) {
			return 1;
		} else {
			return 0;
		}
	}

	function blackout() {
		var i, output = new Array();
		for(i = 0; i < uncolored.length; i++) {
			if(isBlack(uncolored[i]) == 1) {
				output.push(uncolored[i]);
			}
		}
		return output;
	}

///////////////////////////////////////////////////////////////////////////////
//
// General utilities
//
///////////////////////////////////////////////////////////////////////////////

	function findGroup(xy) {
		var i;
		for(i = 0; i < groups.length; i++) {
			if(groups[i].indexOf(xy) != -1) {
				return i;
			}
		}
		return -1;
	}

	function shuffle(target) {
		var a, b, tmp;
		for(var i = 0; i < target.length; i++) {
			a = Math.random();
			a = a * target.length;
			a = Math.floor(a);

			b = Math.random();
			b = b * target.length;
			b = Math.floor(b);

			tmp = target[a];
			target[a] = target[b];
			target[b] = tmp;
		}
	}

///////////////////////////////////////////////////////////////////////////////
//
// Setup public access
//
///////////////////////////////////////////////////////////////////////////////

	function setAIability(input) { aiAbility = input; }
	function getMaxRow() { return maxRow; }
	function getMaxCol() { return maxCol; }
	function getBoard() { return board;	}
	function getGraphSize() { return graph.length; }
	function getSubGraph(groupID) {	return subgraphs[groupID]; }
	function getBorder(groupID) { return borders[groupID]; }
	function getUncoloredCount() { return uncolored.length; }

	return {
		setAIability : setAIability,
		aiPick : aiPick,

		presetBoard : presetBoard,
		setupBoard : setupBoard,
		findGroup : findGroup,

		getMaxRow : getMaxRow,
		getMaxCol : getMaxCol,
		getBoard : getBoard,
		getGraphSize : getGraphSize,
		getColor : getColor,
		setColor : setColor,
		isColorOK : isColorOK,
		getSubGraph : getSubGraph,
		getBorder : getBorder,
		getBlackout : blackout,
		getUncoloredCount : getUncoloredCount
	};
})();

var coloringProblem = (function() {
	if(!canvasSupport) {
		return;
	}
	
///////////////////////////////////////////////////////////////////////////////
//
// Variable declearations
//
///////////////////////////////////////////////////////////////////////////////

	// Path
	const release = 1;
	var path;

	// Canvas
	var theCanvas;
	var context;
	var backCanvas;
	var backContext;

	// Environmental constants
	const screenWidth = 800;
	const screenHeight = 480;

	// Image resources
	var imgTiles = new Image();
	var imgTileBorder = new Image();
	var imgHTML5 = new Image();
	var imgShadow = new Image();
	var imgGlow = new Image();
	var imgPanel = new Image();
	var imgBottons = new Image();
	var imgBeams = new Image();
	var imgSparks = new Image();
	var imgArm1 = new Image();
	var imgArm2 = new Image();
	var imgDot = new Image();
	var imgWarpLine = new Image();
	var imgHalo = new Image();
	var imgMisc = new Image();
	var imgDialog = new Image();
	var imgTitle = new Image();
	var imgNumbers = new Image();
	var imgHUD = new Image();

	// Background array
	var imgBackgrounds = new Array(5);

	// Sound components
	var soundResult0, soundResult1, soundResult2;

///////////////////////////////////////////////////////////////////////////////
//
// Main state machine
//
///////////////////////////////////////////////////////////////////////////////

	// State enumeration
	const mainStates = {
		unknown		: -1,
		initial		: 0, 
		preloading	: 1, 
		initLoader	: 2,
		loading		: 3,
		loadComplete: 4,
		showLogo	: 5,
		resetTitle	: 6,
		title		: 7,
		tutorial	: 8,
		game		: 9
	};
	var state = mainStates.initial;
	var gameParam;

	function timerTick() {
		var res;

		switch(state) {
		case mainStates.initial:
			init();
			break;
		case mainStates.preloading:
			drawPreload();
			break;
		case mainStates.initLoader:
			initLoader();
			break;
		case mainStates.loading:
			loader.draw(Math.ceil(loadCount * 100 / itemsToLoad));
			flip();
			break;
		case mainStates.loadComplete:
			loadComplete();
			loader.resetLogoSliding({
				tiles : imgTiles,
				tileBorder : imgTileBorder,
				html5 : imgHTML5,
				background : imgBackgrounds[0]
			});
			state = mainStates.showLogo;
			break;
		case mainStates.showLogo:
			res = loader.pushLogoSliding();
			loader.drawLogoSliding();
			flip();
			if(res != mainStates.unknown) {
				state = mainStates.resetTitle;
			}
			break;
		case mainStates.resetTitle:
			title.reset();
			state = mainStates.title;
			break;
		case mainStates.title:
			gameParam = title.push();
			title.draw();
			flip();
			if(gameParam[0] != mainStates.unknown) {
				if(tutorialStart == 1) {
					tutorialStart = 0;
					tutorial.reset();
					state = mainStates.tutorial;
				} else {
					state = mainStates.game;
					gameLogic.reset(gameParam[1], gameParam[2]);
				}
			}
			break;
		case mainStates.tutorial:
			res = tutorial.push();
			tutorial.draw();
			flip();
			if(res != mainStates.unknown) {
				state = mainStates.game;
				gameLogic.reset(gameParam[1], gameParam[2]);
			}
			break;
		case mainStates.game:
			res = gameLogic.push();
			gameLogic.draw();
			flip();
			if(res != mainStates.unknown) {
				state = res;
			}
			break;
		}
	}

///////////////////////////////////////////////////////////////////////////////
//
// Deliver events to submodules
//
///////////////////////////////////////////////////////////////////////////////

	// Mouse position variables
	var mouseX, mouseY;

	function eventMouseMove(e) {			
		if(e.offsetX || e.offsetX == 0) {
			mouseX = e.offsetX;
			mouseY = e.offsetY;
		} else if(e.layerX || e.layerX == 0) {
			mouseX = e.layerX - theCanvas.offsetLeft;
			mouseY = e.layerY - theCanvas.offsetTop;
		}

		switch(state) {
		case mainStates.title:
			title.eventMouseMove(mouseX, mouseY);
			break;
		case mainStates.tutorial:
			tutorial.eventMouseMove(mouseX, mouseY);
			break;
		case mainStates.game:
			gameLogic.eventMouseMove(mouseX, mouseY);
			break;
		}
	}

	function eventMouseClick(e) {
		switch(state) {
		case mainStates.title:
			title.eventMouseClick(e);
			break;
		case mainStates.tutorial:
			tutorial.eventMouseClick(e);
			break;
		case mainStates.game:
			gameLogic.eventMouseClick(e);
			break;
		}
	}

///////////////////////////////////////////////////////////////////////////////
//
// Pre-loader subroutines & initialization
//
///////////////////////////////////////////////////////////////////////////////

	// Pre-loader counters
	var itemsToPreload = 2;
	var preloadCount = 0;

	// Prepare global variables
	var env = {
		mainStates : mainStates,
		screenWidth : screenWidth,
		screenHeight : screenHeight
	};

	// Go to tutorial if the player is first time play the game.
	var tutorialStart;

	function init() {
		// Setup path
		if(release == 1) {
			path = "http://alimen.github.io/ColoringProblem/";
		} else {
			path = "";

			// Setup javascript loader events
			itemsToPreload++;
			loadjs("script/Loader.js", 1);
		}

		// Setup image loader events
		imgTiles.src = path + "image/Tiles.png";
		imgTiles.onload = eventItemPreLoaded;
		imgTileBorder.src = path + "image/TileBorder.png";
		imgTileBorder.onload = eventItemPreLoaded;

		// Setup canvas
		theCanvas = document.getElementById("canvas");
		context = theCanvas.getContext("2d");
		backCanvas  = document.createElement("canvas");
		backCanvas.width = theCanvas.width;
		backCanvas.height = theCanvas.height;
		backContext = backCanvas.getContext("2d");

		// Setup mouse events
		theCanvas.addEventListener("mousemove", eventMouseMove, true);
		theCanvas.addEventListener("click", eventMouseClick, true);	

		// Goto tutorial mode before first game start
		tutorialStart = 1;

		// Switch to next state
		state = mainStates.preloading;
	}

	function drawPreload() {
		// Caculate loader
		var percentage = Math.round(preloadCount / itemsToPreload * 100);

		// Clear Background
		context.fillStyle = "#FFFFFF";
		context.fillRect(0, 0, screenWidth, screenHeight);

		// Print percentage
		context.textBaseline = "bottom";	
		context.fillStyle = "#000000";
		context.font = "14px monospace";
		context.textAlign = "center";
		context.fillText(percentage + "%", screenWidth / 2, screenHeight / 2);
	}
	
	function loadjs(filename, preload) {
		var fileref = document.createElement("script");
		fileref.setAttribute("type", "text/javascript");
		fileref.setAttribute("src", filename);
		
		if(preload == 1) {
			fileref.onload = eventItemPreLoaded;
		} else {
			fileref.onload = eventItemLoaded;
		}

		document.getElementsByTagName("head")[0].appendChild(fileref);
	}

	function eventItemPreLoaded(e) {
		preloadCount++;
		if(preloadCount == itemsToPreload) {
			state = mainStates.initLoader;
		}
	}

///////////////////////////////////////////////////////////////////////////////
//
// Loader subroutines
//
///////////////////////////////////////////////////////////////////////////////

	// Loader counters
	var itemsToLoad = 25;
	var loadCount = 0;

	function initLoader() {
		// Setup javascript loader events
		if(release == 0) {
			itemsToLoad += 10;
			loadjs("script/Title.js", 0);
			loadjs("script/GameLogic.js", 0);
			loadjs("script/UI.js", 0);
			loadjs("script/Dialog.js", 0);
			loadjs("script/Panel.js", 0);
			loadjs("script/RoboticArms.js", 0);
			loadjs("script/HUD.js", 0);
			loadjs("script/Warp.js");
			loadjs("script/AI.js", 0);
			loadjs("script/Tutorial.js", 0);
		}

		// Setup sound loader events
		audioLoaderSetup();

		// Setup image loader events
		imgHTML5.src = path + "image/HTML5_Logo.png";
		imgHTML5.onload = eventItemLoaded;
		imgShadow.src = path + "image/Shadow.png";
		imgShadow.onload = eventItemLoaded;
		imgGlow.src = path + "image/Glow.png";
		imgGlow.onload = eventItemLoaded;
		imgPanel.src = path + "image/Panel.png";
		imgPanel.onload = eventItemLoaded;
		imgBottons.src = path + "image/Bottons.png";
		imgBottons.onload = eventItemLoaded;
		imgBeams.src = path + "image/Beam.png";
		imgBeams.onload = eventItemLoaded;
		imgSparks.src = path + "image/Sparks.png";
		imgSparks.onload = eventItemLoaded;
		imgArm1.src = path + "image/Arm1.png";
		imgArm1.onload = eventItemLoaded;
		imgArm2.src = path + "image/Arm2.png";
		imgArm2.onload = eventItemLoaded;
		imgDot.src = path + "image/Dot.png";
		imgDot.onload = eventItemLoaded;
		imgWarpLine.src = path + "image/Warpline.png";
		imgWarpLine.onload = eventItemLoaded;
		imgHalo.src = path + "image/Halos.jpg";
		imgHalo.onload = eventItemLoaded;
		imgMisc.src = path + "image/Misc.png";
		imgMisc.onload = eventItemLoaded;
		imgDialog.src = path + "image/Dialog.jpg";
		imgDialog.onload = eventItemLoaded;
		imgTitle.src = path + "image/Title.png";
		imgTitle.onload = eventItemLoaded;
		imgNumbers.src = path + "image/Numbers.png";
		imgNumbers.onload = eventItemLoaded;
		imgHUD.src = path + "image/HUD.png";
		imgHUD.onload = eventItemLoaded;

		// Background array
		for(var i = 0; i < 5; i++) {
			imgBackgrounds[i] = new Image();
			imgBackgrounds[i].src = path + "image/Background" + i + ".jpg";
			imgBackgrounds[i].onload = eventItemLoaded;
		}


		// Pass resources to loader
		loader.init(env, {
			tiles : imgTiles,
			tileBorder : imgTileBorder
		},
		backContext);

		// Switch to next state
		state = mainStates.loading;
	}

	function eventItemLoaded(e) {
		loadCount++;
		if(loadCount == itemsToLoad) {
			state = mainStates.loadComplete;
		}
	}

	function loadComplete() {
		audioLoadComplete();

		// Initialize sub modules
		title.init(env, {
		}, backContext);

		gameLogic.init(env, {
		}, backContext);

		ui.init(env,  {
			tiles : imgTiles,
			tileBorder : imgTileBorder,
			backgrounds : imgBackgrounds,
			shadow : imgShadow,
			glow : imgGlow,
			title : imgTitle,
			beams : imgBeams,
			sparks : imgSparks,
			misc : imgMisc,
			numbers : imgNumbers
		}, backContext);

		dialog.init(env, {
			panel : imgPanel,
			glow : imgGlow,
			misc : imgMisc,
			dialog : imgDialog
		}, {
			result0 : soundResult0,
			result1 : soundResult1,
			result2 : soundResult2,
		}, backContext);

		panel.init(env, {
			panel : imgPanel,
			bottons : imgBottons
		}, backContext);

		arm1.init(env, {
			arm1 : imgArm1
		}, backContext);

		arm2.init(env, {
			arm2 : imgArm2
		}, backContext);

		hud.init(env, {
			glow : imgGlow,
			misc : imgMisc,
			hud : imgHUD,
			title : imgTitle,
			dialog : imgDialog
		}, backContext);

		warp.init(env, {
			dot : imgDot,
			warpLine : imgWarpLine,
			halo : imgHalo
		}, backContext);

		tutorial.init(env, {
		}, backContext);
	}


///////////////////////////////////////////////////////////////////////////////
//
// Audio utilities
//
///////////////////////////////////////////////////////////////////////////////

	function audioLoaderSetup() {
		var audioType;

		soundResult0 = document.createElement("audio");
		document.body.appendChild(soundResult0);
		audioType = audioSupportedFormat(soundResult0);
		soundResult0.setAttribute("src", path + "sound/Result0" + audioType);
		soundResult0.addEventListener("canplaythrough", eventItemLoaded, false);

		soundResult1 = document.createElement("audio");
		document.body.appendChild(soundResult1);
		soundResult1.setAttribute("src", path + "sound/Result1" + audioType);
		soundResult1.addEventListener("canplaythrough", eventItemLoaded, false);

		soundResult2 = document.createElement("audio");
		document.body.appendChild(soundResult2);
		soundResult2.setAttribute("src", path + "sound/Result2" + audioType);
		soundResult2.addEventListener("canplaythrough", eventItemLoaded, false);
	}

	function audioLoadComplete() {
		soundResult0.removeEventListener("canplaythrough", eventItemLoaded, false);
		soundResult1.removeEventListener("canplaythrough", eventItemLoaded, false);
		soundResult2.removeEventListener("canplaythrough", eventItemLoaded, false);
	}

	function audioSupportedFormat(audio) {
		var returnExtension = "";
		if (audio.canPlayType("audio/ogg") =="probably" || audio.canPlayType("audio/ogg") == "maybe") {
			returnExtension = ".ogg";
		} else if(audio.canPlayType("audio/mp3") == "probably" || audio.canPlayType("audio/mp3") == "maybe") {	
			returnExtension = ".mp3";
		}
		return returnExtension;
	}

///////////////////////////////////////////////////////////////////////////////
//
// General utilities
//
///////////////////////////////////////////////////////////////////////////////

	function flip() {
		context.drawImage(backCanvas, 0, 0);
	}

///////////////////////////////////////////////////////////////////////////////
//
// Public Access
//
///////////////////////////////////////////////////////////////////////////////

	function startMessageLoop() {
		const FPS = 30;
		var intervalTime = 1000 / FPS;
		setInterval(timerTick, intervalTime);
	}

	return {
		startMessageLoop : startMessageLoop
	};
})();

function canvasSupport() {
	return !!document.createElement('testcanvas').getContext;
}

function eventWindowLoaded() {
	coloringProblem.startMessageLoop();
}
window.addEventListener('load', eventWindowLoaded, false);

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

var arm1 = (function() {
	// Environmental variables
	var backContext;
	var imgArm1;
	var env;

	// Robotic arm movement variables
	var lowerArmX, lowerArmY;
	var upperArmX, upperArmY;
	var tipX, tipY;
	var laserX, laserY;
	var r1, r2, r3;

	// Target variables
	const maxSpeed = 15;
	var targetX, targetY;
	var curX, curY;
	var moving;

	// Sliding movement variables
	var shiftX;
	var slideSpeed, slideAccel;
	var slideCurrentPos, slideTargetPos;
	var slideT, maxSlideT;

///////////////////////////////////////////////////////////////////////////////
//
// Arm1 movements
//
///////////////////////////////////////////////////////////////////////////////

	function init(_env, _img, _backContext) {
		env = _env;
		imgArm1 = _img.arm1;
		backContext = _backContext;

		reset();
	}

	function reset() {
		shiftX = -220;
		curX = env.screenWidth/2 + shiftX;
		curY = env.screenHeight/2;
		targetX = curX;
		targetY = curY;
		moving = 0;
		slideT = -1;
		slideCurrentPos = 0;
		slideTargetPos = 0;
		solveAngles(curX, curY);
	}

	function resetSliding(targetPos) {
		if(targetPos > 2 || targetPos < 0 || targetPos == slideCurrentPos) {
			return;
		}

		slideTargetPos = targetPos;
		var diff = slideTargetPos - slideCurrentPos;
		if(diff > 0) {
			slideAccel = 0.2;
		} else {
			slideAccel = -0.2;
			diff = (-1)*diff;
		}

		if(diff == 2) {
			slideT = 69;
		} else {
			switch(slideCurrentPos) {
			case 0:
				slideT = 39;
				break;
			case 1:
				if(slideAccel < 0) {
					slideT = 39;
				} else {
					slideT = 49;
				}
				break;
			case 2:
				slideT = 49;
				break;
			}
		}

		slideSpeed = 0;
		maxSlideT = slideT;
	}

	function push() {
		if(slideT >= 0) {
			if(slideT > maxSlideT - 20) {
				slideSpeed = slideSpeed + slideAccel;
			} else if(slideT < 20) {
				slideSpeed = slideSpeed - slideAccel;
			}
			shiftX += slideSpeed;
			targetX = env.screenWidth/2 + shiftX;
			targetY = env.screenHeight/2;
			slideT--;

			if(slideT < 0) {
				slideCurrentPos = slideTargetPos;
			}
		}
			
		if(curX == targetX && curY == targetY) {
			moving = 0;
		} else {
			var l = Math.sqrt((targetX-curX)*(targetX-curX) + (targetY-curY)*(targetY-curY));
			if(l <= maxSpeed) {
				curX = targetX;
				curY = targetY;
			} else {
				var r = angle(curX, curY, targetX, targetY);
				curX = curX + Math.cos(r)*maxSpeed;
				curY = curY + Math.sin(r)*maxSpeed;
			}
			moving = 1;
			solveAngles(curX, curY);
		}
	}

	function solveAngles(x, y) {
		// Cacluate laser head position
		lowerArmX = 125 + shiftX;
		lowerArmY = 392;
		var l = Math.sqrt((x-lowerArmX)*(x-lowerArmX) + (y-lowerArmY)*(y-lowerArmY));
		laserX = lowerArmX + (x - lowerArmX)*0.3;
		laserY = lowerArmY + (y - lowerArmY)*0.3 - (env.screenHeight - l)*0.2;
		r3 = angle(laserX, laserY, x, y);
		
		// Caculate tip angle
		tipX = laserX - Math.cos(-1.02-r3)*57;
		tipY = laserY + Math.sin(-1.02-r3)*57;
		var r0 = angle(lowerArmX, lowerArmY, tipX, tipY);

		// Solve lower arm angle by cosine rules
		var a = 125, b = Math.sqrt((tipX-lowerArmX)*(tipX-lowerArmX)+(tipY-lowerArmY)*(tipY-lowerArmY)), c = 121;
		r1 = r0 - Math.acos((a*a + b*b - c*c) / (2*a*b));
		
		// Caculate upper arm angle
		upperArmX = lowerArmX + Math.cos(r1) * a;
		upperArmY = lowerArmY + Math.sin(r1) * a;
		r2 = angle(upperArmX, upperArmY, tipX, tipY);
	}

	function draw() {
		// Draw bottom rare
		backContext.drawImage(imgArm1, 165, 71, 35, 15, 115+shiftX, 398, 35, 15);

		// Draw lower arm
		backContext.save();
		backContext.setTransform(1, 0, 0, 1, 0, 0);
		backContext.translate(lowerArmX, lowerArmY);
		backContext.rotate(r1 + Math.PI + 0.12);
		backContext.drawImage(imgArm1, 0, 66, 150, 54, -132, -26, 150, 54);
		backContext.restore();

		// Draw tip
		backContext.save();
		backContext.setTransform(1, 0, 0, 1, 0, 0);
		backContext.translate(tipX, tipY);
		backContext.rotate(r3);
		backContext.drawImage(imgArm1, 159, 0, 51, 55, -20, 0, 51, 55);
		backContext.restore();

		// Draw upper arm
		backContext.save();
		backContext.setTransform(1, 0, 0, 1, 0, 0);
		backContext.translate(upperArmX, upperArmY);
		backContext.rotate(r2 - 0.22);
		backContext.drawImage(imgArm1, 0, 0, 158, 65, -25, -25, 158, 65);
		backContext.restore();
		
		// Draw bottom front
		backContext.drawImage(imgArm1, 0, 121, 171, 110, 0+shiftX, 370, 171, 110);
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
// Setup public access
//
///////////////////////////////////////////////////////////////////////////////

	function setTarget(x, y) {
		targetX = x;
		targetY = y;
	}

	function getLaserHead() {
		return [laserX, laserY];
	}

	function isMoving() {
		return moving;
	}

	function isSliding() {
		if(slideT < 0) {
			return 0;
		} else {
			return 1;
		}
	}

	return {
		init : init,
		reset : reset,
		resetSliding : resetSliding,
		push : push,
		draw : draw,
		setTarget : setTarget,
		getLaserHead : getLaserHead,
		isMoving : isMoving,
		isSliding : isSliding
	};
})();

///////////////////////////////////////////////////////////////////////////////

var arm2 = (function() {
	// General variables
	var backContext;
	var imgArm2;
	var env;
	
	// Robotic arm movement variables
	var lowerArmX, lowerArmY;
	var upperArmX, upperArmY;
	var tipX, tipY;
	var laserX, laserY;
	var r1, r2, r3;

	// Target variables
	const maxSpeed = 15;
	var targetX, targetY;
	var curX, curY;
	var moving;

	// Sliding movement variables
	var shiftX;
	var slideSpeed, slideAccel;
	var slideCurrentPos, slideTargetPos;
	var slideT, maxSlideT;
	
///////////////////////////////////////////////////////////////////////////////
//
// Arm2 movements
//
///////////////////////////////////////////////////////////////////////////////

	function init(_env, _img, _backContext) {
		env = _env;
		imgArm2 = _img.arm2;
		backContext = _backContext;
		
		reset();
	}

	function reset() {
		shiftX = 260;
		curX = env.screenWidth/2 + shiftX;
		curY = env.screenHeight/2;
		targetX = curX;
		targetY = curY;
		moving = 0;
		slideT = -1;
		slideCurrentPos = 0;
		slideTargetPos = 0;
		solveAngles(curX, curY);
	}

	function resetSliding(targetPos) {
		if(targetPos > 2 || targetPos < 0 || targetPos == slideCurrentPos) {
			return;
		}

		slideTargetPos = targetPos;
		var diff = slideTargetPos - slideCurrentPos;
		if(diff > 0) {
			slideAccel = -0.2;
		} else {
			slideAccel = +0.2;
			diff = (-1)*diff;
		}

		if(diff == 2) {
			slideT = 79;
		} else {
			switch(slideCurrentPos) {
			case 0:
				slideT = 59;
				break;
			case 1:
				if(slideAccel > 0) {
					slideT = 59;
				} else {
					slideT = 39;
				}
				break;
			case 2:
				slideT = 39;
				break;
			}
		}

		slideSpeed = 0;
		maxSlideT = slideT;
	}

	function push() {
		if(slideT >= 0) {
			if(slideT > maxSlideT - 20) {
				slideSpeed = slideSpeed + slideAccel;
			} else if(slideT < 20) {
				slideSpeed = slideSpeed - slideAccel;
			}
			shiftX += slideSpeed;
			targetX = env.screenWidth/2 + shiftX;
			targetY = env.screenHeight/2;
			slideT--;

			if(slideT < 0) {
				slideCurrentPos = slideTargetPos;
			}
		}

		if(curX == targetX && curY == targetY) {
			moving = 0;
			return;
		} else {
			var l = Math.sqrt((targetX-curX)*(targetX-curX) + (targetY-curY)*(targetY-curY));
				if(l <= maxSpeed) {
				curX = targetX;
				curY = targetY;
			} else {
				var r = angle(curX, curY, targetX, targetY);
				curX = curX + Math.cos(r)*maxSpeed;
				curY = curY + Math.sin(r)*maxSpeed;
			}
			moving = 1;
			solveAngles(curX, curY);
		}
	}

	function solveAngles(x, y) {
		// Caculate lower arm angle
		lowerArmX = 696 + shiftX;
		lowerArmY = 383;
		var maxLength = Math.sqrt(env.screenWidth*env.screenWidth+env.screenHeight*env.screenHeight);
		var l = Math.sqrt((x-lowerArmX)*(x-lowerArmX) + (y-lowerArmY)*(y-lowerArmY));
		var offset = (1 - l / maxLength) * 0.5 * Math.PI;
		var r0 = angle(lowerArmX, lowerArmY, x, y);
		r1 = r0 + offset;

		// Caculate upper arm angle
		upperArmX = lowerArmX + Math.cos(r1 + 0.36)*117;
		upperArmY = lowerArmY + Math.sin(r1 + 0.36)*117;
		r2 = r0 - offset + Math.PI + (1 - l / maxLength);

		// Caculate tip angle
		tipX = upperArmX + Math.cos(r2 + 3.13)*146;
		tipY = upperArmY + Math.sin(r2 + 3.13)*146;
		r3 = angle(tipX, tipY, x, y) + Math.PI;
		
		// Cacluate laser head position
		laserX = tipX + Math.cos(r3+3.15)*23;
		laserY = tipY + Math.sin(r3+3.15)*23;
	}

	function draw() {
		// Draw bottom
		backContext.drawImage(imgArm2, 0, 130, 158, 125, env.screenWidth-158+shiftX, env.screenHeight-125, 158, 125);

		// Draw tip
		backContext.save();
		backContext.setTransform(1, 0, 0, 1, 0, 0);
		backContext.translate(tipX, tipY);
		backContext.rotate(r3);
		backContext.drawImage(imgArm2, 152, 95, 40, 40, -25, -17, 40, 40);
		backContext.restore();

		// Draw upper arm
		backContext.save();
		backContext.setTransform(1, 0, 0, 1, 0, 0);
		backContext.translate(upperArmX, upperArmY);
		backContext.rotate(r2);
		backContext.drawImage(imgArm2, 0, 0, 196, 50, -160, -20, 196, 50);
		backContext.restore();

		// Draw lower arm
		backContext.save();
		backContext.setTransform(1, 0, 0, 1, 0, 0);
		backContext.translate(lowerArmX, lowerArmY);
		backContext.rotate(r1);
		backContext.drawImage(imgArm2, 0, 50, 150, 83, -23, -22, 150, 83);
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
// Setup public access
//
///////////////////////////////////////////////////////////////////////////////

	function setTarget(x, y) {
		targetX = x;
		targetY = y;
	}

	function getLaserHead() {
		return [laserX, laserY];
	}

	function isMoving() {
		return moving;
	}

	function isSliding() {
		if(slideT < 0) {
			return 0;
		} else {
			return 1;
		}
	}

	return {
		init : init,
		reset : reset,
		resetSliding : resetSliding,
		push : push,
		draw : draw,
		setTarget : setTarget,
		getLaserHead : getLaserHead,
		isMoving : isMoving,
		isSliding : isSliding
	};
})();

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

