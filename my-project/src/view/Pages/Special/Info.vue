<template>
    <div class="stat-loan">
        <el-tabs v-model="tabActive" type="card" @tab-click="creditTabChangeHandler">
            <el-tab-pane label="变更" name="a">
                <div class="stat-box">
                    <div class="search-box">
                        <el-form   :model="search" ref="certNoForm">
                            <el-form-item  label="证件号:" label-width="100px" prop="certNo" :rules="[
                                {required: true, message: '请输入证件号'},
                            ]">
                                <el-input   v-model="search.certNo" :placeholder="'请输入证件号'"></el-input>
                            </el-form-item>
                            <el-form-item label-width="30px" >
                                <el-button @click.native="doGetUserInfoByCertNoHandler('certNoForm')" size="small" type="primary">查询</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>

                <el-form :model="user"  ref="userForm" label-width="100px">
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="客户名称:">
                                <span>{{ originalUser.custName }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="客户名称:"  prop="custName" :rules="[
                                {required: true, message: '请输入姓名'},
                            ]">
                                <el-input v-model.number="user.custName"  placeholder="请输入姓名"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="身份证号:">
                                <span>{{ originalUser.certNo }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="身份证号:"  prop="certNo" :rules="[
                        {required: true, message: '请输入担保金额'}
                        ]">
                                <el-input v-model="user.certNo"  placeholder="请输入担保金额"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="社区经理:">
                                <span>{{ originalUser.mainMarketerName }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label-width="30px" >
                                <el-button @click.native="doUserInfoChangeApplyHandler('userForm')" size="small" type="primary">提交修改</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <!--<div  class="table">-->
                <!--<el-table-->
                    <!--v-loading="loading"-->
                    <!--:data="list"-->
                    <!--:stripe="true"-->
                    <!--border-->
                <!--style="width: 100%">-->
                    <!--<el-table-column-->
                    <!--prop="userId"-->
                    <!--align="center"-->
                    <!--label="客户编号"-->
                    <!--&gt;</el-table-column>-->
                    <!--<el-table-column-->
                    <!--prop="name"-->
                    <!--align="center"-->
                    <!--label="客户名称"-->
                    <!--&gt;-->
                    <!--</el-table-column>-->
                    <!--<el-table-column-->
                    <!--prop="phone"-->
                    <!--label="客户类型"-->
                    <!--align="center"-->
                    <!--&gt;-->
                    <!--</el-table-column>-->
                    <!--<el-table-column-->
                    <!--prop="certNumber"-->
                    <!--align="center"-->
                    <!--label="担保金额"-->
                    <!--&gt;-->
                    <!--</el-table-column>-->
                    <!--<el-table-column-->
                    <!--prop="balance"-->
                    <!--align="center"-->
                    <!--label="担保期限"-->
                    <!--&gt;-->
                    <!--</el-table-column>-->
                    <!--<el-table-column-->
                    <!--align="center"-->
                    <!--label="操作"-->
                    <!--&gt;-->
                    <!--<template scope="scope">-->
                        <!--<span>{{ scope.row.updateTime | dateTimeFormat }}</span>-->
                    <!--</template>-->
                    <!--</el-table-column>-->
                <!--</el-table>-->
                <!--</div>-->
                    <!--<div class="footer-box">-->
                    <!--<span v-if="startRow" class="pull-left">显示{{startRow}}-{{endRow}} 总共有{{total}}条目</span>-->
                    <!--<div class="pagination pull-right">-->
                    <!--<el-pagination-->
                    <!--layout="prev, pager, next"-->
                    <!--@current-change="handleCurrentChange"-->
                    <!--:page-size="pageSize"-->
                    <!--:current-page.sync="pageNum"-->
                    <!--:total="total">-->
                    <!--</el-pagination>-->
                    <!--</div>-->
                <!--</div>-->
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
                                <el-button @click.native="getUserChangeHistoryHandler" size="small" type="primary">查询</el-button>
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
                                label="原客户名称"
                        ></el-table-column>


                        <el-table-column
                        prop="oldCertNo"
                        align="center"
                        label="原身份证号"
                        >
                        </el-table-column>
                        <el-table-column
                                prop="newCustName"
                                align="center"
                                label="变更后客户名称"
                        ></el-table-column>
                        <el-table-column
                                prop="newCertNo"
                                align="center"
                                label="变更后身份证号"
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
                        <el-table-column
                                prop="businessType"
                                label="变更类型"
                                align="center"
                        >
                            <template scope="scope">
                                <!--<span>{{ scope.row.businessType | opsFormat(ops.approvalType) }}</span>-->
                            </template>
                        </el-table-column>
                        <el-table-column
                                align="center"
                                label="审核状态"
                        >
                            <template scope="scope">
                                <!--<span>{{ scope.row.status | opsFormat(ops.approvalStatus) }}</span>-->
                            </template>

                        </el-table-column>
                        <el-table-column
                                prop="accepterName"
                                align="center"
                                label="审批人"
                        >
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
                    certNo:'',
                },
                user:{
                    "custId":null,
                    "custName":null,
                    "certType":null,
                    "certNo":null,
                    "isLoan":null,
                    "isBlack":null,
                    "status":null,
                    "registerPhone":null,
                    "custType":null,
                    "mainMarketerId":null,
                    "mainMarketerName":null
                },
                originalUser:{
                    "custId":null,
                    "custName":null,
                    "certType":null,
                    "certNo":null,
                    "isLoan":null,
                    "isBlack":null,
                    "status":null,
                    "registerPhone":null,
                    "custType":null,
                    "mainMarketerId":null,
                    "mainMarketerName":null
                },
                history:{
                    list:[],
                    pageNum:1,
                    pageSize:15,
                },
                tabActive:'a',
                pageNum:1,
                pageSize:15,
                loading: false,
                staffLoading:false,
                funcId:'R070500',
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
            creditTabChangeHandler(){
                let that = this
                that.doReset()
            },
