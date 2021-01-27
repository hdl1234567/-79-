$(function () {
  let form = layui.form;

  // 初始化富文本编辑器
  initEditor();

  // 1. 初始化图片裁剪器
  let $image = $("#image");

  // 2. 裁剪选项
  let options = {
    aspectRatio: 400 / 280,
    preview: ".img-preview",
  };

  // 3. 初始化裁剪区域
  $image.cropper(options);

  // =============== 获取分类数据
  axios.get("/my/article/cates").then((res) => {
    // console.log(res);

    // 创建option添加到下拉框中
    res.data.data.forEach((item) => {
      $(`<option value="${item.Id}">${item.name}</option>`).appendTo(
        $("#cateSelect")
      );
    });

    // 重新渲染表单
    form.render("select");
  });

  // =============== 选择封面 ===============
  $("#chooseImg").click(function () {
    $("#file").click();
  });

  // 文件域的change事件
  $("#file").on("change", function () {
    // 选择的图片
    let file = this.files[0];
    console.log(file);

    // 没有选择到文件，后续代码不执行
    if (!file) {
      return;
    }

    // 按照文件得到对应的url地址
    let newImgURL = URL.createObjectURL(file);

    $image
      .cropper("destroy") // 销毁旧的裁剪区域
      .attr("src", newImgURL) // 重新设置图片路径
      .cropper(options); // 重新初始化裁剪区域
  });

  // 决定该文章是发布还是存为草稿
  let state; // 表示文章的状态
  // 发布按钮
  $("#btn1").click(function () {
    state = "已发布";
  });

  // 草稿按钮
  $("#btn2").click(function () {
    state = "草稿";
  });

  // ============= 发布文章===============
  $("form").on("submit", function (e) {
    e.preventDefault();

    // 收集表单中数据

    // 封面
    // 状态（已发布、草稿）

    // 封面处理
    $image
      .cropper("getCroppedCanvas", {
        // 创建一个 Canvas 画布
        width: 400,
        height: 280,
      })
      .toBlob((blob) => {
        // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作

        // 通过FormData来收集表单数据 ==> 需要使用箭头函数来解决this指向问题
        let fd = new FormData(this);

        // 以上fd只收集到了title content cate_id的值
        // 还有cover_img state的值如何收集到？？？ ==> append追加
        fd.append("cover_img", blob);
        fd.append("state", state);

        // 检测fd中收集到的数据
        /* fd.forEach((value, key) => {
          console.log(value, key);
        }); */

        // console.log(blob);
        // console.log(state);

        // 发送ajax请求
        pubArt(fd);
      });
  });

  // 实现发布文章
  function pubArt(data) {
    axios.post("/my/article/add", data).then((res) => {
      console.log(res);

      if (res.data.status !== 0) {
        return layer.msg("发布文章失败");
      }

      layer.msg("发布成功");

      // 跳转页面
      location.href = "/article/art_list.html";
    });
  }
});
