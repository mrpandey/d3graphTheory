let initialState = [3, 3, 1];
let goalState = [0, 0, 0];
let state = [];
let killedState = [];
let iterator = true;
// create an object for individual state
class CreateState { 
  constructor() {
    this.value;
    this.parent;
    this.visited;
    this.x;
    this.y;
  }
}
// Creating a root node.
var  rootNode = new CreateState();
rootNode.value = initialState;
rootNode.parent = initialState;
rootNode.visited = false;

function setup() {
  frameRate(3);
  createCanvas(windowWidth, windowHeight);
  background(0, 0, 74);
  // LEGEND START
  strokeWeight(1);
  stroke(255);
  noFill();
  rect(50, 50, 200, 110);
  fill(255);
  noStroke();
  textSize(12);
  text('Legend', 60, 70);
  fill(0, 255, 0);
  noStroke();
  rect(60, 100, 10, 10);
  fill(255);
  textSize(11);
  text('Visited State leading to goal state.', 75, 108);
  fill(255, 0, 0);
  noStroke();
  rect(60, 120, 10, 10);
  fill(255);
  textSize(11);
  text('Killed State.', 75, 129);
  fill(231, 149, 7);
  noStroke();
  rect(60, 140, 10, 10);
  fill(255);
  textSize(11);
  text('Unvisited state.', 75, 150);  
  // LEGEND END
  fill(255);  
  text('STATE SPACE TREE FOR CLASSICAL MISSIONARIES AND CANNIBALS GAME.', windowWidth /2  - 200, 30);   
  textSize(18);
  fill(255, 165, 0);
  noStroke();
  text('3, 3, 1', windowWidth / 2 - 10, 70);
  // set x and y position of the root node.
  rootNode.x = windowWidth / 2;
  rootNode.y = 70;
  state.push(rootNode);
  while(iterator) {
    applyOperation(state[state.length - 1])
  }
  console.log("State:");
  console.log(state);
  console.log("Killed State:");
  console.log(killedState);
  // displayState();
}
var i = 0;
function draw() {
  textSize(13);
  displayState();
  i++;
  if(i >= state.length) {
    noLoop();
  }

}
function applyOperation(tempState) {
    if(tempState.visited === true) {
      killedState.push(state[state.length - 1]);
      state.splice(state.length - 1, 1);
    }else {
    tempState.visited = true;
    boatPosition = tempState.value[2];
    // If Boat is at the left bank
    if(boatPosition === 1) {   
      // console.log("boat is going from Left to Right"); 
      
      // 2 Missionaries
      if(tempState.value[0] >= 2) {
        addState(tempState, [tempState.value[0] - 2, tempState.value[1] - 0, 0]);
      }       
      // 1 Missionary
      if(tempState.value[0] >= 1) {
        addState(tempState, [tempState.value[0] - 1, tempState.value[1] - 0, 0]);
      }  
      // 2 Cannibals
      if(tempState.value[1] >= 2) {
        addState(tempState, [tempState.value[0] - 0, tempState.value[1] - 2, 0]);
      }                      
      // 1 Missionary and 1 Cannibal
      if(tempState.value[0] >= 1 && tempState.value[1] >= 1) {
        addState(tempState, [tempState.value[0] - 1, tempState.value[1] - 1, 0]);
      }
      // 1 Cannibal
      if(tempState.value[1] >= 1) {
        addState(tempState, [tempState.value[0] - 0, tempState.value[1] - 1, 0]);
      }          
    } else if(boatPosition === 0) {
      // If Boat is at the right bank.
      // 1 Missionary and 1 Cannibal
      if(initialState[0] - tempState.value[0] > 0) {
        addState(tempState, [tempState.value[0] + 1, tempState.value[1] + 0, 1]);
      }
      // 1 Cannibal
      if(initialState[1] - tempState.value[1] > 0) {
        addState(tempState, [tempState.value[0] + 0, tempState.value[1] + 1, 1]);
      }
      // 2 Missionary
      if(initialState[0] - tempState.value[0] > 2) {
        addState(tempState, [tempState.value[0] + 2, tempState.value[1] + 0, 1]);
      }
      // 2 Cannibals
      if(initialState[1] - tempState.value[1] > 2) {
        addState(tempState, [tempState.value[0] + 0, tempState.value[1] + 2, 1]);
      }
      // 1 Missionary and 1 Cannibal
      if((initialState[0] - tempState.value[0] > 0) && (initialState[1] - tempState.value[1] > 0)) {
        addState(tempState, [tempState.value[0] + 1, tempState.value[1] + 1, 1]);
      }      
    }
  }
}

function addState(parent, value) {
  var temp = new CreateState();
  temp.value = value;
  temp.parent = parent.value;
  temp.visited = false;
  if(goalState[0] === value[0] && goalState[1] === value[1]) {
    state.push(temp);
    iterator = false;
  }else if((temp.value[0] === 0) || temp.value[0] >= temp.value[1]) {
    if((3 - temp.value[0] === 0) || (3 - temp.value[0] >= 3 - temp.value[1])){
      if(repetitionChecker(value)) {
        killedState.push(temp);
      } else {
        state.push(temp);
      }
    }else {
      killedState.push(temp);
    }
  }else if(temp.value[0] < temp.value[1]) {
    killedState.push(temp); 
  }
}
// Function to check whether a state already exists or not in the array
function repetitionChecker(value) {
  for(let i = 0; i < state.length; i++) {
    if(state[i].value[0] === value[0] && state[i].value[1] === value[1] && state[i].value[2] === value[2]) {
      return true;
    }
  }
  return false;
}

