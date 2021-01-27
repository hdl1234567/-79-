// ==================== ajax 获取到类别的数据 ====================
 let form = layui.form
function getArtCate() {
  axios.get("/my/article/cates").then((res) => {
    // 模板和数据结合起来
    let htmlStr = template("trTpl", res.data);
    $("tbody").html(htmlStr);
  });
}
getArtCate();
// ========================= 添加分类 =================
let index; // 存储弹出层的索引，用于后面close关于弹出层使用
$("#addBtn").click(function () {
  index = layer.open({
    type: 1, // 页面层，没有确定和取消按钮的
    title: "添加分类信息",
    content: $("#addFormTpl").html(), // 内容，可以放置html字符串，html标签是可以被识别出来的
    area: "500px", // 定宽高
  });
});

// 注意：form表单是随着弹出层的出现而出现的，所以在给form注册submit事件的时候，需要使用事件委托
$("body").on("submit", "#addForm", function (e) {
  e.preventDefault();

  // 获取到表单数据
  let data = $(this).serialize();
  axios.post("/my/article/addcates", data).then((res) => {
    if (res.data.status !== 0) {
      // 失败
      return layer.msg("新增文章分类失败");
    }
    // 成功
    layer.msg("新增文章分类成功");
    // 2. 关闭弹出层
    layer.close(index);
    // 3. 重新发送ajax，获取所有的分类数据
    getArtCate();
  });
});
// =================编辑功能=====================
let editIndex; // 变量editIndex存储编辑的弹出层的索引
$("body").on("click", ".editBtn", function () {
  console.log('1');
  // 获取到当前编辑按钮上使用自定义属性data-id存储的Id的值，需要获取到，发送ajax请求获取到数据
  let id =$(this).attr('data-id')
//  发送请求
axios.get("/my/article/cates/" + id).then((res)=>{
    // 给表单赋值
    form.val('editForm', res.data.data)
})
editIndex = layer.open({
  type: 1, // 页面层
  title: "编辑分类信息",
  content: $("#editFormTpl").html(),
  area: "500px", // 定宽高
});
})
//======================实现编辑功能=====================
$('body').on('submit','#editForm',function (e) {
  e.preventDefault()
  //  获取表单数据
  let data = $(this).serialize()
// 发送请求
  axios.post("/my/article/updatecate", data).then((res)=>{
    if (res.data.status !==0) {
        return layer.msg("更新失败");
    }
    layer.msg("更新分类数据成功");
    // 2. 关闭弹出层layer.open
    layer.close(editIndex);

    getArtCate() 
  })
})
// ====================删除功能=====================
$('tbody').on('click','.delBth',function () {
  console.log('1');
   let id = $(this).attr('data-id')
   layer.confirm('确定删除?', {icon: 3, title:'提示'}, function(index){
     axios.get("/my/article/deletecate/" + id).then((res)=> {
        if (res.data.status !==0) {
          return layer.msg("删除文章分类失败");
          
        }
        layer.msg("删除文章分类成功");
        layer.close(index); 
        getArtCate();

      })
    });
})

