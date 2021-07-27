var that;
class Tab{
    constructor(id){
        //获取元素
        that = this;
        this.main = document.querySelector(id);
        this.lis = this.main.querySelectorAll('.select');
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
        that.sections[this.index].className = "conactive";
        that.lis[this.index].className = 'liAfter';
    }
    clearClass(){
        for(var i=0; i<this.lis.length; i++){
            this.sections[i].className = "delcon";
            this.lis[i].className = 'liBefore';
        }
    }
    
}
var tab = new Tab('#box');
