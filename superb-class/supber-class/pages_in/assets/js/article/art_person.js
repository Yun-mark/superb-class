$(function() {
    
    let str = window.location.search.slice(1);
    let para=str.split('=');   //["uid", "04191096"]
    let uid = para[1];
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
    // var q = {
    //   pagenum: 1, // 页码值，默认请求第一页的数据
    //   pagesize: 2, // 每页显示几条数据，默认每页显示2条
    //   cid: '', // 文章分类的 Id
    //   statestr: '' // 文章的发布状态
    // }
    //调用函数，获取用户基本信息
    getUserInfo()
  
    initTable()
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
    //initCate()

       // 获取文章列表数据的方法
      function initTable() {
        $.ajax({
          method: 'GET',
          url: 'http://supertest.nat300.top/article/get/' + uid,
          headers : {
            Authorization : 'Bearer ' + localStorage.getItem('token')|| '' ,
            token : localStorage.getItem('token')|| '' 
          },
    
          success: function(res) {
            if (res.code !== 200) {
              return layer.msg('获取文章列表失败！')
            } 
            // 使用模板引擎渲染页面的数据
            var htmlStr = template('tpl-table', res)
            $('tbody').html(htmlStr)
            renderAvatar(res.data)
            // 调用渲染分页的方法
          // renderPage(res.total)
          }
        })
      }
  
    // 初始化文章分类的方法
    function initCate() {
      $.ajax({
        method: 'GET',
        url: 'http://supertest.nat300.top/article/cates',
        headers : {
          Authorization : 'Bearer ' + localStorage.getItem('token')|| '' ,
          token : localStorage.getItem('token')|| '' 
        },
        success: function(res) {
          if (res.code !== 0) {
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
      q.cate_id = cate_id
      q.state = state
      // 根据最新的筛选条件，重新渲染表格的数据
      initTable()
    })

    
  
    
  
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
        // console.log(first)
        // console.log(obj.curr)
        // 把最新的页码值，赋值到 q 这个查询参数对象中
        q.pagenum = obj.curr
        // 把最新的条目数，赋值到 q 这个查询参数对象的 pagesize 属性中
        q.pagesize = obj.limit
        // 根据最新的 q 获取对应的数据列表，并渲染表格
        // initTable()
        if (!first) {
          initTable()
        }
      }
    })
  }

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
         // renderAvatar(res.data)
      }
  })
}

  function renderAvatar(user) {
    //获取用户的名称
    var name = user[0].nickname || user[0].username
        var first = name.slice(-2).toUpperCase()
        $('.text-avatar').html(first).show()
}
