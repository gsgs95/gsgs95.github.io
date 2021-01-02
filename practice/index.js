const examples = document.querySelectorAll(".p");
const body = document.body;                         // For Version 1
const SHOWING="showing";                            // For Version 2, 3
const Link= "link";                                 // For Version 2
const FRAME= "frame";                               // For Version 2, 3
const BUTTON= "btn";                                // For Version 3
const EXAMPLESNAME="examplesName";                  // For Version 3
const CLICKED="clicked";                            // For Version 3

///////////////////////////////////////////////////////////////////////////
// Version 1 : just making a auto format by parent's classname 
/*
function insertFormat1(){
    examples.forEach(function(ex) {
        const pNum = ex.classList[0];
        const headerId=`${pNum}h`;
        const footerId=`${pNum}f`;

        const text = document.createTextNode(`[ ${pNum} ]`);
        const headerBox = document.createElement("div");
        headerBox.classList.add("headerBox");
        headerBox.id=headerId;
        const b = document.createElement('b');
        b.appendChild(text);
        headerBox.appendChild(b);
        body.insertBefore(headerBox, ex);

        const footerBox = document.createElement("div");
        footerBox.classList.add("footerBox");
        footerBox.id=footerId;
        const p = document.createElement('p');
        const hr = document.createElement('hr');
        p.appendChild(hr);
        footerBox.appendChild(p);
        body.insertBefore(footerBox, ex.nextSibling);
    });
}
*/

///////////////////////////////////////////////////////////////////////////
// Version 2 : Hyperlink w/ a&iframe tag
/*
function handleLinkClick(event){
    const link = event.target;
    const frame=document.getElementsByName(link.target)[0];
    frame.classList.toggle(SHOWING);
}

function insertFormat2(){
    examples.forEach(function(ex) {
        const pNum = ex.classList[0];
        const aId =`${pNum}l`;
        const text = document.createTextNode(`[${pNum}]`);
        const a = document.createElement("a");
        const iframe = document.createElement("iframe");
        const iframeName = `${pNum}i`;
        a.id=aId;
        iframe.name=iframeName;
        a.href=`example${pNum.substring(1)}.html`;
        a.target=iframeName;

        a.classList.add(Link);
        iframe.classList.add(FRAME);

        a.appendChild(text);
        a.addEventListener("click", handleLinkClick);
        ex.appendChild(a);
        ex.appendChild(iframe);
    })
}
*/

///////////////////////////////////////////////////////////////////////////
// Version 3 : button animation & iframe link

function handleBtnClick(event){
    const button=event.target;
    const id_len=button.id.length;
    const id = button.id.substring(0, `${id_len-1}`);
    const frame=document.getElementsByName(`${id}i`)[0];
    button.classList.toggle(CLICKED);
    frame.classList.toggle(SHOWING);
}

function insertFormat(){
    examples.forEach(function(ex) {
        const pNum = ex.classList[0];
        const text = document.createTextNode(`[${pNum}]`);
        const button = document.createElement("button");
        const span = document.createElement("span");
        const iframe = document.createElement("iframe");
        const iframeName = `${pNum}i`;
        const btnId = `${pNum}b`;

        span.appendChild(text);
        span.classList.add(EXAMPLESNAME);
        button.innerText="🔼";
        button.id=btnId;
        iframe.name=iframeName;
        iframe.src=`example${pNum.substring(1)}.html`;
        button.classList.add(BUTTON);
        iframe.classList.add(FRAME);

        button.addEventListener("click", handleBtnClick);

        ex.appendChild(button);
        ex.appendChild(span);
        ex.appendChild(iframe);
    })
}

function init(){
    insertFormat();
}


init();