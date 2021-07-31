$(function(){
    //调用函数，获取用户基本信息
    getUserInfo()

    var layer = layui.layer

     $('#btnLogout').on('click',function(){
       //提示用户是否确认退出
       layer.confirm('确定退出登录？',{ icon: 3, title: '提示'},
       function(index){
        //清空本地存储的token
        localStorage.removeItem('token')
        //重新跳转到登录页面
        location.href = './login.html'
       //关闭 confirm 询问框
         layer.close(index)
       })     
     })

})

//获取用户的基本信息
function getUserInfo (){
    $.ajax({
         method:'GET',
         url:'http://supertest.nat300.top/userHome/info',
         headers:{
              Authorization : 'Bearer ' + localStorage.getItem('token')|| '' ,
              token : localStorage.getItem('token')|| '' 
            },
         success: function(res){
             if(res.code !== 200){
                 return  layui.layer.msg('获取用户的基本信息失败!')
             }
             renderAvatar(res.data)
         }
    })
}

function renderAvatar(user) {
    //获取用户的名称
    var name = user.nickname || user.username
    //设置欢迎的文本
    $('#welcome').html('Hi,&nbsp;&nbsp;' + name)
    //按需渲染用户的头像
    if(user.userPic !== null){
        //头像
        $('layui-nav-img').attr('src',user.userPic).show()
        $('text-avatar').hide()
    }else{
        //文本头像
        $('.layui-nav-img').hide()
        var first = name.slice(-2).toUpperCase()
        $('.text-avatar').html(first).show()
    }

}
$(function(){
  var laypage = layui.laypage
  
  // 定义美化时间的过滤器
  template.defaults.imports.dataFormat = function(date) {
    const dt = new Date(date)

    var y = dt.getFullYear()
    var m = padZero(dt.getMonth() + 1)
    var d = padZero(dt.getDate())
    
    var hh = padZero(dt.getHours())
    var mm = padZero(dt.getMinutes())
    var ss = padZero(dt.getSeconds())

    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
  }

  // 定义补零的函数
  function padZero(n) {
    return n > 9 ? n : '0' + n
  }

    initTable()
    function initTable() {
       $.ajax({
         method: 'GET',
         url: 'http://supertest.nat300.top/article/get',
         headers:{
           Authorization : 'Bearer ' + localStorage.getItem('token')|| '' ,
           token : localStorage.getItem('token')|| '' 
         },
         success: function(res) {
           if (res.code !== 200) {
             return layer.msg('获取文章列表失败！') 
           }
           console.log(res);
           // 使用模板引擎渲染页面的数据
           var htmlStr = template('tpl-table', res)
           console.log(res);
           $('tbody').html(htmlStr)
           // 调用渲染分页的方法
         //   renderPage(res.total)
         }
       })
     }
})

