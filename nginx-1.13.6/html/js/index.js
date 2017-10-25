

$(".login-button").click(function() {
  // $.ajaxSetup({
  //   async:false
  // });
  var jobNumber=$(".jobNumber").val();
    var password=$.md5($('.password').val()).toUpperCase();
  $.ajax({

    // crossDomain: true,
    url: "/apis/login/signIn",
      data:{
      jobNumber:jobNumber,
      password:password,
    },
    dataType:"json",
    method: "post",
    // contentType:"application/json",
    
  
    success: function(data) {
      if(data.code==200){
        alert("登录成功");
        $(location).attr("href", "index-dashboad.html");
      }
      if(data.code==400){
        alert("登录失败,请检查工号和密码");
      }

    }

  })
  
});

