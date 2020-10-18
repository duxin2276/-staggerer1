let layer = layui.layer;
// 入口函数
$(function () {
    // 获取用户信息
    getUserInfo();

    // 退出功能
    $('#btnLogout').on('click', function () {
        layer.confirm('确定退出登录?', {icon: 3, title:'提示'}, function(index){
            
            // 清空本地的token
            localStorage.removeItem('token');

            // 跳转到首页
            location.href = 'login.html';
            layer.close(index);
          });
    });
});


// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        headers: {
            Authorization: localStorage.getItem('token')
        },
        success: (res) => {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败');
            }
            // 渲染用户头像
            renderAvatar(res.data);
        },
        // complete: (res) => {
        //     // console.log(res);

        //     // 利用请求后服务器返回的状态来决定用户是否可以登录
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
        //         // 1. 强制清空token
        //         localStorage.removeItem('token');

        //         // 2. 强制跳转到首页
        //         location.href = 'login.html';
        //     }
        // }
    });
}

// 渲染用户头像
function renderAvatar(user) {
    // 1. 获取用户的昵称
    let name = user.nickname || user.username;

    // 2. 设置用户的内容
    $('#welcome').html('欢迎&nbsp&nbsp' + name);

    // 3. 按需求渲染用户的头像
    if (user.user_pic !== null) {
        // 渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        // 渲染文字头像
        $('.layui-nav-img').hide();
        // toUpperCase  装换为大写
        let first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();
    }
}