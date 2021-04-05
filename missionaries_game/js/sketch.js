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
  createCanvas(windowWidth, windowHeight - 100);
  // set x and y position of the root node.
  rootNode.x = windowWidth / 2;
  rootNode.y = 70;
  state.push(rootNode);
  while(iterator) {
    applyOperation(state[state.length - 1])
  }
  console.log("Estado:");
  console.log(state);
  console.log("Killed State:");
  console.log(killedState);
}
function draw() {
  background(0, 0, 74);
  // river water
  fill(0, 0, 190);
  quad(windowWidth / 2 - 190, 170, windowWidth / 2 + 190, 170, windowWidth / 2 + 220, windowHeight - 130, windowWidth / 2 -  220, windowHeight - 130);
  // moon
  fill(255);
  ellipse(100, 50, 50);
  fill(255, 255, 255, 220);
  ellipse(100, 50, 58);
  // left bank grass
  fill(0, 123, 0);
  quad(0, 150, windowWidth / 2 - 200, 150, windowWidth / 2 - 230, windowHeight - 120, 0, windowHeight - 120);
  // left bank mud
  fill(204, 153, 0);
  quad(windowWidth / 2 - 200, 150, windowWidth / 2 - 190, 170, windowWidth / 2 -  220, windowHeight - 130 , windowWidth / 2 - 230, windowHeight - 120);
  // right bank grass
  fill(0, 123, 0);
  quad(windowWidth / 2 + 200, 150, windowWidth , 150, windowWidth , windowHeight - 120 , windowWidth / 2 + 230, windowHeight - 120);
  // right bank mud
  fill(204, 153, 0);
  quad(windowWidth / 2 + 200, 150, windowWidth / 2 + 190, 170, windowWidth / 2 + 220, windowHeight - 130, windowWidth / 2 + 230, windowHeight - 120);
  fill(255, 0, 0);

  // set boat position
  let x;
  if(tracker[2] === 1) {
     x = windowWidth / 2 - 200;
  }else {
     x = windowWidth / 2 + 80;
  }
  // boat
  stroke(255);
  fill(102, 50, 2);
  beginShape();
    vertex(x + 20, 150);
    vertex(x + 40, 130);
    vertex(x + 90, 130);
    vertex(x + 110, 150);
    vertex(x + 90, 170);
    vertex(x + 40, 170);
  endShape();
  beginShape();
    vertex(x + 20, 150);
    vertex(x + 40, 170);
    vertex(x + 90, 170);
    vertex(x + 110, 150);
    vertex(x + 90, 190);
    vertex(x + 40, 190);
    vertex(x + 20, 150 )
  endShape();
  // MISSIONARIES
  for(let i = 0; i < tracker[0]; i++) {
    noStroke();
      // face
      fill(255, 210, 127);
      ellipse((windowWidth / 2 - 383) + i * 50, 150, 30, 50);
      // cap
      fill(255, 0, 0);
      ellipse((windowWidth / 2 - 383) + i * 50, 130, 20, 10);
      // left eye
      noFill();
      stroke(0);
      arc((windowWidth / 2 - 388) + i * 50, 145, 5, 5, 0, PI);
      // right eye
      arc((windowWidth / 2 - 376) + i * 50, 145, 5, 5, 0, PI);
      // mouth
      arc((windowWidth / 2 - 383) + i * 50, 160, 7, 5, 0, PI);
  }
  for(let i = 0; i < 3 - tracker[0]; i++) {
    noStroke();
    // face
    fill(255, 210, 127);
    ellipse((windowWidth / 2 + 280) + i * 50, 150, 30, 50);
    // cap
    fill(255, 0, 0);
    ellipse((windowWidth / 2 + 280) + i * 50, 130, 20, 10);
    // left eye
    noFill();
    stroke(0);
    arc((windowWidth / 2 + 275) + i * 50, 145, 5, 5, 0, PI);
    // right eye
    arc((windowWidth / 2 + 285) + i * 50, 145, 5, 5, 0, PI);
    // mouth
    arc((windowWidth / 2 + 280) + i * 50, 160, 7, 5, 0, PI);
  }
  for(let j = 0; j < tracker[1]; j++) {
    // CANNIBALS
    noStroke();
    // head
    fill(194, 121, 45);
    quad((windowWidth / 2 - 405) + j * 50, 210, (windowWidth / 2 - 365) + j * 50, 210, (windowWidth / 2 - 375) + j * 50, 250, (windowWidth / 2 - 395) + j  * 50, 250);
    stroke(5);
    strokeWeight(2);
    // spooky hair
    line((windowWidth / 2 - 405) + j  * 50, 200, (windowWidth / 2 - 400) + j * 50, 210);
    line((windowWidth / 2 - 385) + j  * 50, 200, (windowWidth / 2 - 385) + j * 50, 210);
    line((windowWidth / 2 - 365) + j  * 50, 200, (windowWidth / 2 - 370) + j * 50, 210);
    fill(255, 0, 0);
    strokeWeight(1);
    // left eye
    quad((windowWidth / 2 - 395) + j * 50, 215, (windowWidth / 2 - 387) + j * 50, 225, (windowWidth / 2 - 395) + j * 50, 225);
    // right eye
    quad((windowWidth / 2 - 375) + j * 50, 215, (windowWidth / 2 - 383) + j * 50, 225, (windowWidth / 2 - 375) + j * 50, 225);
    // left mouth line
    line((windowWidth / 2 - 390) + j * 50, 240, (windowWidth / 2 - 385) + j * 50, 235);
    // right mouth line
    line((windowWidth / 2 - 380) + j * 50 , 240, (windowWidth / 2 - 385) + j * 50, 235);
  }
  j = 0;
  for(let j = 0; j < 3 - tracker[1]; j++) {
    // CANNIBALS
    noStroke();
    // head
    fill(194, 121, 45);
    quad((windowWidth / 2 + 265) + j * 50, 210, (windowWidth / 2 + 306) + j * 50, 210, (windowWidth / 2 + 298) + j * 50, 250, (windowWidth / 2 + 275) + j * 50, 250);
    stroke(5);
    strokeWeight(2);
    // spooky hair
    line((windowWidth / 2 + 265) + j * 50, 200, (windowWidth / 2 + 270)  + j * 50, 210);
    line((windowWidth / 2 + 285)  + j * 50, 200, (windowWidth / 2 + 285)  + j * 50, 210);
    line((windowWidth / 2 + 305)  + j * 50, 200, (windowWidth / 2 + 300)  + j * 50, 210);
    fill(255, 0, 0);
    strokeWeight(1);
    // left eye
    quad((windowWidth / 2 + 275)  + j * 50, 215, (windowWidth / 2 + 283)  + j * 50, 225, (windowWidth / 2 + 275)  + j * 50, 225);
    // right eye
    quad((windowWidth / 2 + 295)  + j * 50, 215, (windowWidth / 2 + 287)  + j * 50, 225, (windowWidth / 2 + 295)  + j * 50, 225);
    // left mouth line
    line((windowWidth / 2 + 280)  + j * 50, 240, (windowWidth / 2 + 285)  + j * 50, 235);
    // right mouth line
    line((windowWidth / 2 + 290)  + j * 50 , 240, (windowWidth / 2 + 285)  + j * 50, 235);
  }
  fill(255);
  // text('Watch the console for more messages', windowWidth /2  - 100, 50);
}
// Generate new states from parent state.
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
// Function to check and add/delete the newly generated states.
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
