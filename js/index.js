const maxItems = 100;
let testNum = 0;
let stepCount = 0;
let stepArr = []; // Stores State ID
let stateButtonFlag = false;
let transitionButtonFlag = false;
let runButtonFlag = false;
let transitionLinked = 0;
let transitionCoord = [];
let startStateFlag = false;
let inputString = "";
let outputString = "";
let inputElement = document.getElementById("input");
let outputElement = document.getElementById("output");
let canvasElement = document.getElementById("canvas");

function State(i) {
    this.name = i;
    this.id = "none";
    this.startState = false;
    this.finalState = false;
    this.x = 0;
    this.y = 0;
    this.enabled = false;
}

function Transition(i) {
    this.name = i;
    this.id = "none";
    this.startState = "none";
    this.endState = "none";
    this.input = "";
    this.enabled = false;
}

function createStateList(n) {
    let arr = [];
    for (let i = 0; i < n; i++) {
        arr.push(new State(i));
        arr[i].id = `state${i}`;
    }
    return arr;
}

function createTransitionList(n) {
    let arr = [];
    for (let i = 0; i < n; i++) {
        arr.push(new Transition(i));
        arr[i].id = `transition${i}`;
    }
    return arr;
}

let stateList = createStateList(maxItems);
let transitionList = createTransitionList(maxItems);

document.addEventListener('keydown', inputKey);

function inputKey(e) {
    if (runButtonFlag == true) {
        if (e.key == "a" || e.key == "b" || e.key == "c" || e.key == "d") {
            inputString += e.key;
            transitionStep(e.key);
        }
        else if (e.key == "Backspace") {
            inputString = inputString.slice(0, -1);
            transitionBackward();
        }
        inputElement.textContent = inputString;
    }
}

function transitionStep(key) {
    stepCount++;
    if (stepArr[stepCount - 1] != "none") {
        let previousState = document.getElementById(stepArr[stepCount - 1]);
        previousState.style.backgroundColor = "rgb(177, 177, 177)";
        for (let i = 0; i < maxItems; i++) {
            if (transitionList[i].startState == stepArr[stepCount - 1] && transitionList[i].input == key) {
                stepArr[stepCount] = transitionList[i].endState;
                let currentState = document.getElementById(stepArr[stepCount]);
                currentState.style.backgroundColor = "yellow";
            }
        }
    }
    if (!stepArr[stepCount]) {
        stepArr[stepCount] = "none";
    }
}

function transitionBackward() {
    if (stepArr[stepCount] != "none") {
        let previousState = document.getElementById(stepArr[stepCount]);
        previousState.style.backgroundColor = "rgb(177, 177, 177)";
    }
    if(--stepCount < 0){
            stepCount = 0;
    }
    if (stepArr[stepCount] != "none") {
        let currentState = document.getElementById(stepArr[stepCount]);
        currentState.style.backgroundColor = "yellow";
    }
}

canvasElement.addEventListener("click", createItem);

