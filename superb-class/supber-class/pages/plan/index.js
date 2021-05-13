class Tab{
    constructor(id){
        //获取元素
        this.main = document.querySelector(id);
        this.lis = this.main.querySelectorAll('li');
        this.sections = this.main.querySelectorAll('section');
        this.init();
    }
    init(){
        //初始化
        // this.newResize = this.resize.bind(this);
        for(var i = 0; i<5 ; i++)
        {
            this.lis[i].index = i;
            this.lis[i].onclick = this.toggleTab;

        }
    }
    //切换
    toggleTab(){
        this.otherToggleTab();
        this.className = 'liAfter';
    }
    otherToggleTab(){
        for(var i = 0; i<5 ; i++)
        {
            this.lis[i].className = 'liBefore';
        }
    }
    
}
var tab = new Tab('#box');
