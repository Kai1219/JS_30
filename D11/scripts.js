const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');

const toggle = player.querySelector('.toggle');
const ranges = player.querySelectorAll('.player__slider');
const buttons = player.querySelectorAll('.player__button');

toggle.addEventListener('click', togglePlay);
video.addEventListener('click', togglePlay);
video.addEventListener('play', updateBtn);
video.addEventListener('pause', updateBtn);

buttons.forEach((button) => button.addEventListener('click', skip));
ranges.forEach((range) => range.addEventListener('change', handleRange));
video.addEventListener('timeupdate', handleProgress);

let mousedown = false;
progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', (e) => mousedown && scrub(e));
progress.addEventListener('mousedoen', () => (mousedown = true));
progress.addEventListener('mouseup', () => (mousedown = false));

function togglePlay() {
    video.paused ? video.play() : video.pause();
}

function updateBtn() {
    this.paused ? (toggle.textContent = '►') : (toggle.textContent = '❚ ❚');
}

function skip() {
    video.currentTime += parseFloat(this.dataset.skip);
}

function handleRange() {
    video[this.name] = this.value;
}

function handleProgress() {
    const percent = (video.currentTime / video.duration) * 100;
    progressBar.style.width = `${percent}%`;
}

function scrub(e) {
    const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
    video.currentTime = scrubTime;
}
