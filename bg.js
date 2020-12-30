// management background images
const body = document.querySelector("body"),
    bgBtns = document.querySelector(".js-bgBtns"),
    bgLeftBtn = document.querySelector(".js-bgLeftBtn"),
    bgRightBtn = document.querySelector(".js-bgRightBtn"),
    bgOnOffBtn = document.querySelector(".js-bgOnOffBtn");
    ON = "on";
    BG_IMAGE="bgImage";

const IMG_NUMBER = 14;
const IMG_START = "01";
const BG_CLICKED_CLASS = "bgClicked";
const image = new Image();
let bgId;

function paintImage(imgNumber){
    image.src = `images/${
        imgNumber < 10 ? `0${imgNumber}` : imgNumber}.jpg`;
    image.classList.add(BG_IMAGE);
    body.appendChild(image);
}

function handleBgLeftClick(event){
    bgId = parseInt(bgId > 1 ? `${bgId-1}` : IMG_NUMBER);
    paintImage(bgId);
}
function handleBgRightClick(event){
    bgId = parseInt(bgId < IMG_NUMBER ? `${bgId+1}` : IMG_START);
    paintImage(bgId);
}

function handleBgOnOffClick(event){
    bgOnOffBtn.classList.toggle(BG_CLICKED_CLASS);
    bgBtns.classList.toggle(BG_CLICKED_CLASS);
    image.classList.toggle(ON);
    let result = false;
    bgOnOffBtn.classList.forEach(function(element) {
        result = (element === BG_CLICKED_CLASS);
    });
    if(result){
        bgOnOffBtn.innerText = "ON";
    } else {
        bgOnOffBtn.innerText = "OFF";
    }
}

function paintBtns(){
    bgLeftBtn.innerText = "◀";
    bgRightBtn.innerText = "▶";
    bgOnOffBtn.innerText = "OFF";
    
    bgLeftBtn.addEventListener("click", handleBgLeftClick);
    bgRightBtn.addEventListener("click", handleBgRightClick);
    bgOnOffBtn.addEventListener("click", handleBgOnOffClick);
}

function genRandom(){
    const number = Math.ceil(Math.random()*IMG_NUMBER);
    return number;
}

function init(){
    const randomNumber = genRandom();
    bgId=randomNumber;
    paintImage(randomNumber);
    paintBtns();
}

init();