$(function () {
  // 1.1 获取裁剪区域的 DOM 元素
  var $image = $('#image')
  // 1.2 配置选项
  const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
  }

  // 1.3 创建裁剪区域
  $image.cropper(options)

  // 上传文件
  $('#btnChooseImage').on('click', () => {
    $('#Image').click();
  });

  // 给文件筐添加change事件
  $('#Image').on('change', function (e) {
    let list = e.target.files;
    console.log(list);
    
      if (list.length == 0) {
      return layui.layer.msg('未选中图片');
    }

    // 1. 拿到用户选择的文件
  var file = e.target.files[0]
  // 2. 将文件，转化为路径
    var imgURL = URL.createObjectURL(file)
    
    // 3. 重新初始化裁剪区域
  $image
  .cropper('destroy') // 销毁旧的裁剪区域
  .attr('src', imgURL) // 重新设置图片路径
  .cropper(options) // 重新初始化裁剪区域
  })


  // ---------------------------------------
  // 确定上传
  $('#btnOk').on('click', () => {
    var dataURL = $image
      .cropper('getCroppedCanvas', {
        // 创建一个 Canvas 画布
        width: 100,
        height: 100
      })
      .toDataURL('image/png');
    
    // 调用接口，把头像上传到服务器
    $.ajax({
      method: 'POST',
      url: '/my/update/avatar',
      data: {avatar: dataURL},
      success(res) {
        if (res.status == 0) {
          // 获取数据
          window.parent.getUserInfo();
          layui.layer.msg('更换头像成功');
        } else {
          layui.layer.msg('更换头像失败');
        }
      }
    });
  });
});