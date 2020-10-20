let layer = layui.layer;
let indexAdd = null;
let indexEdit = null;
let form = layui.form
// 入口函数
$(function () {
    // 渲染数据
    initArtCateList();

    // 添加类别
    $('#btnAdd').on('click', () => {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#tpl-layui').html()
          })
    });

    // 修改类别
    $('tbody').on('click', '#btn-Edit', function () {
        let id = $(this).attr('data-id');
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#edit-tpl').html()
        });
        // 把id传给editData
        // editData(id)
        $.get('/my/article/cates/' + id, (res) => {
            // console.log(res);
            form.val('form-edit', res.data);
        })
    });

    // 添加数据
    addForm();

    // 修改数据
    editData();

    // 删除数据
    removeData();
});

// 渲染数据
function initArtCateList() {
    $.get('/my/article/cates',(res) => {
        console.log(res);
        
        // 调用template函数
        let data = template('tpl', res);

        // 放到容器里
        $('tbody').html(data);
    })
}

// 添加数据
function addForm() {
    $('body').on('submit', '#add-form', function(e){
        e.preventDefault();
        let formStr = $(this).serialize();
        $.post('/my/article/addcates', formStr,
            (res) => {
                if (res.status !== 0) {
                    return layer.msg('添加失败');
                }
                
                // 刷新数据
                initArtCateList();

                layer.close(indexAdd);

                layer.msg('添加成功');
        })
    });
}

// 编辑数据
function editData() {
    $('body').on('submit', '#edit-form', function (e) {
        e.preventDefault();
        $.post('/my/article/updatecate',
            $(this).serialize(),
            (res) => {
            // console.log(res);
            if (res.status !== 0) {
                layer.msg('修改数据失败');
            }


            // 关闭弹出层
            layer.close(indexEdit);

            // 刷新页面
            initArtCateList();
            
            layer.msg('修改数据成功');
        })
    })
}

// 删除数据
function removeData() {
    $('tbody').on('click', '#btnRemove', function () { 
        let id = $(this).siblings().attr('data-id');
        layer.confirm('你确定要删除吗?', {icon: 3, title:'提示'}, function(index){
            $.get('/my/article/deletecate/' + id, (res) => {
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            
            initArtCateList();

            layer.msg(res.message);
        })
            
            layer.close(index);
          });
    })
}
