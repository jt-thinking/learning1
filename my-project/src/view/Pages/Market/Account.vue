<template>
    <div class="stat-loan">
        <div class="stat-box">
            <div class="search-box">
                <el-form   :model="formInline" label-width="66px" >
                    <!--<el-select @change="mixChange"  v-model="mix.value" placeholder="条件" size="small" class="middle">-->
                        <!--<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>-->
                    <!--</el-select>-->
                    <!--<el-input v-show="mix.value == 0 " size="small"  v-model="search.contractNumber" :placeholder="'请输入合同号'"></el-input>-->

                    <!--<el-input v-show="mix.value == 3 " size="small"  v-model="search.certNumber" :placeholder="'请输入身份证'"></el-input>-->
                    <el-form-item label="客户名称">
                        <el-input  size="small"  v-model="search.custName" placeholder="请输入姓名"></el-input>
                    </el-form-item>
                    <el-form-item label="注册手机">
                        <el-input  size="small"  v-model="search.phone" placeholder="请输入手机"></el-input>
                    </el-form-item>
                    <el-form-item label-width="80px" label="截至日期" prop="deadlineTimeT" :rules="[
                            {required: true, message: '请选择截至时间'}
                        ]">
                        <el-date-picker
                                class="date"
                                size="small"
                                v-model="search.deadlineTimeT"
                                type="date"
                                placeholder="开始日期时间">
                        </el-date-picker>
                        <!--<el-date-picker-->
                                <!--class="date"-->
                                <!--size="small"-->
                                <!--v-model="search.updateEndTimeT"-->
                                <!--type="date"-->
                                <!--placeholder="截至日期时间">-->
                        <!--</el-date-picker>-->
                    </el-form-item>
                    <el-form-item label="投资余额">
                        <el-input @blur="moneyChange" size="small" class="money" v-model.lazy="search.minFundBalanceT" placeholder="金额"></el-input>
                        <span>-</span>
                        <el-input @blur="moneyChange" size="small" class="money" v-model.lazy="search.maxFundBalanceT" placeholder="金额"></el-input>
                    </el-form-item>
                    <el-form-item label="贷款余额">
                        <el-input @blur="moneyChange" size="small" class="money" v-model.lazy="search.minLoanBalanceT" placeholder="金额"></el-input>
                        <span>-</span>
                        <el-input @blur="moneyChange" size="small" class="money" v-model.lazy="search.maxLoanBalanceT" placeholder="金额"></el-input>
                    </el-form-item>

                    <el-form-item label-width="30px" >
                        <el-button @click.native="doReset" size="small" type="primary">重置</el-button>
                        <el-button @click.native="doSearchHandler" size="small" type="primary">查询</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>

        <div  class="table">
            <el-form>
                <el-form-item label-width="0" >
                    <el-button @click.native="doSelectionPrint" size="small">打印账单</el-button>
                    <el-button ref="printAll" @click="doAllPrint" size="small">打印全部</el-button>
                </el-form-item>
            </el-form>
            <el-table
                    v-loading="loading"
                    :data="list"
                    :stripe="true"
                    border
                    @selection-change="handleSelectionChange"
                    style="width: 100%"
            >
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column
                        prop="custName"
                        align="center"
                        label="用户名称"
                ></el-table-column>
                <el-table-column
                        prop="registerPhone"
                        align="center"
                        label="注册手机号"
                        >
                </el-table-column>
                <el-table-column
                        align="center"
                        label="借款总额"
                        >
                    <template scope="scope">
                        <span>{{ scope.row.loanBalance | moneyFormat }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="投资总额"
                >
                    <template scope="scope">
                        <span>{{ scope.row.fundBalance | moneyFormat }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="操作"
                >
                    <template scope="scope">
                        <el-button @click.native="doSinglePrint(scope)" size="small">查看对账单</el-button>
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

    </div>

</template>

<script>
    import leverBar         from    '../../Com/LeverBar.vue'
    import Util             from    'src/js/util'
    import auth             from    'src/js/auth'
    import cache             from    'src/js/cache'


    export default {
        data() {
            return {
                list: [],
                value: '',
                value: '',
                mix:{
                    //混合选项 合同 身份证 手机号
                    value:'1',
                },
                totals:{
                    prePrincipalAmtTotal:0
                },
                url:"#/print-account",
                search:{
                    custName:'',
                    phone:'',
                    certNumber:'',
                    contractNumber:'',
                    accountManager:null,
                    deadlineTimeT:new Date().getTime(),
                    deadlineTime:new Date().getTime(),
                    //授信总额
                    minFundBalance:'',
                    minFundBalanceT:'',
                    maxFundBalance:'',
                    maxFundBalanceT:'',
                    //授信余额
                    minLoanBalance:'',
                    maxLoanBalance:'',
                    minLoanBalanceT:'',
                    maxLoanBalanceT:'',
                },
                multipleSelection:[],
                pageNum:1,
                pageSize:15,
                loading: false,
                staffLoading:false,
                funcId:'R050900',
            }
        },
        watch: {
            "search.deadlineTimeT": function (val) {
                this.search.deadlineTime = val ? new Date(val).getTime() : null
            },
            "search.minFundBalanceT": function (val) {
                this.search.minFundBalance = val ? accounting.format(val, 0, '') : null
            },
            "search.maxFundBalanceT": function (val) {
                this.search.maxFundBalance = val ? accounting.format(val, 0, '') : null
            },
            "search.minLoanBalanceT": function (val) {
                this.search.minLoanBalance = val ? accounting.format(val, 0, '') : null
            },
            "search.maxLoanBalanceT": function (val) {
                this.search.maxLoanBalance = val ? accounting.format(val, 0, '') : null
            },
        },
        methods: {
            doSelectionPrint(){
                let that = this
                let arr  =  []
                that.multipleSelection.forEach(v=>{
                    arr.push(v.custId)
                })
                that.getPrintData(arr.join(','),function () {
                    let span    = document.createElement("span")
                    let a       = document.createElement("a")
                    a.href      = "#/print-account?r="+ Math.random()
                    a.target    = "_blank"
                    a.append(span)
                    a.click();
                })

            },
            doSinglePrint(scope){
                let that   = this
                let custId = scope.row.custId
                that.getPrintData(custId,function () {
                    let span    = document.createElement("span")
                    let a       = document.createElement("a")
                    a.href      = "#/print-account?r="+ Math.random()
                    a.target    = "_blank"
                    a.append(span)
                    a.click();
                })

            },
            doAllPrint(){
                let that = this
                that.getAllPrintData(function () {
                    let span    = document.createElement("span")
                    let a       = document.createElement("a")
                    a.href      = "#/print-account?r="+ Math.random()
                    a.target    = "_blank"
                    a.append(span)
                    a.click();
                })
            },
            getPrintData(custIds,callback){
                let that        = this
                let url         = Vue.agent.root + '/statistics/accountList/print'
                var reqData     = {
                    funcId:that.funcId,
                    deadlineTime:that.search.deadlineTime,
                    custId:custIds
                }
                Util.dataClear(reqData)

                that.$http.get(url,{
                    params:reqData,
                }).then(res => {
                    if(res.body.code == "200") {
                        let list            = res.body.data.list
                        cache.set('print', list, {exp : 10000});
                        !!callback && callback()
                    }
                });
            },

            getAllPrintData(callback){
                let that        = this
                let url         = Vue.agent.root + '/statistics/accountList/printAllWithFilter'
                var reqData     = {
                    funcId:that.funcId,
                    deadlineTime:that.search.deadlineTime,
                }
                Object.assign(reqData,that.search)
                Util.dataClear(reqData)

                that.$http.get(url,{
                    params:reqData,
                }).then(res => {
                    if(res.body.code == "200") {
                        let list            = res.body.data.list
                        cache.set('print', list, {exp : 10000});
                        !!callback && callback()
                    }
                });
            },

            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            moneyChange(val){
                const search = this.search
                if(search.minFundBalanceT)
                    search.minFundBalanceT = accounting.format(search.minFundBalanceT,2,',')

                if(search.maxFundBalanceT)
                    search.maxFundBalanceT = accounting.format(search.maxFundBalanceT,2,',')

                if(search.minLoanBalanceT)
                    search.minLoanBalanceT = accounting.format(search.minLoanBalance,2,',')

                if(search.maxLoanBalanceT)
                    search.maxLoanBalanceT = accounting.format(search.maxLoanBalanceT,2,',')
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
                let url         = Vue.agent.root + '/statistics/accountList/list'
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

        },
        mounted:function () {

        },
        components:{
        }
    }
</script>
<style lang="scss">
    @import 'src/scss/pages/stat/remained.scss';
</style>