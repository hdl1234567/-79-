$(function () {
  // ========================= 裁剪区域 ======================
//  获取裁剪区DOM元素
let $image = $('#image')

// 配置选项
let options = {
    // 纵横比
  aspectRatio:1,
      // 指定预览区域
  preview:'.img-preview'
}
 
// 创建裁剪区域
$image.cropper(options)

// ===========================点击上传文件 模拟点击文件域=======
  $('#chooseBtn').click(function () {
    $("#file").click()
  })
// ===========================文件域change事件================
  // 当文件域发生改变的时候就会触发change事件
  $("#file").on("change", function () {
    // 1. 获取到用户选择的图片（文件域的DOM对象的files属性）
    let file = this.files[0]
  //  如果file不存在 用户没有选择照片 后续操作不执行
  if (!file) {
    return
  }
   // 2. 把用户选择的图片设置到裁剪区域（预览区域和裁切大小都要发生改变）
    // 根据选择的文件，创建一个对应的 URL 地址： 
    let newImgURL = URL.createObjectURL(file);
    $image
    .cropper("destroy") // 销毁旧的裁剪区域
    .attr("src", newImgURL) // 重新设置图片路径
    .cropper(options); // 重新初始化裁剪区域

  })
  // ==========================点击确定 上传头像===============
  $("#sureBtn").click(function () {
    let dataURL = $image
    .cropper("getCroppedCanvas", {
        // 创建一个 Canvas 画布
        width: 100,
        height: 100,
     })
     .toDataURL("image/png"); // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
     axios
     .post("/my/update/avatar", "avatar=" + encodeURIComponent(dataURL))
     .then((res) => {
      if (res.data.status !== 0) {
        return layer.msg("更新头像失败");

         
       }
       layer.msg("更新头像成功");
       window.parent.getUserInfo();
      })


   })


})