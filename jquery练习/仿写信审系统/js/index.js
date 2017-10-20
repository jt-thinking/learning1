$(".login-button").click(function() {
  $.ajaxSetup({
    async:false
  });
  $.ajax({

    crossDomain: true,
    url: "http://192.168.1.203:9180/login/signIn?jobNumber=9200&password=202CB962AC59075B964B07152D234B70",
    dataType: "json",
    method: "POST",
    // contentType:"application/json",
    beforeSend: function(request) {
                            request.setRequestHeader("Origin", "*");
                        },
    success: function(data) {
      alert();
    }
  })
  // $(location).attr("href", "index-dashboad.html");
});
