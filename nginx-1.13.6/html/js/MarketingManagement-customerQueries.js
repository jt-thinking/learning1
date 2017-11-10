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
            var dataValue=JSON.stringify(data.data[0].options[i].value);
               var no=JSON.stringify(data.data[0].options[i].no);
            var reg = new RegExp('"', "g");
            str = str.replace(reg, "");
            no=no.replace(reg, "");

            $(".select2").append("<option value="+dataValue+">" + str + '---------->'+no+ "</option>");
            // $(".select2>option:nth-child("+(i+1)+")").attr('value','');

        }

        // 可搜索的下拉框
        $(function() {
            $('.select2').searchableSelect();
        });


    }

})

$("#buttonQuery").click(function(){
  
  var select1=$('.select1').val();
  if (select1==='姓名'){
    var name=$('.input1').val();
  }else if(select1==='手机号'){
     var phone=$('.input1').val();
  }else{
    alert("错误，请重新操作");
  }
 var accountManager=$(".select2").val();
  $.ajax({
    url:"/apis/statistics/cust/marketing",
    headers:{
       authorization: localStorage.name
     },
     data:{
      pageSize:15,
      pageNum:1,
      marketerType:0,
      funcId:'R050100',
      name:name,
      phone:phone,
      accountManager:accountManager,

     },

     dataType:"json",
     method:"post",
     success:function(data){
     var data=data.data.list;

     for(var i=0,l=data.length;i<l;i++){
       $('tbody').append('<tr></tr>');
       $('tbody tr:nth-child('+(i+1)+')').append('<td>'+data[i].name+'</td>');
       $('tbody tr:nth-child('+(i+1)+')').append('<td>'+data[i].certNo+'</td>');
       $('tbody tr:nth-child('+(i+1)+')').append('<td>'+data[i].isLoan+'</td>');
       $('tbody tr:nth-child('+(i+1)+')').append('<td>'+data[i].phone+'</td>');
       $('tbody tr:nth-child('+(i+1)+')').append('<td>'+data[i].loanCount+'</td>');
       $('tbody tr:nth-child('+(i+1)+')').append('<td>'+data[i].investCount+'</td>');
       $('tbody tr:nth-child('+(i+1)+')').append('<td>'+data[i].investAmt+'</td>');
       $('tbody tr:nth-child('+(i+1)+')').append('<td>'+data[i].jxBankCardNo+'</td>');
       $('tbody tr:nth-child('+(i+1)+')').append('<td>'+data[i].accoutAmt+'</td>');
       $('tbody tr:nth-child('+(i+1)+')').append('<td>'+data[i].cardNo+'</td>');
       $('tbody tr:nth-child('+(i+1)+')').append('<td>'+data[i].branchName+'</td>');
       $('tbody tr:nth-child('+(i+1)+')').append('<td>'+data[i].cardNo+'</td>');
       $('tbody tr:nth-child('+(i+1)+')').append('<td>'+data[i].registerTime+'</td>');
       $('tbody tr:nth-child('+(i+1)+')').append('<td>'+data[i].bindCardTime+'</td>');
       $('tbody tr:nth-child('+(i+1)+')').append('<td>'+data[i].mainMarketerName+'</td>');
       console.log(data[i].name);
       

     }
    


     }
  })



})