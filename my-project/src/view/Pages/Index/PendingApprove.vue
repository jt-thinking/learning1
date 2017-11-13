<template>
  <div class="pending-task">
    <div class="stat-box">
      <el-button size="small" @click="$router.replace('/index-dashboad');" type="primary">返回</el-button>
    </div>
    <el-table
            :data="list.pendTask"
            :stripe="true"
            border
            style="width: 100%">
      <el-table-column
              align="center"
              label="客户名称"
              min-width="90"
      >
        <template scope="scope">
          <span>{{ scope.row.userName}}</span>
        </template>
      </el-table-column>
      <el-table-column
              prop="nodeName"
              label="任务类型"
              align="center"
              min-width="80">
      </el-table-column>
      <el-table-column
              align="center"
              label="操作"
              min-width="80"
      >
        <template scope="scope">
          <span>待审核</span>
        </template>

      </el-table-column>
      <el-table-column
              label="任务编号"
              align="center"
              min-width="120"
      >
        <template scope="scope">
          <span>{{ scope.row.taskId }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
//Message功能-提示框，本网页中为黄色警告框。[刘]
//  import Message from 'vue-bulma-message'
  export default {
      name:'Index',
  //注册组件：Message方便使用
    components: {
//        Message
    },
    data () {
      return {
          moment:moment,
          tabs:{
              taskActive:'first'
          },
          list:{
              pendTask:[]
          }
      }
    },
//    computed: {
//        monthClosingHint:function () {
//            let balanceDate = this.balanceDate
//            return `结算日期已设定为本月${balanceDate}号,请及时操作!`
//        }
//    },
      methods:{
          getPendingTask(){
              let that            = this
              let myTaskUrl         = Vue.agent.root+'/workflow/getTaskInHandOfApplicant';
              that.$http.get(myTaskUrl,{
                  funcId:that.funcId,
              }).then(function (res) {
                  if(res.body.code == 200) {
                      let list           = res.body.data.list
                      that.list.pendTask = list;
                  }
              });
          }
      },
    created:function () {
        let that = this
        that.getPendingTask()
    },
  }
</script>

<style lang="scss">
  @import 'src/scss/pages/index/todo-task.scss';
</style>
