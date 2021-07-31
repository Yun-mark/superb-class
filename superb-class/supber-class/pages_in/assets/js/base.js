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
                $('#aboutUs').on("click",function(){
                    layer.alert('<div style="padding:10px; font-size:16px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;计科卓越内网是一套基于layui的技术，以卓越班同学的实际需求出发，为方便同学们的日常学习生活，用于卓越管理系统的网页界面，该开发版权和使用权限由《计科卓越官网组》所有。<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;我们诚挚的邀请各位老师和同学进行体验和反馈，一起打造“卓越生态”，您的每一个建议，都是对我们最大的信任与支持。</div>',
                     {
                        skin: 'layui-layer-molv' ,
                        closeBtn: 0 ,
                        title: '关于我们',
                        area: ['500px', '320px'],
                        anim: 3
                     })
                })
                $('.test').children('dd').on('click',function(){
                    layer.alert('该功能程序媛小姐姐还在开发中...', {
                      skin: 'layui-layer-molv' //样式类名
                      ,closeBtn: 0,
                      title:'尊敬的用户',
                      anim: 1
                    });
                  })
              })           
              
$(function(){
    $('.layui-nav-tree').children('.layui-nav-item1').one('click',function(){
        layer.tips('点击查看其他同学的优秀周报~', '.layui-nav-item2');
    })
})
$(function(){
    $('.layui-nav-tree').children().children().children('#look1').one('click',function(){
        layer.tips('记得勤写周报哦~', '#look2');
    })
})
$(function(){
    $('.layui-nav-tree').children().children().children('#look3').one('click',function(){
        layer.tips('不要忘记绑定手机和修改初始密码', '#look4');
    })
})


