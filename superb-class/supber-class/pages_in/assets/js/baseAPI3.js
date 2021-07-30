

//在发请求之前，先调用这个函数，可以拿到我们给ajax提供的配置对象

$.ajaxPrefilter(function (options){
    //在发起真正的ajax请求之前，统一拼接请求的根路径
    options.url = 'http://supertest.nat300.top' + options.url
 
 
   if(options.url.indexOf('/article/')!==-1){
    options.headers = {
      Authorization : 'Bearer ' + localStorage.getItem('token')|| '' ,
      token : localStorage.getItem('token')|| '' 
    } 
   }
   //  options.complete = function(res){
   //     if(res.responseJSON.status === 500 ){
   //        localStorage.removeItem('token')
   //        //强制跳转登录
   //        location.href = './login.html'
   //     }
   //  }
 })
 