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

