$(function(){
  layui.use('element', function(){
    var element = layui.element;
  });
  let layer = layui.layer

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
  init()
  
  //初始化
  function init(){
    $.ajax({
      method: 'GET',
      url: 'http://supertest.nat300.top/article/latest',
      headers : {
        Authorization : 'Bearer ' + localStorage.getItem('token')|| '' ,
        token : localStorage.getItem('token')|| '' 
      } ,
      success: function(res) {
        if (res.code !== 200) {
          return layer.msg('获取成员列表失败！') 
        }
        var htmlStr = template('second-grade', res)
        console.log(res);
        $('.second').html(htmlStr)
        
        renderAvatar(res.data)
        console.log(res.data);
      }
    })
  }
  

  //搜索内容
  $('.layui-icon-search').on('click', function(){
    let loc = $(".search-input").val();
     //搜索内容所在元素下遍历 
    $("li").each(function() { 
      if($(this).children('.name').text()===loc){
        $(this).parent().parent().prop('class','layui-colla-content layui-show')
        //定位id属性
        $(this).prop('id','test'); 
        //跳转到id位置
        $('a span').click();
        //自定页
        layer.open({
          type: 1,
          skin: 'layui-layer-molv', //样式类名
          closeBtn: 0, //不显示关闭按钮
          anim: 2,
          title:'点击查看',
          area: ['90%', '200px'],
          shadeClose: true, //开启遮罩关闭
          content: $('#test')
        }); 
        $('#test').css('display', 'block')
      }
      //清除id
      $(this).prop('id', '');
    });
  })
  
  // 预览文章
  $('.second').on('click','.eye', function () {
    $.ajax({
      method: 'GET',
      url: 'http://supertest.nat300.top/article/'+ $(this).attr('data-id'),
      headers : {
        Authorization : 'Bearer ' + localStorage.getItem('token')|| '' ,
        token : localStorage.getItem('token')|| '' 
      } ,
      success: function(res) {
        if (res.code !== 200) {
          return layer.msg('获取成员列表失败！') 
        }
        console.log(res);
        const htmlStr = template('tmpl-artinfo', res.data)
        console.log(htmlStr);
        layer.open({
              type: 1,
              title: '周报详情页',
              skin: 'layui-layer-molv',
              area: ['80%', '80%'],
              maxmin: true, //开启最大化最小化按钮
              content: htmlStr
            })
            
          }
        
    })
  })
  // 查看全部周报
  $('.second').on('click','.all-art', function () {
      layer.open({
          type: 2,
          title: '全部周报',
          skin: 'layui-layer-molv',
          shadeClose: true,
          shade: false,
          maxmin: true, //开启最大化最小化按钮
          area: ['893px', '600px'],
          content: './art_person.html' + '?uid=' + $(this).attr('data-id')
        });
           
  }) 
})
function renderAvatar(user) {

  $('.second').children().children('.head-image').each(function(index,domEle){
    if(index===user.length){
      return
    }
    else{
      let name = user[index].nickname 
      let first = name.slice(-2).toUpperCase()
      $(domEle).html(first).show()
    } 
  })
}
