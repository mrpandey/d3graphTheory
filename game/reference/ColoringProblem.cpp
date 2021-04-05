#include <stdio.h>
#include <time.h>
#include <set>
#include <vector>
using namespace std;

// The board
#define MAXCOL 20
#define MAXROW 15
char board[MAXCOL*MAXROW];
vector< set<int> > groups;
vector< set<int> > graph;

// Board setup sub-rutines
void setupBoard();
void emptyBoard(set<int> &emptyCells);

// Debug sub-rutines
void printBoard();
void printGroup();
void printGraph();

// Game play sub-rutines
void play();
void humanPlayer(set<int> &uncolored);
void aiPlayer(set<int> &uncolored);
void blackout(set<int> &uncolored);

// AI related utilities
bool defensivePick(vector<int> &candidates, int uncoloredCnt);
void offensivePick(vector<int> &candidates, set<int> &uncolored);
void randomPick(vector<int> &candidates);
int evalute(int groupColorID);

// Game related utilities
void paint(int groupID, char color);
int findGroup(int xy);
bool isColored(int groupID);
bool isBlack(int groupID);
bool isColorOK(int groupID, char color);

// Setup related utilities
int grouping(int xy);
bool isNeighbor(set<int> &group1, set<int> &group2);
bool isNeighbor(set<int> &group, int xy);
bool isNeighbor(int xy1, int xy2);
bool isEdge(int xy);

// General utilities
void shuffle(int* in, int count);
void swap(int &a, int &b);
void fillArray(set<int> &in, int* out);

int main(int argc, char *argv[])
{
	srand(time(NULL));

	setupBoard();
	printBoard();
	play();

	system("pause");
	return 0;
}

void setupBoard()
{
	const int removed=8;
	const int seed=15;

	set<int> emptyCells;
	set<int> dummyGroup;
	int setupSeq[MAXCOL*MAXROW];
	int i, j, tmp;
	
	// Step 1. Empty the board
	emptyBoard(emptyCells);
	for(i = 0; i < seed; i++) {
		groups.push_back(dummyGroup);
		graph.push_back(dummyGroup);
	}

	// Step 2. Remove some cells for randomize
	fillArray(emptyCells, setupSeq);
	shuffle(setupSeq, emptyCells.size());
	for(i = 0; i < removed; i++) {
		board[setupSeq[i]] = ' ';
		emptyCells.erase(setupSeq[i]);
	}

	// Step 3. Generate grouping seeds
	fillArray(emptyCells, setupSeq);
	shuffle(setupSeq, emptyCells.size());
	for(i = 0; i < seed; i++) {
		board[setupSeq[i]] = (char)i+'a';
		groups[i].insert(setupSeq[i]);
		emptyCells.erase(setupSeq[i]);
	}

	// Step 4. Grouping for cells that ungrouped
	while(emptyCells.size() > 0) {
		j = emptyCells.size();
		fillArray(emptyCells, setupSeq);
		shuffle(setupSeq, emptyCells.size());

		for(i = 0; i < j; i++) {
			tmp = grouping(setupSeq[i]);
			if(tmp >= 0) {
				board[setupSeq[i]] = (char)tmp+'a';
				groups[tmp].insert(setupSeq[i]);
				emptyCells.erase(setupSeq[i]);
			}
		}
	}

	// Step 5. Confirm the graph
	for(i = 0; i < seed-1; i++) {
		for(j = i+1; j < seed; j++) {
			if(isNeighbor(groups[i], groups[j])) {
				graph[i].insert(j);
				graph[j].insert(i);
			}
		}
	}

	return;
}

void emptyBoard(set<int> &emptyCells)
{
	int i;
	
	emptyCells.clear();
	for(i = 0; i < MAXCOL*MAXROW; i++) {
		if(isEdge(i)) {
			board[i] = ' ';
		} else {
			board[i] = '0';
			emptyCells.insert(i);
		}
	}

	return;
}

