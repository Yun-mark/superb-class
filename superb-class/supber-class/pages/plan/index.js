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
        if(this.index == 0)
        {
            this.className = 'liAfter li21';
        }
        else if(this.index == 1)
        {
            this.className = 'liAfter li22';
        }
        else if(this.index == 2)
        {
            that.lis[1].className = 'liBefore li112';
            this.className = 'liAfter li23';
        }
        else if(this.index == 3)
        {
            that.lis[1].className = 'liBefore li112';
            that.lis[2].className = 'liBefore li113';
            this.className = 'liAfter li24';
        }
        else if(this.index == 4)
        {
            that.lis[1].className = 'liBefore li112';
            that.lis[2].className = 'liBefore li113';
            that.lis[3].className = 'liBefore li114';
            this.className = 'liAfter li25';
        }
    }
    clearClass(){
        for(var i=0; i<this.lis.length; i++){
            this.sections[i].className = "delcon";
        }
        this.lis[0].className = 'liBefore li11';
        this.lis[1].className = 'liBefore li12';
        this.lis[2].className = 'liBefore li13';
        this.lis[3].className = 'liBefore li14';
        this.lis[4].className = 'liBefore li15';
    }
    
}
var tab = new Tab('#box');
