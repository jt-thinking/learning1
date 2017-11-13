<template>
    <div class="market-income">
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
                        <el-input  size="small"  v-model="search.contractNumber" :placeholder="'请输入合同号'"></el-input>
                    </el-form-item>
                    <el-form-item label="应还日期">
                        <el-date-picker
                                class="date"
                                size="small"
                                v-model="search.shouldStartTimeT"
                                type="date"
                                placeholder="开始日期时间">
                        </el-date-picker>
                        <el-date-picker
                                class="date"
                                size="small"
                                v-model.aync="search.shouldEndTimeT"
                                type="date"
                                placeholder="截至日期时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="实还日期">
                        <el-date-picker
                                class="date"
                                size="small"
                                v-model="search.actualStartTimeT"
                                type="date"
                                placeholder="选择日期时间">
                        </el-date-picker>
                        <el-date-picker
                                class="date"
                                size="small"
                                v-model="search.actualEndTimeT"
                                type="date"
                                placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>

                    <el-form-item label="回款类型">
                        <el-select size="small" class="middle"  v-model="search.type" placeholder="请选择条件">

                            <el-option :label="'全部'" :value="null"></el-option>
                            <el-option :label="'本金'" value="1"></el-option>
                            <el-option :label="'利息'" value="2"></el-option>

                        </el-select>
                    </el-form-item>

                    <el-form-item label="状态">
                        <el-select size="small" class="middle" label-width="40px" v-model="search.status" placeholder="请选择条件">
                            <el-option :label="'全部'" :value="null"></el-option>
                            <el-option :label="'未回款'" value="0"></el-option>
                            <el-option :label="'已兑付'" value="6"></el-option>
                            <!--<el-option :label="'逾期'" :value="8"></el-option>-->
                        </el-select>
                    </el-form-item>
                    <!--v-if="checkRole()"-->
                    <el-form-item  label="社区经理">
                        <el-select class="manager" size="small" filterable
                                   :filter-method="filterMethod"
                                   @visible-change="expandHandler"
                                   :loading="staffLoading"
                                   v-model="search.accountManager"
                                   placeholder="请选择">
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
                    <!--<el-form-item label-width="70px" label="截至时间">-->
                        <!--<el-date-picker-->
                                <!--editable="false"-->
                                <!--class="time"-->
                                <!--size="small"-->
                                <!--v-model="search.deadlineTimeT"-->
                                <!--type="date"-->
                                <!--placeholder="截至时间">-->
                        <!--</el-date-picker>-->
                    <!--</el-form-item>-->
                    <el-form-item label-width="30px" class="item-box">
                        <el-button @click.native="doReset" size="small" type="primary">重置</el-button>
                        <el-button @click.native="doSearchHandler" size="small" type="primary">查询</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="result-box">
                <div class="totals pull-left">
                    <label>投资本金:</label>
                    <span>{{statistics.loanTotalAmt | moneyFormat}}</span>
                    <label>应还本金:</label>
                    <span>{{statistics.prePrincipalAmtTotal | moneyFormat}}</span>
                    <label>实还本金:</label>
                    <span>{{statistics.principalAmtTotal | moneyFormat}}</span>
                    <label>应还收益:</label>
                    <span>{{statistics.preInterestAmtTotal | moneyFormat}}</span>
                    <label>实还收益:</label>
                    <span>{{statistics.interestAmtTotal | moneyFormat}}</span>
                    <label>应还本息:</label>
                    <span>{{statistics.prePrincipalInterestAmtTotal | moneyFormat}}</span>
                    <label>实还本息:</label>
                    <span>{{statistics.principalInterestAmtTotal | moneyFormat}}</span>
                    <label>本金应还笔数:</label>
                    <span>{{statistics.prePaidCount}}</span>
                    <label>本金实还笔数:</label>
                    <span class="">{{statistics.paidCount}}</span>
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
                        label="投资人"
                        align="center"
                        min-width="80">
                </el-table-column>
                <el-table-column
                        prop="goodsName"
                        align="center"
                        label="合同号"
                        min-width="160">
                </el-table-column>

                <el-table-column
                        prop="phone"
                        align="center"
                        label="手机号"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="certNumber"
                        align="center"
                        label="身份证号"
                        width="180">
                </el-table-column>
                <el-table-column
                        label="投资本金"
                        align="center"
                        min-width="100">
                    <template scope="scope">
                        <span>{{ scope.row.preRepayShare | moneyFormat }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="投资余额"
                        align="center"
                        min-width="120">
                    <template scope="scope">
                        <span>{{ scope.row.balance | moneyFormat }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="应还本金"
                        align="center"
                        min-width="100">
                    <template scope="scope">
                        <span>{{ scope.row.prePrincipalAmt | moneyFormat }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="应还收益"
                        align="center"
                        width="100">
                    <template scope="scope">
                        <span>{{ scope.row.preInterestAmt | moneyFormat }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="应还本息"
                        align="center"
                        width="100">
                    <template scope="scope">
                        <span>{{ scope.row.preRepayAmt | moneyFormat }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="实还收益"
                        width="100">
                    <template scope="scope">
                        <span>{{ scope.row.interestAmt | moneyFormat }}</span>
                    </template>
                </el-table-column>
                <!--<el-table-column-->
                        <!--label="借款金额"-->
                        <!--align="center"-->
                        <!--min-width="100">-->
                    <!--<template scope="scope">-->
                        <!--<span>{{ scope.row.loanAmt | moneyFormat }}</span>-->
                    <!--</template>-->
                <!--</el-table-column>-->
                <el-table-column
                        label="投资日期"
                        align="center"
                        width="120"
                >
                    <template scope="scope">
                        <span>{{ scope.row.startDate | dateFormat }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="实还本金"
                        width="100">
                    <template scope="scope">
                        <span>{{ scope.row.principalAmt | moneyFormat }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="实还本息"
                        width="100">
                    <template scope="scope">
                        <span>{{ scope.row.repayAmt | moneyFormat }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="计息开始时间"
                        width="120">
                    <template scope="scope">
                        <span>{{ scope.row.startDate | dateFormat }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="应还日期"
                        width="120">
                    <template scope="scope">
                        <span>{{ scope.row.preRepayDate | dateFormat }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="实还日期"
                        width="120">
                    <template scope="scope">
                        <span>{{ scope.row.repayDate | dateFormat }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="状态"
                        width="80">
                    <template scope="scope">
                        <span>{{ scope.row.status | incomePlanStatus }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="社区经理"
                        width="120">
                    <template scope="scope">
                        <span>{{ scope.row.manager }} - {{ scope.row.jobNumber }}</span>
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
                        label="借款人"
                        width="120"
                >
                    <template scope="scope">
                        <span>{{scope.row.loanCustName}}</span>
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
    import list             from    '../../../../src/data/loan/list'
    import Staff            from    '../../../data/loan/staff'
    import Util             from    'src/js/util'
    import auth             from    'src/js/auth'

    let ops =[
        {
        value: '1',
        label: '投资人'
    }, {
        value: '2',
        label: '手机号'
    }, {
        value: '3',
        label: '身份证'
    }]
    export default {
        data() {
            return {
                list: [],
                options: ops,
                value: '',
                mix:{
                    //混合选项 投资人 身份证 手机号
                    value:'1',
                },
                statistics:{

                },
                search:{
                    contractNumber:null,
                    phone:'',
                    name:'',
                    certNumber:'',
                    shouldStartTimeT:null,
                    shouldStartTime:null,
                    shouldEndTimeT:null,
                    shouldEndTime:null,
                    actualStartTime:null,
                    actualStartTimeT:null,
                    actualEndTime:null,
                    actualEndTimeT:null,
                    accountManager:null,
                    status:null,
                    type:'1',
                    //                    截止日期
                    deadlineTimeT:null,
                    deadlineTime:null,
                },
                pageNum:1,
                pageSize:15,
                staffList: Staff.list,
                staffLoading:false,
                funcId:'R050600',
                loading:false
            }
        },
        watch: {
            "search.shouldStartTimeT": function (val) {
                this.search.shouldStartTime = val ? new Date(val).getTime() : null
            },
            "search.shouldEndTimeT": function (val) {
                this.search.shouldEndTime = val ? (new Date(val).getTime()+86400000-1) : null
            },
            "search.actualStartTimeT": function (val) {
                this.search.actualStartTime = val ? new Date(val).getTime() : null
            },
            "search.actualEndTimeT": function (val) {
                this.search.actualEndTime = val ? (new Date(val).getTime()+86400000-1) : null
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
            moneyChange(val){
                const search = this.search
//                if(search.creditAmtMinT)
//                    search.creditAmtMinT = accounting.format(search.creditAmtMinT,2,',')
//
//                if(search.creditAmtMaxT)
//                    search.creditAmtMaxT = accounting.format(search.creditAmtMaxT,2,',')
//
//                if(search.remainedAmtMinT)
//                    search.remainedAmtMinT = accounting.format(search.remainedAmtMin,2,',')
//
//                if(search.remainedAmtMaxT)
//                    search.remainedAmtMaxT = accounting.format(search.remainedAmtMaxT,2,',')
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
                let url         = Vue.agent.root + '/statistics/plan/selectFundPlan'
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
                }).then( res => {
                    that.loading = false
                    if(res.body.code == 200) {
                        let data     = res.body.data
                        Object.assign(that,data)
                    }
                },res =>{
                    that.loading = false
                });
            },
            doExport(){
                let that        = this
                let url         = Vue.agent.root + '/statistics/plan/fund/excel'
                let fileName    = "回款计划" + moment().format("YYYY-MM-DD hh:mm:ss")
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
            let newsId      = this.$route.query.newsId
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
        }
    }
</script>
<style lang="scss">
    @import 'src/scss/pages/market/income.scss';
</style>