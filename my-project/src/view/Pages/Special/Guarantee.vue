<template>
    <div class="stat-loan">
        <el-tabs v-model="tabActive" type="card" @tab-click="creditTabChangeHandler">
            <el-tab-pane label="变更" name="a">
                <div class="stat-box">
                    <div class="search-box">
                        <el-form   :model="search"  ref="creditNoForm">
                            <el-form-item  label="授信合同号:" label-width="100px" prop="creditNo" :rules="[
                            {required: true, message: '请输入合同号'},
                            ]">
                                <el-input  size="small"  v-model.trim="search.creditNo" :placeholder="'请输入合同号'" ></el-input>
                            </el-form-item>
                            <el-form-item label-width="30px" >
                                <el-button @click.native="doGetGuaranteeListByCreditNoHandler('creditNoForm')" size="small" type="primary">查询</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
                <el-form :model="credit"  ref="creditForm" label-width="120px">
                    <el-row>
                        <el-col :span="6">
                            <h3 v-show="credit.custName != null">
                                <span>{{ credit.custName }}({{ credit.custId }})</span>
                            </h3>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="客户类型:">
                                <span> 个人 </span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="客户编号:">
                                <span>{{ credit.custId }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="身份证:">
                                <span>{{ credit.certNo }}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="授信合同号:">
                                <span>{{ credit.creditNo }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="金额:">
                                <span>{{ credit.creditAmt }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="授信有效期:">
                                <span>{{ credit.startDate | dateFormat }} - {{ credit.endDate | dateFormat }}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="经办机构:">
                                <span>{{ credit.operateOrganName }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="经办日期:">
                                <span>{{ credit.operateDate | dateFormat }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="社区经理:">
                                <span>{{ credit.operaterName }}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div  class="table">
                    <div class="table-header-zone">
                        <el-button @click.native="doAddGuaranteeHandler" size="small" type="primary">添加</el-button>
                    </div>
                    <el-table
                    v-loading="loading"
                    :data="credit.guarantees"
                    :stripe="true"
                    border
                    style="width: 100%">
                        <el-table-column
                        prop="custId"
                        align="center"
                        label="客户编号"
                        ></el-table-column>
                        <el-table-column
                        prop="custName"
                        align="center"
                        label="客户名称"
                        >
                        </el-table-column>
                        <el-table-column
                        label="客户类型"
                        align="center"
                        >
                            <template scope="scope">
                                <span v-show="scope.row.custType == 1">个人</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                        prop="certNumber"
                        align="center"
                        label="担保金额"
                        >
                            <template scope="scope">
                                <span>{{ scope.row.guaranteeAmt | moneyFormat }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                        prop="balance"
                        align="center"
                        label="担保期限"
                        >
                            <template scope="scope">
                                <span>{{ scope.row.startDate | dateFormat }} - {{ scope.row.endDate | dateFormat }}</span>
                            </template>

                        </el-table-column>
                        <el-table-column
                        align="center"
                        label="操作"
                        >
                        <template scope="scope">
                            <el-button @click.native="doGuaranteeEditHandler(scope)" size="small" type="primary">编辑</el-button>
                            <el-button @click.native="doGuaranteeDeleteHandler(scope)" size="small" type="primary">删除</el-button>
                        </template>
                        </el-table-column>
                    </el-table>
                    <div class="table-footer-zone">
                        <el-button @click.native="doSaveUserBalanceCache" size="small pull-right" type="primary">提交申请</el-button>
                    </div>

                </div>
            </el-tab-pane>
            <el-tab-pane label="变更记录" name="b">
                <div class="stat-box">
                    <div class="search-box">
                        <el-form   :model="search">
                            <el-form-item label-width="100px" label="移交时间:">
                                <el-date-picker
                                        class="date"
                                        style="width:140px"
                                        size="small"
                                        v-model="search.minCreateTimeT"
                                        type="date"
                                        placeholder="起始日期">
                                </el-date-picker>
                                <el-date-picker
                                        style="width:140px"
                                        size="small"
                                        class="date"
                                        v-model="search.maxCreateTimeT"
                                        type="date"
                                        placeholder="结束日期">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label-width="30px" >
                                <el-button @click.native="getChangeHistoryHandler" size="small" type="primary">查询</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
                <div  class="table">
                    <el-table
                            v-loading="loading"
                            :data="history.list"
                            :stripe="true"
                            border
                            style="width: 100%">
                        <el-table-column
                                prop="oldCustName"
                                align="center"
                                label="授信合同号"
                        ></el-table-column>


                        <el-table-column
                                prop="custName"
                                align="center"
                                label="客户名称"
                        >
                        </el-table-column>
                        <el-table-column
                                prop="newCustName"
                                align="center"
                                label="客户身份证号"
                        >
                        </el-table-column>
                        <el-table-column
                                prop="guaranteerName"
                                align="center"
                                label="担保人名称"
                        >
                        </el-table-column>
                        <el-table-column
                                prop="guaranteerName"
                                align="center"
                                label="担保人身份证号"
                        >
                        </el-table-column>
                        <el-table-column
                                prop="businessType"
                                label="变更类型"
                                align="center"
                        >
                            <template scope="scope">
                                <span>{{ scope.row.businessType | opsFormat(ops.approvalType) }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                align="center"
                                label="变更前金额"
                        >
                            <template scope="scope">
                                <span>{{ scope.row.oldAmt | moneyFormat }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                align="center"
                                label="变更后金额"
                        >
                            <template scope="scope">
                                <span>{{ scope.row.newAmt | moneyFormat }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="guaranteerName"
                                align="center"
                                label="审核人"
                        >
                        </el-table-column>

                        <el-table-column
                                align="center"
                                label="变更时间"
                        >
                            <template scope="scope">
                                <span>{{ scope.row.createTime | dateTimeFormat }}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="footer-box">
                    <span v-if="startRow" class="pull-left">显示{{startRow}}-{{endRow}} 总共有{{total}}条目</span>
                    <div class="pagination pull-right">
                        <el-pagination
                                layout="prev, pager, next"
                                @current-change="handleCurrentChange"
                                :page-size="history.pageSize"
                                :current-page.sync="history.pageNum"
                                :total="history.total">
                        </el-pagination>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>


        <!--新建、编辑担保 -->
        <el-dialog title="新建担保信息" class="guarantee-dialog" :visible.sync="visible.guarantee" size="tiny" >
            <el-form :model="guarantee"  ref="guarantee" label-width="100px">
                <el-form-item label="证件号">
                    <el-select
                            v-model="guarantee.custId"
                            style="width:100%"
                            filterable
                            remote
                            @change="selectedCustomHandler"
                            placeholder="请输入证件号"
                            :no-data-text="身份证号输入有误或该客户不存在"
                            :remote-method="getCustomByCertNo"
                            :loading="customer.loading"
                            >
                        <el-option
                                v-for="item in customer.options"
                                :key="item.custId"
                                :label="item.certNo"
                                :value="item.custId">
                            <span style="float: left">{{ item.certNo }}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.custName }}</span>
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="担保人名称"  >

                    <el-input  :readonly="true"  v-model="guarantee.custName"  placeholder="请输入担保人名称"></el-input>
                </el-form-item>
                <el-form-item label="担保金额"  prop="guaranteeAmt" :rules="[
                            {required: true, message: '请输入担保金额'},
                            { type:'number', message: '必须为数字'}
                            ]">
                    <el-input @change="certNumberChangeHandler"  v-model.number="guarantee.guaranteeAmt"  placeholder="请输入担保金额"></el-input>
                </el-form-item>
                <el-form-item label="起效日期"  prop="startDate" :rules="[
                            {required: true, message: '选择时间'},
                            ]">
                    <!--:readonly="true"-->
                    <el-date-picker

                            class="date"
                            style="width:100%"
                            v-model="guarantee.startDate"
                            type="date"
                            placeholder="放款日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="到期日期"  prop="endDate" :rules="[
                                {required: true, message: '选择时间'},
                            ]">
                    <el-date-picker
                            style="width:100%"
                            class="date"
                            v-model="guarantee.endDate"
                            type="date"
                            placeholder="放款日期">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button class="pull-left" @click.native="visible.guarantee = false">取 消</el-button>
                <el-button v-show="action == 'add' " type="primary" @click.native="doSaveGuaranteeHandler('guarantee')">确 认</el-button>
                <el-button v-show="action == 'edit' " type="primary" @click.native="visible.guarantee = false">确 认</el-button>
            </div>
        </el-dialog>

    </div>

</template>

<script>
    import Util             from    'src/js/util'
    import auth             from    'src/js/auth'

    export default {
        data() {
            return {
                list: [],
                value: '',
                value: '',
                totals:{
                    prePrincipalAmtTotal:0
                },
                search:{
                    name:'',
                    phone:'',
                    certNumber:'',
                    contractNumber:'',
                    accountManager:null
                },
                credit:{
                    "custName":null,
                    "custId":null,
                    "certNo":null,
                    "creditId":null,
                    "creditNo":null,
                    "creditAmt":null,
                    "startDate":null,
                    "endDate":null,
                    "operateOrganId":null,
                    "operaterId":null,
                    "operateOrganName":null,
                    "operateDate":null,
                    "operaterName":null,
                    guarantees:[]
                },
                guarantee:{
                    "custId":null,
                    "custName":null,
                    "custType":1,
                    guaranteeAmt:null,
                    startDate:null,
                    endDate:null,
//                    "creditId":"SX3582491459604480",
                    guaranteeId:null,
                    guaranteeNo:null,
//                    "status":2
                },
                customer:{
                    loading: false,
                    options:[]
                },
                visible:{
                    guarantee:null
                },
                action:"add",
                ops:{
                    approvalType:[]
                },
                history:{
                    list:[],
                    pageNum:1,
                    pageSize:15,
                    total:0,
                },
                tabActive:'a',
                pageNum:1,
                pageSize:15,
                loading: false,
                staffLoading:false,
                funcId:'R050800',
            }
        },
        watch: {
            "search.updateStartTimeT": function (val) {
                this.search.updateStartTime = val ? new Date(val).getTime() : null
            },
            "search.updateEndTimeT": function (val) {
                this.search.updateEndTime = val ? (new Date(val).getTime()+86400000-1) : null
            },
        },
        methods: {
            //tab切换
            creditTabChangeHandler(){
                let that = this
                that.doReset()
            },
            //重置
            doReset(){
                let search = this.search
                Util.dataReset(search)
            },

//          通过搜索获取担保信息
            doGetGuaranteeListByCreditNoHandler(form){
                let that = this
                that.$refs[form].validate((valid) => {
                    if (valid) {
                        that.getGuaranteeInfo()
                    } else {
                        console.log('11')
                        return false;
                    }
                });
            },
            getGuaranteeInfo(){
                let that        = this
                let search      = that.search
                let url         = Vue.agent.root + '/business/guarantee/chg/list'
                var reqData     = {
                    funcId:that.funcId,
                    creditNo:search.creditNo

                }
                that.$http.get(url,{
                    params:reqData,
                }).then(res => {
                    if(res.body.code == "200") {
                        that.credit = res.body.data
                    }
                });
            },

//          编辑担保人
            doGuaranteeEditHandler(scope){
                let that = this
                that.visible.guarantee  = true
                that.guarantee          = scope.row
                that.action             = "edit"
            },
            //删除
            doGuaranteeDeleteHandler(scope){
                let that    = this
                let index   = scope.row.index
                that.credit.guarantees.splice(index,1)
            },

//            添加担保人
            doAddGuaranteeHandler(){
                let that = this
                let credit = that.credit
                that.visible.guarantee  = true

//                if(!!credit.apply.expirationDate)
//                    credit.guarantee.item.expirationDateTime = credit.apply.expirationDate

            },
            //获取担保用户
            getCustomByCertNo(query){
                let that        = this
                if(query == null || query.length < 4){
                    that.customer.options = []
                    return false
                }
                let url         = Vue.agent.root + '/customer/person/getCustByCertNo'
                var reqData     = {
                    funcId  :that.funcId,
                    certNo:query
                }
                that.$http.get(url,{
                    params:reqData,
                }).then(res => {
                    if(res.body.code == 200) {
                        let list            = res.body.data
                        that.customer.options = list
                        that.customer.loading = false;
                    }else{
                        that.customer.options = []
                    }
                });
            },
//            选择用户后
            selectedCustomHandler(val){
                let that    = this
                let options = that.customer.options

                let res     = options.find(v=>{
                    return val == v.custId
                })
                if(!!res){
                    that.guarantee.custName = res.custName
                }else{
                    that.guarantee.custName = null
                }

            },
//            添加担保人
            doSaveGuaranteeHandler(){
                let that = this
                let guarantee = that.guarantee
                that.credit.guarantees.push(
                    guarantee
                )
            },
            doSaveUserBalanceCache(){
                let that        = this
                let url         = Vue.agent.root + '/business/guarantee/chg'
                let guarantees  = JSON.parse(JSON.stringify(that.credit.guarantees))

                if(!!guarantees && guarantees.length > 0){
                    guarantees.forEach(v=>{
                        v.startDate     = new Date(v.startDate).getTime()
                        v.endDate       = new Date(v.endDate).getTime()
                    })
                }
                let reqData = {
                    jsonContent:JSON.stringify(guarantees),
                    creditId:that.credit.creditId,
                    funcId  :that.funcId,
                }

                that.$http.post(url,reqData).then(res => {
                    if(res.body.code == 200) {
                        that.$notify({title: '成功',message: '暂存成功',type: 'success'});
                    }
                });
            },

            //变更记录
            getChangeHistoryHandler(){
                let that = this
                that.getChangeHistory()
            },
            getChangeHistory(){
                let that        = this
                let history     = that.history
                let url         = Vue.agent.root + '/business/guarantee/chg/history'
                var reqData     = {
                    pageSize:history.pageSize,
                    pageNum:history.pageNum,
                    funcId:that.funcId
                }
                Object.assign(reqData,that.search)
                Util.dataClear(reqData)

                that.$http.get(url,{
                    params:reqData,
                }).then(res => {
                    if(res.body.code == "200") {
                        let data            = res.body.data
                        Object.assign(that.history,data)
                    }
                });
            },
            doSearch(){
                let that        = this
                let url         = Vue.agent.root + '/business/guarantee/chg/list'
                var reqData     = {
                    funcId:that.funcId
                }
                that.loading = true
                Object.assign(reqData,that.search)
                Util.dataClear(reqData)

                that.$http.get(url,{
                    params:reqData,
                    timeout:30000
                }).then(res => {
                    that.loading = false
                    if(res.body.code == "200") {
                        that.loading = false
                        let data            = res.body.data
                        Object.assign(that,data)
                    }
                },res=>{
                    that.loading = false
                });
            },

            doReset(){
                let search = this.search
                Util.dataReset(search)
            },
            handleCurrentChange(val) {
                let that = this
                if(that.loading == true){
                    that.$notify({title: '提示',message: '请勿频繁操作',type: 'warning'});
                }else{
                    that.pageNum = val
                    that.doSearch()
                }
            },
            //获取ops
            getOps(){
                let that        = this
                let opsUrl      = Vue.agent.root + '/dictionary/dict/querys'

                that.$http && that.$http.get(opsUrl,{params:{
                    names:"approvalType",
//                    ,approvalStatus
                    funcId:that.funcId
                }}).then(function (res) {
                    if(res.body.code == "200") {
                        let data                     = res.body.data
                        that.ops.approvalType        = data.approvalTypeOptions
//                        that.ops.approvalStatus      = data.approvalStatusOptions
                    }
                });
            },
        },
        created:function () {
            let that        = this
            that.getOps()
        },
        mounted:function () {

        },
        components:{
        }
    }
</script>
<style lang="scss">
    @import 'src/scss/pages/special.scss';
</style>