function createItem(e) {
    if (stateButtonFlag == true) {
        var pos = getMousePos(canvasElement, e);
        posx = pos.x;
        posy = pos.y;
        let newestState = availableItemSpot(stateList);
        newestState.id = `state${newestState.name}`;
        newestState.enabled = true;
        newestState.x = posx;
        newestState.y = posy;
        let circle = document.createElement("SPAN");
        circle.id = newestState.id;
        circle.classList.add("dot");
        circle.style.top = `${posy}px`;
        circle.style.left = `${posx}px`;
        circle.style.draggable = "true";
        //circle.innerHTML = newestState.id;
        if (startStateFlag == false) {
            newestState.startState = true;
            circle.style.border = "3px solid blue";
            //canvasElement.innerHTML += `<path  d="M 100,100 A 10 5 0 0 1 200,100" style="stroke:blue;stroke-width:3;position: absolute; fill:none;" />`;
            canvasElement.innerHTML += `<polygon points="${posx - 5},${posy - 90} ${posx - 20},${posy - 100} ${posx - 20},${posy - 80}" style="fill:blue;stroke-width:3;" />`
            startStateFlag = true;
        }
        document.body.appendChild(circle);

        circle.addEventListener("mousedown", e => {
            if (stateButtonFlag == true){
                var stateFinalizer = document.getElementById(e.target.id);
                stateFinalizer.style.border = "3px solid green";
            }
            if (transitionButtonFlag == true) {
                if (transitionLinked == 0) {
                    let newestTransition = availableItemSpot(transitionList);
                    newestTransition.id = `transition${newestTransition.name}`;
                    newestTransition.startState = e.target.id;
                    transitionLinked = 1;
                }
                else if (transitionLinked == 1) {
                    let newestTransition = availableItemSpot(transitionList);
                    newestTransition.endState = e.target.id;
                    var inputPrompt = prompt("Please enter an input a,b,c, or d");
                    if (inputPrompt) {
                        newestTransition.input = inputPrompt;
                        newestTransition.enabled = true;
                        //All below this is drawing code
                        let startTransition = findById(stateList, newestTransition.startState);
                        let endTransition = findById(stateList, newestTransition.endState);
                        if (newestTransition.startState == newestTransition.endState) {
                            canvasElement.innerHTML += `<circle id="${newestTransition.id}" cx="${startTransition.x + 25}" cy="${startTransition.y - 125}" r="25" stroke="black" stroke-width="2" style="fill:none"; />`
                            canvasElement.innerHTML += `<polygon points="${endTransition.x},${endTransition.y - 110} ${endTransition.x - 10},${endTransition.y - 125} ${endTransition.x + 10},${endTransition.y - 125}" style="fill:black"; />`
                            var checkText = document.getElementById(newestTransition.startState + newestTransition.endState);
                            if (checkText) {
                                checkText.innerHTML += `,${newestTransition.input}`;
                            }
                            else {
                                let text = document.createElement("SPAN");
                                text.id = newestTransition.startState + newestTransition.endState;
                                text.classList.add("text");
                                text.style.top = `${endTransition.y - 50}px`;
                                text.style.left = `${endTransition.x + 30}px`;
                                text.innerHTML = newestTransition.input;
                                document.body.appendChild(text);
                            }
                        }
                        else {
                            canvasElement.innerHTML += `<polyline id="${newestTransition.id}" points="${startTransition.x + 50},${startTransition.y - 90} ${endTransition.x},${endTransition.y - 90}" style="stroke:black;stroke-width:2;position: absolute;" />`;
                            canvasElement.innerHTML += `<polygon points="${endTransition.x - 20},${endTransition.y - 80} ${endTransition.x - 20},${endTransition.y - 100} ${endTransition.x - 5},${endTransition.y - 90}" style="fill:black"; />`
                            var checkText = document.getElementById(newestTransition.startState + newestTransition.endState);
                            if (checkText) {
                                checkText.innerHTML += `,${newestTransition.input}`;
                            }
                            else {
                                let text = document.createElement("SPAN");
                                text.id = newestTransition.startState + newestTransition.endState;
                                text.classList.add("text");
                                text.style.top = `${(endTransition.y - startTransition.y) / 2 + startTransition.y}px`;
                                text.style.left = `${(endTransition.x - startTransition.x) / 2 + startTransition.x}px`;
                                text.innerHTML = newestTransition.input;
                                document.body.appendChild(text);
                            }
                        }
                    }
                    transitionLinked = 0;
                }
            }
        });
        circle.addEventListener("contextmenu", e => {
            e.preventDefault();
            //TODO: Right click stuff
        });
    }
}

function getMousePos(canvas, e) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX,
        y: e.clientY
    };
}

function availableItemSpot(arr) {
    for (let i = 0; i < maxItems; i++) {
        if (arr[i].enabled == false) {
            return arr[i];
        }
    }
    console.log("Max limit reached")
}

function findById(arr, ids) {
    for (let i = 0; i < maxItems; i++) {
        if (arr[i].id == ids) {
            return arr[i];
        }
    }
    console.log("Max limit reached")
}

function pressStateButton(e) {
    stateButtonFlag = true;
    transitionButtonFlag = false;
    runButtonFlag = false;
    let statebtn = document.getElementById("statebtn");
    let transitionbtn = document.getElementById("transitionbtn");
    let runbtn = document.getElementById("runbtn");
    statebtn.style.border = "medium solid black";
    transitionbtn.style.border = "thin solid black";
    runbtn.style.border = "thin solid black";
    transitionLinked = 0;
}

function pressTransitionButton(e) {
    stateButtonFlag = false;
    transitionButtonFlag = true;
    runButtonFlag = false;
    let statebtn = document.getElementById("statebtn");
    let transitionbtn = document.getElementById("transitionbtn");
    let runbtn = document.getElementById("runbtn");
    statebtn.style.border = "thin solid black";
    transitionbtn.style.border = "medium solid black";
    runbtn.style.border = "thin solid black";
}

function pressRunButton(e) {
    stateButtonFlag = false;
    transitionButtonFlag = false;
    runButtonFlag = true;
    let statebtn = document.getElementById("statebtn");
    let transitionbtn = document.getElementById("transitionbtn");
    let runbtn = document.getElementById("runbtn");
    statebtn.style.border = "thin solid black";
    transitionbtn.style.border = "thin solid black";
    runbtn.style.border = "medium solid black";
    transitionLinked = 0;
    inputString = "";
    inputElement.textContent = "";
    stepArr = [];
    stepCount = 0;
    stepArr[0] = stateList[0].id; //Technically should use stepcount here
    let currentState = document.getElementById(stateList[0].id);
    currentState.style.backgroundColor = "yellow";
}

function pressInstructionButton(e) {
    let msg = "Instructions\r\n";
    msg += "Create State Button\r\n";
    msg += "     Click canvas - create new state\r\n";
    msg += "     Click state - turn it into final state\r\n";
    msg += "Create Transition Button\r\n";
    msg += "     Click state 1st time - Sets as starting node of transition\r\n";
    msg += "     Click state 2nd time - Sets as ending node of transition\r\n";
    msg += "Run Test Button\r\n";
    msg += "     Key a,b,c,d - Runs input on machine\r\n";
    msg += "     Key backspace - Removes input from machine";
    alert(msg);
}