void printBoard()
{
	int i, j, curRow;

	for(i = 0; i < MAXROW; i++) {
		curRow = i * MAXCOL;
		if(i%2) {
			printf(" ");
		}

		for(j = 0; j < MAXCOL; j++) {
			printf("%c ", board[curRow+j]);
		}
		printf("\n");
	}

	return;
}

void printGroup()
{
	vector< set<int> >::iterator gpos;
	set<int>::iterator pos;
	for(gpos = groups.begin(); gpos != groups.end(); ++gpos) {
		for(pos = gpos->begin(); pos != gpos->end(); ++pos) {
			printf("%d ", *pos);
		}
		printf("\n");
	}

	return;
}

void printGraph()
{
	vector< set<int> >::iterator gpos;
	set<int>::iterator pos;
	for(gpos = graph.begin(); gpos != graph.end(); ++gpos) {
		for(pos = gpos->begin(); pos != gpos->end(); ++pos) {
			printf("%d ", *pos);
		}
		printf("\n");
	}

	return;
}

void play()
{
	const bool player1isHuman=true;
	const bool player2isHuman=false;

	set<int> uncolored;
	unsigned int i;

	// Initialize the variables
	for(i = 0; i < graph.size(); i++) {
		uncolored.insert(i);
	}
	printf("uncolored group = %d\n", uncolored.size());

	// Start the gaming loop	
	while(1) {
		// Player 1 movements
		if(uncolored.size() == 0) {
			printf("\n!!!Player 2 wins!!!\n");
			break;
		}
		printf("\n---Player 1---\n");
		if(player1isHuman) {
			humanPlayer(uncolored);
		} else {
			aiPlayer(uncolored);
		}
		blackout(uncolored);
		printBoard();
		printf("uncolored group = %d\n", uncolored.size());

		// Player 2 movements
		if(uncolored.size() == 0) {
			printf("\n!!!Player 1 wins!!!\n");
			break;
		}
		printf("\n---Player 2---\n");
		if(player2isHuman) {
			humanPlayer(uncolored);
		} else {
			aiPlayer(uncolored);
		}
		blackout(uncolored);
		printBoard();
		printf("uncolored group = %d\n", uncolored.size());
	}

	return;
}

void humanPlayer(set<int> &uncolored)
{
	int groupID;
	char target, color;
	bool success=false;

	// Handle player inputs
	while(!success) {
		// Get target cell#
		printf("Select a group : ");
		scanf(" %c", &target);
		groupID = target-'a';
		if(groupID < 0 || isColored(groupID)) {
			printf("!!!Invaild target!!!\n");
			continue;
		}

		// Get color
		printf("Paint color : ");
		scanf(" %c", &color);
		if(!isColorOK(groupID, color)) {
			printf("!!!Invaild color!!!\n");
			continue;
		}
		
		// Ready to paint, exit the loop
		success = true;
	}

	// Paint the board
	paint(groupID, color);
	uncolored.erase(groupID);

	return;
}

void aiPlayer(set<int> &uncolored)
{
	vector<int> candidates;
	int i, groupID;
	char color;
	bool res;

	// Setup candidates
	for(set<int>::iterator pos=uncolored.begin(); pos != uncolored.end(); ++pos) {
		for(i = 1; i <= 3; i++) {
			if(isColorOK(*pos, i+'0')) {
				candidates.push_back((*pos)*10+i);
			}
		}
	}

	// Pick the best one
	printf("### defensivePick() : starts with %d uncolored groups (%d candidates) ###\n", uncolored.size(), candidates.size());
	res = defensivePick(candidates, uncolored.size());
	printf("\n### offensivePick() : starts with %d uncolored groups (%d candidates) ###\n", uncolored.size(), candidates.size());
	offensivePick(candidates, uncolored);
	printf("%d candidates left\n", candidates.size());
	randomPick(candidates);

	// Paint the board
	groupID = candidates[0]/10;
	color = candidates[0]%10+'0';
	printf("AI selects group : %c\n", groupID+'a');
	printf("AI paints color : %c\n", color);
	paint(groupID, color);
	uncolored.erase(groupID);

	return;
}

