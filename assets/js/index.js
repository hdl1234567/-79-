// ====================== 发送ajax请求来获取到用户的信息 ======================
function getUserInfo() {
  axios
    .get("/my/userinfo", {
       headers: {
        Authorization: localStorage.getItem("token"),
      },
    })
    .then((res) => {
      if (res.data.status !== 0) {
        // 获取用户信息失败
        return layer.msg("获取用户信息失败");
      }
      // 获取用户信息成功 ==> 处理头像和昵称
      avatarAndName(res.data);
    });
}
getUserInfo();

// ======================  处理头像和昵称 ======================
function avatarAndName(res) {
  let name = res.data.nickname || res.data.username;
  $("#welcome").text("欢迎 " + name);
  if (res.data.user_pic) {
    $(".layui-nav-img").attr("src", res.data.user_pic).show();
    $(".text_avatar").hide();
  } else {
    // 没有自己的头像，隐藏，展示文字头像
    $(".layui-nav-img").hide();
    // 文字头像的文字是名字的第一个字符的大写
    let first = name[0].toUpperCase();
    $(".text_avatar").text(first).show();
  }
}
// ========================退出=======================
$("#logoutBtn").on('click',function () {
   
  layer.confirm('确认退出?', {icon: 5, title:'提示'}, function(index){
     localStorage.removeItem('token')
     location.href='/home/login.html'
    layer.close(index);
  });
})