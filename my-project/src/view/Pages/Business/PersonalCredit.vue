<template>
    <div class="business-personal-credit">
        <el-tabs v-model="tab.active" type="card" @tab-click="creditTabChangeHandler">
            <el-tab-pane :label="'待处理 ('+ count.initializationCount +') 笔'" name="a">
                <div class="busy-box">
                    <div class="search-box">
                        <el-form   :model="formInline" label-width="66px" >
                            <el-form-item label-width="30px" >
                                <el-button @click.native="showAddCreditHandler" size="small" type="primary">新增</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane :label="'待审批 ('+ count.approvalCount +') 笔'" name="b">
                <div class="busy-box">
                    <div class="search-box">
                        <el-form   :model="formInline" label-width="66px" >
                            <el-form-item label-width="30px" >
                            </el-form-item>
                        </el-form>
                    </div>
                </div>

            </el-tab-pane>
            <el-tab-pane :label="'已审批 ('+ count.approvedCount +') 笔'" name="c">
                <div class="busy-box">
                    <div class="search-box">
                        <el-form   :model="search" label-width="66px" >
                            <el-form-item label-width="30px" >
                                <el-form-item label="客户姓名">
                                    <el-input size="small"  v-model="search.name" :placeholder="'请输入姓名'"></el-input>
                                </el-form-item>
                                <el-form-item label="证件号">
                                    <el-input size="small"  v-model="search.certificate" :placeholder="'请输入证件号'"></el-input>
                                </el-form-item>
                                <el-form-item label="授信日期">
                                    <el-date-picker
                                            class="date"
                                            size="small"
                                            v-model="search.applyStartDateT"
                                            type="date"
                                            placeholder="选择日期时间">
                                    </el-date-picker>
                                    <el-date-picker
                                            class="date"
                                            size="small"
                                            v-model="search.applyEndDateT"
                                            type="date"
                                            placeholder="选择日期时间">
                                    </el-date-picker>
                                </el-form-item>
                            </el-form-item>



                            <el-form-item label-width="30px" class="item-box">
                                <el-button @click.native="doReset" size="small" type="primary">重置</el-button>
                                <el-button @click.native="doSearchHandler" size="small" type="primary">查询</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane :label="'需要我审批 ('+ count.pendingCount +') 笔'" name="d">
                <div class="busy-box">
                    <div class="search-box">
                        <el-form   :model="formInline" label-width="66px" >
                            <el-form-item label-width="30px" >
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
        <div>
            <div class="table">
                <!--v-loading="prodData.loading"-->

                <el-table
                        :data="toDoData.list"
                        border
                        style="width: 100%">
                    <el-table-column
                            prop="creditNo"
                            label="授信合同编号"
                            align="center"
                            min-width="160">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="客户姓名"
                            min-width="140">
                        <template scope="scope">
                            <el-button type="text" @click.native="showCustomInfoHandler(scope)">{{ scope.row.custName }}</el-button>
                        </template>

                    </el-table-column>
                    <el-table-column
                            prop="basePrdName"
                            align="center"
                            label="基本产品"
                            min-width="140">
                    </el-table-column>
                    <el-table-column
                            prop="subsidiaryPrdName"
                            align="center"
                            label="附属产品"
                            min-width="140">
                    </el-table-column>
                    <el-table-column
                            prop="marketPrdName"
                            align="center"
                            label="营销产品"
                            min-width="140">
                    </el-table-column>
                    <el-table-column
                            prop="phone"
                            align="center"
                            label="申请金额"
                            min-width="180">
                        <template scope="scope">
                            <span>{{ scope.row.creditAmt | moneyFormat }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="申请期限"
                            align="center"
                            min-width="130">
                        <template scope="scope">
                            <span>{{scope.row.duration}}天</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="申请日期"
                            align="center"
                            min-width="130">
                        <template scope="scope">
                            <span>{{ scope.row.applyDate | dateFormat}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="到期日期"
                            align="center"
                            width="140">
                        <template scope="scope">
                            <span>{{ scope.row.expirationDate | dateFormat }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="经办人"
                            align="center"
                            prop="operaterName"
                            min-width="100">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="受理机构"
                            prop="operaterOrganizationName"
                            min-width="140">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="操作"
                            width="280"
                            fixed="right"
                    >
                        <template scope="scope">
                            <el-tooltip v-show="tab.active == 'a' && scope.row.status == 3" class="item" effect="dark" :content="scope.row.retMsg" placement="left">
                                <el-button size="small" click.native="show" >回退详情</el-button>
                            </el-tooltip>
                            <el-button v-show="tab.active == 'a'" @click.native="doCreditEditHandler(scope)" size="small">授信编辑</el-button>
                            <el-button v-show="tab.active == 'a'" @click.native="doTodoDeleteHandler(scope)" size="small">删除</el-button>
                            <el-button v-show="tab.active == 'b'" @click.native="showCreditEditHandler(scope)" size="small">申请详情</el-button>
                            <el-button v-show="tab.active == 'c'" @click.native="showCreditEditHandler(scope)" size="small">申请详情</el-button>
                            <el-button v-show="tab.active == 'b'" @click.native="showApproveHistoryHandler(scope)" size="small">审批进度</el-button>
                            <el-button v-show="tab.active == 'b'" @click.native="doCreditApplyRevokeHandler(scope)" size="small">撤回</el-button>
                            <el-button v-show="tab.active == 'c'" @click.native="showApproveHistoryHandler(scope)" size="small">审批记录</el-button>
                            <el-button v-show="tab.active == 'd'" @click.native="showApproveDialogHandler(scope)" size="small">审批</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="footer-box">
                <span v-if="startRow" class="pull-left">显示{{startRow}}-{{endRow}} 总共有{{total}}条目</span>
                <div class="pagination pull-right">
                    <el-pagination
                            layout="prev, pager, next"
                            @current-change="toDoCurrentPageChange"
                            :page-size="toDoData.pageSize"
                            :current-page.sync="toDoData.pageNum"
                            :total="toDoData.total">
                    </el-pagination>
                </div>
            </div>
        </div>

        <!--新建授信 -->
        <el-dialog title="新建授信" class="org-dialog" :visible.sync="visible.addCredit" size="tiny" >
            <el-form :model="credit"  ref="newCredit" label-width="100px">
                <el-form-item label="客户名称:">
                    <el-select
                            v-model="credit.certNumber"
                            filterable
                            clearable
                            remote
                            @change="selectedCustomHandler"
                            placeholder="请输入证件号或名字"
                            :no-data-text="身份证号输入有误或该客户不存在"
                            :remote-method="getCustomByCertNoOrName"
                            :loading="customer.loading">
                        <el-option
                                v-for="item in customer.options"
                                :key="item.custId"
                                :label="item.certNo"
                                :value="item.custId">
                            <span style="float: left; color: #8492a6; font-size: 13px">{{ item.custName }}</span>
                            <span style="float: right">证件:{{ item.certNo }}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-alert v-show="brief.visible == true" :title="brief.msg" type="info" show-icon></el-alert>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button class="pull-left" @click.native="visible.addCredit = false">取 消</el-button>
                <el-button :disabled="!brief.enable" type="primary" @click.native="doCreditAddHandler('newCredit')">确 认</el-button>
            </div>
        </el-dialog>

        <!--审批-->
        <el-dialog title="审批" class="org-dialog" :visible.sync="visible.approve" size="small" >
            <el-form :model="approve"  label-width="140px">
                <el-form-item label="审批意见">
                    <el-select v-model="approve.operate" placeholder="请选择审批类型">
                        <el-option  label="请选择审批类型" :value="null"></el-option>
                        <el-option
                                v-for="item in ops.approvalOps"
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
        </el-dialog>


        <!--审批记录-->
        <el-dialog title="审批记录" class="org-dialog" :visible.sync="visible.history" size="large" >
            <div class="table">
                <!--v-loading="prodData.loading"-->

                <el-table
                        :data="history"
                        border
                        style="width: 100%">
                    <el-table-column
                            prop="nodeName"
                            label="操作环节"
                            align="center"
                            min-width="160">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="完成时间"
                            min-width="140">
                        <template scope="scope">
                            <span>{{ scope.row.endTime | dateTimeFormat }}</span>
                        </template>

                    </el-table-column>
                    <el-table-column
                            prop="opType"
                            align="center"
                            label="审批状态"
                            min-width="140">
                        <template scope="scope">
                            <span>{{ scope.row.opType | opsFormat(ops.approvalStatus) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="userName"
                            align="center"
                            label="经办人"
                            min-width="140">
                    </el-table-column>
                    <el-table-column
                            prop="subsidiaryPrdName"
                            align="center"
                            label="处理机构"
                            min-width="140">
                    </el-table-column>
                    <el-table-column
                            prop="message"
                            align="center"
                            label="意见"
                            min-width="140">
                    </el-table-column>
                </el-table>
            </div>
        </el-dialog>


        <!--新建资料item -->
        <el-dialog title="新建资料" class="org-dialog" :visible.sync="visible.upload" size="tiny" >
            <el-form :model="credit.material.item"  ref="uploadItem" label-width="100px">

                <el-form-item label="附件名称"  prop="name" :rules="[
                                {required: true, message: '附件名称'},
                            ]">
                    <el-input  size="small"  v-model="credit.material.item.name" placeholder="附件名称"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input  size="small"  v-model="credit.material.item.remark" placeholder="备注"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button class="pull-left" @click.native="visible.upload = false">取 消</el-button>
                <el-button type="primary" @click.native="doSaveUploadItemHandler('uploadItem')">确 认</el-button>
            </div>
        </el-dialog>


        <!--新建资料item -->
        <el-dialog title="其他资料上传" class="org-dialog" :visible.sync="visible.uploadDetail" size="w800">
            <el-form  :model="credit.material.item"  ref="uploadItem" label-width="100px">
                <div>
                    <el-upload
                            action="root/business/material/other/file/upload"
                            list-type="picture-card"
                            :on-preview="handlePictureCardPreview"
                            :file-list="credit.material.fileList"
                            :on-success="handleUploadSuccess"
                            :data="uploadItemData"
                            :multiple="true"
                            :auto-upload="true"
                            :headers="headers"
                            ref="uploadItem"
                            :on-remove="uploadDetailRemoveHandler">
                        <i class="el-icon-plus"></i>
                    </el-upload>

                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button class="pull-left" @click.native="visible.uploadDetail = false">取 消</el-button>
                <el-button type="primary" @click.native="visible.uploadDetail = false">确 认</el-button>
            </div>
        </el-dialog>
        <el-dialog v-model="visible.bigImg" size="w800">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>


        <user-info :editable="false" :opened.sync="visible"  :custId.sync="current.custId"></user-info>
        <credit-info :editable="current.creditEditable" :opened.sync="visible" :applyCallBack="applyCallBack"  :creditId.sync="current.creditId"></credit-info>

    </div>

</template>

<script>
    import Util             from    'src/js/util'
    import auth             from    'src/js/auth'
    import UserInfo         from    '../../Com/UserInfo.vue'
    import CreditInfo       from    '../../Com/CreditInfo.vue'

    export default {
        data() {

            return {
                relationShipCollapse:['1','2'],
                brief:{
                    enable:false,
                    msg:"",
                    visible:false,
                    custId:null
                },
                tabActive:'first',
                userTabActive:'5-1',
                prodData:{
                    list:[],
                    base:{
                        minDuration:null,
                        maxDuration:null,
                        loanRate:null,
                        serviceRate:null,
                        minCostRate:null,
                        maxCostRate:null,
                    },
                    subsidiary:{
                        minDuration:null,
                        maxDuration:null,
                        loanRate:null,
                        serviceRate:null,
                        minCostRate:null,
                        maxCostRate:null,
                    },
                    market:{
                        minDuration:null,
                        maxDuration:null,
                        loanRate:null,
                        serviceRate:null,
                        minCostRate:null,
                        maxCostRate:null,
                    },
                    pageNum:1,
                    pageSize:15,
                    total:null,
                    loading:false
                },
                customer:{
                    loading: false,
                    options:[]
                },
                approve:{
                    operate:null,
                    message:null,
                    taskId:null
                },
                toDoData:{
                    list:[],
                    pageNum:1,
                    pageSize:15,
                },
                credit:{
                    certNumber:null,
                    creditId:null,
                    apply:{
                        creditNo:null,
                        custId:null,
                        creditAmt:null,
                        custName:null,
                        certificateNumber:null,
                        expirationDate:null,
                        applyDate:null,
                        guaranteeType:null,
                        isSpecialService:0,
                        basePrdId:null,
                        baseEndDate:null,
                        baseStartDate:null,
                        baseCostRate:0,
                        subsidiaryPrdId:null,
                        subsidiaryStartDate:null,
                        subsidiaryEndDate:null,
                        subsidiaryCostRate:null
                    },
                    operate:{
                        industry:null,
                        industryDuration:null,
                        isOtherIndustry:null,
                        otherIndustry:null,
                        mainProduct:null,
                        stable:null,
                        employers:null,
                        salesVolume:null,
                        profit:null,
                        profitRate:null,
                        lastSalesVolume:null,
                        lastProfit:null,
                        lastProfitRate:null,
                        salesTarget:null,
                        isSeasonal:null,
                        busySeason:null,
                        lowSeason:null,
                        estimate:null,
                    },
                    balance:{
                        asset:[],
                        loan:[],
                        liabilities:[],
                        assetsTotal:0
                    },
                    guarantee:{
                        item:{
                            guaranteeType:1,
                            expirationDateTime:null,
                            startDateTime:null,
                            guaranteeAmt:null,
                            guaranteerId:null,
                            custName:null
                        },
                        list:[]
                    },
//                  资料
                    material:{
                        "custId":100000015,
                        "creditId":"SX3537224811368448",
                        queryTime:1483200000000,
                        "creditReportFile":"F3542389207027712.jpeg",
                        "creditReportRemark":null,
                        "creditReportUpdateTime":1505198170000,
                        "litigationFile":null,
                        "litigationRemark":null,
                        "litigationUpdateTime":0,
                        "noticeFile":null,
                        "noticeRemark":null,
                        "noticeUpdateTime":0,
                        "sentenceFile":null,
                        "sentenceRemark":null,
                        "sentenceUpdateTime":0,
                        "executeFile":null,
                        "executeRemark":null,
                        "executeUpdateTime":0,
                        "courtExecuteFile":null,
                        "courtExecuteRemark":null,
                        "courtExecuteUpdateTime":0,
                        list:[],
                        item:{
                            remark:null,
                            name:null,
                        },
                        fileList:[
                        ],
                        fileId:null
                    },
                },
                recordData:{
                    list:[],
                    pageNum:1,
                    pageSize:15,
                    total:null,
                    loading:false
                },
                history:[],
                list: [],
                tab:{
                  active:'a'
                },
                attrList:[],
                value: '',
                visible:{
                    addCredit:false,
                    upload:false,
                    uploadDetail:false,
                    bigImg:false,
                    user:false,
                    operate:false,
                    approve:false,
                    history:false,
                    balance:false,
                    creditMaterial:false,
                    rollbackReason:false,
                    openUser:false,
                    openCredit:false,
                },
                search:{
                    name:null,
                    certificate:null,
                    applyEndDate:null,
                    applyEndDateT:null,
                    applyStartDate:null,
                    applyStartDateT:null,
                },
                prod:{
                    id:null,
                    prdName:null,
                    minPrincipal:null,
                    maxPrincipal:null,
                    minDuration:null,
                    maxDuration:null,
                    minCostRate:null,
                    maxCostRate:null,
                    loanRate:null,
                    penaltyRate:null,
                    repayType:null,
                },
                current:{
                    creditId:null,
                    pId:null,
                    prod:null,
                    attr:null,
                    action:"add",
                    attr:null,
                    tabIndex:0,
                    custId:null,
                    creditEditable:false
                },
                attr:{

                },
                ops:{
                    repayType:[],
                    loanRate:[],
                    costRate:[],
                    lifeCycle:[],
                    approvalStatus:[],
                    assureType:[],
                    stabilizeType:[],
                    educationOps:[],
                    residentHouseTypeOps:[],
                    residentStatusOps:[],
                    maritalStatusOps:[],
                    approvalOps:[],
                    guaranteeTypeOps:[]
                },
                count:{
                    initializationCount: 0,
                    pendingCount: 0,
                    approvedCount: 0,
                    approvalCount: 0
                },
                loading: false,
                prodRules: {
                    prdName: [
                        {required: true, message: '请输入产品名称', trigger: 'blur'},
                    ],
                },
                attrRules: {

                },
                funcId:'R060200',
                headers:{
                    'authorization':auth.getToken(),
//                    'Content-Type': 'multipart/form-data',
//                    'Accept':'application/json',
                }
            }
        },
        watch: {
            "search.applyStartDateT": function (val) {
                this.search.applyStartDate = val ? accounting.format(val, 0, '') : null
            },
            "search.applyEndDateT": function (val) {
                this.search.applyEndDate = val ? (new Date(val).getTime()+86400000-1) : null
            },
        },
        computed: {
            uploadItemData:function () {
                let that            = this
                let creditId        = that.credit.creditId
                let material        = that.credit.material
                let ob = {
                    creditId:creditId,
                    id:material.fileId
                }

                return ob
            },
            assetsTotal:function(){
                let balance = this.credit.balance
                let total   = 0
                if(balance.asset.length>0){
                    balance.asset.forEach(v=>{
                        total += parseFloat(v.balance)
                    })
                    balance.assetsTotal = total
                }
                return balance.assetsTotal
            },
            liabilitiesTotal:function () {
                let balance = this.credit.balance
                let total   = 0
                if(balance.liabilities.length>0){
                    balance.liabilities.forEach(v=>{
                        total += parseFloat(v.balance)
                    })
                }
                if(balance.loan.length>0){
                    balance.loan.forEach(v=>{
                        total += parseFloat(v.principal)
                    })

                }
                balance.liabilitiesTotal = total
                return balance.liabilitiesTotal
            },
            netAssets:function(){
                let balance = this.credit.balance
                balance.netAssets = balance.assetsTotal - balance.liabilitiesTotal
                return balance.netAssets
            },
            assetLiabilityRatio:function () {
                let balance = this.credit.balance
                let assetsTotal     = 0
                let assetLiability  = 0
                if(balance.asset.length>0){
                    balance.asset.forEach(v=>{
                        assetsTotal += parseFloat(v.balance)
                    })
                }
                if(balance.liabilities.length>0){
                    balance.liabilities.forEach(v=>{
                        assetLiability += parseFloat(v.balance)
                    })
                }
                if(balance.loan.length>0){
                    balance.loan.forEach(v=>{
                        assetLiability += parseFloat(v.principal)
                    })

                }
                let rate    = 0
                if(assetsTotal != 0){
                    rate    = (balance.liabilitiesTotal/parseFloat(assetsTotal)*100).toFixed(2)
                }else{
                    rate    = 0
                }

                balance.assetLiabilityRatio = rate

                return balance.assetLiabilityRatio
            },
            //授信期限
            creditDuration:function(){
                let apply      = this.credit.apply
                let duration   = moment(apply.expirationDate).diff(moment(apply.applyDate), 'days')
                apply.duration = duration
                return duration
            }

        },
        methods: {
            baseCostRateValidate(rule, value, callback){
                let that =  this
                if (value === '') {
                    callback(new Error('请输入借款成本'));
                } else {
                    let minCostRate = that.prodData.base.minCostRate
                    let maxCostRate = that.prodData.base.maxCostRate
                    if (value < minCostRate || value > maxCostRate ) {
                        callback(new Error('借款成本超出范围'));
                    }
                    callback();
                }
            },
            //授信Tab切换
            creditTabChangeHandler(tab){
                let that    = this
                let credit  = that.credit
                that.getCount()
                if(tab.index == 0){
                    that.getMyCreditList()
                }
                if(tab.index == 1){
                    that.getMyPendingAuditSearch()
                }
                if(tab.index == 2){
                    that.getApprovedSearch()
                }
                if(tab.index == 3){
                    that.getNeedApproveSearch()
                }

            },

            //待处理
            getMyCreditList(){
                let that        = this
                let url         = Vue.agent.root + '/business/credit/search'
                var reqData     = {
                    pageSize:that.toDoData.pageSize,
                    pageNum :that.toDoData.pageNum,
                    funcId  :that.funcId,
                    status:1
                }
                that.$http.get(url,{
                    params:reqData,
                    timeout:30000
                }).then(res => {
                    if(res.body.code == 200) {
                        let data            = res.body.data
                        Object.assign(that.toDoData,data)
                    }
                });
            },
            //我的待审批
            getMyPendingAuditSearch(){
                let that        = this
                let url         = Vue.agent.root + '/business/credit/search'
                var reqData     = {
                    pageSize:that.toDoData.pageSize,
                    pageNum :that.toDoData.pageNum,
                    funcId  :that.funcId,
                    status:2
                }
                that.$http.get(url,{
                    params:reqData,
                    timeout:30000
                }).then(res => {
                    if(res.body.code == 200) {
                        let data            = res.body.data
                        Object.assign(that.toDoData,data)
                    }
                });
            },
            //我的待审批
            getMyPendingAuditSearch(){
                let that        = this
                let url         = Vue.agent.root + '/business/credit/search'
                var reqData     = {
                    pageSize:that.toDoData.pageSize,
                    pageNum :that.toDoData.pageNum,
                    funcId  :that.funcId,
                    status:2
                }
                that.$http.get(url,{
                    params:reqData,
                    timeout:30000
                }).then(res => {
                    if(res.body.code == 200) {
                        let data            = res.body.data
                        Object.assign(that.toDoData,data)
                    }
                });
            },
//            查询事件
            doSearchHandler(){
                let that    =  this
                that.getApprovedSearch()
            },
            //已审批
            getApprovedSearch(){
                let that        = this
                let url         = Vue.agent.root + '/business/credit/search'
                var reqData     = {
                    pageSize:that.toDoData.pageSize,
                    pageNum :that.toDoData.pageNum,
                    funcId  :that.funcId,
                    status:3
                }
                let search  = that.search
                Object.assign(reqData,search)

                Util.dataClear(reqData)

                that.$http.get(url,{
                    params:reqData,
                }).then(res => {
                    if(res.body.code == 200) {
                        let data            = res.body.data
                        Object.assign(that.toDoData,data)
                    }
                });
            },
            //需要审批
            getNeedApproveSearch(){
                let that        = this
                let url         = Vue.agent.root + '/business/credit/search'
                var reqData     = {
                    pageSize:that.toDoData.pageSize,
                    pageNum :that.toDoData.pageNum,
                    funcId  :that.funcId,
                    status:4
                }
                that.$http.get(url,{
                    params:reqData,
                    timeout:30000
                }).then(res => {
                    if(res.body.code == 200) {
                        let data            = res.body.data
                        Object.assign(that.toDoData,data)
                    }
                });
            },


            //撤回审批
            doCreditApplyRevokeHandler(scope){
                let that = this
                let creditId = scope.row.creditId
                let index  = scope.$index
                that.$confirm('确认要删除?, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    that.doCreditApplyRevoke(creditId,function () {
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            doCreditApplyRevoke(creditId,callback){
                let that        = this
                let url         = Vue.agent.root + '/business/credit/revoke'
                let reqData     = {
                    funcId  :that.funcId,
                    id:creditId,
                }
                that.$http.put(url,reqData).then(res => {
                    if(res.body.code == 200) {
                        !!callback && callback()
                        that.$notify({title: '成功',message: '撤回成功',type: 'success'});
                    }
                });
//
            },
            getApproveStatusHandler(){

            },
//            显示审批窗口
            showApproveDialogHandler(scope){
                let that                = this
                that.visible.approve    = true
                that.approve.taskId     = scope.row.taskId
            },
//            显示审批记录
            showApproveHistoryHandler(scope){
                let that                = this
                let instanceId              = scope.row.instanceId
                that.getApproveHistory(instanceId)

            },
            getApproveHistory(instanceId){
                let that           = this
                let url            = Vue.agent.root+'/workflow/getTasksByInstanceId';
                that.$http.get(url,{params:{
                    funcId:that.funcId,
                    instanceId:instanceId,
                }}).then(function (res) {
                    if(res.body.code == 200) {
                        let data =  res.body.data
                        that.visible.history    = true
                        that.history = data.list
                    }
                });
            },

//            操作审批
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
                        that.getNeedApproveSearch()
                        that.visible.approve    = false
                    }
                });
            },
//            通用下载
            getCreditMaterialDownload(type,creditId){
                let that        = this
                let url         = Vue.agent.root + '/business/material/download?token=' + auth.getToken() + '&device=1&type='+type+'&id='+creditId
                return url
            },
            //图片预览
            handlePicturePreview(type){
                let that        = this
                let creditId    = that.credit.creditId
                let url         = Vue.agent.root + '/business/material/download?token=' + auth.getToken() + '&device=1&type='+type+'&id='+creditId
                this.dialogImageUrl = url;
                this.visible.bigImg = true;
            },
//            图片预览
            handlePictureCardPreview(file){
                this.dialogImageUrl = file.url;
                this.visible.bigImg = true;
            },
//            上传后显示图片
            handleUploadSuccess(res, file){
                let that = this
                if(res.code == 200){
                    that.$notify({title: '成功',message: '上传成功',type: 'success'});
                }
            },
            //新增授信
            showAddCreditHandler(){
                let that = this
                Util.dataReset(that.credit.apply)
                that.prodData.base = {}
                that.visible.addCredit  = true
                that.credit.certNumber = null
                that.brief.visible = false

            },

            //            选择用户后
            selectedCustomHandler(val){
                let that    = this
                let options = that.customer.options
                let res     = options.find(v=>{
                    return val == v.custId
                })
                if(!!res){
                    if(res.blackFlag == 1){
                        that.brief.msg     = "该用户是黑名单用户"
                        that.brief.visible = true
                        return false
                    }
                    if(res.creditFlag == 1){
                        that.brief.msg     = "该用户已授信，金额为" + accounting.format(res.creditAmount,2,',')
                        that.brief.visible = true
                        return false
                    }
                    that.brief.visible = false
                    that.brief.enable  = true
                    that.brief.custId  = res.custId
                }else{

                }

            },

            //            获取担保用户
            getCustomByCertNoOrName(query){
                let that        = this
                if(query == null){
                    that.customer.options = []
                    return false
                }
                var reqData     = {
                    funcId  :that.funcId,
                }
                if(!!query.match(/\d*/)){
                    reqData.certNumber = query
                    reqData.custName = null
                }
                if(!!query.match(/[\u4e00-\u9fa5]/)){
                    reqData.custName = query
                    reqData.certNumber = null
                }
                Util.dataClear(reqData)

                let url         = Vue.agent.root + '/business/credit/add/fetchUser'

                that.$http.get(url,{
                    params:reqData,
                }).then(res => {
                    if(res.body.code == 200) {
                        let list            = res.body.data.list
                        that.customer.options = list
                        that.customer.loading = false;
                    }else{
                        that.customer.options = []
                    }
                });
            },


            //添加授信
            doCreditAddHandler(newCredit){
                let that = this
                that.$refs[newCredit].validate((valid) => {
                    if (valid) {
                        that.tabActive = 'first'
                        that.addCredit()
                    } else {
                        return false;
                    }
                });
            },
            addCredit(){
                let that        = this

                let url         = Vue.agent.root + '/business/credit/add'
                let brief       = that.brief

                var reqData     = {
                    funcId:that.funcId,
                    id:brief.custId,
                }

                that.$http && that.$http.post(url,reqData).then(function (res) {
                    if(res.body.code == "200") {
                        let creditId = res.body.data
                        that.visible.addCredit  = false
                        that.current.creditId = creditId
                        that.visible.openCredit = true
                        that.current.creditEditable = true
                    }
                });
            },
            //  编辑授信
            doCreditEditHandler(scope){
                let that    = this
                let credit  = scope.row
                that.current.creditId = credit.creditId
                that.visible.openCredit = true
                that.current.creditEditable = true
            },
            //查看授信
            showCreditEditHandler(scope){
                let that    = this
                let credit  = scope.row
                that.current.creditId = credit.creditId
                that.visible.openCredit = true
                that.current.creditEditable = false
            },
            applyCallBack(){
                let that = this
                that.getCount()
                that.getMyCreditList()
            },

            showRollbackReasonHandler(){

            },
            getMaterialInfo(creditId){
                let that        = this
                let url         = Vue.agent.root + '/business/material/fetch'
                var reqData     = {
                    id :creditId,
                    funcId  :that.funcId
                }

                that.$http.get(url,{
                    params:reqData,
                }).then(res => {
                    if(res.body.code == 200) {
                        let data            = res.body.data
                        Object.assign(that.credit.material,data)
                    }
                });
            },
            getOtherMaterialList(creditId){
                let that        = this
                let url         = Vue.agent.root + '/business/material/other/list'
                var reqData     = {
                    id :creditId,
                    funcId  :that.funcId
                }

                that.$http.get(url,{
                    params:reqData,
                }).then(res => {
                    if(res.body.code == 200) {
                        let data            = res.body.data
                        that.credit.material.list = data
//                        Object.assign(that.credit.material.list,data)
                    }
                });
            },
            doAddUploadItemHandler(){
                let that = this
                that.visible.upload = true
            },
//            添加上传清单
            doSaveUploadItemHandler(uploadItem){
                let that = this
                that.$refs[uploadItem].validate((valid) => {
                    if (valid) {
                        that.addUploadItem()
                    } else {
                        return false;
                    }
                });

            },
            addUploadItem(){
                let that        = this
                let credit      = that.credit
                let item        = that.credit.material.item
                let url         = Vue.agent.root + '/business/material/other/add'
                var reqData     = {
                    id :credit.creditId,
                    funcId  :that.funcId,
                    name:item.name,
                    remark:item.remark
                }

                that.$http.post(url,reqData).then(res => {
                    if(res.body.code == 200) {
                        that.visible.upload = false
                        that.$notify({title: '成功',message: '添加成功',type: 'success'});
                        that.getOtherMaterialList(credit.creditId)
                        let data            = res.body.data
//                        Object.assign(that.credit.material.list,data)
                    }
                });
            },
            //删除其他附件目录
            deleteUpdateItemHandler(scope){
                let that     = this
                let reportId = scope.row.id
                let index    = scope.row.index
                let creditId = scope.row.creditId
                that.deleteUpdateItem(reportId,creditId,function () {
//                    console.log(that.credit.user.other)
                    that.credit.material.list.splice(index,1)
                })
            },
            deleteUpdateItem(reportId,creditId,callback){
                let that        = this
                let url         = Vue.agent.root + '/business/material/other/delete'
                var reqData     = {
                    id      :reportId,
                    creditId:creditId,
                    funcId  :that.funcId
                }

                that.$http.delete(url,{
                    params:reqData,
                }).then(res => {
                    if(res.body.code == 200) {
                        !!callback && callback()
                        that.$notify({title: '成功',message: '删除成功',type: 'success'});
                    }
                });

            },
            //显示其他附件详情
            showUploadDetailHandler(fileId){
                let that                    = this

                that.credit.material.fileList = []
                that.credit.material.fileId = fileId
                that.getUploadItemDetail(fileId)
            },
            getUploadItemDetail(fileId){
                let that        = this
                let url         = Vue.agent.root + '/business/material/other/file/list'
                var reqData     = {
                    id      :fileId,
                    funcId  :that.funcId
                }

                that.$http.get(url,{
                    params:reqData,
                }).then(res => {
                    if(res.body.code == 200) {
                        let data            = res.body.data
                        data.forEach(v=>{
                            v.url = Vue.agent.root + '/business/material/other/file/download?token=' + auth.getToken() + '&device=1&id='+v.id+ '&reportId='+v.reportId
                        })
                        that.credit.material.fileList = data
                        that.visible.uploadDetail   = true
                    }
                });
            },

//            上传到服务器
            submitUpload(uploadName) {
                let that = this
                that.$refs['materialForm'].validate((valid) => {
                    if (valid) {
                        if(this.$refs[uploadName].uploadFiles.length == 0){
                            that.$notify({title: '提示',message: '未上传文件',type: 'warning'});
                        }else{
                            this.$refs[uploadName].submit();
                        }
                    } else {
//                        console.log('error submit!!');
                        return false;
                    }
                });


            },

            uploadDetailRemoveHandler(file, fileList){
                this.deleteUpdateDetailItem(file.reportId,file.creditId,file.id)
//                console.log(file, fileList);
            },
            deleteUpdateDetailItem(reportId,creditId,fileId){
                let that        = this
                let url         = Vue.agent.root + '/business/material/other/file/delete'
                var reqData     = {
                    id      :fileId,
                    reportId:reportId,
                    creditId:creditId,
                    funcId  :that.funcId
                }

                that.$http.delete(url,{
                    params:reqData,
                }).then(res => {
                    if(res.body.code == 200) {
                        that.$notify({title: '成功',message: '删除成功',type: 'success'});
                    }
                });

            },

            doAddBalanceLoanHandler(){
                let that = this
                let loan = that.credit.balance.loan

                let o    = {
                    "bankName": null,
                    "expirationDate": null,
                    "id": 0,
                    "loanTimes": null,
                    "name": null,
                    "principal": null,
                    "startDate": null
                }
                loan.push(o)
            },
            //基本产品改变
            prodBaseChangeHandler(val){
                let that = this
                let list = that.prodData.list
                let ele  = list.find(v=>{
                    return v.currentPId == val
                })
                if(!!ele){
                    that.prodData.base = ele
                    that.credit.apply.baseCostRate = that.prodData.base.minCostRate
                }else{
                    Util.dataReset(that.prodData.base)
                }
            },
            //附属产品产品改变
            prodSubsidiaryChangeHandler(val){
                let that = this
                let list = that.prodData.list
                let ele  = list.find(v=>{
                    return v.currentPId == val
                })
                if(!!ele){
                    that.prodData.subsidiary = ele
                }else{
                    Util.dataReset(that.prodData.subsidiary)
                }

            },

            //营销产品产品改变
            prodMarketChangeHandler(val){
                let that = this
                let list = that.prodData.list
                let ele  = list.find(v=>{
                    return v.currentPId == val
                })
                if(!!ele){
                    that.prodData.market = ele
                }else{
                    Util.dataReset(that.prodData.market)
                }
            },
            //个人概况保存
            doSaveUserApplyCacheHandler(apply){
                let that = this
                that.$refs[apply].validate((valid) => {
                    that.doSaveUserApplyCache(function () {
                    })
                });
            },
            doSaveUserApplyCache(callback){
                let that        = this
                let url         = Vue.agent.root + '/business/credit/update'
                let apply       = that.credit.apply
                var reqData     = {
                    funcId  :that.funcId,
                    id:apply.creditId,
                    creditAmt:apply.creditAmt,
                    duration:apply.duration,
                    guaranteeType:apply.guaranteeType,
                    basePrdId:apply.basePrdId,
                    baseCostRate:apply.baseCostRate,
                    isSpecialService:apply.isSpecialService,
                    purpose:apply.purpose
                }

                if(apply.applyDate)
                    reqData.applyDate      = new Date(apply.applyDate).getTime()
                if(apply.expirationDate)
                    reqData.expirationDate = new Date(apply.expirationDate).getTime()
                if(apply.baseStartDate)
                    reqData.baseStartDate      = new Date(apply.baseStartDate).getTime()
                if(apply.baseEndDate)
                    reqData.baseEndDate = new Date(apply.baseEndDate).getTime()


                that.$http.put(url,reqData).then(res => {
                    if(res.body.code == 200) {
                        !!callback && callback()
                        that.$notify({title: '成功',message: '暂存成功',type: 'success'});
                    }
                });
            },
            doSaveUserBalanceCacheHandler(){
                let that    = this
                that.doSaveUserBalanceCache()
            },
            doSaveUserBalanceCache(callback){
                let that        = this
                let url         = Vue.agent.root + '/business/balanceSheet/save'
                let balance     = JSON.parse(JSON.stringify(that.credit.balance))
                if(balance.loan && balance.loan.length > 0){
                    balance.loan.forEach(v=>{
                        v.startDate         = new Date(v.startDate).getTime()
                        v.expirationDate    = new Date(v.expirationDate).getTime()
                    })
                }

                that.$http.put(url,JSON.stringify(balance)).then(res => {
                    if(res.body.code == 200) {
                        !!callback && callback()
                        that.$notify({title: '成功',message: '暂存成功',type: 'success'});
                    }
                });
            },
            //经营情况保存
            doSaveUserOperateCacheHandler(operation){
                let that = this
                that.$refs[operation].validate((valid) => {
                        that.doSaveUserOperateCache(function () {
                        })
                });
            },
            doSaveUserOperateCache(callback){
                let that        = this
                let url         = Vue.agent.root + '/business/creditOperation/save'
                let operate       = that.credit.operate
                let apply       = that.credit.apply
                var reqData     = {
                    id              :apply.creditId,
                    funcId          :that.funcId,
                    industry        :operate.industry,
                    industryDuration:operate.industryDuration,
                    isOtherIndustry :operate.isOtherIndustry,
                    otherIndustry   :operate.otherIndustry,
                    mainProduct     :operate.mainProduct,
                    stable          :operate.stable,
                    employers       :operate.employers,
                    salesVolume     :operate.salesVolume,
                    profit          :operate.profit,
                    profitRate      :operate.profitRate,
                    lastSalesVolume :operate.lastSalesVolume,
                    lastProfit      :operate.lastProfit,
                    lastProfitRate  :operate.lastProfitRate,
                    salesTarget     :operate.salesTarget,
                    isSeasonal      :operate.isSeasonal,
                    busySeason      :operate.busySeason,
                    lowSeason       :operate.lowSeason,
                    estimate        :operate.estimate,
                }

                that.$http.put(url,reqData).then(res => {
                    if(res.body.code == 200) {
                        !!callback && callback()
                        that.$notify({title: '成功',message: '暂存成功',type: 'success'});
                    }
                });
            },


            //待处理页码变换
            toDoCurrentPageChange(val) {
                let that = this
                if(that.toDoData.loading == true){
                    that.$notify({title: '提示',message: '请勿频繁操作',type: 'warning'});
                }else{
                    that.toDoData.pageNum = val
                    that.getMyCreditList()
                }
            },

            //            显示编辑
            doTodoDeleteHandler(scope){
                let that = this
                let creditId = scope.row.creditId
                let index  = scope.$index
                that.$confirm('确认要删除?, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    that.toDoDelete(creditId,function () {
                        that.toDoData.list.splice(index,1)
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            toDoDelete(creditId,cb){
                let that        = this
                let url         = Vue.agent.root + '/business/credit/delete'
                var reqData     = {
                    id:creditId,
                    funcId  :that.funcId,
                }
                that.$http.delete(url,{
                    params:reqData
                }).then(function (res) {
                    if(res.body.code == 200) {
                        that.$notify({title: '成功',message: '删除成功',type: 'success'});
                        cb()
                    }else{
                        that.$notify({title: '失败',message: '操作失败',type: 'error'});
                    }
                });
            },





            //用户信息Tab

            //显示编辑用户 dialog
            showCustomInfoHandler(val){
                let that = this
                that.visible.openUser = true
                that.current.custId = val.row.custId
            },

            //获取客户经营情况详情
            getUserOperationByCreditId(creditId){
                let that        = this
                let url         = Vue.agent.root + '/business/creditOperation/fetch'
                var reqData     = {
                    id:creditId,
                    funcId  :that.funcId,
                }
                that.$http.get(url,{
                    params:reqData
                }).then(function (res) {
                    if (res.body.code == "200") {
                        that.credit.user.operation.detail = res.body.data
//                        let list = res.body.data
//                        that.credit.user.operation = list
                    }
                })
            },

            showUserOperateInfoHandler(scope){
                let that = this
                that.visible.operate = true
                that.getUserOperationByCreditId(scope.row.creditId)

            },

            //显示负债详情窗口
            showUserBalanceInfoHandler(scope){
                let that = this
                that.visible.balance = true
                that.getUserBalanceDetailByCreditId(scope.row.creditId)

            },
            //获取客户负债情况详情
            getUserBalanceDetailByCreditId(creditId){
                let that        = this
                let url         = Vue.agent.root + '/business/balanceSheet/fetch'
                var reqData     = {
                    id:creditId,
                    funcId  :that.funcId,
                }
                that.$http.get(url,{
                    params:reqData
                }).then(function (res) {
                    if (res.body.code == "200") {
                        that.credit.user.balance.detail = res.body.data
//                        let list = res.body.data
//                        that.credit.user.operation = list
                    }
                })
            },
            showDetailCreditMaterialHandler(scope){
                let that = this
                that.visible.creditMaterial = true
                let creditId    = scope.row.creditId
                that.getCreditMaterial(creditId)
            },
            getCreditMaterial(creditId){
                let that        = this
                let url         = Vue.agent.root + '/business/material/fetch'
                var reqData     = {
                    id :creditId,
                    funcId  :that.funcId
                }

                that.$http.get(url,{
                    params:reqData,
                }).then(res => {
                    if(res.body.code == 200) {
                        let data            = res.body.data
                        that.credit.user.creditMaterial.detail = data
                    }
                });
            },


            doReset(){
                let search = this.search
                Util.dataReset(search)
            },

//            获取 counts
            getCount(){
                let that        = this
                let opsUrl      = Vue.agent.root + '/business/credit/count'

                that.$http && that.$http.get(opsUrl,{params:{
                    funcId:that.funcId
                }}).then(function (res) {
                    if(res.body.code == "200") {
                        let data             = res.body.data
                        that.count           = data
                    }
                });
            },


//            获取ops
            getOps(){
                let that        = this
                let opsUrl      = Vue.agent.root + '/dictionary/dict/querys'

                that.$http && that.$http.get(opsUrl,{params:{
                    names:"repayType,lifeCycle,guaranteeType,loanRate,costRate,approvalStatus,assureType,stabilizeType,education,residentStatus,residentHouseType,maritalStatus,approvalOperationType",
                    funcId:that.funcId
                }}).then(function (res) {
                    if(res.body.code == "200") {
                        let data                     = res.body.data
                        that.ops.repayType           = data.repayTypeOptions
                        that.ops.loanRate            = data.loanRateOptions
                        that.ops.lifeCycle           = data.lifeCycleOptions
                        that.ops.costRate            = data.costRateOptions
                        that.ops.approvalStatus      = data.approvalStatusOptions
                        that.ops.assureType          = data.assureTypeOptions
                        that.ops.stabilizeType       = data.stabilizeTypeOptions
                        that.ops.educationOps        = data.educationOptions
                        that.ops.residentHouseTypeOps= data.residentHouseTypeOptions
                        that.ops.residentStatusOps   = data.residentStatusOptions
                        that.ops.maritalStatusOps    = data.maritalStatusOptions
                        that.ops.approvalOps         = data.approvalOperationTypeOptions
                        that.ops.guaranteeTypeOps    = data.guaranteeTypeOptions

                    }
                });
            },
            getProds(){
                let that        = this
                let url         = Vue.agent.root + '/business/loanProduct/list'
                var reqData     = {
                    funcId  :that.funcId
                }

                that.$http.get(url,{
                    params:reqData,
                }).then(res => {
                    if(res.body.code == 200) {
                        let list            = res.body.data.list
                        that.prodData.list       = list
                    }
                });
            }
        },
        created:function () {
            let that        = this
            that.getOps()
            that.getProds()
            that.getCount()
            that.getMyCreditList()
        },
        mounted:function () {

        },
        components:{
            'user-info':UserInfo,
            'credit-info':CreditInfo
        }
    }
</script>
<style lang="scss">
    @import 'src/scss/pages/business/personal-credit.scss';
</style>