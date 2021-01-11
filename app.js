// Selectors
const canvas = document.getElementById("jsCanvas");
const ctx = canvas.getContext('2d');
const colors = document.getElementsByClassName("jsColor");
const range = document.getElementById("jsRange");
const mode = document.getElementById("jsMode");
const saveBtn = document.getElementById("jsSave");
const homeBtn = document.getElementById("jsHome");

const CLICKED = "clicked";

// default values
const INITIAL_CANVAS_WIDTH = canvas.offsetWidth;
const INITIAL_CANVAS_HEIGHT = canvas.offsetHeight;
const INITIAL_COLOR = "#2c2c2c"; // default color
const INITIAL_NUM = 0;
const INITIAL_LINEWIDTH = 2.5; // default lineWidth


// canvasContext attrs initialize
canvas.width = INITIAL_CANVAS_WIDTH;
canvas.height = INITIAL_CANVAS_HEIGHT;
ctx.strokeStyle = INITIAL_COLOR;
ctx.fillStyle = INITIAL_COLOR;
ctx.lineWidth = INITIAL_LINEWIDTH; 


// control flags
let painting = false; 
let filling = false;

//////////////////////////////////////////////////////////////////////////
// find & update the selecting color
function updateCurrentColor(inputColor) {
    Array.from(colors).forEach(function (color) {
        if (color.style.backgroundColor === inputColor) {
            color.classList.add(CLICKED);
        } else {
            color.classList.remove(CLICKED);
        }
    });
}

// canvasEvent handlers
function stopPainting() {
    painting = false;
}

function startPainting() {
    painting = true;
}

function onMouseMove(event) {
    const x = event.offsetX;
    const y = event.offsetY;
    if(!painting) {
        ctx.beginPath();
        ctx.moveTo(x, y);
    } else {
        ctx.lineTo(x,y);
        ctx.stroke();
    }
}

// canvasFill handler
function handleCanvasClick() {
    if (filling) {
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

// colorChange handler
function handleColorClick(event) {
    const color = event.target.style.backgroundColor;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    updateCurrentColor(color);
}

// rangeChange handler
function handleRangeChange(event) {
    const size = event.target.value;
    ctx.lineWidth = size;
}

// modeChange handler
function handleModeClick() {
    if(filling === true) {
        filling = false;
        mode.innerText = "Fill";
    } else {
        filling = true;
        mode.innerText = "Paint";
    }
}

// mouseRightClick(ContextMenu) handler
function handleContextMenu(event){
    event.preventDefault();
}

// SaveBtn handler
function handleSaveClick() {
    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = "myImg";
    link.click();
}

// HomeBtn handler
function handleHomeClick() {
    const link = document.createElement("a");
    link.href = "index.html";
    link.click();
}

//////////////////////////////////////////////////////////////////////////
// Binding eventListners
function init() {
    // initialize color selection
    updateCurrentColor(Array.from(colors)[INITIAL_NUM].style.backgroundColor);
    
    // Drawing event
    if (canvas) {
        canvas.addEventListener("mousemove", onMouseMove);
        canvas.addEventListener("mousedown", startPainting);
        canvas.addEventListener("mouseup", stopPainting);
        canvas.addEventListener("mouseleave", stopPainting);
        canvas.addEventListener("click", handleCanvasClick);
        canvas.addEventListener("contextmenu", handleContextMenu);
    }
    
    // ColorClick event
    Array.from(colors).forEach(color => 
        color.addEventListener("click", handleColorClick)
    );
    
    // RangeChange event
    if(range) {
        range.addEventListener("input", handleRangeChange);
    }

    // ModeChange event
    if(mode) {
        mode.addEventListener("click", handleModeClick);
    }

    // Saving event
    if(saveBtn) {
        saveBtn.addEventListener("click", handleSaveClick);
    }

    // HomeBtnClick event
    if(homeBtn) {
        homeBtn.addEventListener("click", handleHomeClick);
    }
}

// Start 
init();

//////////////////////////////////////////////////////////////////////////
/*
            ********* TODO LIST *********
            1. Range Value Display
            2. FILL 디버그 (Fill 상태에서 드래그시 mousemove 이벤트 핸들러 작동)
            3. 투명 & white 구분
            4. 새 캔버스
            5. 캔버스 크기조절 옵션
            6. 지우개
            7. 자유색
            8. 스포이드
            9. undo redo
*/
//////////////////////////////////////////////////////////////////////////