void blackout(set<int> &uncolored)
{
	for(set<int>::iterator pos=uncolored.begin(); pos != uncolored.end(); ++pos) {
		if(isBlack(*pos)) {
			paint(*pos, '4');
			uncolored.erase(pos);
		}
	}

	return;
}

bool defensivePick(vector<int> &candidates, int uncoloredCnt)
{
	printf("(u%d, c%d, ", uncoloredCnt, candidates.size());
	vector<int> output;
	bool breakthrough=false;
	int score;

	for(unsigned int i=0; i < candidates.size(); i++) {
		score = evalute(candidates[i]);
		if(score > 0 && uncoloredCnt%2 == score%2) {
			output.push_back(candidates[i]);
		}
	}

	if(output.size() != 0) {
		candidates = output;
		if(uncoloredCnt%2 == 0) {
			breakthrough = true;
		}
	}

	printf("l%d, b%d)", candidates.size(), breakthrough);
	return breakthrough;
}

void offensivePick(vector<int> &candidates, set<int> &uncolored)
{
	char bkpBoard[MAXCOL*MAXROW];
	set<int> bkpUncolored=uncolored;
	set<int>::iterator pos;
	vector<int> newCandidates, scores, output;
	unsigned int i, j, min;
	int groupID;
	char color;
	bool breakthrough;
	
	// Backup the whole board
	for(i = 0; i < MAXCOL*MAXROW; i++) {
		bkpBoard[i] = board[i];
	}

	// Starts evaluation
	for(j = 0; j < candidates.size(); j++) {
		groupID = candidates[j]/10;
		color = candidates[j]%10+'0';
		printf("%c%c=", groupID+'a', color);

		// Paint the candidate
		paint(groupID, color);
		uncolored.erase(groupID);
		blackout(uncolored);
		
		// Setup up new candidates
		newCandidates.clear();
		for(pos = uncolored.begin(); pos != uncolored.end(); ++pos) {
			for(i = 1; i <= 3; i++) {
				if(isColorOK(*pos, i+'0')) {
					newCandidates.push_back((*pos)*10+i);
				}
			}
		}

		// Scoring
		breakthrough = defensivePick(newCandidates, uncolored.size());
		printf("\n");
		if(!breakthrough) {
			scores.push_back(-1);
		} else {
			scores.push_back(newCandidates.size());
		}
		
		// Restore the board
		for(i = 0; i < MAXCOL*MAXROW; i++) {
			board[i] = bkpBoard[i];
		}
		uncolored = bkpUncolored;
	}

	// Find the candidates with minimum score
	min = 0;
	output.push_back(candidates[0]);
	for(i = 1; i < scores.size(); i++) {
		if(scores[i] == scores[min]) {
			output.push_back(candidates[i]);
		} else if(scores[i] < scores[min]) {
			min = i;
			output.clear();
			output.push_back(candidates[i]);
		}
	}

	if(output.size() != 0) {
		candidates = output;
	}

	return;
}

void randomPick(vector<int> &candidates)
{
	if(candidates.size() <= 1) {
		return;
	}

	int tmp=candidates[rand()%candidates.size()];
	candidates.clear();
	candidates.push_back(tmp);

	return;
}

int evalute(int groupColorID)
{
	int groupID=groupColorID/10, blackoutCnt=0;
	char color=groupColorID%10+'0', tmp;

	if(isColored(groupID) || !isColorOK(groupID, color)) {
		return 0;
	}

	tmp = board[*groups[groupID].begin()];
	paint(groupID, color);
	for(set<int>::iterator pos=graph[groupID].begin(); pos != graph[groupID].end(); ++pos) {
		if(!isColored(*pos) && isBlack(*pos)) {
			blackoutCnt++;
		}
	}
	paint(groupID, tmp);

	return blackoutCnt+1;
}

