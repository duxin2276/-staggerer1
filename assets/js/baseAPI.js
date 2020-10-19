// 注意：每次调用$.get() 或$.post() 或 $.ajax() 的时候，
// 会先调用 ajaxPrefilter 这个函数
// 这个函数中，可以拿到我们给ajax提供的配置对象 
$.ajaxPrefilter(function (options) {
    options.url = 'http://ajax.frontend.itheima.net' + options.url;


    //  统一为有权限的接口设置headers请求头
    if (options.url.indexOf('/my') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token')
        }
    }

    // 利用请求后服务器返回的状态来决定用户是否可以登录
    options.complete = (res) => {
        // console.log(res);

        // 利用请求后服务器返回的状态来决定用户是否可以登录
        if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
            // 1. 强制清空token
            localStorage.removeItem('token');

            // 2. 强制跳转到首页
            window.top.location.href = 'login.html';
        }
    }
});