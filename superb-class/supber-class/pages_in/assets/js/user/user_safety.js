$(function(){
  let form = layui.form;
  let layer = layui.layer;
  $('#changeIphone').on('click',function(){
      layer.open({
        type: 1,
        area: ['600px', '360px'],
        shadeClose: true, //点击遮罩关闭
        content: `
        <div class="small-box-phone">
  <h2>修改手机号</h2>
  <form class="layui-form" action="">
    <div class="layui-form-item">
      <label class="layui-form-label">输入框</label>
      <div class="layui-input-block">
        <input type="text" name="title" required  lay-verify="required" placeholder="请输入标题" autocomplete="off" class="layui-input">
      </div>
  </div>
  <div class="layui-form-item">
    <label class="layui-form-label">输入框</label>
    <div class="layui-input-block">
      <input type="text" name="title" required  lay-verify="required" placeholder="请输入标题" autocomplete="off" class="layui-input">
    </div>
</div>
<div class="layui-form-item">
  <label class="layui-form-label">输入框</label>
  <div class="layui-input-block">
    <input type="text" name="title" required  lay-verify="required" placeholder="请输入标题" autocomplete="off" class="layui-input">
  </div>
</div>
  </form>
</div>
        `
    });
  }) 
  // $('#changePassword').on('click', function(){})
 
})