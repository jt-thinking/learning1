<template>
    <div class="market-trade">
        <div class="trade-box">
            <div  class="search-box">
                <el-form   :model="formInline" label-width="66px" >
                    <el-select @change="mixChange"  v-model="mix.value" placeholder="条件" size="small" class="middle">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                    <el-input v-show="mix.value == 1 " size="small"  v-model="search.name" :placeholder="'请输入姓名'"></el-input>
                    <el-input v-show="mix.value == 2 " size="small"  v-model="search.phone" :placeholder="'请输入手机'"></el-input>
                    <el-input v-show="mix.value == 3 " size="small"  v-model="search.certNo" :placeholder="'请输入身份证'"></el-input>
                    <!--v-if="checkRole()"-->
                    <el-form-item  label="社区经理">
                        <el-select class="manager" size="small" filterable
                                   :filter-method="filterMethod"
                                   :loading="staffLoading"
                                   @visible-change="expandHandler"
                                   v-model="search.accountManager" placeholder="请选择">
                            <el-option :label="'全部'" :value="null"></el-option>
                            <el-option-group
                                    v-for="group in staffList"
                                    :key="group.label"
                                    :label="group.label">
                                <el-option
                                        v-for="item in group.options"
                                        :key="item.name"
                                        :label="item.name"
                                        :value="item.value">
                                    <span style="float: left">{{ item.name }}</span>
                                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.no }}</span>
                                </el-option>
                            </el-option-group>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="交易时间">
                        <el-date-picker
                                editable="false"
                                class="date"
                                size="small"
                                v-model="search.tradeStartTimeT"
                                type="date"
                                placeholder="开始日期时间">
                        </el-date-picker>
                        <el-date-picker
                                editable="false"
                                class="date"
                                size="small"
                                v-model="search.tradeEndTimeT"
                                type="date"
                                placeholder="截至日期时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="交易类型">
                        <el-select size="small" class="middle" v-model="search.type" placeholder="交易类型">
                            <el-option :label="'全部'" :value="null"></el-option>
                            <el-option :label="'充值'" value="RECHARGE"></el-option>
                            <el-option :label="'投资'" value="SALE"></el-option>
                            <el-option :label="'提现'" value="WITHDRAW"></el-option>
                            <el-option :label="'放款'" value="LOAN"></el-option>
                            <el-option :label="'还款'" value="REPAYMENT"></el-option>
                            <el-option :label="'贴息'" value="INTEREST"></el-option>
                            <el-option :label="'线下充值'" value="OFRECHARGE"></el-option>
                            <el-option :label="'回款'" value="CASH"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label-width="40px" label="状态">
                        <el-select size="small" class="middle" v-model="search.status" placeholder="交易类型">
                            <el-option :label="'全部'" :value="null"></el-option>
                            <el-option  label="成功" value="1"></el-option>
                            <el-option  label="失败" value="2"></el-option>
                            <el-option  label="流标已回款" value="3"></el-option>
                            <el-option  label="创建" value="4"></el-option>
                            <el-option  label="关闭" value="5"></el-option>
                            <el-option  label="取消" value="6"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="营销类型">
                        <el-select size="small" class="middle" v-model="search.marketerType" placeholder="主副营销">
                            <el-option :label="'全部'" :value="0"></el-option>
                            <el-option :label="'主营销人'" :value="1"></el-option>
                            <el-option :label="'副营销人'" :value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <div class="item-box">
                        <el-button @click.native="doReset" size="small" type="primary">重置</el-button>
                        <el-button @click.native="doSearchHandler" size="small" type="primary">查询</el-button>
                    </div>
                </el-form>
            </div>
            <!--<div class="result-box">-->
                <!--<div class="pull-right">-->
                    <!--<a @click.prevent="doExport" href="javascript:(0)">-->
                        <!--<span>导出全部</span>-->
                        <!--<i class="fa fa-download" aria-hidden="true"></i>-->
                    <!--</a>-->
                <!--</div>-->
            <!--</div>-->
        </div>

        <div class="table">
            <el-table
                    v-loading="loading"
                    :data="list"
                    :stripe="true"
                    border
                    style="width: 100%">

                <el-table-column
                        fixed="left"
                        align="center"
                        label="客户名称"
                        width="140"
                        >
                    <template scope="scope">
                        <span>{{ scope.row.name | nameFormat }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="客户编号"
                        min-width="150"
                >
                    <template scope="scope">
                        <span>{{ scope.row.userId }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="phone"
                        align="center"
                        label="手机"
                        width="120"
                        >
                </el-table-column>
                <el-table-column
                        label="交易金额"
                        align="center"
                        width="180"
                >
                    <template scope="scope">
                        <span>{{ scope.row.amount | moneyFormat }}</span>
                    </template>
                </el-table-column>

                <el-table-column
                        label="应付金额"
                        align="center"
                        width="180"
                >
                    <template scope="scope">
                        <span>{{ scope.row.amountPayable | moneyFormat }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="账户余额"
                        align="center"
                        width="180"
                >
                    <template scope="scope">
                        <span>{{ scope.row.balance | moneyFormat }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="交易类型"
                        align="center"
                        width="120"
                >
                    <template scope="scope">
                        <span>{{ scope.row.type | tradeTypeFormat }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="交易日期"
                        align="center"
                        width="160"
                >
                    <template scope="scope">
                        <span>{{ scope.row.updateTime | dateTimeFormat }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="状态"
                        align="center"
                        width="100"
                >
                    <template scope="scope">
                        <span>{{ scope.row.status}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="主营销人"
                        min-width="120"
                >
                    <template scope="scope">
                        <span>
                            {{scope.row.mainMarketerName | nameFormat}}
                            <!--（{{ scope.row.mainMarketerId }}）-->
                        </span>
                    </template>
                </el-table-column>

                <el-table-column
                        align="center"
                        label="副营销人"
                        min-width="120"
                >
                    <template scope="scope">
                        <span>{{scope.row.deputyMarketerName | nameFormat}}</span>
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
    import Staff                from    '../../../data/loan/staff'
    import Util                 from    '../../../js/util'
    import auth                 from    '../../../js/auth'
//    let wrpEle;
    let ops =[
//        {
//            value: '0',
//            label: '合同号'
//        },
        {
            value: '1',
            label: '姓名'
        },
        {
            value: '2',
            label: '手机号'
        },
//        {
//            value: '3',
//            label: '身份证'
//        }
    ]
    let currentTime  = new Date().getTime()
    let currentMonth =  (new Date(moment().startOf('month'))).getTime()
    let list = []
    export default {
        data() {
            return {
                list: list,
                options: ops,
                value: '',
                mix:{
                    //混合选项 合同 身份证 手机号
                    value:'1',
                },
                totals:{

                },
                statistics:{

                },
                search:{
                    //用户姓名
                    name:'',
                    //手机号
                    phone:'',
//                    身份证
                    certNo:'',
                    //授信总额
                    creditAmtMin:'',
                    creditAmtMinT:'',
                    creditAmtMax:'',
                    creditAmtMaxT:'',
                    type:null,
                    //交易时间
                    tradeStartTime:currentMonth,
                    tradeStartTimeT:currentMonth,
                    tradeEndTime:currentTime,
                    tradeEndTimeT:currentTime,
                    accountManager:null,
                    marketerType:0,
//                    状态
                    status:null
                },
                staffList: Staff.list,
                staffLoading:false,
                funcId:'R050200',
                total:0,
                pageNum:1,
                loading:false
            }
        },
        watch: {
            "search.tradeStartTimeT": function (val) {
                this.search.tradeStartTime = val ? new Date(val).getTime() : null
            },
            "search.tradeEndTimeT": function (val) {
                this.search.tradeEndTime = val ? (new Date(val).getTime()+86400000-1) : null
            }
        },
        methods: {
            mixChange(val){
                this.search.name    = ''
                this.search.phone  = ''
                this.search.certNo  = ''
            },
            moneyChange(val){
                const search = this.search
                if(search.creditAmtMinT)
                    search.creditAmtMinT = accounting.format(search.creditAmtMinT,2,',')

                if(search.creditAmtMaxT)
                    search.creditAmtMaxT = accounting.format(search.creditAmtMaxT,2,',')

            },
            expandHandler(val){
                if(val == true){
                    this.staffList = Staff.list
                }
            },
            filterMethod(query){
                if (!!query) {
                    this.staffLoading = true
                    if(!!query.match(/[\u4e00-\u9fa5]/)){
                        this.staffLoading = false
                        this.staffList = Staff.findByName(Staff.list,query)
                    }else if(!!query.match(/^[1]\d*/)){
                        console.log("手机")
                        this.staffLoading = false
                        this.manageList = Staff.findByPhone(Staff.list,query)
                    }else if(!!query.match(/^\d/)){
                        this.staffLoading = false
                        this.staffList = Staff.findByNo(Staff.list,query)
                    }else if(!!query.match(/[a-zA-Z]/)){
                        console.log('字母')
                        this.staffLoading = false
                        this.staffList = Staff.findByInitial(Staff.list,query.toUpperCase())
                    }else{
                        this.staffLoading = false;

                    }
                } else {
                    this.staffLoading = true;
                    this.staffList = []
                    setTimeout(()=>{
                        this.staffLoading = false;
                        this.staffList = Array.from(Staff.list)
                    })

                }
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
                let url         = Vue.agent.root + '/transactionRecord/search'
                var reqData     = {
                    pageSize:15,
                    pageNum:that.pageNum,
                    funcId:that.funcId
                }
                that.loading = true
                Object.assign(reqData,that.search)
                Util.dataClear(reqData)

                that.$http.get(url,{
                    params:reqData,

                }).then(res =>{
                    that.loading = false
                    if(res.body.code == "200") {
                        let data     = res.body.data
                        Object.assign(that,data)
                    }
                },res =>{
                    that.loading = false
                });
            },
            doExport(){
                let that        = this
                let url         = Vue.agent.root + '/customer/excel'

                let fileName    = "交易记录" + moment().format("YYYY-MM-DD hh:mm:ss")
                var reqData     = {
                    funcId:that.funcId
                }
                Object.assign(reqData,that.search)
                Util.dataClear(reqData)

                this.$http.post(url, reqData,{responseType: 'arraybuffer'})
                    .then(response=>{
                        Util.getFile(response,fileName)
                    })
                    .catch((err) => {
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
            let newsId      = this.$route.query.newsId
            let url         = Vue.agent.root + '/manageUser/options'

            var reqData     = {
                funcId:that.funcId
            }

            that.$http && that.$http.get(url,{
                params:reqData,
                timeout:30000
            }).then(res => {
                if(res.body.code == "200") {
                    Staff.list      = res.body.data
                    that.manageList = Staff.list
                }
            });
        },
        mounted:function () {
//            wrpEle = document.querySelector('.table .el-table__body-wrapper')
        },
        components:{
        }
    }
</script>
<style lang="scss">
    @import 'src/scss/pages/market/trade.scss';
</style>