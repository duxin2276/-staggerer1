// 外部声明一个全局变量
let $btnLogin, $btnReg;
// 入口函数
$(function () {
    $btnLogin = $('.login-box');
    $btnReg = $('.reg-box')
    // 去注册
    $('#link_reg').on('click', function () {
        $btnReg.show();
        $btnLogin.hide();
    });

    // 去登录
    $('#link_login').on('click', function () {
        $btnLogin.show();
        $btnReg.hide();
    });

    // 登录校验
    let form = layui.form;
    // console.log(form);
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],

        // 确认密码再次校验
        repwd: (value) => {
            let pwdStr = $('.reg-box #password').val();
            if (pwdStr !== value) {
                return '两次输入的密码不正确';
            }
        }
    });

    // 注册
    register();

    // 登录
    login();
});


// 注册功能
function register() {
    $('#reg').on('submit', (e) => {
        e.preventDefault();
        // let regStr = $('#reg').serialize();
        let username = $('.reg-box [name = username]').val();
        let password = $('.reg-box [name = password]').val();
        // console.log(username);
        // console.log(password);
        // console.log(regStr);
        $.post('/api/reguser', {
            username: username,
            password: password
        }, (res) => {
            if (res.status !== 0) {
                return layui.layer.msg(res.message);
            } else {
                // alert(res.message);
                layui.layer.msg(res.message);
                // 跳转到登录页面
                $('#link_login').click();
                $('.login-box [name = username]').val(username);
                $('.login-box [name = password]').val(password);
            }
        })
    });
}

// 登录功能
function login() {
    $('#login').on('submit', function (e) {
        e.preventDefault();
        console.log($(this).serialize());
        $.post('/api/login',
            $(this).serialize(), (res) => {
                if (res.status !== 0) {
                    layui.layer.msg(res.message);
                } else {
                    layui.layer.msg(res.message);
                    // 将获取的token存到本地存储中
                    localStorage.setItem('token', res.token);
                    // 跳转到首页
                    location.href = 'index.html';
                }

            });
    });
}