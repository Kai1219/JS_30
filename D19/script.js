const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');
const controllers = document.querySelectorAll('.rgb input');

video.addEventListener('canplay', paintToCanavas);

function getVideo() {
    navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((localMediaStream) => {
            console.log(localMediaStream);
            video.srcObject = localMediaStream;
            video.play();
        })
        .catch((err) => {
            console.log('發生錯誤:', err);
        });
}

function paintToCanavas() {
    const width = video.videoWidth;
    const height = video.videoHeight;

    canvas.width = width;
    canvas.height = height;

    return setInterval(() => {
        //繪製畫布
        ctx.drawImage(video, 0, 0, width, height);
        //取出canvas像素資料
        let pixels = ctx.getImageData(0, 0, width, height);
        //紅色濾鏡效果
        //pixels = redEffect(pixels);
        //顏色分離效果
        pixels = rgbSplit(pixels);
        //加入綠幕效果
        //pixels = greenScreen(pixels);
        ctx.globalAlpha = 0.1;
        //將ImageData數據繪製到畫布上
        ctx.putImageData(pixels, 0, 0);
    }, 16);
}
function takePhoto() {
    //拍照音效
    snap.currentTime = 0;
    snap.play();
    //將canvas轉為base64位編碼
    const data = canvas.toDataURL('image/jpeg');
    //建立一個新的<a>元素
    const link = document.createElement('a');
    //超連結為base64位編碼的canvas圖
    link.href = data;
    //連結點下後會下載base64位編碼的canvas圖，文件名為penguin
    link.setAttribute('download', 'penguin');
    link.innerHTML = ` <img src="${data}" alt="penguin">`;
    //strip為div，新增的超連結會放到第一個位置，也就是新增的元素會把舊的往後推
    strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels) {
    //將每一個像素的紅色增強，藍綠色減弱
    for (let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i + 0] = pixels.data[i + 0] + 100; //紅色增強
        pixels.data[i + 1] = pixels.data[i + 1] - 50; //綠色減弱
        pixels.data[i + 2] = pixels.data[i + 2] * 0.5; //藍色減弱
    }
    return pixels;
}

function rgbSplit(pixels) {
    for (let i = 0; i < pixels.data.length; i += 4) {
        //pixels.data[i - 150] = pixels.data[i + 0]; // 控制藍色
        pixels.data[i + 500] = pixels.data[i + 1]; // 控制紅色
        pixels.data[i - 550] = pixels.data[i + 2]; // 控制藍色
    }

    return pixels;
}

function greenScreen(pixels) {
    const levels = {};
    controllers.forEach((controller) => {
        levels[controller.name] = controller.value;
    });

    for (i = 0; i < pixels.data.length; i += 4) {
        red = pixels.data[i + 0];
        green = pixels.data[i + 1];
        blue = pixels.data[i + 2];
        alpha = pixels.data[i + 3];
        if (
            red >= levels.rmin &&
            green >= levels.gmin &&
            blue >= levels.bmin &&
            red <= levels.rmax &&
            green <= levels.gmax &&
            blue <= levels.bmax
        ) {
            //透明
            pixels.data[i + 3] = 0;
        }
    }

    return pixels;
}

getVideo();
