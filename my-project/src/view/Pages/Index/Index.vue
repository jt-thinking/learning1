<template>
  <div class="index-dashboard">
    <h3 class="calendar">{{moment().format('YYYY-MM-DD')}}  {{moment().format('dddd')}}</h3>
    <el-row :gutter="10">
      <el-col :span="6">
        <div class="grid-content">
          <div class="box">
          </div>
      </div>
      </el-col>
      <el-col :span="18">
        <div class="grid-content">
          <div class="box">
            <el-tabs v-model="tabs.taskActive" type="card" @tab-click="handleClick">
              <el-tab-pane label="我的任务" name="first">
                <el-row :gutter="20">
                  <el-col :span="12">
                    <div class="box-content">
                      <div>
                        <router-link class="pull-right" :to="{ path: 'index-todo-task' }">更多</router-link>
                        <h3>待处理的任务</h3>
                      </div>
                      <el-table
                              :data="list.myTask"
                              :stripe="true"
                              border
                              style="width: 100%">
                        <el-table-column
                                align="center"
                                label="客户名称"
                                min-width="90"
                        >
                          <template scope="scope">
                            <span>{{ scope.row.custName}}</span>
                          </template>
                        </el-table-column>
                        <el-table-column
                                prop="type"
                                label="任务类型"
                                align="center"
                                min-width="80">
                          <template scope="scope">
                            <!--| opsFormat(ops.approvalType)-->
                            <span>{{ scope.row.bzName}}</span>
                          </template>
                        </el-table-column>
                        <el-table-column
                                align="center"
                                label="操作"
                                min-width="80"
                        >
                          <template scope="scope">
                            <span>待操作</span>
                          </template>
                        </el-table-column>
                        <el-table-column
                                label="任务编号"
                                align="center"
                                min-width="120"
                        >
                          <template scope="scope">
                            <router-link :to="{ path: 'index-approve', query: { taskType: scope.row.bzType,businessKey:scope.row.bzKey,taskId:scope.row.taskId,instanceId:scope.row.instanceId }}">{{ scope.row.taskId }}</router-link>
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div class="box-content">
                      <div>
                        <router-link class="pull-right" :to="{ path: 'index-wait-approve' }">更多</router-link>
                        <h3>待审批的任务</h3>
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
                                prop="custName"
                        >
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
                  </el-col>
                </el-row>

              </el-tab-pane>
              <el-tab-pane label="审批中的任务" name="second">配置管理</el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </el-col>
    </el-row>
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
          funcId:'R010100',
          list:{
              myTask:[
              ],
              pendTask:[

              ]
          },
          ops:{
              approvalType:[]
          }
      }
    },
    methods:{
          getToDoTask(){
              let that            = this
              let myTaskUrl         = Vue.agent.root+'/workflow/getTaskInHand';
              that.$http.get(myTaskUrl,{
                  funcId:that.funcId,
              }).then(function (res) {
                  if(res.body.code == 200) {
                      let list           = res.body.data.list
                      that.list.myTask   = list.slice(0,4);
                  }
              });
          },
          getPendingTask(){
              let that            = this
              let myTaskUrl         = Vue.agent.root+'/workflow/getTaskInHandOfApplicant';
              that.$http.get(myTaskUrl,{
                  funcId:that.funcId,
              }).then(function (res) {
                  if(res.body.code == 200) {
                      let list           = res.body.data.list
                      that.list.pendTask = list.slice(0,4);
                  }
              });
          },
          getOps(){
              let that                 = this
              let opsUrl      = Vue.agent.root + '/dictionary/dict/querys'

              that.$http && that.$http.get(opsUrl,{params:{
                  names:"approvalType",
                  funcId:that.funcId
              }}).then(function (res) {
                  if(res.body.code == "200") {
                      let data                    = res.body.data
                      that.ops.approvalType       = data.approvalTypeOptions
                  }
              });
          }
    },
//    computed: {
//        monthClosingHint:function () {
//            let balanceDate = this.balanceDate
//            return `结算日期已设定为本月${balanceDate}号,请及时操作!`
//        }
//    },
//    //进入页面便开始通过create方法得到接口链接numsUrl[刘]
    created:function () {
        let that            = this
        that.getToDoTask()
        that.getPendingTask()

        that.getOps()

//      let myTaskUrl         = Vue.agent.root+'/workflow/getTaskInHand';
//      //链接接口，如果返回SUCCEED，就得到res.body.date内容，赋值给Num[刘]
//      this.$http.get(myTaskUrl,{
//
//      }).then(function (res) {
//        if(res.body.status == "SUCCEED") {
//          this.Num = res.body.data;
//        }
//      });
    },
  }
</script>

<style lang="scss">
  @import 'src/scss/pages/index/index.scss';
</style>
