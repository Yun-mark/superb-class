
$(function(){
  let form = layui.form;
  var show_num = [];
  
  // 修改手机号弹窗
  $('#changeIphone').on('click', function(){
    $('.phone-cover').show();
    draw(show_num,document.getElementById('canvas'));
    $('#canvas').prop('width','100');
    $('#canvas').prop('height','43');
    $(".words").on('click',function(){
      draw(show_num,document.getElementById('canvas'));
    })
    $('.words').click();
    $(".btn").on('click',function(){
      var val = $(".image-code").val().toLowerCase();
      var num = show_num.join("");
      if(val==''){
          alert('请输入验证码！');
      }else if(val == num){
          alert('提交成功！');
          $(".image-code").val('');
          draw(show_num,document.getElementById('canvas'));

      }else{
          alert('验证码错误！请重新输入！');
          $(".image-code").val('');
          draw(show_num,document.getElementById('canvas'));
      }
  })
  })
  $('.phone-close').click(function() {
      $(".phone-cover").hide();
  });



  // 修改密码弹窗
  $('#changePassword').on('click', function(){
    $('.password-cover').show();
    draw(show_num,document.getElementById('canvasPassword'));

    $('#canvasPassword').prop('width','100');
    $('#canvasPassword').prop('height','43');
    $(".words").on('click',function(){
      draw(show_num,document.getElementById('canvasPassword'));
  })
    $('.words').click();
    $(".btnPass").on('click',function(){
      var val = $(".image-code-password").val().toLowerCase();
      var num = show_num.join("");
      if(val==''){
          alert('请输入验证码！');
      }else if(val == num){
          alert('提交成功！');
          $(".image-code-password").val('');
          draw(show_num,document.getElementById('canvasPassword'));

      }else{
          alert('验证码错误！请重新输入！');
          $(".image-code-password").val('');
          draw(show_num,document.getElementById('canvasPassword'));
      }
  })
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
  



  
    
  //获取手机号
  // $.ajax({
    
  // })
  




})