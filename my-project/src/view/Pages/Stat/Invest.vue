<template>
    <div class="stat-loan">
        <div class="stat-box">
            <div class="search-box">
                <el-form   :model="formInline" label-width="66px" >
                    <el-select @change="mixChange"  v-model="mix.value" placeholder="条件" size="small" class="middle">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                    <el-input v-show="mix.value == 1 " size="small"  v-model="search.name" :placeholder="'请输入姓名'"></el-input>
                    <el-input v-show="mix.value == 2 " size="small"  v-model="search.phone" :placeholder="'请输入手机'"></el-input>
                    <el-input v-show="mix.value == 3 " size="small"  v-model="search.certNumber" :placeholder="'请输入身份证'"></el-input>

                    <el-form-item label="合同号">
                        <el-input size="small"  v-model="search.contractNumber" :placeholder="'请输入合同号'"></el-input>
                    </el-form-item>


                    <el-form-item label="投资金额">
                        <el-input @blur="moneyChange" size="small" class="money" v-model="search.minInvestmentAmountT" placeholder="金额"></el-input>
                        <span>-</span>
                        <el-input @blur="moneyChange" size="small" class="money" v-model="search.maxInvestmentAmountT" placeholder="金额"></el-input>
                    </el-form-item>
                    <el-form-item label="投资利率">
                        <el-input @change="rateChangeHandler" min="0" max="100" type="number" size="small" class="money" v-model="search.investmentRate" placeholder="百分比(%)"></el-input>
                    </el-form-item>
                    <el-form-item label="投资期限">
                        <el-input size="small" min="0" type="number" class="money" v-model="search.minInvestmentDays" placeholder="天数"></el-input>
                        <span>-</span>
                        <el-input size="small" min="0" type="number" class="money" v-model="search.maxInvestmentDays" placeholder="天数"></el-input>
                    </el-form-item>
                    <el-form-item label="回款方式">
                        <el-select size="small" class="middle" v-model="search.paymentMethod" placeholder="请选择条件">
                            <el-option :label="'全部'" :value="null"></el-option>
                            <el-option :label="'利随本清'" value="1"></el-option>
                            <el-option :label="'按月结息'" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label-width="40px" label="状态">
                        <el-select size="small" class="middle" v-model="search.status" placeholder="选择条件">
                            <el-option :label="'全部'" :value="null"></el-option>
                            <el-option :label="'初始'" value="1"></el-option>
                            <el-option :label="'成功'" value="2"></el-option>
                            <el-option :label="'撤销'" value="3"></el-option>
                            <el-option :label="'失败'" value="4"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="客户经理">
                        <el-select class="lang" size="small" filterable
                                   :filter-method="filterMethod"
                                   :loading="staffLoading"
                                   @visible-change="expandHandler"
                                   v-model="search.accountManager"
                                   placeholder="请选择">
                            <el-option :label="'全部'" :value="''"></el-option>
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
                    <el-form-item label-width="100px" label="计息开始时间">
                        <el-date-picker
                                editable="false"
                                class="time"
                                size="small"
                                v-model="search.interestStartTimeT"
                                type="date"
                                placeholder="开始日期时间">
                        </el-date-picker>
                        <el-date-picker
                                editable="false"
                                class="time"
                                size="small"
                                v-model="search.interestEndTimeT"
                                type="date"
                                placeholder="截至日期时间">
                        </el-date-picker>
                    </el-form-item>

                    <el-form-item label-width="100px" label="合同到期时间">
                        <el-date-picker
                                editable="false"
                                class="time"
                                size="small"
                                v-model="search.expireStartTimeT"
                                type="date"
                                placeholder="选择日期时间">
                        </el-date-picker>
                        <el-date-picker
                                editable="false"
                                class="time"
                                size="small"
                                v-model="search.expireEndTimeT"
                                type="date"
                                placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label-width="80px" label="截至时间">
                        <el-date-picker
                                editable="false"
                                class="time"
                                size="small"
                                v-model="search.deadlineTimeT"
                                type="date"
                                placeholder="截至时间">
                        </el-date-picker>
                    </el-form-item>
                    <!--<el-form-item label="首笔投资">-->
                        <!--<el-select size="small" class="middle" v-model="search.first" placeholder="是否">-->
                            <!--<el-option :label="'全部'" :value="0"></el-option>-->
                            <!--<el-option :label="'是'" :value="1"></el-option>-->
                            <!--<el-option :label="'否'" :value="2"></el-option>-->
                        <!--</el-select>-->
                    <!--</el-form-item>-->
                    <el-form-item label-width="30px">
                        <el-button @click.native="doReset" size="small" type="primary">重置</el-button>
                        <el-button @click.native="doSearchHandler" size="small" type="primary">查询</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="result-box">
                <div class="totals pull-left">
                    <label>投资总金额:</label>
                    <span>{{statistics.amountTotal | moneyFormat }}</span>
                    <label>投资总笔数:</label>
                    <span>{{statistics.recordCount}}</span>
                    <label>投资总余额:</label>
                    <span>{{statistics.balanceTotal | moneyFormat }}</span>

                </div>

                <!--<span>流失借款金额:</span>-->

                <div class="pull-right">
                    <!--<a href="#">-->
                        <!--<span>导出</span>-->
                        <!--<i class="fa fa-download" aria-hidden="true"></i>-->
                    <!--</a>-->
                    <a @click.prevent="doExport" href="javascript:(0)">
                        <span>导出全部</span>
                        <i class="fa fa-download" aria-hidden="true"></i>
                    </a>
                </div>
            </div>
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
                        prop="name"
                        align="center"
                        label="投资人"
                        width="80"
                >
                </el-table-column>
                <el-table-column
                        prop="contractNumber"
                        align="center"
                        label="合同号"
                        width="160"
                >
                </el-table-column>
                <el-table-column
                        prop="phone"
                        label="手机号"
                        align="center"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="certNumber"
                        label="身份证号"
                        align="center"
                        width="180"
                >
                </el-table-column>
                <el-table-column
                        align="center"
                        label="投资金额"
                        width="100"
                >
                    <template scope="scope">
                        <span>{{ scope.row.investmentAmount | moneyFormat }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="投资余额"
                        width="100"
                >
                    <template scope="scope">
                        <span>{{ scope.row.investAmount | moneyFormat }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="investmentTerm"
                        align="center"
                        label="投资期限"
                        width="120"
                >
                </el-table-column>
                <el-table-column
                        prop="investmentRate"
                        align="center"
                        label="投资利率"
                        width="100"
                >
                </el-table-column>
                <el-table-column
                        align="center"
                        label="回款方式"
                        width="100"
                >
                    <template scope="scope">
                        <span>{{ scope.row.repaymentMode | repayType }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="计息开始时间"
                        width="120"
                >
                    <template scope="scope">
                        <span>{{ scope.row.interestTime | dateFormat }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="合同到期时间"
                        width="120"
                >
                    <template scope="scope">
                        <span>{{ scope.row.expireTime | dateFormat }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="还本时间"
                        width="120"
                >
                    <template scope="scope">
                        <span>{{ scope.row.lastRepayDate | dateFormat }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="状态"
                        width="80"
                >
                    <template scope="scope">
                        <span>{{ scope.row.status | investStatus}}</span>
                    </template>
                </el-table-column>
                <!--<el-table-column-->
                        <!--prop="zip"-->
                        <!--align="center"-->
                        <!--label="首笔投资(是/否)"-->
                        <!--width="160"-->
                <!--&gt;-->
                <!--</el-table-column>-->
                <el-table-column
                        align="center"
                        label="客户经理"
                        width="120"
                >
                    <template scope="scope">
                        <span>{{ scope.row.manager}} - {{scope.row.jobNumber}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="主营销人"
                        width="120"
                >
                    <template scope="scope">
                        <span>{{scope.row.mainMarketerName}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="副营销人"
                        width="120"
                >
                    <template scope="scope">
                        <span>{{scope.row.deputyMarketerName}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="合同下载"
                        width="100"
                >
                    <template scope="scope">
                        <a target="_blank" :href="scope.row.fundContract">下载</a>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="footer-box">
            <span v-if="startRow" class="pull-left">显示{{startRow}}-{{endRow}} 总共有{{total}}条目</span>
            <div class="pagination pull-right">
                <span v-if="startRow" class="pull-left">显示{{startRow}}-{{endRow}} 总共有{{total}}条目</span>
                <el-pagination
                        layout="prev, pager, next"
                        @current-change="handleCurrentChange"
                        :current-page.sync="pageNum"
                        :page-size="pageSize"
                        :total="total">
                </el-pagination>
            </div>
        </div>

    </div>

</template>

<script>
    import leverBar         from    '../../Com/LeverBar.vue'
    import Staff            from    '../../../data/loan/staff'
    import Util             from    'src/js/util'

    let ops =[
        {
            value: '1',
            label: '姓名'
        },
        {
            value: '2',
            label: '手机号'
        },
        {
            value: '3',
            label: '身份证'
        }]
    let currentTime  = new Date().getTime()
    let currentMonth =  (new Date(moment().startOf('month'))).getTime()
    export default {
        data() {
            return {
                list: [],
                statistics:{},
                options: ops,
                value: '',
                mix:{
                    //混合选项 合同 身份证 手机号
                    value:'1',
                },
                statistics:{

                },
                search:{
                    name:'',
                    phone:'',
                    certNumber:'',
                    contractNumber:'',
                    interestStartTime:currentMonth,
                    interestStartTimeT:currentMonth,
                    interestEndTime:currentTime,
                    interestEndTimeT:currentTime,
                    investmentRate:null,
                    paymentMethod:null,
                    expireStartTime:null,
                    expireStartTimeT:null,
                    expireEndTime:null,
                    expireEndTimeT:null,
                    deadlineTimeT:null,
                    deadlineTime:null,
                    jobNum:null,
                    //投资金额
                    minInvestmentAmountT:null,
                    minInvestmentAmount:null,
                    maxInvestmentAmountT:null,
                    maxInvestmentAmount:null,
//                    状态
                    status:'2',
//                    工号查询
                    accountManager:null
                },
                pageNum:1,
                staffList: Staff.list,
                staffLoading:false,
                funcId:'R020600',
                loading:false
            }
        },
        watch: {
            "search.interestStartTimeT": function (val) {
                this.search.interestStartTime = val ? new Date(val).getTime() : null
            },
            "search.interestEndTimeT": function (val) {
                this.search.interestEndTime = val ? (new Date(val).getTime()+86400000-1) : null
            },
            "search.expireStartTimeT": function (val) {
                this.search.expireStartTime = val ? new Date(val).getTime() : null
            },
            "search.expireEndTimeT": function (val) {
                this.search.expireEndTime = val ? (new Date(val).getTime()+86400000-1) : null
            },
            "search.minInvestmentAmountT": function (val) {
                this.search.minInvestmentAmount = val ? accounting.format(val, 0, '') : null
            },
            "search.maxInvestmentAmountT": function (val) {
                this.search.maxInvestmentAmount = val ? accounting.format(val, 0, '') : null
            },
            "search.deadlineTimeT": function (val) {
                this.search.deadlineTime = val ? (new Date(val).getTime()+86400000-1) : null
            },


        },
        methods: {
            mixChange(val){
                let search = this.search
                search.name                 = ''
                search.phone                = ''
                search.certNumber           = ''
            },
            rateChangeHandler(val){
                if(val == 0)
                    this.search.investmentRate = null
//                console.log(val)
            },
            expandHandler(val){
                if(val == true){
                    this.staffList = Staff.list
                }
            },
            moneyChange(val){

                const search = this.search

                if(search.minInvestmentAmountT)
                    search.minInvestmentAmountT = accounting.format(search.minInvestmentAmountT,2,',')

                if(search.maxInvestmentAmountT)
                    search.maxInvestmentAmountT = accounting.format(search.maxInvestmentAmountT,2,',')
//
//                if(search.remainedAmtMaxT)
//                    search.remainedAmtMaxT = accounting.format(search.remainedAmtMaxT,2,',')
            },
            filterMethod(query){
                if (!!query) {
                    this.staffLoading = true
                    if(!!query.match(/[\u4e00-\u9fa5]/)){
                        this.staffLoading = false
                        this.staffList = Staff.findByName(Staff.list,query)
//                        console.log('test:',Staff.list)
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
                        console.log('空白',Staff.list)
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
                let url         = Vue.agent.root + '/statistics/fund/selectFundInfo'
                var reqData     = {
                    pageSize:15,
                    pageNum:that.pageNum,
                    funcId:that.funcId
                }
                that.loading = true
                Object.assign(reqData,that.search)
                Util.dataClear(reqData)

                that.$http.post(url,reqData,{
                    timeout:30000
                }).then(res=>{
                    that.loading = false
                    if(res.body.code == "200") {
                        let data            = res.body.data
                        Object.assign(that,data)
                    }
                },res=>{
                    that.loading = false
                });
            },
            doExport(){
                let that        = this
                let url         = Vue.agent.root +'/statistics/fund/excel'

                let fileName    = "投资记录" + moment().format("YYYY-MM-DD hh:mm:ss")
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
            let url         = Vue.agent.root + '/manageUser/options'

            var reqData     = {
                funcId:that.funcId
            }

            that.$http && that.$http.get(url,{params:reqData}).then(function (res) {
                if(res.body.code == "200") {
                    Staff.list      = res.body.data

//                    console.log(Staff.list)
                    that.manageList = Staff.list

                }
            });
        },
        mounted:function () {
//            wrpEle = document.querySelector('.table .el-table__body-wrapper')
        },
        components:{
            leverBar
        }
    }
</script>
<style lang="scss">
    @import 'src/scss/pages/stat/invest.scss';
</style>