void paint(int groupID, char color)
{
	for(set<int>::iterator pos=groups[groupID].begin(); pos != groups[groupID].end(); ++pos) {
		board[*pos] = color;
	}

	return;
}

int findGroup(int xy)
{
	unsigned int i;

	for(i = 0; i < groups.size(); i++) {
		if(groups[i].find(xy) != groups[i].end()) {
			return i;
		}
	}

	return -1;
}

bool isColored(int groupID)
{
	char tmp=board[*groups[groupID].begin()];
	
	if(tmp == '1' || tmp == '2' || tmp == '3' || tmp == '4') {
		return true;
	} else {
		return false;
	}
}

bool isBlack(int groupID)
{
	return !(isColorOK(groupID, '1') || isColorOK(groupID, '2') || isColorOK(groupID, '3'));
}

bool isColorOK(int groupID, char color)
{
	if(color < '1' || color > '3') {
		printf("!!!Not a color!!!\n");
		return false;
	}

	for(set<int>::iterator pos=graph[groupID].begin(); pos != graph[groupID].end(); ++pos) {
		if(board[*groups[*pos].begin()] == color) {
			return false;
		}
	}

	return true;
}

int grouping(int xy)
{
	vector<int> candidates;
	unsigned int i, min;
	
	for(i = 0; i < groups.size(); i++) {
		if(isNeighbor(groups[i], xy)) {
			candidates.push_back(i);
		}
	}

	if(candidates.size() < 1) {
		return -1;
	} else if(candidates.size() == 1) {
		return candidates[0];
	} else {
		min = 0;
		for(i = 1; i < candidates.size(); i++) {
			if(groups[i].size() < groups[min].size()) {
				min = i;
			}
		}
		return candidates[min];
	}
}

bool isNeighbor(set<int> &group1, set<int> &group2)
{
	for(set<int>::iterator pos=group2.begin(); pos != group2.end(); ++pos) {
		if(isNeighbor(group1, *pos)) {
			return true;
		}
	}

	return false;
}

bool isNeighbor(set<int> &group, int xy)
{
	for(set<int>::iterator pos=group.begin(); pos != group.end(); ++pos) {
		if(isNeighbor(*pos, xy)) {
			return true;
		}
	}

	return false;
}

bool isNeighbor(int xy1, int xy2)
{
	int row=xy1/MAXCOL;
	int odd;
	if(row % 2) {
		odd = 1;
	} else {
		odd = -1;
	}

	if(xy1+1 == xy2 || xy1-1 == xy2 
		|| xy1-MAXCOL == xy2 || xy1-MAXCOL+odd == xy2 
		|| xy1+MAXCOL == xy2 || xy1+MAXCOL+odd == xy2) {
		return true;
	} else {
		return false;
	}
}

bool isEdge(int xy)
{
	if(xy < MAXCOL || xy >= (MAXROW-1)*MAXCOL) {
		return true;
	}
	if(xy%MAXCOL == 0 || xy%MAXCOL == MAXCOL-1) {
		return true;
	}
	if((xy/MAXCOL)%2 == 1 && xy%MAXCOL == MAXCOL-2) {
		return true;
	}

	return false;
}

void shuffle(int* in, int count)
{
	for(int i=0; i < count*2; i++) {
		swap(in[rand()%count], in[rand()%count]);
	}

	return;
}

void swap(int &a, int &b)
{
	int tmp=a;
	a = b;
	b = tmp;

	return;
}

void fillArray(set<int> &in, int* out)
{
	int i=0;
	for(set<int>::iterator pos = in.begin(); pos != in.end(); ++pos) {
		out[i] = *pos;
		i++;
	}

	return;
}
