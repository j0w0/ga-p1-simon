// https://git.generalassemb.ly/SEI-CC/SEI-CC-9/blob/master/projects/project-1/project-1-requirements.md

/*----- app's state (variables) -----*/
let currentLevel, simonSeq, playerSeq, inPlay, playersTurn, gameOver;

/*----- cached element references -----*/
const msgEl = document.querySelector('p');
const btnLights = document.getElementById('btn-lights-inner');
const levelEl = document.getElementById('level');
const btnPlayEl = document.getElementById('btn-play');

/*----- event listeners -----*/
btnPlayEl.addEventListener('click', startGame);
btnLights.addEventListener('click', lightClickHandler);
btnLights.addEventListener('mousedown', turnLightOnHandler);
btnLights.addEventListener('mouseup', turnLightOffHandler);
btnLights.addEventListener('mouseout', turnLightOffHandler);

/*----- functions -----*/
function init(startGame = false) {
    // initialize/reset game state
    currentLevel = 1;
    simonSeq = [];
    playerSeq = [];
    inPlay = startGame;
    playersTurn = false;
    gameOver = null;

    // render view to dom
    render();
}

function render() {
    // update and display current level
    let levelNumber = currentLevel >= 1 && currentLevel <= 9 ? "0" + currentLevel : currentLevel;
    levelEl.innerHTML = `level <strong>${levelNumber}</strong>`;

    // get and display message/feedback to player
    msgEl.innerText = getMessage();

    // create buttons only on initial load
    if(!inPlay && !gameOver) {
        BUTTONS.forEach(btn => {
            // create button element and inject with svg
            const btnEl = document.createElement('button');
            btnEl.innerHTML = btn.svgPaths;

            // update button face's svg fill color
            const btnFill = btnEl.querySelector(".btn-fill");
            btnFill.style.fill = btn.offColor;

            // append to inner container
            btnLights.append(btnEl);
        });
    }

    // only play simon's sequence when in play and not player's turn
    if(inPlay && !playersTurn) {
        simonSequence();
    }

    // update and show/hide play button
    btnPlayEl.innerText = gameOver ? `replay` : `play`;
    btnPlayEl.style.visibility = inPlay ? 'hidden' : 'visible';
}

function simonSequence() {
    // get random numbers in range of button indices
    const random = Math.floor(Math.random() * BUTTONS.length);

    // add random number/index to simon sequence array
    simonSeq.push(random);

    // delay simon sequence so player is ready
    setTimeout(playSimonSequence, 1000);
}

function playSimonSequence() {
    // set base ms for timing
    const msBase = 500;

    // loop through simon's sequence and turn on/off lights
    simonSeq.forEach((btnIdx, idx) => {
        setTimeout(function() {
            // 'turn on' light
            changeFillColor(btnIdx, 'onColor');

            // 'turn off' the light
            setTimeout(function() {
                changeFillColor(btnIdx, 'offColor');
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
    // puts game into play
    init(true);
}

function turnLightOnHandler(e) {
    // get button index
    const btnIdx = getBtnIndex(e);
    // return if index doesn't exist on element
    if(btnIdx === undefined) return;
    // change button face's fill color
    changeFillColor(btnIdx, 'onColor');
}

function turnLightOffHandler(e) {
    // get button index
    const btnIdx = getBtnIndex(e);
    // return if index doesn't exist on element
    if(btnIdx === undefined) return;
    // change button face's fill color
    changeFillColor(btnIdx, 'offColor');
}

function getBtnIndex(e) {
    // check to see if button/svg event is valid
    if(e.target.tagName !== 'path' ||
        !e.target.classList.contains('btn-fill') ||
        playerSeq.length === simonSeq.length ||
        !playersTurn ||
        gameOver
    ) return;

    // return button/svg index
    return parseInt(e.target.parentElement.dataset.index);
}

function changeFillColor(btnIdx, lightStatus) {
    // change button's face fill color
    const btnLightFill = document.querySelector(`[data-index='${btnIdx}'] .btn-fill`);
    btnLightFill.style.fill = BUTTONS[btnIdx][lightStatus];
}

function lightClickHandler(e) {
    // get button's index
    const btnIdx = getBtnIndex(e);

    // return if there's no index on target
    if(btnIdx === undefined) return;

    // add button index to player sequence array
    playerSeq.push(btnIdx);

    // get index of element that was just added
    const clickCountIndex = playerSeq.length - 1;

    // compare player selection to element in simon sequence
    if(btnIdx !== simonSeq[clickCountIndex]) {
        // does not match, so game is over
        gameOver = true;
        inPlay = false;
    } else if(playerSeq.length === simonSeq.length) {
        // move to next level
        currentLevel++;
        playerSeq = [];
        playersTurn = false;
    }

    // re-render dom if game is over or after player's turn
    if(gameOver || !playersTurn) render();
}

function getMessage() {
    if(!inPlay) {
        if(gameOver) return `game over!`;
        return `click play to begin`;
    }
    if(playersTurn) return `your turn...`;
    return `simon's turn...`;
}

init();