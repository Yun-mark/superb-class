$(function() {
    var form = layui.form
  
    form.verify({
      nickname: function(value) {
        if (value.length > 6) {
          return '昵称长度必须在 1 ~ 6 个字符之间！'
        }
      }
    })
    initUserInfo()
    // 初始化用户的基本信息
    function initUserInfo(){
      $.ajax({
        method:'GET',
        url:'/my/userinfo',
        success:function (res) {
          if(res.status!== 0){
            return layer.msg('获取用户信息失败！')
          }
          form.val('formUserInfo',res.data)
          renderAvatar(res.data)
        }
      })
    }
    //重置表单的数据
    $('#btnReset').on('click',function(e){
      //阻止表单的默认重置行为
      e.preventDefault()
      initUserInfo()
    }) 


    //
    $('.layui-form').on('submit',function(e){
      //阻止默认
      e.preventDefault()
      $.ajax({
        method:'POST',
        url:'/my/userinfo',
        data: $(this).serialize(),
        success:function(res){
          if(res.status!== 0){
            return layer.msg('更新用户信息失败！')
          }
          layer.msg('更新用户信息成功!')

          //调用父页面的方法
          window.parent.getUserInfo()
        }
      })
    })

  })
  
function renderAvatar(user) {
      //获取用户的名称
      var name = user.nickname || user.username
      //按需渲染用户的头像
      if(user.user_pic !== null){
          //头像
          $('layui-nav-img').attr('src',user.user_pic).show()
          $('text-avatar').hide()
      }else{
          //文本头像
          $('.layui-nav-img').hide()
          var first = name.slice(-2).toUpperCase()
          $('.text-avatar').html(first).show()
      }
    }
