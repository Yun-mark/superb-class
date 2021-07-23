

//在发请求之前，先调用这个函数，可以拿到我们给ajax提供的配置对象

$.ajaxPrefilter(function (options){
   //在发起真正的ajax请求之前，统一拼接请求的根路径
   options.url = 'http://api-breakingnews-web.itheima.net' + options.url


  if(options.url.indexOf('/my/')!==-1){
   options.headers = {
      Authorization: localStorage.getItem('token')|| ''
    }
  }
   options.complete = function(res){
      if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！'){
         localStorage.removeItem('token')
         //强制跳转登录
         location.href = './login.html'
      }
   }
})

