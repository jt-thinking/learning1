<template>
  <div class="approve">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="line-height: 32px;">审批内容</span>
      </div>
      <!--产品-->
      <el-table
              v-if="taskType == 'product'"
              :data="info"
              border
              style="width: 100%">
        <el-table-column
                prop="productName"
                align="center"
                label="产品名称"
                min-width="140">
        </el-table-column>
        <el-table-column
                prop="phone"
                align="center"
                label="借款额度（元）"
                min-width="180">
          <template scope="scope">
            <span v-show="scope.row.minPrincipal">{{ scope.row.minPrincipal | moneyFormat }} - {{ scope.row.maxPrincipal | moneyFormat }}</span>
            <span v-show="!scope.row.minPrincipal">无</span>
          </template>
        </el-table-column>
        <el-table-column
                label="借款期限（天）"
                align="center"
                min-width="130">
          <template scope="scope">
            <span v-show="scope.row.minDuration">{{scope.row.minDuration}}天 - {{scope.row.maxDuration}}天</span>
            <span v-show="!scope.row.minDuration">无</span>
          </template>
        </el-table-column>
        <el-table-column
                label="借款利率(%)"
                align="center"
                min-width="130">
          <template scope="scope">
            <span v-show="scope.row.loanRate">{{ scope.row.loanRate}}%</span>
            <span v-show="!scope.row.loanRate">无</span>
          </template>
        </el-table-column>
        <el-table-column
                label="还款方式"
                align="center"
                width="120">
          <template scope="scope">
            <span v-show="scope.row.repayType">{{ scope.row.repayType | opsFormat(ops.repayType) }}</span>
            <span v-show="!scope.row.repayType">无</span>
          </template>
        </el-table-column>
        <el-table-column
                label="借款服务费率(%)"
                align="center"
                min-width="140">
          <template scope="scope">
            <span v-show="scope.row.serviceRate">{{ scope.row.serviceRate }}%</span>
            <span v-show="!scope.row.serviceRate">无</span>
          </template>
        </el-table-column>
        <el-table-column
                align="center"
                label="逾期罚息(%)"
                min-width="120">
          <template scope="scope">
            <span v-show="scope.row.penaltyRate">{{ scope.row.penaltyRate}}%</span>
            <span v-show="!scope.row.penaltyRate">无</span>
          </template>
        </el-table-column>
        <el-table-column
                align="center"
                label="借款综合成本(%)"
                min-width="140">
          <template scope="scope">
            <span v-show="scope.row.minCostRate">{{ scope.row.minCostRate }}% - {{ scope.row.maxCostRate }}%</span>
            <span v-show="!scope.row.minCostRate">无</span>
          </template>
        </el-table-column>
        <el-table-column
                align="center"
                label="操作人"
                min-width="100">
          <template scope="scope">
                {{ scope.row.operaterName}}
          </template>
        </el-table-column>
        <el-table-column
                align="center"
                label="操作人工号"
                min-width="100">
          <template scope="scope">
            {{ scope.row.operaterNumber }}
          </template>
        </el-table-column>
      </el-table>
      <!--客户信息-->
      <el-table
              v-if="taskType == 'cust_basic_chg'"
              :data="info"
              border
              style="width: 100%">
        <el-table-column
                prop="oldCustName"
                align="center"
                label="原客户名称"
                min-width="140">
        </el-table-column>
        <el-table-column
                prop="oldCertNo"
                align="center"
                label="原身份证号"
                min-width="180">
        </el-table-column>
        <el-table-column
                prop="newCustName"
                align="center"
                label="现客户名称"
                min-width="140">
        </el-table-column>
        <el-table-column
                prop="opTypeName"
                label="操作类型"
                align="center"
                min-width="130">
        </el-table-column>
        <el-table-column
                prop="operName"
                label="操作人"
                align="center"
                width="120">
        </el-table-column>
        <el-table-column
                prop="operId"
                align="center"
                label="操作人工号"
                min-width="100">
        </el-table-column>
      </el-table>

      <!--客户引入-->
      <el-table
              v-if="taskType == 'cust_obtain'"
              :data="info"
              border
              style="width: 100%">
        <el-table-column
                prop="custName"
                align="center"
                label="客户名称"
                min-width="140">
        </el-table-column>
        <el-table-column
                prop="certNo"
                align="center"
                label="身份证号"
                min-width="180">
        </el-table-column>
        <el-table-column
                prop="newMarketName"
                align="center"
                label="现管户人"
                min-width="140">
          <template scope="scope">
            <span>{{scope.row.newMarketName}} {{scope.row.newMarketId}}</span>
          </template>
        </el-table-column>

        <el-table-column
                prop="oldMarketName"
                align="center"
                label="原管户人"
                min-width="140">
        </el-table-column>

        <el-table-column
                prop="opTypeName"
                align="center"
                label="操作"
                min-width="180">
        </el-table-column>
        <el-table-column
                label="操作人"
                align="center"
                prop="operName"
                min-width="140">
        </el-table-column>
        <el-table-column
                align="center"
                label="操作人工号"
                prop="operId"
                min-width="120">
        </el-table-column>
        <el-table-column
                align="center"
                label="引入理由"
                min-width="100">
          <template scope="scope">
            <p>{{ scope.row.remark}}</p>
          </template>
        </el-table-column>
      </el-table>


      <!--客户移交-->
      <el-table
              v-if="taskType == 'cust_transfer'"
              :data="info"
              border
              style="width: 100%">
        <el-table-column
                prop="custName"
                align="center"
                label="客户名称"
                min-width="140">
        </el-table-column>
        <el-table-column
                prop="certNo"
                align="center"
                label="身份证号"
                min-width="180">
        </el-table-column>
        <el-table-column
                prop="newMarketName"
                align="center"
                label="现管户人"
                min-width="140">
          <template scope="scope">
            <span>{{scope.row.newMarketName}} {{scope.row.newMarketId}}</span>
          </template>
        </el-table-column>

        <el-table-column
                prop="oldMarketName"
                align="center"
                label="原管户人"
                min-width="140">
        </el-table-column>

        <el-table-column
                prop="opTypeName"
                align="center"
                label="操作"
                min-width="180">
        </el-table-column>
        <el-table-column
                label="操作人"
                align="center"
                prop="operName"
                min-width="140">
        </el-table-column>
        <el-table-column
                align="center"
                label="操作人工号"
                prop="operId"
                min-width="120">
        </el-table-column>
        <el-table-column
                align="center"
                label="引入理由"
                min-width="100">
          <template scope="scope">
            <p>{{ scope.row.remark}}</p>
          </template>
        </el-table-column>
      </el-table>

      <!--授信审批-->
      <el-table
              v-if="taskType == 'cust_credit'"
              :data="info"
              border
              style="width: 100%">
        <el-table-column
                prop="creditNo"
                align="center"
                label="授信合同号"
                min-width="140">
        </el-table-column>
        <el-table-column
                prop="custName"
                align="center"
                label="客户名称"
                min-width="140">
        </el-table-column>
        <el-table-column
                prop="certificate"
                align="center"
                label="身份证号"
                min-width="180">
        </el-table-column>
        <el-table-column
                align="center"
                label="授信金额"
                min-width="180">
          <template scope="scope">
            <span>{{scope.row.creditAmount | moneyFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
                align="center"
                label="授信申请日"
                min-width="140">
          <template scope="scope">
            <span>{{scope.row.applyDate | dateFormat}} </span>
          </template>
        </el-table-column>
        <el-table-column
                align="center"
                label="授信到期日"
                min-width="140">
          <template scope="scope">
            <span>{{scope.row.expirationDate | dateFormat}} </span>
          </template>
        </el-table-column>
        <el-table-column
                prop="actType"
                align="center"
                label="操作类型"
                min-width="180">
        </el-table-column>
        <el-table-column
                label="操作人"
                align="center"
                prop="operaterName"
                min-width="140">
        </el-table-column>
        <el-table-column
                align="center"
                label="操作人工号"
                prop="operaterId"
                min-width="120">
        </el-table-column>
      </el-table>



    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="line-height: 32px;">审批记录</span>
      </div>
      <el-table
              :data="history"
              border
              style="width: 100%">
        <el-table-column
                prop="userName"
                align="center"
                label="操作人"
                min-width="120">
        </el-table-column>
        <el-table-column
                prop="userId"
                align="center"
                label="操作人工号"
                min-width="120">
        </el-table-column>
        <el-table-column
                label="审批阶段"
                align="center"
                prop="nodeName"
                min-width="120">
        </el-table-column>
        <el-table-column
                label="受理时间"
                align="center"
                min-width="140">
          <template scope="scope">
            <span>{{ scope.row.startTime | dateTimeFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
                label="处理时间"
                align="center"
                min-width="140">
          <template scope="scope">
            <span>{{ scope.row.endTime | dateTimeFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column
                label="审批意见"
                align="center"
                min-width="120">
          <template scope="scope">
            <span>{{ scope.row.opType | opsFormat(ops.approvalStatus) }} </span>
          </template>
        </el-table-column>
        <el-table-column
                align="center"
                label="具体意见"
                min-width="120">
          <template scope="scope">
            <span>{{ scope.row.message }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>


    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="line-height: 32px;">审批操作</span>
      </div>
      <el-form :model="approve"  label-width="140px">
        <el-form-item label="审批意见">
          <el-select v-model="approve.operate" placeholder="请选择审批类型">
            <el-option  label="请选择审批类型" :value="null"></el-option>
            <el-option
                    v-for="item in ops.approvalOperationType"
                    :key="item.id"
                    :label="item.name"
                    :value="parseInt(item.value)">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="具体意见">
          <el-input
                  type="textarea"
                  :rows="3"
                  placeholder="请输入内容"
                  v-model="approve.message">
          </el-input>
        </el-form-item>
        <div>
          <el-button size="small" @click="$router.back()" type="primary">返回</el-button>
          <el-button size="small" class="pull-right" type="primary" @click.native="doApproveHandler">确 认</el-button>
        </div>
      </el-form>
    </el-card>
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
              myTask:[
                  {
                      name:'林仁保',
                      type:'客户资料',
                      operation:'待发起',
                      taskNo:'JK01201704280001'
                  }
              ]
          },
          info:[],
          history:[],
          ops:{
              repayType:[],
              approvalOperationType:[],
              approvalStatus:[]
          },
          approve:{
              taskId:null,
              operate:null,
              message:null
          },
          funcId:'R010400',
          taskType:null,
      }
    },
    methods:{
      doApproveHandler(){
          let that           = this
          let url            = Vue.agent.root+'/workflow/audit';
          let approve        = that.approve
          that.$http.put(url,{
              funcId:that.funcId,
              taskId:approve.taskId,
              operate:approve.operate,
              message:approve.message
          }).then(function (res) {
              if(res.body.code == 200) {
                  that.$notify({title: '成功',message: '提交成功',type: 'success'});
                  that.$router.replace('/index-todo-task');
              }
          });
      },
      getApproveInfo(){
          let that           = this
          let params         = that.$route.query
          let url            = Vue.agent.root+'/workflow/info';
          that.$http.get(url,{
              params:{
                  funcId:that.funcId,
                  taskType:params.taskType,
                  businessKey:params.businessKey,
                  instanceId:params.instanceId
              }
          }).then(function (res) {
              if(res.body.code == 200) {
                  that.info = []
                  let data   = res.body.data
                  if(data.list != null){
                      that.info = data.list
                  }else{
                      that.info.push(data)
                  }
              }
          });
      },
      getApproveHistory(){
          let that           = this
          let params         = that.$route.query
          let url            = Vue.agent.root+'/workflow/getCompletedTasksByInstanceId';
          that.$http.get(url,{
              params:{
                  funcId:that.funcId,
                  instanceId:params.instanceId
              }
          }).then(function (res) {
              if(res.body.code == 200) {
                  let list      = res.body.data.list
                  that.history  = list
              }
          });
      },

      getOps(){
          let that                 = this
          let opsUrl               = Vue.agent.root + '/dictionary/dict/querys'

          that.$http && that.$http.get(opsUrl,{params:{
              names:"repayType,approvalOperationType,approvalStatus",
              funcId:that.funcId
          }}).then(function (res) {
              if(res.body.code == "200") {
                  let data                        = res.body.data
                  that.ops.repayType              = data.repayTypeOptions
                  that.ops.approvalOperationType  = data.approvalOperationTypeOptions
                  that.ops.approvalStatus         =  data.approvalStatusOptions

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
    created:function () {
      let that                = this
      that.getApproveInfo()
      that.getApproveHistory()
      that.getOps()
      let params              = that.$route.query
      that.approve.taskId     = params.taskId
      that.taskType           = params.taskType
    },
  }
</script>

<style lang="scss">
  @import 'src/scss/pages/index/approve.scss';
</style>