//          重置搜索
            doReset(){
                let search = this.search
                Util.dataReset(search)
            },
//          通过授信合同查询客户信息
            doGetUserInfoByCertNoHandler(form){
                let that = this
                that.$refs[form].validate((valid) => {
                    if (valid) {
                        that.getUserByCertNo()
                    } else {
                        return false;
                    }
                });

            },
            getUserByCertNo(){
                let that        = this
                let url         = Vue.agent.root + '/customer/person/getSingleCustByCertNo'
                let search      = that.search
                var reqData     = {
                    funcId:that.funcId,
                    certNo:search.certNo,
                }

                that.$http.get(url,{
                    params:reqData,
                }).then(res => {
                    if(res.body.code == "200") {
                        let data  = res.body.data
                        that.user = data
                        Object.assign(that.originalUser,data)

                    }
                });
            },

            doUserInfoChangeApplyHandler(form){
                let that = this
                that.$refs[form].validate((valid) => {
                    if (valid) {
                        that.userInfoChangeApply()
                    } else {
                        return false;
                    }
                });
            },
            userInfoChangeApply(){
                let that    = this
                let url     = Vue.agent.root + '/customer/chg/basic'
                let user    = that.user
                let reqData = {
                    custId:user.custId,
                    custName:user.custName,
                    custType:user.custType,
                    certNo:user.certNo
                }
                that.$http && that.$http.post(url,reqData).then(function (res) {
                    if(res.body.code == "200") {
                        that.$notify({title: '提示',message: '操作成功',type: 'success'});
                    }
                });

            },

            //            获取用户变更记录
            getUserChangeHistoryHandler(){
                let that = this
                that.getUserChangeHistory()
            },
            getUserChangeHistory(){
                let that        = this
                let history     = that.history
                let url         = Vue.agent.root + '/customer/chg/basic/history'
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

            doSearchHandler(){
                let that     = this
                if(that.pageNum == 1){
                    that.doSearch()
                }else{
                    that.pageNum = 1
                }
            },
            doSearch(){
                let that        = this
                let url         = Vue.agent.root + '/statistics/userBalance/search'
                var reqData     = {
                    pageSize:that.pageSize,
                    pageNum:that.pageNum,
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
            handleCurrentChange(val) {
                let that = this
                if(that.loading == true){
                    that.$notify({title: '提示',message: '请勿频繁操作',type: 'warning'});
                }else{
                    that.pageNum = val
                    that.doSearch()
                }
            }
        },
        created:function () {
            let that        = this
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