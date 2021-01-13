// Selectors
const bodySection=document.getElementById("jsBodySection");
const canvas = document.getElementById("jsCanvas");
const ctx = canvas.getContext('2d');
const colors = document.getElementsByClassName("jsColor");
const tools = document.getElementsByClassName("jsTool");
const range = document.getElementById("jsRange");
const bucket = document.getElementById("jsBucket");
const saveBtn = document.getElementById("jsSave");
const homeBtn = document.getElementById("jsHome");
const rangeViewer = document.getElementById("jsRangeViewer");

// Tools
const COLORS = ["jsColor0", "jsColor1","jsColor2","jsColor3",
"jsColor4","jsColor5","jsColor6","jsColor7","jsColor8"]
const PEN = "jsPen", 
    ERASER = "jsEraser",
    BUCKET = "jsBucket",
    PIPETTE = "jsPipette";
const TOOLS = [PEN, ERASER, BUCKET, PIPETTE];
const CLICKED = "clicked";

// default values
const INITIAL_CANVAS_WIDTH = canvas.offsetWidth;
const INITIAL_CANVAS_HEIGHT = canvas.offsetHeight;
const INITIAL_COLOR = "#2c2c2c"; // default color
const INITIAL_COLOR_NUM = 0;
const INITIAL_TOOL_NUM = 0;
const INITIAL_LINEWIDTH = 2.5; // default lineWidth


// canvasContext attrs initialize
canvas.width = INITIAL_CANVAS_WIDTH;
canvas.height = INITIAL_CANVAS_HEIGHT;
ctx.strokeStyle = INITIAL_COLOR;
ctx.fillStyle = INITIAL_COLOR;
ctx.lineWidth = INITIAL_LINEWIDTH; 


// control flags
let painting = false;
let drawing = true;
let erasing = false;
let filling = false;
let pipetting = false;

//////////////////////////////////////////////////////////////////////////
// find & update the selection

function updateCurrentSelection(obj){
    console.log(obj);
}

// canvasEvent handlers
function stopPainting() {
    painting = false;
}

function startPainting() {
    painting = true;
}

function onMouseMove(event) {
    if (drawing) {
        const x = event.offsetX;
        const y = event.offsetY;
        if (!painting) {
            ctx.beginPath();
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
            ctx.stroke();
        }
    }
}

// canvasFill handler
function handleCanvasClick() {
    if (filling) {
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if(pipetting) {
        console.log("Canvas Click Event appears while Pippeting Mode.");
    }
}

/////////////////////////////////////////////////////
/* ================= Click Tools ================= */
function initModes() {
    drawing = false;
    erasing = false;
    filling = false;
    pipetting = false;
}

function handleToolsClick(event){
    // 0. obj 가 이미 Clicked 면 아무것도안함.
    // 1. tools 배열내의 모든 요소들에게 obj.classList.remove(CLICKED); 하고
    // 2. 이벤트가 발생한 객체의 해당 요소에 obj.classList.add(CLICKED); 함
    // 3. 모든 modeFlags를 false로 초기화
    // 4. 해당 id의 버튼의 역할에 해당하는 이벤트핸들러를 switch case로 call
    const clickedObj = event.target;
    if(Array.from(clickedObj.classList).includes(CLICKED)) return;
    const id = clickedObj.id;
    console.log(id);
    if (id) {
        Array.from(tools).forEach(obj => obj.classList.remove(CLICKED));
        clickedObj.classList.add(CLICKED);
        initModes();
        switch (id) {
            case PEN:
                console.log("It is " + PEN);
                handlePenClick();
                break;
            case ERASER:
                console.log("It is " + ERASER);
                handleEraserClick();
                break;
            case PIPETTE:
                console.log("It is " + PIPETTE);
                handlePipetteClick();
                break;
            case BUCKET:
                console.log("It is " + BUCKET);
                handleBucketClick();
                break;
            default:
                console.log("ERROR: unvalid id @handleToolsClick()");                
        }
    }
}
// modeChange handlers
function handlePenClick() {
    drawing = true;
    bodySection.style.cursor = "url(./cursors/pen.cur), auto";
    console.log("now DrawingMode: ", drawing);
}
function handleEraserClick() {
    erasing = true;
    bodySection.style.cursor = "url(./cursors/pen.cur), auto";
    console.log("now ErasingMode: ", erasing);
}

function handleBucketClick() {
    filling = true;
    bodySection.style.cursor = "url(./cursors/bucket.cur), auto";
    console.log("now FillingMode: ", filling);
}

function handlePipetteClick() {
    pipetting = true;
    bodySection.style.cursor = "url(./cursors/pipette.cur), auto";
    console.log("now PipettingMode", pipetting);
}

// colorChange handlers
function handleColorClick(event) {
    // 0. obj 가 이미 Clicked 면 아무것도안함.
    // 1. colors 배열내의 모든 요소들에게 obj.classList.remove(CLICKED); 하고
    // 2. 이벤트가 발생한 객체의 해당 요소에 obj.classList.add(CLICKED); 함
    // 3. 해당 Obj의 색으로 변경
    const clickedObj = event.target;
    if(Array.from(clickedObj.classList).includes(CLICKED)) return;
    const id = clickedObj.id;
    if (id) {
        Array.from(colors).forEach(obj => obj.classList.remove(CLICKED));
        clickedObj.classList.add(CLICKED);
        const clickedColor = clickedObj.style.backgroundColor;
        ctx.strokeStyle = clickedColor;
        ctx.fillStyle = clickedColor;
    }
}


/////////////////////////////////////////////////////

// rangeChange handler
function handleRangeChange(event) {
    const size = event.target.value;
    rangeViewer.innerText=`${size}`;
    ctx.lineWidth = size;
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
    // initialize tool/color selection
    bodySection.style.cursor = "url(./cursors/pen.cur), auto";
    document.getElementById(TOOLS[INITIAL_TOOL_NUM]).classList.add(CLICKED);
    document.getElementById(COLORS[INITIAL_COLOR_NUM]).classList.add(CLICKED);
    
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

    // ToolClick event
    Array.from(tools).forEach(tool =>
        tool.addEventListener("click", handleToolsClick)
    );
    
    // RangeChange event
    if(range) {
        range.addEventListener("input", handleRangeChange);
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
        ✔    1. Range Value Display
        ✔    2. FILL 디버그 (Fill 상태에서 드래그시 mousemove 이벤트 핸들러 작동)
             3. 투명 & white 구분
             4. 새 캔버스
             5. 캔버스 크기조절 옵션
             6. 지우개
             7. 자유색
             8. 스포이드
             9. undo redo
        ✔    10. 도구별 커서
*/
//////////////////////////////////////////////////////////////////////////