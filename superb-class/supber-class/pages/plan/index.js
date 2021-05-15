var that;
class Tab{
    constructor(id){
        //获取元素
        that = this;
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
        that.clearClass();
        this.className = 'liAfter';
        that.sections[this.index].className = "conactive";
    }
    clearClass(){
        for(var i=0; i<this.lis.length; i++){
            this.lis[i].className = 'liBefore';
            this.sections[i].className = "delcon";
        }
    }
    
}
var tab = new Tab('#box');
