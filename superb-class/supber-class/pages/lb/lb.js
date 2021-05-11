var items = document.getElementsByClassName('item');

var index = 0;

var clearActive = function(){
    for(let i = 0; i< items.length; i++){
        items[i].className = 'item';
    }
}
var goIndex = function(){
    clearActive();
    console.log(index);
    items[index].className = 'item active';
}
var goNext = function(){
    if(index<3){
        index++;
    }
    else{
        index = 0;
    }
    goIndex();
}

setInterval(function(){
    goNext();
},5000)
