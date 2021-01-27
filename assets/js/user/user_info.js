$(function () {
  // =======================发送ajax请求获取用户信息============
  let form = layui.form

 function getUserInfo() {
     axios.get("/my/userinfo").then((res)=>{
      //  console.log(res);
       //给表单赋值
       form.val('form',res.data.data)
     })
    }
    getUserInfo()
// =========================添加自定义校验规则====================
form.verify({
  nickname: function (value) {
    if (value.length > 6) {
      return "昵称长度需要在1-6个字符"
    }
  }
})
// =========================实现修改功能=========================
$('#form').on('submit',function (e) {
  e.preventDefault()

  let data = $(this).serialize()


  axios.post("/my/userinfo",data).then((res)=>{
    // console.log(res);
    if (res.data.status !==0) {
       return "修改用户信息失败"
    }
    layer.msg("修改用户信息成功！")
        window.parent.getUserInfo()
  })

})
// =====================重置功能===============================
$('#resetBtn').click(function () {
    e.preventDefault()

    getUserInfo()
})
})