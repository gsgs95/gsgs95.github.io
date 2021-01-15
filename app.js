// constant values
const COLORS = ["jsColor0", "jsColor1","jsColor2","jsColor3",
"jsColor4","jsColor5","jsColor6","jsColor7","jsColor8", "jsColor9"]
const PEN = "jsPen", 
    ERASER = "jsEraser",
    BUCKET = "jsBucket",
    PIPETTE = "jsPipette";
const TOOLS = [PEN, ERASER, BUCKET, PIPETTE];
const CLICKED = "clicked";
const FREE_COLOR_ID = "jsColor9";
const TRANSPARENT = "transparent url('./painterImg/bgPattern.png') repeat";

// Selectors
const bodySection=document.getElementById("jsBodySection");
const canvas = document.getElementById("jsCanvas");
const ctx = canvas.getContext('2d');
const colors = document.getElementsByClassName("jsColor");
const tools = document.getElementsByClassName("jsTool");
const saveBtn = document.getElementById("jsSave");
const homeBtn = document.getElementById("jsHome");
const bucket = document.getElementById(BUCKET);
const freeColorBtn = document.getElementById(FREE_COLOR_ID);

// Range Selectors
const lineWidthRange = document.getElementById("jsLineWidthRange");
const redRange = document.getElementById("jsRedRange");
const greenRange = document.getElementById("jsGreenRange");
const blueRange = document.getElementById("jsBlueRange");
//const alphaRange = document.getElementById("jsAlphaRange");
const lineWidthRangeViewer = document.getElementById("jsLineWidthRangeViewer");
const redRangeViewer = document.getElementById("jsRedRangeViewer");
const greenRangeViewer = document.getElementById("jsGreenRangeViewer");
const blueRangeViewer = document.getElementById("jsBlueRangeViewer");
//const alphaRangeViewer = document.getElementById("jsAlphaRangeViewer");

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

// line attributes
ctx.lineCap='round';
ctx.lineJoin = 'round';

// control flags
let transparent = true;
let painting = false;


let drawing = true;
let erasing = false;
let filling = false;
let pipetting = false;



//////////////////////////////////////////////////////////////////////////
/*
// For making a canvas Background Pattern
const PATTERN_COLORS = ["#bbbbbb", "#eeeeee"];
const PATTERN_SIZE=10;
const wNum = canvas.width/PATTERN_SIZE;
const hNum = canvas.height/PATTERN_SIZE;

// canvas background imagepattern
function makeCanvasBackgroundPattern() {
    //create square pattern
    for (i = 0; i < hNum; i++) {
        for (j = 0; j < wNum; j++) {
            ctx.beginPath();
            ctx.rect(0 + PATTERN_SIZE * j, 0 + PATTERN_SIZE * i, PATTERN_SIZE, PATTERN_SIZE);
            if (i % 2 === 1) {
                ctx.fillStyle = PATTERN_COLORS[`${j % 2}`];
            } else {
                ctx.fillStyle = PATTERN_COLORS[`${(j + 1) % 2}`];
            }
            //fill the rectangle with the selected color
            ctx.fill();
        }
    }
}
*/
//////////////////////////////////////////////////////////////////////////

// canvasEvent handlers
function stopPainting() {
    painting = false;
}

function startPainting() {
    painting = true;
}

function onMouseMove(event) {
    if (drawing || erasing) {
        const x = event.offsetX;
        const y = event.offsetY;
        if (!painting) {
            ctx.beginPath();
            ctx.moveTo(x, y);
        } else {
            if(drawing) { // mouseMove with PenMode
            ctx.lineTo(x, y);
            ctx.stroke();
            } else { // mouseMove with EraserMode
                const size = lineWidthRange.value;
                ctx.clearRect(`${x-size/2}`, `${y-size/2}`, size, size);
            }            
        }
    }
}
/////////////////////////////////////////////////////
/* ================= Using Tools ================= */
function handleCanvasClick(event) {
    // 클릭지점의 캔버스 내 좌표얻음
    const x = event.offsetX;
    const y = event.offsetY;
    // 활성화된 모드별로 작동
    if (filling) { // Bucket Mode
        ctx.fillRect(0,0,canvas.width,canvas.height);
    } else if(pipetting) { // Pippet Mode
        // 클릭지점 픽셀의 색상값을 배열로 받아옴
        const imageData = ctx.getImageData(x, y, 1,1);
        const pixelColor=Array.from(imageData.data);
        const cssColor = "rgba(" + pixelColor[0] + ", " + 
        pixelColor[1] + ", " + pixelColor[2] + ", " + pixelColor[3] + ")"
        // 선택된 색상에 의한 RGB Channel Range 변환
        redRange.value = pixelColor[0];
        greenRange.value = pixelColor[1];
        blueRange.value = pixelColor[2];
        redRangeViewer.innerText=pixelColor[0];
        greenRangeViewer.innerText=pixelColor[1];
        blueRangeViewer.innerText=pixelColor[2];
        // 선택된 색상이 무색인지 검사        
        if(pixelColor[3] === 0){
            freeColorBtn.style.background = TRANSPARENT;
            transparent = true;
        } else{
            freeColorBtn.style.background = "";
            transparent = false;
        }
        // 선택된 색상을 자유색 버튼의 색상값에 저장
        freeColorBtn.style.backgroundColor = cssColor;
        // 만약 자유색이 선택된 상태라면, fillStyle/strokeStyle 바로 업데이트
        if (Array.from(freeColorBtn.classList).includes(CLICKED)) {
            ctx.strokeStyle = cssColor;
            ctx.fillStyle = cssColor;
        }      
    } else if(drawing) { // Pen Mode
        // mousemove 없이 점만 찍어도 작동해야함.
        ctx.lineTo(x, y);
        ctx.stroke();
    } else if(erasing) { // Eraser Mode
        const size = lineWidthRange.value;
        ctx.clearRect(`${x-size/2}`, `${y-size/2}`, size, size);
    }
}

