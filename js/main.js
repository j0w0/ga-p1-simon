/*
https://git.generalassemb.ly/SEI-CC/SEI-CC-9/blob/master/projects/project-1/project-1-requirements.md
*/

/*----- constants -----*/
const BUTTONS = {
    0: 'green',
    1: 'red',
    2: 'blue',
    3: 'yellow',
    off: 'white'
}

/*----- app's state (variables) -----*/
let currentLevel, simonSeq, playerSeq;


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
    render();
}

function render() {

    msgEl.innerText = `Click play to begin.`;

    currentLevel = currentLevel >= 1 && currentLevel <= 9 ? "0" + currentLevel : currentLevel;
    levelEl.innerText = `level ${currentLevel}`;


}

function getRandomNumber() {
    return Math.floor(Math.random() * 4);
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
                btnLight.style.backgroundColor = BUTTONS['off'];
            }, 500);
            
        }, 1000 * idx);
    });
}

function updateMessage() {

}

function startGame() {

    // populate simon's sequence array
    getSimonSequence();
    playSimonSequence();


}




