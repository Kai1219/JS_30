const holes = document.querySelectorAll('.hole');
const moles = document.querySelectorAll('.mole');
const scoreBoard = document.querySelector('.score');
const timeBoard = document.querySelector('.timeLeft');
const modal = document.querySelector('.modal');
let lastIdx;
let timeUp = false;
let score = 0;
let countDown;
let canClick = true; //可以點擊加分

moles.forEach((mole) => {
    mole.addEventListener('click', hit);
});

timeBoard.addEventListener('transitionend', function () {
    this.classList.remove('warn'); //可以製造縮放效果
});

function randomTime(min, max) {
    return Math.round((max - min) * Math.random() + min);
}

function randomHole(holes) {
    const index = Math.floor(Math.random() * holes.length);
    if (lastIdx == index) {
        return randomHole(holes);
    }
    const hole = holes[index];
    lastIdx = index;
    return hole;
}

function peep() {
    const time = randomTime(200, 1000);
    const hole = randomHole(holes);
    hole.classList.add('up');
    setTimeout(() => {
        hole.classList.remove('up');
        if (!timeUp) {
            peep();
        }
    }, time);
}

function startGame() {
    scoreBoard.textContent = 0;
    score = 0;
    timeUp = false;
    modal.style.display = 'none'; //關閉modal
    peep();
    timer(10);
}

function hit(e) {
    if (!e.isTrusted) return;

    if (canClick) {
        canClick = false;
        score++;
    }
    setTimeout(() => {
        canClick = true;
    }, 100);

    this.parentNode.classList.remove('up');
    scoreBoard.textContent = score;
}

function timer(seconds) {
    clearInterval(countDown);
    displayTime(seconds);

    const now = Date.now();
    const then = Date.now() + seconds * 1000;

    countDown = setInterval(() => {
        let secondsLeft = Math.round((then - Date.now()) / 1000);

        if (secondsLeft <= 0) {
            displayTime(secondsLeft);
            timeUp = true; //時間到
            modalText(); //遊戲結束介面文字
            modal.style.display = 'block'; //開啟modal
            clearInterval(countDown);
            return;
        }
        displayTime(secondsLeft);
    }, 1000);
}

function displayTime(seconds) {
    timeBoard.style.color = 'black';
    if (seconds > 0 && seconds <= 3) {
        timeBoard.style.color = 'red'; //倒數三秒提醒玩家
        timeBoard.classList.add('warn');
    }
    return (timeBoard.textContent = seconds);
}

function modalText() {
    modal.innerHTML = `
    <div class="modal-content">
            <h1>遊戲結束!</h1>
            <h2>成績:${score}</h2>
            <button onClick="startGame()">再來一次</button>
    </div>`;
}
