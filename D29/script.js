const timeLeft = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');
const timeBtns = document.querySelectorAll('[data-time]');
let countDown;

timeBtns.forEach((btn) => btn.addEventListener('click', startTimer));

function timer(seconds) {
    clearInterval(countDown); //開頭就先清除掉setInterval
    const now = Date.now();
    const timeUp = now + seconds * 1000;
    displayTimeLeft(seconds);
    diplayEndTime(timeUp);

    countDown = setInterval(() => {
        const secondsLeft = Math.round((timeUp - Date.now()) / 1000);
        if (secondsLeft < 0) {
            clearInterval(countDown);
            return;
        }
        displayTimeLeft(secondsLeft);
    }, 1000);
}

function displayTimeLeft(seconds) {
    const mins = Math.floor(seconds / 60);
    const remainderSecs = seconds % 60;
    const display = `${mins}:${remainderSecs < 10 ? '0' : ''}${remainderSecs}`;
    timeLeft.textContent = display;
    document.title = display;
}

function diplayEndTime(timeUp) {
    const end = new Date(timeUp);
    const hours = end.getHours();
    const mins = end.getMinutes();
    const AmPmHours = hours < 12 ? `上午${hours}` : `下午${hours - 12}`;
    endTime.textContent = `結束時間:${AmPmHours}:${mins < 10 ? '0' : ''}${mins}`;
}

function startTimer() {
    const seconds = parseInt(this.dataset.time); //將dataset字串轉成數字
    timer(seconds);
}

document.customForm.addEventListener('submit', inputTime);

function inputTime(e) {
    e.preventDefault();
    const secs = this.minutes.value * 60; //將輸入的數字分鐘數轉成秒數
    timer(secs);
    this.reset(); //清空表單
}
