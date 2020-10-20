// layui的方法
let layer = layui.layer;
let form = layui.form;
// 入口函数
$(function () {
    // 1.渲染文章类别
    initCate()

    // 2.初始化富文本编辑器
    initEditor()


    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)


    // 点击按钮选择封面
    $('#btnChooseImg').on('click', function () {
        $('#coverFile').click();
    });

    // 监听coverFile 的change事件
    $('#coverFile').on('change', function (e) {
        let files = e.target.files

        // 判断用户是否选择了图片
        if (files.length == 0) {
            return
        }
        // 根据文件，创建对应的 URL 地址
        let newImgURL = URL.createObjectURL(files[0])
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    });


    // 定义一个变量，用于保存state
    let state = '已发布';
    // 点击btnsave后改变state的值
    $('#btnsave').on('click', function () {
        state = '草稿';
    });

    // 提交数据
    $('#form-pub').on('submit', function (e) {
        // 阻止表单默认行为
        e.preventDefault();
        
        // 创建一个FormData对象
        let fd = new FormData($(this)[0]);

        // 3. 将文章的发布状态，存到 fd 中
        fd.append('state', state);

        // 4. 将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                // 6. 发起 ajax 数据请求
                publishArticle(fd);
            })
        
    });
});

// 渲染文章类别
function initCate() {
    $.get('/my/article/cates', (res) => {
        if (res.status != 0) {
            return layer.msg(res.message);
        }
        layer.msg(res.message);

        // 调用template() 方法 渲染数据
        let data = template('tpl-cate', res);

        // 渲染到容器中
        $('[name = cate_id]').html(data);

        // 调用layui的方法渲染表单
        form.render();
    });
}

// 发起 ajax 数据请求  发布文章
function publishArticle(fd) {
    $.ajax({
        method: 'POST',
        url: '/my/article/add',
        data: fd,
        contentType: false,
        processData: false,
        success(res) {
            if (res.status != 0) {
                return layer.msg(res.message);
            }
            layer.msg(res.message);

            // 跳转到文章列表
            location.href = 'art_list.html';
        }
    })
}
