<template>
    <div class="market-info">
        <div class="stat-box">
            <div  class="search-box">
                <el-form   :model="formInline" label-width="66px" >
                    <el-select @change="mixChange"  v-model="mix.value" placeholder="条件" size="small" class="middle">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                    <el-input v-show="mix.value == 1 " size="small"  v-model="search.name" :placeholder="'请输入姓名'"></el-input>
                    <el-input v-show="mix.value == 2 " size="small"  v-model="search.phone" :placeholder="'请输入手机'"></el-input>
                    <el-input v-show="mix.value == 3 " size="small"  v-model="search.certNo" :placeholder="'请输入身份证'"></el-input>
                    <!--v-if="checkRole()"-->
                    <el-form-item label="社区经理">
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
                    <el-form-item label="注册时间">
                        <el-date-picker
                                editable="false"
                                class="date"
                                size="small"
                                v-model="search.registerTimeMinT"
                                type="date"
                                placeholder="开始日期时间">
                        </el-date-picker>
                        <el-date-picker
                                editable="false"
                                class="date"
                                size="small"
                                v-model="search.registerTimeMaxT"
                                type="date"
                                placeholder="截至日期时间">
                        </el-date-picker>
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
                    <el-form-item label="营销类别">
                        <el-select size="small" class="middle" v-model="search.marketerType" placeholder="主副营销">
                            <el-option :label="'全部'" :value="0"></el-option>
                            <el-option :label="'主营销人'" :value="1"></el-option>
                            <el-option :label="'副营销人'" :value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否投资客户" label-width="100px">
                        <el-select size="small" class="middle" v-model="search.isLoan" placeholder="是否投资客户">
                            <el-option :label="'全部'" :value="null"></el-option>
                            <el-option label="借款人" :value="'1'"></el-option>
                            <el-option label="投资人" :value="'0'"></el-option>
                        </el-select>
                    </el-form-item>
                    <div class="item-box">
                        <el-button @click.native="doReset" size="small" type="primary">重置</el-button>
                        <el-button @click.native="doSearchHandler" size="small" type="primary">查询</el-button>
                    </div>
                </el-form>
            </div>
            <div class="result-box">
                <div class="totals">
                    <el-tag type="primary">今天</el-tag>

                    <label>注册用户数:</label>
                    <span class="span-date">{{ statistics.dayRegisterCount }}</span>
                    <label>客户总数:</label>
                    <span class="span-date">{{ statistics.dayCustomerCount }}</span>
                    <label>账户总余额:</label>
                    <span class="span-date">{{statistics.dayCustomerBalanceTotal | moneyFormat}}</span>

                </div>
                <div class="totals">
                    <el-tag type="success">当月</el-tag>
                    <label>注册客户数:</label>
                    <span class="span-date">{{ statistics.monthRegisterCount }}</span>
                    <!--<label>授信总余额:</label>-->
                    <!--<span class="span-date">{{statistics.remainedCreditAmtTotal | moneyFormat}}</span>-->
                </div>
                <div class="totals">
                    <el-tag type="danger">区间</el-tag>
                    <label>注册客户数:</label>
                    <span class="span-date">
                        {{ statistics.rangeCustomerCount }}
                    </span>
                    <!--<label>授信总余额:</label>-->
                    <!--<span class="span-date">{{totals.remainedCreditAmtTotal | moneyFormat}}</span>-->
                </div>


                <div class="pull-right">
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
                        align="center"
                        label="客户名称"
                        width="140"
                        >
                    <template scope="scope">
                        <span>{{ scope.row.name | nameFormat }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        fixed="left"
                        prop="certNo"
                        label="身份证号"
                        align="center"
                        width="180">
                </el-table-column>
                <el-table-column
                        align="center"
                        label="客户类型"
                        width="120"
                >
                    <template scope="scope">
                        <span>{{ scope.row.isLoan | isLoanFormat }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="phone"
                        align="center"
                        label="手机号"
                        width="120"
                        >
                </el-table-column>

                <el-table-column
                        label="借款余额"
                        align="center"
                        width="180"
                        >
                    <template scope="scope">
                        <span>{{ scope.row.borrowAmt | moneyFormat }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="授信余额"
                        align="center"
                        width="180"
                >
                    <template scope="scope">
                        <span>{{ scope.row.remainedAmt | moneyFormat }}</span>
                    </template>
                </el-table-column>

                <el-table-column
                        label="投资余额"
                        align="center"
                        width="180"
                >
                    <template scope="scope">
                        <span>{{ scope.row.investAmt | moneyFormat }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="剩余关联借款"
                        align="center"
                        width="120"
                >
                    <template scope="scope">
                        <span>{{ scope.row.loanCount }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="剩余关联投资"
                        align="center"
                        width="120"
                >
                    <template scope="scope">
                        <span>{{ scope.row.investCount }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="账户余额"
                        width="120"
                >
                    <template scope="scope">
                        <span>{{ scope.row.accoutAmt | moneyFormat }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="江西银行电子账户"
                        align="center"
                        min-width="180"
                        >
                    <template scope="scope">
                        <span>{{ scope.row.jxBankCardNo}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="绑定卡开户行"
                        align="center"
                        width="140"
                >
                    <template scope="scope">
                        <span>{{ scope.row.branchName }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="绑定银行卡号"
                        width="180"
                        >
                    <template scope="scope">
                        <span>{{ scope.row.cardNo}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="注册时间"
                        width="160"
                        >
                    <template scope="scope">
                        <span>{{ scope.row.registerTime | dateTimeFormat }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="绑卡时间"
                        width="160"
                        >
                    <template scope="scope">
                        <span>{{ scope.row.bindCardTime | dateTimeFormat }}</span>
                    </template>
                </el-table-column>
                <!--<el-table-column-->
                        <!--align="center"-->
                        <!--label="社区经理"-->
                        <!--width="120"-->
                        <!--&gt;-->
                    <!--<template scope="scope">-->
                        <!--<span>{{ scope.row.mgrName }} - {{ scope.row.jobNum }} </span>-->
                    <!--</template>-->
                <!--</el-table-column>-->
                <el-table-column
                        align="center"
                        label="主营销人"
                        width="120"
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
                        label="主营销人占比(%)"
                        width="140">
                    <template scope="scope">
                        <span>{{ scope.row.mainPercentage}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="副营销人"
                        width="120"
                >
                    <template scope="scope">
                        <span>{{scope.row.deputyMarketerName | nameFormat}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="副营销人占比(%)"
                        width="140">
                    <template scope="scope">
                        <span>{{ scope.row.deputyPercentage}}</span>
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
                        :current-page.sync="pageNum"
                        :page-size="pageSize"
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
                    //授信时间
                    registerTimeMin:currentMonth,
                    registerTimeMinT:currentMonth,
                    registerTimeMax:currentTime,
                    registerTimeMaxT:currentTime,
                    accountManager:null,
                    marketerType:0,
                    //                    截止日期
                    deadlineTimeT:null,
                    deadlineTime:null,
                    isLoan:null,
                },
                staffList: Staff.list,
                staffLoading:false,
                funcId:'R050100',
                total:0,
                pageNum:1,
                loading:false
            }
        },
        watch: {
            "search.registerTimeMinT": function (val) {
                this.search.registerTimeMin = val ? new Date(val).getTime() : null
            },
            "search.registerTimeMaxT": function (val) {
                this.search.registerTimeMax = val ? (new Date(val).getTime()+86400000-1) : null
            },
            "search.deadlineTimeT": function (val) {
                this.search.deadlineTime = val ? (new Date(val).getTime()+86400000-1) : null
            },
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
            checkRole(){
                let role = this.role

//                console.log("角色:",role)

                if(role == null){
                    return false
                }
                return true
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
                let url         = Vue.agent.root + '/statistics/cust/marketing'
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
                }).then(res => {
                    that.loading = false
                    if(res.body.code == "200") {
                        let data     = res.body.data
                        Object.assign(that,data)
                    }
                },res=>{
                    that.loading = false
                });
            },
            doExport(){
                let that        = this
                let url         = Vue.agent.root + '/statistics/cust/excel'

                var reqData     = {
                    funcId:that.funcId
                }

                Object.assign(reqData,that.search)
                Util.dataClear(reqData)

                let fileName    = "客户基本情况" + moment().format("YYYY-MM-DD hh:mm:ss")

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
        components:{
        }
    }
</script>
<style lang="scss">
    @import 'src/scss/pages/market/info.scss';
</style>