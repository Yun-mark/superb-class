$(function() {
  //该功能尚未开发完善
  var layer = layui.layer
  var form = layui.form
  let str = window.location.search.slice(1);
  let para=str.split('=');   
  let aid = para[1];
  console.log(aid);
  articleContent(aid)
  // 定义加载文章分类的方法
  function initCate() {
    $.ajax({
      method: 'GET',
      url: 'http://39.105.118.190:8080/category/get',
      headers:{
        Authorization : 'Bearer ' + localStorage.getItem('token')|| '' ,
        token : localStorage.getItem('token')|| '' 
        },
      success: function(res) {
        if (res.code !== 200) {
          return layer.msg('初始化文章分类失败！')
        }
        // 调用模板引擎，渲染分类的下拉菜单
        var htmlStr = template('tpl-cate', res)
        $('[name=catename]').html(htmlStr)
        // 一定要记得调用 form.render() 方法
        form.render()   
      }
    })
  }

 



  // 为选择封面的按钮，绑定点击事件处理函数
  $('#btnChooseImage').on('click', function() {
    $('#coverFile').click()
  })

  // 监听 coverFile 的 change 事件，获取用户选择的文件列表
  $('#coverFile').on('change', function(e) {
    // 获取到文件的列表数组
    var files = e.target.files
    // 判断用户是否选择了文件
    if (files.length === 0) {
      return
    }
    // 根据文件，创建对应的 URL 地址
    var newImgURL = URL.createObjectURL(files[0])
    // 为裁剪区域重新设置图片
    $image
      .cropper('destroy') // 销毁旧的裁剪区域
      .attr('src', newImgURL) // 重新设置图片路径
      .cropper(options) // 重新初始化裁剪区域
  })

  // 定义文章的发布状态
  var state = '已发布'

  // 为存为草稿按钮，绑定点击事件处理函数
  $('#btnSave2').on('click', function() {
    state = '草稿箱'
  })

  // 为表单绑定 submit 提交事件
  $('#form-pub').on('submit', function(e) {
    // 1. 阻止表单的默认提交行为
    e.preventDefault()
    // 2. 基于 form 表单，快速创建一个 FormData 对象
    var fd = new FormData($(this)[0])
    // 3. 将文章的发布状态，存到 fd 中
    fd.append('statestr', state)
    fd.append('id', aid)
    publishArticle(fd)
  })

   //初始化文章内容
  function articleContent(id){
    $.ajax({
      method: 'GET',
      url: 'http://39.105.118.190:8080/article/'+ id,
      headers : {
        Authorization : 'Bearer ' + localStorage.getItem('token')|| '' ,
        token : localStorage.getItem('token')|| '' 
      } ,
      success: function(res) {
        if (res.code !== 200) {
          return layer.msg('获取周报信息失败！') 
        }
          const htmlStr = template('art-edit', res.data)
          $('.layui-card-body').html(htmlStr)
          initCate()
          // 初始化富文本编辑器
          initEditor(res.data.mdcontent)
          form.render()
          // $('option').each(function(index, domEle){
          //   console.log('aaa');
          // })
        }
        
    })
  }

  // 定义一个发布文章的方法
  function publishArticle(fd) {
    $.ajax({
      method: 'POST',
      url: 'http://39.105.118.190:8080/article/create',
      data: fd,
      headers:{
        Authorization : 'Bearer ' + localStorage.getItem('token')|| '' ,
        token : localStorage.getItem('token')|| '' 
        },
      // 注意：如果向服务器提交的是 FormData 格式的数据，
      // 必须添加以下两个配置项
      contentType: false,
      processData: false,
      success: function(res) {
        if (res.code !== 200) {
          return layer.msg('编辑文章失败！')
        }
        layer.msg('编辑文章成功！')
        // 发布文章成功后，跳转到文章列表页面
        // location.href = './art_list.html'
      }
    })
  }
})