/////////////////////////////////////////////////////
/* ================= Active Tools ================= */
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
                handlePenClick();
                break;
            case ERASER:
                handleEraserClick();
                break;
            case PIPETTE:
                handlePipetteClick();
                break;
            case BUCKET:
                handleBucketClick();
                break;
            default:
                console.log("ERROR: unvalid id @handleToolsClick()");
                break;           
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
    } else {
        console.log("ERROR: unvalid colorBtn id @handleColorClick()");
    }
}


/////////////////////////////////////////////////////

// rangeChange handler
function handleRangeChange(event) {
    // 어떤 range가 변하는지 확인
    const size = event.target.value;
    const sizebox = event.target.nextSibling.nextSibling;
    console.log(sizebox.id);
    sizebox.innerText = `${size}`;
    if(sizebox === lineWidthRangeViewer) { // 선굵기
        ctx.lineWidth = size;
    } else { // RGB
        const currentColor = new String(freeColorBtn.style.backgroundColor);
        let tmpRGB = [0, 0, 0];
        let tmpColor

        // 투명관련처리
        if(currentColor != "transparent"){ 
            // 현재 자유색값 문자열=> 배열 변환
            tmpColor = currentColor.slice(4);
            tmpColor = tmpColor.slice(0, tmpColor.length-1);
            tmpColor = tmpColor.split(", ");
            tmpRGB = tmpColor;
        }
        switch(sizebox) { // RGB 채널별로 처리
            case redRangeViewer: tmpRGB[0]=size; break;
            case greenRangeViewer: tmpRGB[1]=size; break;
            case blueRangeViewer: tmpRGB[2]=size; break;
        }
        // 변경한 배열 => 문자열로 재변환
        tmpColor = "rgb(" + tmpRGB[0] + ", " + tmpRGB[1] + ", " + tmpRGB[2] + ")";
        // 변경된 색상 업데이트
        freeColorBtn.style.background = "";
        transparent = false;
        freeColorBtn.style.backgroundColor=tmpColor;
        ctx.fillStyle = tmpColor;
        ctx.strokeStyle = tmpColor;
    }
}

// mouseRightClick(ContextMenu) handler
function handleContextMenu(event){ // 마우스 우클릭 블로킹
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
    // initialize background pattern
    freeColorBtn.style.background = TRANSPARENT;
    canvas.style.background = TRANSPARENT;
    // saving initial property of canvas context
    ctx.save();
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
    if(lineWidthRange) {
        lineWidthRange.addEventListener("input", handleRangeChange);
    }

    if(redRange) {
        redRange.addEventListener("input", handleRangeChange);
    }

    if(greenRange) {
        greenRange.addEventListener("input", handleRangeChange);
    }

    if(blueRange) {
        blueRange.addEventListener("input", handleRangeChange);
    }
/*
    if(alphaRange) {
        alphaRange.addEventListener("input", handleRangeChange);
    }
*/
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
        ✔    3. 투명 & white 구분
             4. 새 캔버스
             5. 캔버스 크기조절 옵션
        ✔    6. 지우개
        ✔    7. 자유색
        ✔    8. 스포이드
             9. undo redo
        ✔    10. 도구별 커서
             11. 도구별 단축키 설정

        ⚠  자유색 알파값 조절실패
*/
//////////////////////////////////////////////////////////////////////////