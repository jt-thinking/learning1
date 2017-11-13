<template>
    <div class="stat-loan">
        <el-tabs v-model="tabActive" type="card" @tab-click="creditTabChangeHandler">
            <el-tab-pane label="单笔授信变更" name="a">
                <div class="stat-box">
                    <div class="search-box">
                        <el-form   :model="search"  ref="searchForm">
                            <el-form-item ref="creditForm"  label="授信合同号:" label-width="100px" prop="creditNo" :rules="[
                                { required: true, message: '请输入证件号'}
                            ]">
                                <el-input  size="small"  v-model="search.creditNo" placeholder="请输入授信合同号"></el-input>
                            </el-form-item>
                            <el-form-item label-width="30px" >
                                <el-button @click.native="getCreditByCreditNoHandler('searchForm')" size="small" type="primary">查询</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>

                <el-form :model="credit"  ref="creditForm" label-width="120px">
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="授信合同号:">
                                <span>{{ originalCredit.creditNo }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="客户姓名:">
                                <span>{{ originalCredit.custName }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="授信金额:">
                                <span>{{ originalCredit.creditAmt }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="授信生效日:">
                                <span>{{ originalCredit.applyDate | dateFormat }}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="授信到期日:">
                                <span>{{ originalCredit.expirationDate | dateFormat }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="证件类型:">
                                <span>{{ originalCredit.certificateType }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="基本产品:">
                                <span>{{ originalCredit.basePrdName }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="附属产品:">
                                <span>{{ originalCredit.subsidiaryPrdName }}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="营销产品:">
                                <span>{{ originalCredit.marketPrdName }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="经办人:">
                                <span>{{ originalCredit.operaterName }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="受理机构:">
                                <span>{{ originalCredit.operaterOrganizationName }}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item  label="原授信额度(万):">
                                <span>{{ originalCredit.creditAmt }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item  label="修改额度为(万):">
                                <el-input size="small" v-model="credit.creditAmt" placeholder="请输入授信额度"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-button @click.native="changeCreditMoneyHandler('searchForm')" size="small" type="primary">提交变更</el-button>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item  label="原基本产品:">
                                <span>{{ originalCredit.basePrdName }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="修改基本产品为">
                                <el-select   size="small" v-model="credit.basePrdId" placeholder="请选择产品">
                                    <el-option  label="选择产品" :value="null"></el-option>
                                    <el-option
                                            v-for="item in prodList"
                                            :key="item.prdId"
                                            :label="item.prdName"
                                            :value="item.currentPId">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-button @click.native="changeCreditMainProdHandler('searchForm')" size="small" type="primary">提交变更</el-button>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item  label="原附属产品:">
                                <span>{{ originalCredit.subsidiaryPrdName }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="修改附属产品为">
                                <el-select   size="small" v-model="credit.subsidiaryPrdId" placeholder="请选择产品">
                                    <el-option  label="选择产品" :value="null"></el-option>
                                    <el-option
                                            v-for="item in prodList"
                                            :key="item.prdId"
                                            :label="item.prdName"
                                            :value="item.currentPId">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-button @click.native="changeCreditSubProdHandler('searchForm')" size="small" type="primary">提交变更</el-button>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item  label="原营销产品:">
                                <span>{{ originalCredit.marketPrdName }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="修改营销产品为">
                                <el-select   size="small" v-model="credit.marketPrdId" placeholder="请选择产品">
                                    <el-option  label="选择产品" :value="null"></el-option>
                                    <el-option
                                            v-for="item in prodList"
                                            :key="item.prdId"
                                            :label="item.prdName"
                                            :value="item.currentPId">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-button @click.native="changeCreditMarketProdHandler('searchForm')" size="small" type="primary">提交变更</el-button>
                        </el-col>
                    </el-row>
                </el-form>

            </el-tab-pane>
            <el-tab-pane label="批量产品变更" name="b">
                <div style="height:60px">
                    <el-form :model="prodBatch" ref="fileForm">
                        <el-row :gutter="20">
                            <el-col :span="3">
                                <el-upload
                                        class="upload-demo"
                                        :headers="headers"
                                        action="root/credit/product/batch/chg/update"
                                        :multiple="false"
                                        :on-success="handleUploadSuccess"
                                        :on-remove="handleRemove"
                                        :data="uploadData"
                                        :auto-upload="false"
                                        ref="fileUpload"
                                >
                                    <el-button size="small" type="primary">选择文件</el-button>
                                    <!--<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
                                </el-upload>
                                <!--<el-input size="small"  v-model="credit.material.courtExecuteFile"  placeholder="文件名"></el-input>-->
                            </el-col>
                            <el-col :span="3">
                                <!--<el-button size="small" type="primary">点击上传</el-button>-->
                                <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload('fileUpload')">提交变更</el-button>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>

                <div  class="table">
                    <el-table
                            v-loading="loading"
                            :data="prodBatch.errorList"
                            :stripe="true"
                            border
                            style="width: 100%">
                        <el-table-column
                                prop="creditNo"
                                align="center"
                                label="授信合同编号"
                                width="200px"
                        >
                        </el-table-column>
                        <el-table-column
                                prop="msg"
                                align="center"
                                label="错误原因"
                        >
                        </el-table-column>
                    </el-table>
                </div>
            </el-tab-pane>
            <el-tab-pane label="授信额度止付" name="c">
                <div class="stat-box">
                    <div class="search-box">
                        <el-form   :model="search"  ref="stopPaymentForm">
                            <el-form-item ref="creditForm"  label="授信合同号:" label-width="100px" prop="creditNo" :rules="[
                                { required: true, message: '请输入证件号'}
                            ]">
                                <el-input  size="small"  v-model="search.creditNo" placeholder="请输入授信合同号"></el-input>
                            </el-form-item>
                            <el-form-item label-width="30px" >
                                <el-button @click.native="getStopPaymentByCreditNoHandler('stopPaymentForm')" size="small" type="primary">查询</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
                <div  class="table">
                    <el-table
                    v-loading="loading"
                    :data="stopRepaymentList"
                    :stripe="true"
                    border
                    style="width: 100%">
                        <el-table-column
                            prop="creditNo"
                            align="center"
                            label="授信合同编号"
                            min-width="160px"
                        >
                        </el-table-column>
                        <el-table-column
                        prop="custName"
                        align="center"
                        label="客户姓名"
                        >
                        </el-table-column>
                        <el-table-column
                        prop="basePrdName"
                        label="基本产品"
                        align="center"
                        >
                        </el-table-column>
                        <el-table-column
                        prop="subsidiaryPrdName"
                        align="center"
                        label="附属产品"
                        >
                        </el-table-column>
                        <el-table-column
                        prop="marketPrdName"
                        align="center"
                        label="营销产品"
                        >
                        </el-table-column>
                        <el-table-column
                                align="center"
                                label="授信金额"
                        >
                            <template scope="scope">
                                <span>{{ scope.row.creditAmt | moneyFormat }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                align="center"
                                label="授信期限"
                        >
                            <template scope="scope">
                                <span>{{ scope.row.duration }} 天</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="applyDate"
                                align="center"
                                min-width="100px"
                                label="授信日期"
                        >
                            <template scope="scope">
                                <span>{{ scope.row.applyDate | dateFormat }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="expirationDate"
                                align="center"
                                min-width="100px"
                                label="到期日期"
                        >
                            <template scope="scope">
                                <span>{{ scope.row.expirationDate | dateFormat }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                align="center"
                                label="状态"
                        >
                            <template scope="scope">
                                <span v-show="scope.row.amountFlag == 1 && scope.row.enableFlag == 1">有效</span>
                                <span v-show="scope.row.amountFlag == 0 && scope.row.enableFlag == 1">无效</span>
                                <span v-show="scope.row.enableFlag == 0">终止</span>
                            </template>
                        </el-table-column>
                            <el-table-column
                                    prop="operaterName"
                                    align="center"
                                    label="经办人"
                            >
                        </el-table-column>
                        <el-table-column
                            align="center"
                            fixed="right"
                            label="操作"
                            min-width="100px"
                        >
                            <template scope="scope">
                                <el-button v-show="scope.row.amountFlag == 1 && scope.row.enableFlag == 1" @click.native="doStopPaymentHandler(scope)" size="mini">止付</el-button>
                                <el-button v-show="scope.row.amountFlag == 0 && scope.row.enableFlag == 1" @click.native="doRecoverHandler(scope)" size="mini">恢复</el-button>
                                <el-button v-show="scope.row.enableFlag == 1" @click.native="doEndHandler(scope)" size="mini">终止</el-button>
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
                :page-size="pageSize"
                :current-page.sync="pageNum"
                :total="total">
                </el-pagination>
                </div>
                </div>
            </el-tab-pane>

            <el-tab-pane label="授信变更记录" name="d">
                <div class="stat-box">
                    <div class="search-box">
                        <el-form   :model="search">
                            <el-form-item ref="creditForm"  label="授信合同号:" label-width="100px">
                                <el-input  size="small"  v-model="search.creditNo" placeholder="请输入授信合同号"></el-input>
                            </el-form-item>
                            <el-form-item ref="creditForm"  label="客户名称:" label-width="100px">
                                <el-input  size="small"  v-model="search.name" placeholder="请输入客户名称"></el-input>
                            </el-form-item>
                            <el-form-item label="审批类型" label-width="100px">
                                <el-select size="small" v-model="search.type" placeholder="请选择审批类型">
                                    <el-option  label="全部" :value="null"></el-option>
                                    <el-option
                                            v-for="item in ops.approvalType"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label-width="100px" label="审批时间:">
                                <el-date-picker
                                class="date"
                                style="width:100%"
                                size="small"
                                v-model="search.auditStartDateT"
                                type="date"
                                placeholder="放款日期">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label-width="100px" label="到期日期">
                                <el-date-picker
                                style="width:100%"
                                size="small"
                                class="date"
                                v-model="search.auditEndDateT"
                                type="date"
                                placeholder="放款日期">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label-width="30px" >
                                <el-button @click.native="getCreditChangeHistoryHandler" size="small" type="primary">查询</el-button>
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
                        prop="creditNumber"
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
                        prop="businessType"
                        label="变更类型"
                        align="center"
                        >
                            <template scope="scope">
                                <span>{{ scope.row.businessType | opsFormat(ops.approvalType) }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                        prop="oldValue"
                        align="center"
                        label="变更前"
                        >
                        </el-table-column>
                        <el-table-column
                        prop="value"
                        align="center"
                        label="变更后"
                        >
                        </el-table-column>
                        <el-table-column
                                prop="accepterName"
                                align="center"
                                label="审批人"
                        >
                        </el-table-column>

                        <el-table-column
                        align="center"
                        label="审批时间"
                        >
                            <template scope="scope">
                                <span>{{ scope.row.accepterTime | dateTimeFormat }}</span>
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
                :page-size="pageSize"
                :current-page.sync="pageNum"
                :total="total">
                </el-pagination>
                </div>
                </div>
            </el-tab-pane>


        </el-tabs>
    </div>

</template>

<script>
    import Util             from    'src/js/util'
    import Auth             from    'src/js/auth'

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
                    creditNo:'',
                    auditStartDateT:null,
                    auditStartDate:null,
                    auditEndDateT:null,
                    auditEndDate:null,
                    type:null
                },
                credit:{
                  creditNo:null
                },
                originalCredit:{

                },
                prodBatch:{
                    errorList:[]
                },
                history:{
                    list:[],
                    pageNum:1,
                    pageSize:15,
                },
                headers:{
                    'authorization':Auth.getToken(),
//                    'Content-Type': 'multipart/form-data',
//                    'Accept':'application/json',
                },
                ops:{
                    approvalType:[]
                },
                stopRepaymentList:[],
                prodList:[],
                tabActive:'a',
                pageNum:1,
                pageSize:15,
                loading: false,
                funcId:'R070600',
            }
        },
        computed: {
            uploadData:function () {
                let that            = this
                let ob = {
                }

                return ob
            },
        },
        watch: {
            "search.auditStartDateT": function (val) {
                this.search.auditStartDate = val ? new Date(val).getTime() : null
            },
            "search.auditEndDateT": function (val) {
                this.search.auditEndDate = val ? (new Date(val).getTime()+86400000-1) : null
            },
        },
        methods: {
            handleUploadSuccess(){

            },
            //上传后显示图片
            handleUploadSuccess(res, file){
                let that = this
                if(res.code == 200){
                    that.$notify({title: '成功',message: '上传成功',type: 'success'});
                }
                if(res.code == 400){
                    that.prodBatch.errorList = res.data.list
                    that.$notify({title: '失败',message: res.message,type: 'error'});
                }
            },
            submitUpload(uploadName) {
                let that = this
                that.$confirm('您确认要批量变更营销产品吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    that.$refs['fileForm'].validate((valid) => {
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
                }).catch(() => {
                        this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });

            },
//            tab切换
            creditTabChangeHandler(){
                let that = this
                that.doReset()
            },
            doReset(){
                let search = this.search
                Util.dataReset(search)
            },
            changeCreditMoneyHandler(){
                let that    = this
                let url     = Vue.agent.root + '/business/credit/amountChange'
                let credit  = that.credit
                let reqData = {
                    id:credit.creditId,
                    amount:credit.creditAmt,
                    funcId:that.funcId
                }
                that.$http && that.$http.put(url,reqData).then(function (res) {
                    if(res.body.code == "200") {
                        that.$notify({title: '提示',message: '操作成功',type: 'success'});
                    }
                });
            },
            changeCreditMainProdHandler(){
                let that    = this
                let url     = Vue.agent.root + '/business/credit/basicProductChange'
                let credit  = that.credit
                let reqData = {
                    id:credit.creditId,
                    productId:credit.basePrdId,
                    funcId:that.funcId
                }
                that.$http && that.$http.put(url,reqData).then(function (res) {
                    if(res.body.code == "200") {
                        that.$notify({title: '提示',message: '操作成功',type: 'success'});
                    }
                });
            },
            changeCreditSubProdHandler(){
                let that    = this
                let url     = Vue.agent.root + '/business/credit/subsidiaryProductChange'
                let credit  = that.credit
                let reqData = {
                    id:credit.creditId,
                    productId:credit.subsidiaryPrdId,
                    funcId:that.funcId
                }
                that.$http && that.$http.put(url,reqData).then(function (res) {
                    if(res.body.code == "200") {
                        that.$notify({title: '提示',message: '操作成功',type: 'success'});
                    }
                });
            },
            changeCreditMarketProdHandler(){
                let that    = this
                let url     = Vue.agent.root + '/business/credit/marketProductChange'
                let credit  = that.credit
                let reqData = {
                    id:credit.creditId,
                    productId:credit.marketPrdId,
                    funcId:that.funcId
                }
                that.$http && that.$http.put(url,reqData).then(function (res) {
                    if(res.body.code == "200") {
                        that.$notify({title: '提示',message: '操作成功',type: 'success'});
                    }
                });
            },
            getCreditByCreditNoHandler(form){
                let that = this
                that.$refs[form].validate((valid) => {
                    if (valid) {
                        that.getCreditByCreditNo()
                    } else {
                        return false;
                    }
                });
            },
            getCreditByCreditNo(){
                let that        = this
                let url         = Vue.agent.root + '/business/credit/fetchCredit'
                let search      = that.search
                var reqData     = {
                    id:search.creditNo,
                    funcId:that.funcId
                }

                that.$http.get(url,{
                    params:reqData,
                }).then(res => {
                    that.loading = false
                    if(res.body.code == "200") {
                        let data = res.body.data
                        that.credit = data
                        Object.assign(that.originalCredit,data)
                    }
                });
            },
            getStopPaymentByCreditNoHandler(form){
                let that = this
                that.$refs[form].validate((valid) => {
                    if (valid) {
                        that.getStopPaymentByCreditNo()
                    } else {
                        return false;
                    }
                });
            },
            getStopPaymentByCreditNo(){
                let that        = this
                let url         = Vue.agent.root + '/business/credit/fetchCredit'
                let search      = that.search
                var reqData     = {
                    id:search.creditNo,
                    funcId:that.funcId
                }

                that.$http.get(url,{
                    params:reqData,
                }).then(res => {
                    that.loading = false
                    if(res.body.code == "200") {
                        let data = res.body.data
                        let arr  = []
                        arr.push(data)
                        that.stopRepaymentList = arr
                    }
                });
            },
//            止付操作
            doStopPaymentHandler(scope){
                let that        = this
                let creditId    = scope.row.creditId
                that.$confirm('确认要申请止付?', '提示', {
                    confirmButtonText: '提交申请',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    that.stopPayment(creditId)
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            stopPayment(creditId){
                let that    = this
                let url     = Vue.agent.root + '/business/credit/stop'
                let reqData = {
                    id:creditId,
                    funcId:that.funcId
                }
                that.$http && that.$http.put(url,reqData).then(function (res) {
                    if(res.body.code == "200") {
                        that.$notify({title: '提示',message: '操作成功',type: 'success'});
                    }
                });
            },
//            恢复
            doRecoverHandler(scope){
                let that        = this
                let creditId    = scope.row.creditId
                that.$confirm('确认要申请恢复?', '提示', {
                    confirmButtonText: '提交申请',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    that.recover(creditId)
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            recover(creditId){
                let that    = this
                let url     = Vue.agent.root + '/business/credit/recover'
                let reqData = {
                    id:creditId,
                    funcId:that.funcId
                }
                that.$http && that.$http.put(url,reqData).then(function (res) {
                    if(res.body.code == "200") {
                        that.$notify({title: '提示',message: '操作成功',type: 'success'});
                    }
                });
            },
//            终止
            doEndHandler(scope){
                let that        = this
                let creditId    = scope.row.creditId
                that.$confirm('确认要申请终止?', '提示', {
                    confirmButtonText: '提交申请',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    that.endApply(creditId)
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            endApply(creditId){
                let that    = this
                let url     = Vue.agent.root + '/business/credit/finality'
                let reqData = {
                    id:creditId,
                    funcId:that.funcId
                }
                that.$http && that.$http.put(url,reqData).then(function (res) {
                    if(res.body.code == "200") {
                        that.$notify({title: '提示',message: '操作成功',type: 'success'});
                    }
                });
            },
            changeCreditMoneyHandler(){
                let that    = this
                let url     = Vue.agent.root + '/business/credit/amountChange'
                let credit  = that.credit
                let reqData = {
                    id:credit.creditId,
                    amount:credit.creditAmt,
                    funcId:that.funcId
                }
                that.$http && that.$http.put(url,reqData).then(function (res) {
                    if(res.body.code == "200") {
                        that.$notify({title: '提示',message: '操作成功',type: 'success'});
                    }
                });
            },
//            获取授信变更记录
            getCreditChangeHistoryHandler(){
                let that = this
                that.getCreditChangeHistory()
            },
            getCreditChangeHistory(){
                let that        = this
                let history     = that.history
                let url         = Vue.agent.root + '/business/credit/changeHistory'
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
//            doSearchHandler(){
//                let that     = this
//                if(that.pageNum == 1){
////                    that.doSearch()
//                }else{
//                    that.pageNum = 1
//                }
//            },


            handleCurrentChange(val) {
                let that = this
                if(that.loading == true){
                    that.$notify({title: '提示',message: '请勿频繁操作',type: 'warning'});
                }else{
                    that.pageNum = val
                    that.doSearch()
                }
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
                        that.prodList       = list
                    }
                });
            },
//            获取ops
            getOps(){
                let that        = this
                let opsUrl      = Vue.agent.root + '/dictionary/dict/querys'

                that.$http && that.$http.get(opsUrl,{params:{
                    names:"approvalType",
                    funcId:that.funcId
                }}).then(function (res) {
                    if(res.body.code == "200") {
                        let data                     = res.body.data
                        that.ops.approvalType        = data.approvalTypeOptions
                    }
                });
            },


        },
        created:function () {
            let that        = this
            that.getProds()
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