/*
https://git.generalassemb.ly/SEI-CC/SEI-CC-9/blob/master/projects/project-1/project-1-requirements.md
*/

/*----- constants -----*/
const BUTTONS = ['green', 'red', 'blue', 'yellow'];

/*----- app's state (variables) -----*/
let currentLevel, simonSeq, playerSeq, inPlay;


/*----- cached element references -----*/
const msgEl = document.querySelector('p');
const btnLightEls = document.querySelectorAll('#btn-lights > button');
const btnLights = document.getElementById('btn-lights');
const levelEl = document.getElementById('level');
const btnPlayEl = document.getElementById('btn-play');


/*----- event listeners -----*/
btnPlayEl.addEventListener('click', startGame);

btnLights.addEventListener('click', function(e) {
    if(e.target.tagName !== 'BUTTON') return;
    const btnIndex = e.target.dataset.index;
    console.log(btnIndex);
});


/*----- functions -----*/

init();

function init() {
    currentLevel = 1;
    simonSeq = [];
    playerSeq = [];
    inPlay = false;
    render();
}

function render() {
    let levelNumber = currentLevel >= 1 && currentLevel <= 9 ? "0" + currentLevel : currentLevel;
    levelEl.innerText = `level ${levelNumber}`;

    btnPlayEl.style.display = simonSeq.length ? 'none' : 'display';

    msgEl.innerText = getMessage();

    if(inPlay) {

        if(currentLevel === 1) {
            // TODO 3,2,1 countdown so user is ready
        }

        // populate simon's sequence array
        if(!simonSeq.length) {
            getSimonSequence();
            playSimonSequence();
        }
    }
}

function getRandomNumber() {
    return Math.floor(Math.random() * BUTTONS.length);
}

function getSimonSequence() {
    simonSeq = [];
    for(let i = 0; i < currentLevel; i++) {
        simonSeq.push(getRandomNumber());
    }
}

function playSimonSequence() {

    simonSeq.forEach((btnIdx, idx) => {
        setTimeout(function() {

            // animate light buttons
            const currentColor = BUTTONS[btnIdx];
            const btnLight = document.querySelector(`[data-index='${btnIdx}']`);

            btnLight.style.backgroundColor = currentColor;

            // needs to be shorter than outer setTimeout
            setTimeout(function() {
                btnLight.style.backgroundColor = 'white';
            }, 500);
            
        }, 1000 * idx);
    });

    setTimeout(function() {
        msgEl.innerText = getMessage();
    }, 1000 * simonSeq.length);


    

}

function getMessage() {

    if(!inPlay) {
        return `Click play to begin.`;
    }

    if(!simonSeq.length) {
        return `Simon's turn`;
    }

    return `Your turn`;
}

function startGame() {
    inPlay = true;
    render();
}




