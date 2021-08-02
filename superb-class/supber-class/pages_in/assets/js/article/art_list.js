$(function() {
    var layer = layui.layer
    var form = layui.form
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
  
    // 定义一个查询的参数对象，将来请求数据的时候，
    // 需要将请求参数对象提交到服务器
        var q = {
          pagenum: 1, // 页码值，默认请求第一页的数据
          pagesize: 2, // 每页显示几条数据，默认每页显示2条
          catename: '', // 文章分类的 Id
          statestr: '' // 文章的发布状态
        }
    //调用函数，获取用户基本信息
    getUserInfo()
  
    initTable()
    initCate()

    $('.layui-table').on('click','a', function () {
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
          const htmlStr = template('tmpl-artinfo', res.data)
          layer.open({
                type: 1,
                title: '周报详情页',
                area: ['80%', '80%'],
                maxmin: true, //开启最大化最小化按钮
                content: htmlStr
              })
              
            }
          
      })
    })

       // 获取文章列表数据的方法
      function initTable() {
        $.ajax({
          method: 'GET',
          url: 'http://supertest.nat300.top/article/get',
          headers : {
            Authorization : 'Bearer ' + localStorage.getItem('token')|| '' ,
            token : localStorage.getItem('token')|| '' 
          },
          data: q,
          success: function(res) {
            if (res.code !== 200) {
              return layer.msg('获取文章列表失败！')
            } 
            // 使用模板引擎渲染页面的数据
            var htmlStr = template('tpl-table', res)
            $('tbody').html(htmlStr)
            // 调用渲染分页的方法
           renderPage(res.data.length)
          }
        })
      }
  
    // 初始化文章分类的方法
    function initCate() {
      $.ajax({
        method: 'GET',
        url: 'http://supertest.nat300.top/category/get',
        headers : {
          Authorization : 'Bearer ' + localStorage.getItem('token')|| '' ,
          token : localStorage.getItem('token')|| '' 
        },
        success: function(res) {
          if (res.code !== 200) {
            return layer.msg('获取分类数据失败！')
          }
          // 调用模板引擎渲染分类的可选项
          var htmlStr = template('tpl-cate', res)
          $('[name=cate_id]').html(htmlStr)
          // 通过 layui 重新渲染表单区域的UI结构
          form.render()
        }
      })
    }
  
    // 为筛选表单绑定 submit 事件
    $('#form-search').on('submit', function(e) {
      e.preventDefault()
      // 获取表单中选中项的值
      var cate_id = $('[name=cate_id]').val()
      var state = $('[name=state]').val()
      // 为查询参数对象 q 中对应的属性赋值
      q.catename = cate_id
      q.statestr = state
      // 根据最新的筛选条件，重新渲染表格的数据
      initTable()
    })

    
  
    // 定义渲染分页的方法
    function renderPage(total) {
      // 调用 laypage.render() 方法来渲染分页的结构
      laypage.render({
        elem: 'pageBox', // 分页容器的 Id
        count: total, // 总数据条数
        limit: q.pagesize, // 每页显示几条数据
        curr: q.pagenum, // 设置默认被选中的分页
        layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
        limits: [2, 3, 5, 10],
        // 分页发生切换的时候，触发 jump 回调
        // 触发 jump 回调的方式有两种：
        // 1. 点击页码的时候，会触发 jump 回调
        // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调
        jump: function(obj, first) {
          // 可以通过 first 的值，来判断是通过哪种方式，触发的 jump 回调
          // 如果 first 的值为 true，证明是方式2触发的
          // 否则就是方式1触发的
           console.log(first)
           console.log(obj.curr)
          // 把最新的页码值，赋值到 q 这个查询参数对象中
          q.pagenum = obj.curr
          // 把最新的条目数，赋值到 q 这个查询参数对象的 pagesize 属性中
          q.pagesize = obj.limit
          // 根据最新的 q 获取对应的数据列表，并渲染表格
          // initTable()
          console.log(total);
          if (!first) {
            initTable()
          }
        }
      })
    }
  
    // 通过代理的形式，为删除按钮绑定点击事件处理函数
    $('tbody').on('click', '.btn-delete', function() {
      // 获取删除按钮的个数
      var len = $('.btn-delete').length
      // 获取到文章的 id
      var id = $(this).attr('data-id')
      // 询问用户是否要删除数据
      layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
        $.ajax({
          method: 'GET',
          url: 'http://supertest.nat300.top/article/dustbin/' + id,
          headers : {
            Authorization : 'Bearer ' + localStorage.getItem('token')|| '' ,
            token : localStorage.getItem('token')|| '' 
          },
          success: function(res) {
            if (res.code !== 200) {
              return layer.msg('删除文章失败！')
            }
            layer.msg('删除文章成功！')
            // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
            // 如果没有剩余的数据了,则让页码值 -1 之后,
            // 再重新调用 initTable 方法
            // 4
            if (len === 1) {
              // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
              // 页码值最小必须是 1
              q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
            }
            initTable()
          }
        })
  
        layer.close(index)
      })
    })
    // 通过代理的形式，为编辑按钮绑定点击事件处理函数
  $('tbody').on('click', '.btn-edit', function() {
    // 获取到文章的 id
    // var id = $(this).attr('data-id')
    // // 询问用户是否要删除数据
    // layer.open({
    //   type: 2,
    //   title: '编辑周报',
    //   skin: 'layui-layer-molv',
    //   shadeClose: true,
    //   shade: false,
    //   maxmin: true, //开启最大化最小化按钮
    //   area: ['1100px', '650px'],
    //   content: './art_edit.html' + '?aid=' + id
    // });
    layer.alert('该功能程序猿小哥哥还在开发中...', {
      skin: 'layui-layer-molv' //样式类名
      ,closeBtn: 0,
      title:'尊敬的用户',
      anim: 3
    });
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
