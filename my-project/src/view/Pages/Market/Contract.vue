<template>
    <div class="market-contract">
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
                    <el-form-item label="借款金额">
                        <el-input @blur="moneyChange" size="small" class="money" v-model="search.minLoanAmountT" placeholder="金额"></el-input>
                        <span>-</span>
                        <el-input @blur="moneyChange" size="small" class="money" v-model="search.maxLoanAmountT" placeholder="金额"></el-input>
                    </el-form-item>

                    <el-form-item label="借款余额">
                        <el-input @blur="moneyChange" size="small" class="money" v-model="search.minBalanceT" placeholder="金额"></el-input>
                        <span>-</span>
                        <el-input @blur="moneyChange" size="small" class="money" v-model="search.maxBalanceT" placeholder="金额"></el-input>
                    </el-form-item>

                    <el-form-item label="借款期限">
                        <el-input size="small" min="0" type="number" class="money" v-model="search.minLoanTermDays" placeholder="天数"></el-input>
                        <span>-</span>
                        <el-input size="small" min="0" type="number" class="money" v-model="search.maxLoanTermDays" placeholder="天数"></el-input>
                    </el-form-item>
                    <el-form-item label="借款利率">
                        <el-select size="small" class="middle" v-model="search.loanRate" placeholder="借款利率">
                            <el-option :label="'全部'" :value="null"></el-option>
                            <el-option :label="'7.2%年化'" :value="7.2"></el-option>
                            <el-option :label="'7.5%年化'" :value="7.5"></el-option>
                            <el-option :label="'8%年化'" :value="8"></el-option>
                        </el-select>
                        <!--<el-input min="0" max="100" type="number" size="small" class="money" v-model="search.loanRate" placeholder="百分比(%)"></el-input>-->
                    </el-form-item>
                    <!--<el-form-item label="还款方式">-->
                        <!--<el-select size="small" class="middle" v-model="search.repayType" placeholder="选择条件">-->
                            <!--<el-option :label="'全部'" :value="null"></el-option>-->
                            <!--<el-option :label="'利随本清'" :value="1"></el-option>-->
                            <!--<el-option :label="'按月结息'" :value="2"></el-option>-->
                            <!--<el-option :label="'按季付息'" :value="3"></el-option>-->
                        <!--</el-select>-->
                    <!--</el-form-item>-->
                    <el-form-item label="生命周期">
                        <el-select size="small" class="middle" v-model="search.status" placeholder="选择条件">
                            <el-option :label="'全部'" :value="null"></el-option>
                            <el-option :label="'投标中'" :value="1"></el-option>
                            <el-option :label="'计息中'" :value="2"></el-option>
                            <el-option :label="'待返还'" :value="3"></el-option>
                            <el-option :label="'已返还'" :value="4"></el-option>
                            <el-option :label="'已结束'" :value="5"></el-option>
                            <el-option :label="'已撤销'" :value="6"></el-option>
                        </el-select>
                    </el-form-item>
                    <!--<el-form-item label="首笔">-->
                        <!--<el-select size="small" class="middle" v-model="search.first" placeholder="首笔接口">-->
                            <!--<el-option :label="'全部'" :value="0"></el-option>-->
                            <!--<el-option :label="'是'" :value="1"></el-option>-->
                            <!--<el-option :label="'否'" :value="2"></el-option>-->
                        <!--</el-select>-->
                    <!--</el-form-item>-->
                    <!--v-if="checkRole()"-->
                    <el-form-item  label="社区经理">
                        <el-select class="manager" size="small" filterable
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
                    <el-form-item label="放款时间">
                        <el-date-picker
                                class="date"
                                size="small"
                                v-model="search.loanStartTimeT"
                                type="date"
                                placeholder="开始日期时间">
                        </el-date-picker>
                        <el-date-picker
                                class="date"
                                size="small"
                                v-model="search.loanEndTimeT"
                                type="date"
                                placeholder="截至日期时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="到期时间">
                        <el-date-picker
                                class="date"
                                size="small"
                                v-model="search.expireStartTimeT"
                                type="date"
                                placeholder="选择日期时间">
                        </el-date-picker>
                        <el-date-picker
                                class="date"
                                size="small"
                                v-model="search.expireEndTimeT"
                                type="date"
                                placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label-width="70px" label="截至时间">
                        <el-date-picker
                                editable="false"
                                class="time"
                                size="small"
                                v-model="search.deadlineTimeT"
                                type="date"
                                placeholder="截至时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label-width="30px" class="item-box">
                        <el-button @click.native="doReset" size="small" type="primary">重置</el-button>
                        <el-button @click.native="doSearchHandler" size="small" type="primary">查询</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="result-box">
                <div class="totals pull-left">
                    <label>借款总金额:</label>
                    <span>{{statistics.amountTotal | moneyFormat}}</span>
                    <label>借款总笔数:</label>
                    <span>{{statistics.recordCount }}</span>
                    <label>服务费总金额:</label>
                    <span>{{statistics.serviceAmountTotal | moneyFormat}}</span>
                    <label>日均金额:</label>
                    <span>{{statistics.dailyAmountTotal | moneyFormat}}</span>
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

        <div  class="table">
            <el-table
                    v-loading="loading"
                    element-loading-text="玩命加载中"
                    :data="list"
                    :stripe="true"
                    border
                    style="width: 100%">
                <el-table-column
                        fixed="left"
                        prop="name"
                        align="center"
                        label="借款人"
                        width="80">
                </el-table-column>
                <el-table-column
                        prop="contractNumber"
                        align="center"
                        label="合同号"
                        min-width="160">
                </el-table-column>
                <!--<el-table-column-->
                        <!--prop=""-->
                        <!--label="首笔借款(是否)"-->
                        <!--align="center"-->
                        <!--min-width="120">-->
                <!--</el-table-column>-->
                <el-table-column
                        prop="phone"
                        align="center"
                        label="手机号"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="certNumber"
                        label="身份证号"
                        align="center"
                        min-width="180">
                </el-table-column>
                <el-table-column
                        label="借款金额"
                        align="center"
                        width="100">
                    <template scope="scope">
                        <span>{{ scope.row.loanAmount | moneyFormat }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="借款余额"
                        align="center"
                        width="100">
                    <template scope="scope">
                        <span>{{ scope.row.balance | moneyFormat }}</span>
                    </template>
                </el-table-column>

                <el-table-column
                        prop="loanTerm"
                        align="center"
                        label="借款期限"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="annualIncomeRate"
                        align="center"
                        label="借款利率(%)"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="serviceRate"
                        align="center"
                        label="服务费率(%)"
                        width="120">
                </el-table-column>
                <el-table-column
                        align="center"
                        label="服务费金额"
                        width="100">
                    <template scope="scope">
                        <span>{{ scope.row.serviceAmount | moneyFormat }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="放款时间"
                        width="160">
                    <template scope="scope">
                        <span>{{ scope.row.lendingTime | dateTimeFormat }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="到期时间"
                        width="160">
                    <template scope="scope">
                        <span>{{ scope.row.expireTime | dateTimeFormat }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="还款方式"
                        width="100">
                    <template scope="scope">
                        <span>{{ scope.row.repaymentMethod | repayType }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="状态(生命周期)"
                        width="130">
                    <template scope="scope">
                        <span>{{ scope.row.status | lifeCycle }}</span>
                    </template>
                </el-table-column>
                <!--<el-table-column-->
                        <!--align="center"-->
                        <!--label="社区经理"-->
                        <!--width="120">-->
                    <!--<template scope="scope">-->
                        <!--<span>{{ scope.row.manager}} - {{ scope.row.jobNumber }}</span>-->
                    <!--</template>-->
                <!--</el-table-column>-->
                <el-table-column
                        align="center"
                        label="主营销人"
                        width="120"
                >
                    <template scope="scope">
                        <span>{{scope.row.mainMarketerName}}</span>
                    </template>
                </el-table-column>
                <!--<el-table-column-->
                        <!--align="center"-->
                        <!--label="受理机构"-->
                        <!--width="120"-->
                <!--&gt;-->
                    <!--<template scope="scope">-->
                        <!--<span>{{scope.row.org}}</span>-->
                    <!--</template>-->
                <!--</el-table-column>-->
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
    import list             from    '../../../../src/data/loan/list'
    import Staff            from    '../../../data/loan/staff'
    import Util             from    'src/js/util'
    import auth             from    'src/js/auth'

    let ops =[
//        {
//        value: '0',
//        label: '合同号'
//    },
        {
        value: '1',
        label: '借款人'
    }, {
        value: '2',
        label: '手机号'
    }, {
        value: '3',
        label: '身份证号'
    }]
    let currentTime  = new Date().getTime()
    let currentMonth =  (new Date(moment().startOf('month'))).getTime()
    export default {
        data() {
            return {
                list: [],
                options: ops,
                value: '',
                mix:{
                    //混合选项 合同 身份证 手机号
                    value:'1',
                    placeholder:'请输入合同号',
                    input:''
                },
                statistics:{

                },
                search:{
                    contractNumber:'',
                    name:'',
                    phone:'',
                    certNumber:'',
                    minLoanAmount:null,
                    minLoanAmountT:null,
                    maxLoanAmount:null,
                    maxLoanAmountT:null,
                    minLoanTermDays:null,
                    maxLoanTermDays:null,
                    loanRate:null,
                    repayType:null,
                    accountManager:null,
//                  放款时间
                    loanStartTime:currentMonth,
                    loanStartTimeT:currentMonth,
                    loanEndTime:currentTime,
                    loanEndTimeT:currentTime,
//                  截止时间
                    expireStartTime:null,
                    expireStartTimeT:null,
                    expireEndTime:null,
                    expireEndTimeT:null,
//                    借款余额
                    minBalanceT:null,
                    minBalance:null,
                    maxBalanceT:null,
                    maxBalance:null,
//                    生命周期
                    status:null,
                    //                    截止日期
                    deadlineTimeT:null,
                    deadlineTime:null,
                },
                staffList: Staff.list,
                staffLoading:false,
                funcId:'R050400',
                loading: false,
                pageNum:1
            }
        },
        watch: {
            "search.loanStartTimeT": function (val) {
                this.search.loanStartTime = val ? new Date(val).getTime() : null
            },
            "search.loanEndTimeT": function (val) {
                this.search.loanEndTime = val ? (new Date(val).getTime()+86400000-1) : null
            },
            "search.expireStartTimeT": function (val) {
                this.search.expireStartTime = val ? new Date(val).getTime() : null
            },
            "search.expireEndTimeT": function (val) {
                this.search.expireEndTime = val ? (new Date(val).getTime()+86400000-1) : null
            },
            "search.minLoanAmountT": function (val) {
                this.search.minLoanAmount = val ? accounting.format(val, 0, '') : null
            },
            "search.maxLoanAmountT": function (val) {
                this.search.maxLoanAmount = val ? accounting.format(val, 0, '') : null
            },

            "search.maxBalanceT": function (val) {
                this.search.maxBalance = val ? accounting.format(val, 0, '') : null
            },
            "search.minBalanceT": function (val) {
                this.search.minBalance = val ? accounting.format(val, 0, '') : null
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
            expandHandler(val){
                if(val == true){
                    this.staffList = Staff.list
                }
            },
            moneyChange(val){

                const search = this.search

                if(search.minLoanAmountT)
                    search.minLoanAmountT = accounting.format(search.minLoanAmountT,2,',')

                if(search.maxLoanAmountT)
                    search.maxLoanAmountT = accounting.format(search.maxLoanAmountT,2,',')

                if(search.minBalanceT)
                    search.minBalanceT = accounting.format(search.minBalanceT,2,',')

                if(search.maxBalanceT)
                    search.maxBalanceT = accounting.format(search.maxBalanceT,2,',')

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
//                    this.loading = true;
//                    setTimeout(() => {
//                        this.loading = false;
//                        this.options4 = this.list.filter(item => {
//                            return item.label.toLowerCase()
//                                    .indexOf(query.toLowerCase()) > -1;
//                        });
//                    }, 200);
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
                let url         = Vue.agent.root + '/statistics/loan/selectLoanBasicInfo'
                var reqData     = {
                    pageSize:15,
                    pageNum: that.pageNum,
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
                        let data            = res.body.data
                        Object.assign(that,data)
                    }
                }, res =>{
                    that.loading = false
                });
            },
            doExport(){
                let that        = this
                let url         = Vue.agent.root + '/statistics/loan/excel'
                let fileName    = "借款查询" + moment().format("YYYY-MM-DD hh:mm:ss")
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
                if(this.loading == true){
                    this.$notify({title: '提示',message: '请勿频繁操作',type: 'warning'});
                }else{
                    this.pageNum = val
                    this.doSearch()
                }
            }
        },
        created:function () {
            let that        = this
            let url         = Vue.agent.root + '/manageUser/options'

            var reqData     = {
                funcId:that.funcId
            }

            that.$http && that.$http.get(url,{
                params:reqData,
                timeout:30000
            }).then(function (res) {
                if(res.body.code == "200") {
                    Staff.list      = res.body.data
                    that.manageList = Staff.list
                }
            });
        },
        mounted:function () {
        },
    }
</script>
<style lang="scss">
    @import 'src/scss/pages/market/contract.scss';
</style>