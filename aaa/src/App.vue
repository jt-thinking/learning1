<template>
  <div id="app">
    
    <div class="mainBody">
      
      <div class='title'>信贷业务调查报告(2017.08.17版) </div>
      <hr>
      <div class="baseInfo">客户基础信息</div>
     
      <table frame='border' rules="all">
        <tr>
          <td class="first">户名</td>
          <td class="second"></td>
          <td class="third">证件编号</td>
          <td class="fourth"></td>
          <td class="fifth">手机号码</td>
          <td class="sixth"></td>
        </tr>

        <tr>
          <td>性别</td>
          <td></td>
          <td>婚姻状况</td>
          <td>
            <select>
              <option>未婚</option>
              <option>已婚</option>
              <option>未婚</option>
              <option>未婚</option>
              <option>未婚</option>

            </select>

          </td>
          <td>安快担保余额</td>
          <td></td>
       </tr>

        <tr>
          <td>居住状况</td>
          <td></td>
          <td>房屋类型</td>
          <td></td>
          <td>房屋年限</td>
          <td></td>
        </tr>

          <tr>
          <td>户籍地址</td>
          <td colspan="5"></td>
          
        </tr>

        <tr>
          <td>经营地址</td>
           <td colspan="5"></td>
        </tr>



      </table>


    </div>
   
  </div>
</template>

<script>


export default {
  data:function(){
    return{
     

    }
  }
  
}
</script>

<style>
td{
  text-align: center
}
.first,.third,.fifth{
  width: 10rem;

}
.second,.fourth,.sixth{
  width:13rem;
}
#app {
  margin: 2rem 0; 
  font-size: 16px;
  
}
.title{
  text-align: center;
  font-size: 1.5rem; 
}
.mainBody{
  width: 60rem;
  border:0.1rem #070007 solid;
  height: 100rem;

  margin:5% 16% ;
}
.baseInfo{

    font-size: 1.2rem; 
}

</style>
