$(function() {
  let form = layui.form
// =======================添加表单的自定义校验规则===========================
 form.verify ({
   pass: [/^[\S]{6,12}$/ ,'密码必须6到12位，且不能出现空格'],
  //  新密码验证
  newPwd: function (value) {
    let oldPwd = $("[name=oldPwd]").val()
    if (oldPwd === value) {
       return "新旧密码不能相同"
    }
  },
  //确认新密码的校验
  reNewPwd: function (value) {
    let newPwd = $('[name=newPwd]').val()
    if (newPwd !== value) {
      return "两次输入密码不一致"
    }
   }
 })
// =======================实现修改密码===========================
 $("#form").on('submit',function (e) {
   e.preventDefault()

   let data = $(this).serialize()
   axios.post("/my/updatepwd" , data).then((res)=>{
      if (res.data.status !==0) {
         return  layer.msg(res.data.message)
      }
      layer.msg("更新成功")
      $("#form")[0].reset()
   })
 })
})