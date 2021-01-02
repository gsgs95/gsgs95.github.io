function insertP(){
    let arr= new Array();
    arr[0]='zero';
    arr[1]='one';
    arr[2]='two';
    let arr2=new Array('a','b','c');
    let arr3 = new Array(3);

    for(let i = 0; i < arr.length; i++) {
        console.log(arr[i]);
        console.log(arr2[i]);
    }
    for(var i =0; i < arr3.length; i++) {
        console.log(arr3[i]);
    }

    var arr4 = [1234,'test', true];
    arr4.length = 5;
    arr4[5] = 'apple';
    arr4.push('banana');

    var arr5 = [1234,'test', true];
    arr5.length = 5;
    arr5.push('banana');
    arr5[6] = 'apple';

    for(var i = 0; i < arr4.length ; i++) {
        console.log(arr4[i], arr5[i]);
    }
}
function init(){
    console.log(last);
    insertP();
}
init();