//function used to show the state space tree.
function displayState() {
    let tempArray = [];
    for(j = i + 1; j < state.length; j++) {
      if(state[j].parent[0] === state[i].value[0] && state[j].parent[1] === state[i].value[1] && state[j].parent[2] === state[i].value[2] ) {
        if(!tempChecker(state[j].value, tempArray)) {
          var tempValue = {
            value: state[j].value,
            parent: state[i].value
          }
          tempArray.push(tempValue);
        }
      }
    }
    for(k = 0; k < killedState.length; k++) {
      if(killedState[k].parent[0] === state[i].value[0] && killedState[k].parent[1] === state[i].value[1] && killedState[k].parent[2] === state[i].value[2] ) {
        // console.log(killedStsate[k].value);
        if(!tempChecker(killedState[k].value, tempArray)) {
          var tempValue = {
            value: killedState[k].value,
            parent: state[i].value
          }        
          tempArray.push(tempValue);
        }
      } 
    }    
    if(tempArray.length === 1) {
      for(let w = 0; w < state.length; w++) {
        if(state[w].value[0] === tempArray[0].value[0] && state[w].value[1] === tempArray[0].value[1] && state[w].value[2] === tempArray[0].value[2] && state[w].parent[0] === tempArray[0].parent[0] && state[w].parent[1] === tempArray[0].parent[1] && state[w].parent[2] === tempArray[0].parent[2]) {
          if(state[w].visited) {
            fill(0, 255, 0);            
          }
        }
      }
      stroke(255, 255, 255, 120);
      line(state[i].x + 15, state[i].y, state[i].x + 15, state[i].y + 20);
      noStroke();
    
      text(tempArray[0].value, state[i].x, state[i].y + 40);
      fill(255, 0, 0);
      for(let b = 0; b < state.length; b++) {
        if(state[b].value[0] === tempArray[0].value[0] && state[b].value[1] === tempArray[0].value[1] && state[b].value[2] === tempArray[0].value[2]) {
          state[b].x =  state[i].x;
          state[b].y = state[i].y + 50;
        }
      }       
    }else if(tempArray.length !== 0 && tempArray.length % 2 === 0) {
      for(p = 0; p < tempArray.length; p++) {
        for(let q = 0; q < state.length; q++) {
          if(state[q].value[0] === tempArray[p].value[0] && state[q].value[1] === tempArray[p].value[1] && state[q].value[2] === tempArray[p].value[2] && state[q].parent[0] === tempArray[p].parent[0] && state[q].parent[1] === tempArray[p].parent[1] && state[q].parent[2] === tempArray[p].parent[2]) {
            
            if(state[q].visited === true) {
              fill(0, 255, 0);
            }else { 
              fill(255, 165, 0);
            }  
          }
        }
        stroke(255, 255, 255, 120);
        line(state[i].x + 15, state[i].y, state[i].x - (25 * (tempArray.length - 1)) + p * 50 + 15, state[i].y + 20);
        noStroke();
        text(tempArray[p].value,(state[i].x - (25 * (tempArray.length - 1))) + p * 50, state[i].y + 40);
        fill(255, 0, 0);
  
        for(let b = 0; b < state.length; b++) {
          if(state[b].value[0] === tempArray[p].value[0] && state[b].value[1] === tempArray[p].value[1] && state[b].value[2] === tempArray[p].value[2]) {
            state[b].x = state[i].x - (25 * (tempArray.length - 1)) + p * 50, state[i].y + 40;
            state[b].y = state[i].y + 50;
          }
        }        
      }
    }else{
      for(l = 0; l < tempArray.length; l++){  
        for(let q = 0; q < state.length; q++) {
          if(state[q].value[0] === tempArray[l].value[0] && state[q].value[1] === tempArray[l].value[1] && state[q].value[2] === tempArray[l].value[2] && state[q].parent[0] === tempArray[l].parent[0] && state[q].parent[1] === tempArray[l].parent[1] && state[q].parent[2] === tempArray[l].parent[2]) {
            if(state[q].visited === true) {
              fill(0, 255, 0);        
            }else {
              fill(255, 225, 0);
            }  
          }
        }
        stroke(255, 255, 255, 120);
        line(state[i].x + 15, state[i].y + 5, ((state[i].x) - ((tempArray.length - 3) * 25) - 50) + l * 50 + 15, state[i].y + 20);
        noStroke();
        text(tempArray[l].value, ((state[i].x) - ((tempArray.length - 3) * 25) - 50) + l * 50, state[i].y + 40);
        fill(255, 0, 0);
        for(let b = 0; b < state.length; b++) {
          if(state[b].value[0] === tempArray[l].value[0] && state[b].value[1] === tempArray[l].value[1] && state[b].value[2] === tempArray[l].value[2]) {
            state[b].x =((state[i].x) - ((tempArray.length - 3) * 25) - 50) + l * 50, state[i].y + 40;
            state[b].y = state[i].y + 50;
          }
        }
      }
    }  
}
function tempChecker(value, goalArray) {
  for(let i = 0; i < goalArray.length; i++) {
    if(goalArray[0] === value[0] && goalArray[1] === value[1] && goalArray[2] === value[2]) {
      return true;
    }
  }
  return false;
}