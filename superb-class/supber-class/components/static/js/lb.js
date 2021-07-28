var oBox = document.getElementById('box');

var oPicBox = document.getElementById('pic');

var oPics = oPicBox.getElementsByTagName('li');

var num = 0;
var len = oPics.length;


//自动播放
setInterval(function(){
    num++;

    if( num>2){num = 0;}

    for(var i=0; i<len ; i++){
        oPics[i].className = ' ';
    }
    oPics[num].className = 'active';
},4000);
