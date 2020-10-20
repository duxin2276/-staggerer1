let form = layui.form;
let laypage = layui.laypage;
// 定义一个查询的参数对象，将来请求数据的时候，
// 需要将请求参数对象提交到服务器
let p = {
  pagenum: 1, // 页码值
  pagesize: 2, // 每页显示几条数据,默认每页显示10条
  cate_id: '', // 文章分类的Id
  state: '' // 文章的发布状态
}
// <---------------------------------------------------------->
// 入口函数
$(function () {
  // 刷新数据
    load();
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

  // 初始化文章分类
  initCate();

  // 筛选文章
  screen();

  // 删除文章
  removeArticle();
});

// <----------------------------------------------->
// 刷新数据
function load() { 
    $.get('/my/article/list', p, (res) => {
        // console.log(res);
        
        // 导入template()
        let data = template('tpl-table', res);

        // 放入到容器中
      $('tbody').html(data);
      
      // 调用渲染分页的方法
      renderPage(res.total);
    })
}

// 初始化文章分类
function initCate() {
  $.get('/my/article/cates', (res) => {
    // console.log(res);
    if (res.status !== 0) {
      return layer.msg(res.message);
    }
    // 利用模板引擎来渲染
    let htmlStr = template('tpl-cate', res);
    // console.log(htmlStr);
    // 放到容器中
    $('[name = cate_id]').html(htmlStr);

    // 通知layui重新渲染一下页面
    form.render();
    // 后天返回成功的消息
    layer.msg(res.message);
  });
}

// 筛选文章
function screen() {
  $('#btn-screen').on('click', function () {
    // 获取表单中的数据
    let cate_id = $('[name = cate_id]').val();
    let state = $('[name = state]').val();

    // 把表单获取过来的值给到p对象
    p.cate_id = cate_id;
    p.state = state;

    // 再次调用 load() 刷新数据
    load();
  });
}

// 定义渲染分页的方法
function renderPage(total) {
  // console.log(total);
  // 调用 laypage.render()方法来渲染分页的结构
  laypage.render({
    elem: 'pageBox', // 分页容器的Id
    count: total, // 总数据条数
    limit: p.pagesize, // 每页显示几条数据
    curr: p.pagenum, // 设置默认被选中的分页
    layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
    limits: [2, 3, 5, 10],

    // 分页切换的时候触发jump() 回调函数
    // 通过第二个参数(flag)的值来调用load()
    jump: (obj, flag) => {
      // console.log(obj.curr);
      // 把最新的页码值给到p对象中的pagenum属性
      p.pagenum = obj.curr;
      // 把最新的条目数给到pagesize
      p.pagesize = obj.limit;

      // 调用load() 刷新数据
      if (!flag) {
        load();
      } 
    }
  })
}


// 删除文章
function removeArticle() {
  $('tbody').on('click', '.remove-article', function () {
    // 通过页面的删除按钮个数判断出多少条数据
    let len = $('.remove-article').length;
    console.log(len);
    // 获取id
    let id = $(this).attr('data-id');
    layer.confirm('确定要删除吗?', {icon: 3, title:'提示'}, function(index){
      $.get('/my/article/delete/' + id, (res) => {
        console.log(res);
        if (res.status != 0) {
          // 失败消息
          return layer.msg(res.message);
        }
        // 成功消息
        layer.msg(res.message);
        // 当length为1的时候pagenum -1 
        if (len == 1) {
          p.pagenum = p.pagenum === 1 ? 1 : p.pagenum - 1;
        }
        // 刷新数据
        load();
      })
      layer.close(index);
    });
    
  });
}