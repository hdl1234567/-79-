$(function () {
  let form = layui.form;
  let laypage = layui.laypage;

  // 定义查询参数
  const query = {
    pagenum: 1, // 是	int	页码值
    pagesize: 2, // 是	int	每页显示多少条数据
    cate_id: "", // "" 所有的文章分类 否	string	文章分类的 Id
    state: "", // "" 所有状态 文章状态  可选值有：已发布、草稿
  };

  // 定义补零函数
  const padZero = (n) => (n < 10 ? "0" + n : n);

  // 过滤器函数来处理时间格式
  template.defaults.imports.formatTime = function (time) {
    // 把日期t转时分秒操作
    let d = new Date(time);

    let y = d.getFullYear();
    let m = padZero(d.getMonth() + 1);
    let day = padZero(d.getDate());

    let hours = padZero(d.getHours());
    let min = padZero(d.getMinutes());
    let s = padZero(d.getSeconds());

    return `${y}/${m}/${day} ${hours}:${min}:${s}`;
  };

  getList();
  function getList() {
    axios
      .get("/my/article/list", {
        // 发送的数据
        params: query,
      })
      .then((res) => {
        console.log(res);

        // 渲染tr
        let htmlStr = template("trTpl", res.data);
        $("#tb").html(htmlStr);

        // 处理分页 ==> 把总页数传递给该函数
        renderPage(res.data.total);
      });
  }

  // 分页处理函数
  function renderPage(total) {

    // 执行一个laypage实例
    laypage.render({
      elem: "pageBox", //注意，这里的 test1 是 ID，不用加 # 号
      count: total, //数据总数，从服务端得到
      curr: query.pagenum, // 起始页，从query对象中可以获取到
      limit: query.pagesize, // 每页条数，从query对象中可以获取到
      limits: [1, 2, 3, 5, 8, 10],
      layout: ["count", "limit", "prev", "page", "next", "skip"],
      jump: function (obj, first) {
        // 点击分页，需要加载对应分页的数据
        // 1. 修改query对象的pagenum页码值为当前页
        // 2. 发送ajax请求获取到数据
        query.pagenum = obj.curr;
        // 修改pagesize的值(每页显示的条数)
        query.pagesize = obj.limit;        // 2.
        // 首次（初始化渲染分页的时候）不执行
        if (!first) {
          // 点击分页才执行
          getList();
        }
      },
    });
  }

  // 获取分类数据
  axios.get("/my/article/cates").then((res) => {
    // 动态创建option添加到下拉框中
    res.data.data.forEach(function (item) {
      // console.log(item);
      $(`<option value="${item.Id}">${item.name}</option>`).appendTo(
        $("#cateSelect")
      );
    });
    // 当option创建添加到下拉框之后，手动更新form表单全部内容
    form.render();
  });
  // 实现筛选功能
  $("#form").on("submit", function (e) {
    e.preventDefault();
    // 在发送请求之前，还需要修改下query查询参数里面的cate_id 以及 state 值
    query.cate_id = $("#cateSelect").val();
    query.state = $("#stateSelect").val();

    // 筛选的时候，筛选出第一页的数据来查看(解决小bug)
    query.pagenum = 1;

    // console.log(query);

    // 发送请求
    getList();
  });

  // ========== 实现删除功能
  $("#tb").on("click", ".delBtn", function () {
    let id = $(this).attr("data-id");

    layer.confirm("确定删除?", { icon: 3, title: "提示" }, function (index) {
      // do something 点击确认按钮

      if ($(".delBtn").length === 1) {
        query.pagenum = query.pagenum === 1 ? 1 : query.pagenum - 1;
      }

      // 点击确认按钮,来发送ajax请求实现删除文章
      axios.get("/my/article/delete/" + id).then((res) => {
        console.log(res);

        if (res.data.status !== 0) {
          return layer.msg("删除文章失败");
        }

        layer.msg("删除文章成功");

        // 发送ajax获取最新的数据
        getList();
      });

      layer.close(index);
    });
  });
});
