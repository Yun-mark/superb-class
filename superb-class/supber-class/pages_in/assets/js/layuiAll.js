var isShow = true;  //定义一个标志位
        
        
        $('#LAY_app_flexible').on('click',function(){
        //选择出所有的span，并判断是不是hidden
        $('.layui-nav-item span').each(function(){
          if($(this).is(':hidden')){
              $(this).show();
          }else{
              $(this).hide();
          }
        });
        //判断isshow的状态
        if(isShow){
          $('.layui-side.layui-bg-black').width(50); //设置宽度
          $('#LAY_app_flexible i').css('margin-right', '30%');  //修改图标的位置
          //将footer和body的宽度修改
          $('.layui-body').css('left', 50+'px');
          $('.layui-footer').css('left', 50+'px');
          //将二级导航栏隐藏
          $('dd span').each(function(){
              $(this).hide();
          });
          //修改标志位
          isShow =false;
        }else{
          $('.layui-side.layui-bg-black').width(200);
          $('#LAY_app_flexible i').css('margin-right', '10%');
          $('.layui-body').css('left', 200+'px');
          $('.layui-footer').css('left', 200+'px');
          $('dd span').each(function(){
              $(this).show();
          });
          isShow =true;
        }
        });
