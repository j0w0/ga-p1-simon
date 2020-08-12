/*
https://git.generalassemb.ly/SEI-CC/SEI-CC-9/blob/master/projects/project-1/project-1-requirements.md
*/

/*----- constants -----*/
const BUTTONS = [
    { offColor: 'rgb(0 128 0 / .125)', onColor: '#008000' }, // green
    { offColor: 'rgb(255 0 0 / .125)', onColor: '#ff0000' }, // red
    { offColor: 'rgb(0 0 255 / .125)', onColor: '#0000ff' }, // blue
    { offColor: 'rgb(255 255 0 / .125)', onColor: '#ffff00' } // yellow
];


/*----- app's state (variables) -----*/
let currentLevel, simonSeq, playerSeq, inPlay, playersTurn, gameOver;


/*----- cached element references -----*/
const msgEl = document.querySelector('p');
const btnLightFills = document.querySelectorAll('#btn-lights-inner .btn-fill');
const btnLights = document.getElementById('btn-lights-inner');
const levelEl = document.getElementById('level');
const btnPlayEl = document.getElementById('btn-play');


/*----- event listeners -----*/
btnPlayEl.addEventListener('click', startGame);
btnLights.addEventListener('click', lightClick);
btnLights.addEventListener('mousedown', turnLightOn);
btnLights.addEventListener('mouseup', turnLightOff);


/*----- functions -----*/
init();

function init(startGame = false) {

    currentLevel = 1;
    simonSeq = [];
    playerSeq = [];
    inPlay = startGame;
    playersTurn = false;
    gameOver = null;

    render();
}

function render() {

    let levelNumber = currentLevel >= 1 && currentLevel <= 9 ? "0" + currentLevel : currentLevel;
    levelEl.innerText = `level ${levelNumber}`;

    msgEl.innerText = getMessage();
    
    btnLightFills.forEach((btn,idx) => {
        btn.style.fill = BUTTONS[idx].offColor;
    });

    if(inPlay && !playersTurn) {
        simonSequence();
    }

    btnPlayEl.innerText = gameOver ? `replay` : `play`;
    btnPlayEl.style.display = inPlay ? 'none' : 'inline';
}

function simonSequence() {

    // add random number/index to simon sequence array
    const random = Math.floor(Math.random() * BUTTONS.length);
    simonSeq.push(random);

    // delay simon sequence so player is ready
    //const msToWait = simonSeq.length === 1 ? 3000 : 1000;
    setTimeout(playSimonSequence, 1000);
}

function playSimonSequence() {

    const msBase = 1000;

    // loop through the sequence and turn on/off lights
    simonSeq.forEach((btnIdx, idx) => {

        setTimeout(function() {

            const btnLightFill = document.querySelector(`[data-index='${btnIdx}'] .btn-fill`);
            btnLightFill.style.fill = BUTTONS[btnIdx].onColor;

            // 'turn off' the light - needs to be shorter than outer setTimeout
            setTimeout(function() {
                btnLightFill.style.fill = BUTTONS[btnIdx].offColor;
            }, msBase / 2);
            
        }, msBase * idx);
    });

    // update message to player
    setTimeout(function() {
        playersTurn = true;
        msgEl.innerText = getMessage();
    }, msBase * simonSeq.length);
}

function startGame() {
    init(true);
}

function turnLightOn(e) {
    changeFillColor(e, 'onColor');
}

function turnLightOff(e) {
    changeFillColor(e, 'offColor');
}

function changeFillColor(e, status) {

    if(e.target.tagName !== 'path' ||
        !e.target.classList.contains('btn-fill') ||
        playerSeq.length === simonSeq.length ||
        !playersTurn ||
        gameOver
    ) return;

    const btnIdx = parseInt(e.target.parentElement.dataset.index);

    const btnLightFill = document.querySelector(`[data-index='${btnIdx}'] .btn-fill`);
    btnLightFill.style.fill = BUTTONS[btnIdx][status];
}

function lightClick(e) {

    if(e.target.tagName !== 'path' ||
        !e.target.classList.contains('btn-fill') ||
        playerSeq.length === simonSeq.length ||
        !playersTurn ||
        gameOver
    ) return;

    const btnIndex = parseInt(e.target.parentElement.dataset.index);

    // add button index to player sequence array
    playerSeq.push(btnIndex);

    const clickCountIndex = playerSeq.length - 1;

    // compare player and simon selections
    if(btnIndex !== simonSeq[clickCountIndex]) {

        gameOver = true;
        inPlay = false;

        render();

    } else if(playerSeq.length === simonSeq.length) {

        currentLevel++;
        playerSeq = [];
        playersTurn = false;

        render();
    }

    
}

function getMessage() {

    if(!inPlay) {

        if(gameOver) {
            return `game over!`;
        }

        return `click play to begin.`;
    }

    if(playersTurn) {
        return `your turn...`;
    }
    
    return `simon's turn...`;
}