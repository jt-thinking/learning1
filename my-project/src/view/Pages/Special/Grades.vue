<template>
    <div class="stat-loan">
        <el-tabs v-model="tabActive" type="card" @tab-click="creditTabChangeHandler">
            <el-tab-pane label="变更" name="a">
                <div class="stat-box">
                    <div class="search-box">
                        <el-form   :model="formInline" >
                            <el-form-item  label="授信合同号:" label-width="100px" >
                                <el-input  size="small"  v-model="search.creditNo" :placeholder="'请输入合同号'"></el-input>
                            </el-form-item>
                            <el-form-item label-width="30px" >
                                <el-button @click.native="doSearchHandler" size="small" type="primary">查询</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
                <div  class="table">
                <el-table
                v-loading="loading"
                :data="list"
                :stripe="true"
                border
                style="width: 100%">
                    <el-table-column
                    prop="userId"
                    align="center"
                    label="客户编号"
                    ></el-table-column>
                    <el-table-column
                    prop="name"
                    align="center"
                    label="客户名称"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="phone"
                    label="客户类型"
                    align="center"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="certNumber"
                    align="center"
                    label="担保金额"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="balance"
                    align="center"
                    label="担保期限"
                    >
                    </el-table-column>
                    <el-table-column
                    align="center"
                    label="操作"
                    >
                    <template scope="scope">
                        <span>{{ scope.row.updateTime | dateTimeFormat }}</span>
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
            <el-tab-pane label="变更记录" name="b">

            </el-tab-pane>
        </el-tabs>


        <!--新建担保 -->
        <!--<el-dialog title="新建担保信息" class="org-dialog" :visible.sync="visible.addGuarantee" size="tiny" >-->
            <!--<el-form :model="credit.guarantee.item"  ref="guarantee" label-width="100px">-->
                <!--<el-form-item label="担保类型" prop="guaranteeType" :rules="[-->
                            <!--{required: true, message: '请选择担保类型'},-->
                            <!--]">-->
                    <!--<el-radio  v-model.number="credit.guarantee.item.guaranteeType" :label="1">最高额担保</el-radio>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="证件号">-->
                    <!--<el-select-->
                            <!--v-model="credit.guarantee.item.guaranteerId"-->
                            <!--filterable-->
                            <!--remote-->
                            <!--@change="selectedCustomHandler"-->
                            <!--placeholder="请输入证件号"-->
                            <!--:no-data-text="身份证号输入有误或该客户不存在"-->
                            <!--:remote-method="getCustomByCertNo"-->
                            <!--:loading="customer.loading">-->
                        <!--<el-option-->
                                <!--v-for="item in customer.options"-->
                                <!--:key="item.custId"-->
                                <!--:label="item.certNo"-->
                                <!--:value="item.custId">-->
                            <!--<span style="float: left">{{ item.certNo }}</span>-->
                            <!--<span style="float: right; color: #8492a6; font-size: 13px">{{ item.custName }}</span>-->
                        <!--</el-option>-->
                    <!--</el-select>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="担保人名称"  >-->
                    <!--<el-input  :readonly="true"  v-model="credit.guarantee.item.custName"  placeholder="请输入担保人名称"></el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="担保金额"  prop="guaranteeAmt" :rules="[-->
                            <!--{required: true, message: '请输入担保金额'},-->
                            <!--{ type:'number', message: '必须为数字'}-->
                            <!--]">-->
                    <!--<el-input @change="certNumberChangeHandler"  v-model.number="credit.guarantee.item.guaranteeAmt"  placeholder="请输入担保金额"></el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="起效日期"  prop="startDateTime" :rules="[-->
                            <!--{required: true, message: '选择时间'},-->
                            <!--]">-->

                    <!--<el-date-picker-->
                            <!--:readonly="true"-->
                            <!--class="date"-->
                            <!--style="width:100%"-->
                            <!--v-model="credit.guarantee.item.startDateTime"-->
                            <!--type="date"-->
                            <!--placeholder="放款日期">-->
                    <!--</el-date-picker>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="到期日期"  prop="expirationDateTime" :rules="[-->
                                <!--{required: true, message: '选择时间'},-->
                            <!--]">-->
                    <!--<el-date-picker-->
                            <!--style="width:100%"-->
                            <!--class="date"-->
                            <!--v-model="credit.guarantee.item.expirationDateTime"-->
                            <!--type="date"-->
                            <!--placeholder="放款日期">-->
                    <!--</el-date-picker>-->
                <!--</el-form-item>-->

                <!--<el-alert v-show="brief.visible == true" :title="brief.msg" type="info" show-icon></el-alert>-->
            <!--</el-form>-->
            <!--<div slot="footer" class="dialog-footer">-->
                <!--<el-button class="pull-left" @click.native="visible.addGuarantee = false">取 消</el-button>-->
                <!--<el-button type="primary" @click.native="doSaveGuaranteeHandler('guarantee')">确 认</el-button>-->
            <!--</div>-->
        <!--</el-dialog>-->



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
                        <!--label="用户编号"-->
                <!--&gt;</el-table-column>-->
                <!--<el-table-column-->
                        <!--prop="name"-->
                        <!--align="center"-->
                        <!--label="姓名"-->
                        <!--&gt;-->
                <!--</el-table-column>-->
                <!--<el-table-column-->
                        <!--prop="phone"-->
                        <!--label="手机号"-->
                        <!--align="center"-->
                        <!--&gt;-->
                <!--</el-table-column>-->
                <!--<el-table-column-->
                        <!--prop="certNumber"-->
                        <!--align="center"-->
                        <!--label="身份证号码"-->
                        <!--&gt;-->
                <!--</el-table-column>-->
                <!--<el-table-column-->
                        <!--prop="balance"-->
                        <!--align="center"-->
                        <!--label="账号余额"-->
                <!--&gt;-->
                <!--</el-table-column>-->
                <!--<el-table-column-->
                        <!--align="center"-->
                        <!--label="更新时间"-->
                <!--&gt;-->
                    <!--<template scope="scope">-->
                        <!--<span>{{ scope.row.updateTime | dateTimeFormat }}</span>-->
                    <!--</template>-->
                <!--</el-table-column>-->
                <!--<el-table-column-->
                        <!--prop="mainMarketerName"-->
                        <!--align="center"-->
                        <!--label="主营销人"-->
                <!--&gt;-->
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
            doExport(){
                let that        = this
                let url         = Vue.agent.root + '/statistics/userBalance/excel'
                let fileName    = "余额查询" + moment().format("YYYY-MM-DD hh:mm:ss")
                var reqData     = {
                    funcId:that.funcId
                }

                Object.assign(reqData,that.search)
                Util.dataClear(reqData)

                this.$http.post(url, reqData,{responseType: 'arraybuffer'})
                    .then(response=>{
                    Util.getFile(response,fileName)
                }).catch((err) => {
                    console.log(err)
                })

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