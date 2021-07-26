$(function (){
    //点击‘去注册账号’的链接
    $('#link_reg').on('click',function(){
        $('.login-box').hide()
        $('.reg-box').show()
    })
    //点击‘去登录’的链接
    $('#link_login').on('click',function(){
        $('.reg-box').hide()
        $('.login-box').show()
    })

    //从layui 中 获取form对象
    var form = layui.form

    var layer = layui.layer
    //通过verify()
    form.verify({
        pwd:[  /^[\S]{6,12}$/ ,'密码必须6到12位，且不能出现空格'],
        repwd:function (value){
            var pwd = $('.reg-box [name=password]').val()
            if( pwd!== value) {
                return '两次密码不一致!'
            }
        }
    })   

    //监听注册表单的提交事件
   $('#form_reg').on('submit',function(e){
       //阻止表单的默认提交
       e.preventDefault()
       //发起ajax的post请求
       $.post('/api/reguser',{ username: $('#form_reg [name=username]').val(),
        password: $('#form_reg [name=password]').val()  }, function(res){
            if(res.status !== 0) {
                return layer.msg(res.message)
            }
            layer.msg('注册成功，请登录')
            //模拟点击
            $('#link_login').click()
        })
   })


    //监听登录表单的提交事件
    $('#form_login').submit('click',function(e){
         e.preventDefault()
         $.ajax({
             url:'/api/login' ,
             method:'POST',
             data: $(this).serialize(),
             success: function(res){
                 if(res.status!== 0){
                     return layer.msg('登录失败!')
                 }
                 layer.msg('登录成功！')
                 //将登录成功得到的token字符串，保存到localStorage中
                 localStorage.setItem('token',res.token)
                 location.href = './index.html'
             }
         })
    })

    $('.eye').each(function(index, domEle){
      $(domEle).on('click', function(){
        let i = index;
        let e = $(domEle)
        $('.eye-password').each(function(index, domEle){
          if(i === index && $(domEle).prop("type") === "password"){
            e.prop("src","./assets/images/eye-open.png");
            $(domEle).prop("type", "text");
          }
          else if(i === index && $(domEle).prop("type") === "text"){
            e.prop("src","./assets/images/eye-close.png");
            $(domEle).prop("type", "password");
          }
        })
      })
    })
    
    
})
