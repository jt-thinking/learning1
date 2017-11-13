<template>
    <div class="stat-info">
        <div class="stat-box">
            <div class="search-box">
                <el-form   :model="formInline" label-width="66px" >
                    <el-select @change="mixChange"  v-model="mix.value" placeholder="条件" size="small" class="middle">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                    <el-input v-show="mix.value == 1 " size="small"  v-model="search.name" :placeholder="'请输入姓名'"></el-input>
                    <el-input v-show="mix.value == 2 " size="small"  v-model="search.phone" :placeholder="'请输入手机'"></el-input>
                    <el-input v-show="mix.value == 3 " size="small"  v-model="search.certNo" :placeholder="'请输入身份证'"></el-input>
                    <el-form-item label="借款余额">
                        <el-input @blur="moneyChange" size="small" class="money" v-model="search.borrowAmtMinT" placeholder="金额"></el-input>
                        <span>-</span>
                        <el-input @blur="moneyChange" size="small" class="money" v-model="search.borrowAmtMaxT" placeholder="金额"></el-input>
                    </el-form-item>
                    <el-form-item label="投资余额">
                        <el-input @blur="moneyChange" size="small" class="money" v-model="search.investAmtMinT" placeholder="金额"></el-input>
                        <span>-</span>
                        <el-input @blur="moneyChange" size="small" class="money" v-model="search.investAmtMaxT" placeholder="金额"></el-input>
                    </el-form-item>
                    <el-form-item label="授信余额">
                        <el-input @blur="moneyChange" size="small" class="money" v-model="search.remainedAmtMinT" placeholder="金额"></el-input>
                        <span>-</span>
                        <el-input @blur="moneyChange" size="small" class="money" v-model="search.remainedAmtMaxT" placeholder="金额"></el-input>
                    </el-form-item>
                    <el-form-item label="社区经理">
                        <el-select class="manager" size="small"
                                   filterable
                                   :filter-method="filterMethod"
                                   @visible-change="expandHandler"
                                   :loading="staffLoading"
                                   v-model="search.accountManager" placeholder="请选择">
                            <el-option :label="'全部'" :value="''"></el-option>
                            <el-option-group
                                    v-for="group in manageList"
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
                    <el-form-item label-width="100px" label="关联借款笔数">
                        <el-input size="small" min="0" type="number" class="money" v-model.lazy="search.loanCountMin" placeholder="起始笔数"></el-input>
                        <span>-</span>
                        <el-input size="small" min="0" type="number" class="money" v-model.lazy="search.loanCountMax" placeholder="截至笔数"></el-input>
                    </el-form-item>
                    <el-form-item label-width="100px" label="关联投资笔数">
                        <el-input size="small" min="0" type="number" class="money" v-model.lazy="search.investCountMin" placeholder="起始笔数"></el-input>
                        <span>-</span>
                        <el-input size="small" min="0" type="number" class="money" v-model.lazy="search.investCountMax" placeholder="截至笔数"></el-input>
                    </el-form-item>
                    <el-form-item label="注册时间">
                        <!--<el-select  placeholder="条件" v- size="small" class="middle">-->
                            <!--<el-option :label="'注册时间'" :value="1"></el-option>-->
                            <!--<el-option :label="'服务时间'" :value="2"></el-option>-->
                        <!--</el-select>-->
                        <el-date-picker
                                editable="false"
                                class="date"
                                size="small"
                                v-model="search.registerTimeMinT"
                                type="date"
                                placeholder="开始日期时间">
                        </el-date-picker>
                        <el-date-picker
                                class="date"
                                size="small"
                                v-model="search.registerTimeMaxT"
                                type="date"
                                placeholder="截至日期时间">
                        </el-date-picker>
                    </el-form-item>

                    <el-form-item label="绑卡时间">
                        <el-date-picker
                                class="date"
                                size="small"
                                v-model="search.bindCardTimeMinT"
                                type="date"
                                placeholder="选择日期时间">
                        </el-date-picker>
                        <el-date-picker
                                class="date"
                                size="small"
                                v-model="search.bindCardTimeMaxT"
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
                    <el-form-item label="是否投资客户" label-width="100px">
                        <el-select size="small" class="middle" v-model="search.isLoan" placeholder="是否投资客户">
                            <el-option :label="'全部'" :value="null"></el-option>
                            <el-option label="借款人" :value="'1'"></el-option>
                            <el-option label="投资人" :value="'0'"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label-width="30px">
                        <el-button @click.native="doReset" size="small" type="primary">重置</el-button>
                        <el-button @click.native="doSearchHandler" size="small" type="primary">查询</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="result-box">
                <div class="totals pull-left">
                    <label>客户数:</label>
                    <span>{{ statistics.userCount }}</span>
                    <label>借款余额:</label>
                    <span>{{ statistics.borrowAmtTotal | moneyFormat }}</span>
                    <label>投资余额:</label>
                    <span>{{ statistics.inventAmtTotal | moneyFormat }}</span>
                    <label>平台存量人均借款额度:</label>
                    <span>{{ statistics.perPlatformBorrowAmt | moneyFormat }}</span>
                    <label>平台人均投资额度:</label>
                    <span>{{ statistics.perPlatformInvestAmt | moneyFormat }}</span>
                    <label>平台累计服务客户总数:</label>
                    <span>{{statistics.userPlatformCount}}</span>
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
                <!--@mousewheel.prevent="test" -->
            <el-table
                    v-loading="loading"
                    :data="list"
                    :stripe="true"
                    border
                    style="width: 100%">
                <el-table-column
                        fixed="left"
                        align="center"
                        label="姓名"
                        width="80"
                        >
                    <template scope="scope">
                        <span>{{ scope.row.name | nameFormat }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="客户类型"
                        width="140"
                >
                    <template scope="scope">
                        <el-select size="small" @change="(value) => changeIsLoanHandler(value, scope.row)" v-model.number.lazy="scope.row.isLoan" placeholder="请选择">
                            <el-option label="投资人" :value="0"></el-option>
                            <el-option label="借款人" :value="1"></el-option>
                        </el-select>
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
                        prop="phone"
                        align="center"
                        label="手机号"
                        width="120"
                        >
                </el-table-column>
                <el-table-column
                        label="关联借款笔数"
                        align="center"
                        width="110"
                        >
                    <template scope="scope">
                        <span>{{ scope.row.loanCount | countFormat }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="关联投资笔数"
                        width="110"
                        >
                    <template scope="scope">
                        <span>{{ scope.row.investCount | countFormat }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="借款余额"
                        width="100"
                        >
                    <template scope="scope">
                        <span>{{ scope.row.borrowAmt | moneyFormat }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="投资余额"
                        width="100"
                        >
                    <template scope="scope">
                        <span>{{ scope.row.investAmt | moneyFormat }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="授信余额"
                        width="100"
                        >
                    <template scope="scope">
                        <span>{{ scope.row.remainedAmt | moneyFormat }}</span>
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
                        prop="cardNo"
                        align="center"
                        label="绑定银行卡号"
                        width="200"
                >
                </el-table-column>
                <el-table-column
                        align="center"
                        label="注册时间"
                        width="180"
                >
                    <template scope="scope">
                        <span>{{ scope.row.registerTime | dateTimeFormat }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="zip"
                        align="center"
                        label="绑卡时间"
                        width="180"
                >
                    <template scope="scope">
                        <span>{{ scope.row.bindCardTime | dateTimeFormat }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="推荐人"
                        width="120"
                >
                    <template scope="scope">
                        <span>{{scope.row.referee}}</span>
                    </template>
                </el-table-column>
                <!--<el-table-column-->
                        <!--align="center"-->
                        <!--label="社区经理"-->
                        <!--width="180"-->
                <!--&gt;-->
                    <!--<template scope="scope">-->
                        <!--<span>{{ scope.row.mgrName}} - {{ scope.row.jobNum}}</span>-->
                    <!--</template>-->
                <!--</el-table-column>-->
                <el-table-column
                        align="center"
                        label="社区经理手机"
                        width="160"
                >
                    <template scope="scope">
                        <span>{{ scope.row.propertyValue}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="主营销人"
                        width="180"
                >
                    <template scope="scope">
                        <el-select v-if="scope.row.edit" size="small"
                                   @visible-change="expandHandler"
                                    filterable
                                    :filter-method="filterMethod"
                                   :loading="staffLoading"
                                   v-model="scope.row.mainMarketerId"
                                   placeholder="请选择">
                            <el-option label="空" :value="null"></el-option>
                            <el-option-group
                                    v-for="group in manageList"
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

                        <span v-if="!scope.row.edit">{{ scope.row.mainMarketerName | nameFormat }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="主营销人占比"
                        width="160"
                >
                    <template scope="scope">
                        <el-slider :disabled="!scope.row.mainMarketerId" @change="doColSlider(scope.row,1)" v-model="scope.row.mainPercentage" show-input></el-slider>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="副营销人"
                        width="180"
                >
                    <template scope="scope">
                        <el-select v-if="scope.row.edit" size="small"
                                    filterable
                                    :filter-method="filterMethod"
                                   @visible-change="expandHandler"
                                   :loading="staffLoading"
                                   v-model="scope.row.deputyMarketerId" placeholder="请选择">
                            <el-option label="空" :value="null"></el-option>
                            <el-option-group
                                    v-for="group in manageList"
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
                        <span v-if="!scope.row.edit">{{ scope.row.deputyMarketerName | nameFormat }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="副营销人占比"
                        width="160"
                >
                    <template scope="scope">
                        <el-slider :disabled="!scope.row.deputyMarketerId || scope.row.deputyMarketerId == '0' " @change="doColSlider(scope.row,2)" v-model="scope.row.deputyPercentage" show-input></el-slider>
                    </template>
                </el-table-column>
                <el-table-column
                        fixed="right"
                        label="操作"
                        width="64">
                    <template scope="scope">
                        <el-button v-if="scope.row.edit"  @click="doColUpdate(scope.row)" type="text" size="small">保存</el-button>
                        <el-button v-if="!scope.row.edit" @click="doColEdit(scope.row)" type="text" size="small">编辑</el-button>
                        <!--<el-button type="text" size="small">编辑</el-button>-->
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
    import leverBar         from    '../../Com/LeverBar.vue'
    import Staff            from    '../../../data/loan/staff'
    import Util             from    '../../../js/util'


    let wrpEle;
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
        {
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
                    //混合选项 合同 身份证 手机号
                    value:'1',
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
                    //授信余额
                    borrowAmtMin:'',
                    borrowAmtMax:'',
                    borrowAmtMinT:'',
                    borrowAmtMaxT:'',
//                    投资余额
                    investAmtMin:'',
                    investAmtMinT:'',
                    investAmtMax:'',
                    investAmtMaxT:'',
//                    授信余额
                    remainedAmtMin:'',
                    remainedAmtMinT:'',
                    remainedAmtMax:'',
                    remainedAmtMaxT:'',
//                    授信笔数
                    loanCountMin:null,
                    loanCountMax:null,
//                    授信笔数
                    investCountMin:null,
                    investCountMax:null,
//                    注册时间
                    registerTimeMinT:null,
                    registerTimeMin:null,
                    registerTimeMaxT:null,
                    registerTimeMax:null,
//                  绑卡时间
                    bindCardTimeMin:null,
                    bindCardTimeMinT:null,
                    bindCardTimeMax:null,
                    bindCardTimeMaxT:null,
                    //授信时间
                    startDateMin:'',
                    startDateMinT:'',
                    startDateMax:'',
                    startDateMaxT:'',
                    endDateMin:'',
                    endDateMinT:'',
                    endDateMax:'',
                    endDateMaxT:'',
                    status:null,
                    creditCheckStatus:null,
                    accountManager:'',
//                    截止日期
                    deadlineTimeT:null,
                    deadlineTime:null,
                    isLoan:null,
                },
                pageNum:1,
                manageList: Staff.list,
                funcId:'R020500',
                staffLoading:false,
                loading:false,
                lock:false
            }
        },
        watch: {
            "search.borrowAmtMinT": function (val) {
                this.search.borrowAmtMin = val ? accounting.format(val, 0, '') : null
            },
            "search.borrowAmtMaxT": function (val) {
                this.search.borrowAmtMax = val ? accounting.format(val, 0, '') : null
            },

            "search.investAmtMinT": function (val) {
                this.search.investAmtMin = val  ? accounting.format(val, 0, '') : null
            },
            "search.investAmtMaxT": function (val) {
                this.search.investAmtMax = val ? accounting.format(val, 0, '') : null
            },
            "search.remainedAmtMinT": function (val) {
                this.search.remainedAmtMin = val ? accounting.format(val, 0, '') : null
            },
            "search.remainedAmtMaxT": function (val) {
                this.search.remainedAmtMax = val ? accounting.format(val, 0, '') : null
            },
            "search.registerTimeMinT": function (val) {
                this.search.registerTimeMin = val ? new Date(val).getTime() : null
            },
            "search.registerTimeMaxT": function (val) {
                this.search.registerTimeMax = val ? (new Date(val).getTime()+86400000-1) : null ;
            },
            "search.bindCardTimeMinT": function (val) {
                this.search.bindCardTimeMin = val ? new Date(val).getTime() : null
            },
            "search.bindCardTimeMaxT": function (val) {
                this.search.bindCardTimeMax = val ? (new Date(val).getTime()+86400000-1) : null
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
//           客户类型事件响应
            changeIsLoanHandler(current,val){
                let that = this
                if(val.lock == true || current == val.originalIsLoan)
                    return false
                val.lock = true
                let url         = Vue.agent.root + '/statistics/cust/saveIsLoan'
                var reqData     = {
                    custId:val.userNo,
                    funcId:that.funcId,
                    isLoan:val.isLoan
                }

                that.$http.post(url,reqData).then(function (res) {
                    val.lock = false
                    if(res.body.code == "200") {
                        that.$notify({title: '成功',message: '更新成功',type: 'success'});
                    }
                });
            },
            moneyChange(val){
                const search = this.search
                if(search.borrowAmtMinT)
                    search.borrowAmtMinT = accounting.format(search.borrowAmtMinT,2,',')

                if(search.borrowAmtMaxT)
                    search.borrowAmtMaxT = accounting.format(search.borrowAmtMaxT,2,',')

                if(search.investAmtMinT)
                    search.investAmtMinT = accounting.format(search.investAmtMinT,2,',')

                if(search.investAmtMaxT)
                    search.investAmtMaxT = accounting.format(search.investAmtMaxT,2,',')

                if(search.remainedAmtMinT)
                    search.remainedAmtMinT = accounting.format(search.remainedAmtMinT,2,',')

                if(search.remainedAmtMaxT)
                    search.remainedAmtMaxT = accounting.format(search.remainedAmtMaxT,2,',')
            },
            //设置主副营销人
            doColUpdate(val){
                let that        = this

//                if(!val.mainMarketerId){
//                    this.$message({message: '未设置主营销人',type: 'warning'});
//                    return false
//                }

                let deputyPercentage = val.deputyPercentage == 0 ? null : val.deputyPercentage

                let url         = Vue.agent.root + '/statistics/cust/saveManagers'

                var reqData     = {
                    custId:val.userNo,
                    mainMarketerId:val.mainMarketerId,
                    mainPercentage:val.mainPercentage,
                    deputyMarketerId:val.deputyMarketerId,
                    deputyPercentage:deputyPercentage,
                    funcId:that.funcId
                }

                Util.dataClear(reqData)


                that.$http.post(url,reqData).then(function (res) {
                    if(res.body.code == "200") {
                        that.$notify({title: '成功',message: '更新成功',type: 'success'});
                        val.edit = false
                        if(val.deputyMarketerId){
                            let opD = Staff.findByVal(Staff.list,val.deputyMarketerId)
                            val.deputyMarketerName = opD.name
//                            console.log(opD.name)
                        }
                        if(val.mainMarketerId){
                            let op = Staff.findByVal(Staff.list,val.mainMarketerId)
                            val.mainMarketerName = op.name
//                            console.log(op.name)
                        }
                    }
                });
            },
            doColSlider(val,type){
                if(type==1){
                    val.deputyPercentage = 100 - val.mainPercentage
                }else{
                    val.mainPercentage  = 100 - val.deputyPercentage
                }
//                console.log(val)
            },
            doColEdit(val){
                val.edit = true
                this.manageList = Staff.list
            },
            expandHandler(val){
                if(val == true){
                    this.manageList = Staff.list
                }
            },
            filterMethod(query){
                if (!!query) {
                    this.staffLoading = true
                    if(!!query.match(/[\u4e00-\u9fa5]/)){
                        this.staffLoading = false
                        this.manageList = Staff.findByName(Staff.list,query)
//                        console.log('test:',Staff.list)
                    }else if(!!query.match(/^1\d*/) && query.length > 3){
                        console.log("手机")
                        this.staffLoading = false
                        this.manageList = Staff.findByPhone(Staff.list,query)
                    }else if(!!query.match(/^9\d*/)){
                        console.log("工号")
                        this.staffLoading = false
                        this.manageList = Staff.findByNo(Staff.list,query)
                    }else if(!!query.match(/[a-zA-Z]/)){
                        console.log('字母')
                        this.staffLoading = false
                        this.manageList = Staff.findByInitial(Staff.list,query.toUpperCase())
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
                    this.manageList = []
                    setTimeout(()=>{
                        this.staffLoading = false;
//                        console.log('空白',Staff.list)
                        this.manageList = Array.from(Staff.list)
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
                let url         = Vue.agent.root + '/statistics/cust/basicinfo'
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
                    if(res.body.code == 200) {
                        let data            = res.body.data
                        data.list.forEach(function (el,i) {
                            el.edit = false
                            if(!el.mainMarketerId){
                                el.mainMarketerId = null
                            }else{
                                el.mainMarketerId = el.mainMarketerId + ""
                            }

                            if(!el.deputyMarketerId){
                                el.deputyMarketerId = null
                            }else{
                                el.deputyMarketerId = el.deputyMarketerId + ""
                            }
                            el.originalIsLoan = el.isLoan
                            if(!el.mainPercentage)
                                el.mainPercentage = 100
                            if(!el.deputyPercentage)
                                el.deputyPercentage = 0
                        })
                        Object.assign(that,data)
                    }
                },res=>{
                    that.loading = false
                });
            },
            doExport(){
                let that        = this
                let url         = Vue.agent.root + '/statistics/cust/excel'
                let fileName    = "用户信息" + moment().format("YYYY-MM-DD hh:mm:ss")
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
//        beforeRouteEnter (to, from, next){
//            var url         = Vue.agent.jingDebug + '/manageUser/options'
//            var reqData     = {
//            };
//
//            Vue.http.get(url,{params:reqData}).then(function (res) {
//                if(res.body.code == "200") {
//                    Staff.list      = res.body.data
//                    console.log(Staff.list)
//                }
//                next()
//            });
//        },
        components:{
            leverBar
        }
    }
</script>
<style lang="scss">
    @import 'src/scss/pages/stat/info.scss';
</style>