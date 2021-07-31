
$(function(){
  let form = layui.form;
  let layer = layui.layer;
  var show_num = [];
  initUserInfo()
  //获取用户信息
  function initUserInfo(){
    $.ajax({
         method:'GET',
         url:'/userHome/info',
         success: function(res){
             if(res.code !== 200){
                 return  layui.layer.msg('获取用户的基本信息失败!')
             }
            
            if(res.data.phonenumber === null){
              $('#oldPhone').prop('value','请直接输入新手机号')
              $('#spanPhone').text('暂未绑定手机号')
            }
            else{
              let phone = '';
              for(let i = 0; i<res.data.phonenumber.length; i++){
                if(i>=3 && i<=6)
                  phone = phone + '*';
                else
                  phone = phone + res.data.phonenumber[i];
              }
              $('#oldPhone').prop('value',res.data.phonenumber)
              $('#spanPhone').text(phone)
            }
         },
         //不论成功与否，都会调用complete回调函数
    })
  }


  // 修改手机号弹窗
  $('#changeIphone').on('click', function(){
    // 初始化一下
    $(".image-code").val('');
    $("#newPhone").val('');
    $('.phone-wrong1').hide()
    $('.phone-wrong2').hide()

    $('.phone-cover').show();
    draw(show_num,document.getElementById('canvas'));
    $('#canvas').prop('width','100');
    $('#canvas').prop('height','43');
    $(".words").on('click',function(){
      draw(show_num,document.getElementById('canvas'));
    })
    $('.words').click();
  })
  $('.phone-close').click(function() {
      $(".phone-cover").hide();
  });



  // 修改密码弹窗
  $('#changePassword').on('click', function(){
    // 初始化一下
    $(".image-code-password").val('');
    $("#newPassword").val('');
    $(".confirm-new-password").val('');
    $('.password-wrong1').hide()
    $('.password-wrong2').hide()
    $('.password-wrong3').hide()

    $('.password-cover').show();
    $('.eye').each(function(index, domEle){
      $(domEle).prop("src","../assets/images/eye-close.png");
    })
    $('.eye-password').each(function(index, domEle){
      $(domEle).prop("type", "password");
    })

    draw(show_num,document.getElementById('canvasPassword'));

    $('#canvasPassword').prop('width','100');
    $('#canvasPassword').prop('height','43');
    $(".words").on('click',function(){
      draw(show_num,document.getElementById('canvasPassword'));
  })
    $('.words').click();
})
  $('.password-close').click(function() {
      $(".password-cover").hide();
  });

  //查看密码
  $('.eye').each(function(index, domEle){
    $(domEle).on('click', function(){
      let i = index;
      let e = $(domEle)
      $('.eye-password').each(function(index, domEle){
        if(i === index && $(domEle).prop("type") === "password"){
          e.prop("src","../assets/images/eye-open.png");
          $(domEle).prop("type", "text");
        }
        else if(i === index && $(domEle).prop("type") === "text"){
          e.prop("src","../assets/images/eye-close.png");
          $(domEle).prop("type", "password");
        }
      })
    })
  })



  //验证手机号是否符合规范
  let regPhone = /^1[3|4|5|8][0-9]{9}$/;
  $('#newPhone').blur(function(){
    if(regPhone.test($('#newPhone').prop('value')) === false){
      $('.phone-wrong1').show()
      $('.phone-wrong2').hide()
    }
    else{
      if($('#newPhone').prop('value') === $('#oldPhone').prop('value')){
        $('.phone-wrong1').hide()
        $('.phone-wrong2').show()
      }
      else{
        $('.phone-wrong1').hide()
        $('.phone-wrong2').hide()
      }
    }
  })

  $(".btn-phone").on('click',function(event){
    initUserInfo()
    //阻止默认提交事件
    event.preventDefault()
    let val = $(".image-code").val().toLowerCase();
    let num = show_num.join("");
    if(val==''){
      layer.msg('请输入验证码！', {icon: 5})
    }else if(val === num){
      if($('.phone-wrong1').css('display')==="none" && $('.phone-wrong2').css('display')==="none"){
        console.log($('.phone-form').serialize());
        $.ajax({
          method:'POST',
          url:'/userHome/updateTelephone',
          data: $('.phone-form').serialize(),
          success:function(res){
            if(res.code!== 200){
              return layer.msg('手机号修改失败！')
            }
            layer.msg('手机号修改成功!')
            initUserInfo()
            $(".phone-cover").hide();
          }
        })
        
      }
      else layer.msg('请规范填写信息');
      
    }else{
        layer.msg('验证码错误，请重新填写');
        $('.words').click();
    }
  })

  // 验证密码是否符合规范
  // let regPass = /^(?=.*[0-9])(?=.*[a-zA-Z])[0-9a-zA-Z]{8,16}$/;
  let regPass = /^[0-9a-zA-Z]{6,16}$/
  $('#newPassword').blur(function(){
    if(regPass.test($('#newPassword').prop('value')) === false){
      $('.password-wrong1').show()
      $('.password-wrong2').hide()
    }
    else{
      if($('#newPassword').prop('value') === $('#oldPassword').prop('value')){
        $('.password-wrong1').hide()
        $('.password-wrong2').show()
      }
      else{
        $('.password-wrong1').hide()
        $('.password-wrong2').hide()
      }
    }
  })
  $('.confirm-new-password').blur(function(){
    if($('.confirm-new-password').prop('value') === $('#newPassword').prop('value'))
      $('.password-wrong3').hide()  
    else $('.password-wrong3').show()
  })

  $(".btn-password").on('click',function(event){
    //阻止默认提交事件
    event.preventDefault()
    let val = $(".image-code-password").val().toLowerCase();
    let num = show_num.join("");
    if(val==''){
      layer.msg('请输入验证码！', {icon: 5})
    }else if(val === num){
      if($('.password-wrong1').css('display')==="none" && $('.password-wrong2').css('display')==="none"&&$('.password-wrong3').css('display')==="none"){
        $.ajax({
          method:'POST',
          url:'/userHome/updatePassword',
          data: $('.password-form').serialize(),
          success:function(res){
            if(res.code!== 200){
              return layer.msg('原密码错误，修改失败！')
            }
            $(".password-cover").hide();
            alert('密码修改成功！')
          }
        })
        
      }    
      else layer.msg('请规范填写信息');
    }else{
        layer.msg('验证码错误，请重新填写');
        $('.words').click();
    }
  })

})
