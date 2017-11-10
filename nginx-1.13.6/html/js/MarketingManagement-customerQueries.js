$.ajax({
   // 获取所有客户经理接口
    url: "/apis/manageUser/options?funcId=R050100",
    headers: {
        authorization: localStorage.name
    },

    dataType: "json",
    method: "get",
    

// 处理json数据
    success: function(data) {


        for (var i = 0, l = data.data[0].options.length; i < l; i++) {
            var str = JSON.stringify(data.data[0].options[i].name);
            var reg = new RegExp('"', "g");
            str = str.replace(reg, "");

            $(".select2").append(" <option value="">" + str + "</option>")

        }


// 可搜索的下拉框
        $(function() {
            $('.select2').searchableSelect();
        });








    }

})