<template>
    <div class="market-credit">
        <div class="stat-box">
            <div  class="search-box">
                <el-form   :model="formInline" label-width="66px" >
                    <el-select @change="mixChange"  v-model="mix.value" placeholder="条件" size="small" class="middle">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                    <el-input v-show="mix.value == 1 " size="small"  v-model="search.name" :placeholder="'请输入姓名'"></el-input>
                    <el-input v-show="mix.value == 2 " size="small"  v-model="search.phone" :placeholder="'请输入手机'"></el-input>
                    <el-input v-show="mix.value == 3 " size="small"  v-model="search.certNo" :placeholder="'请输入身份证'"></el-input>
                    <el-form-item label="授信金额">
                        <el-input @blur="moneyChange" size="small" class="money" v-model.lazy="search.creditAmtMinT" placeholder="金额"></el-input>
                        <span>-</span>
                        <el-input @blur="moneyChange" size="small" class="money" v-model.lazy="search.creditAmtMaxT" placeholder="金额"></el-input>
                    </el-form-item>
                    <el-form-item label="授信余额">
                        <el-input @blur="moneyChange" size="small" class="money" v-model.lazy="search.remainedAmtMinT" placeholder="金额"></el-input>
                        <span>-</span>
                        <el-input @blur="moneyChange" size="small" class="money" v-model.lazy="search.remainedAmtMaxT" placeholder="金额"></el-input>
                    </el-form-item>
                    <el-form-item label="审核状态">
                        <el-select size="small" class="middle" v-model="search.creditCheckStatus" placeholder="审核状态">
                            <el-option :label="'全部'" :value="null"></el-option>
                            <el-option :label="'已处理'" value="0"></el-option>
                            <el-option :label="'已失败'" value="1"></el-option>
                            <el-option :label="'处理中'" value="2"></el-option>
                        </el-select>
                    </el-form-item>
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
                    <el-form-item label="授信时间">
                        <el-date-picker
                                editable="false"
                                class="date"
                                size="small"
                                v-model="search.startDateMinT"
                                type="date"
                                placeholder="开始日期时间">
                        </el-date-picker>
                        <el-date-picker
                                editable="false"
                                class="date"
                                size="small"
                                v-model="search.startDateMaxT"
                                type="date"
                                placeholder="截至日期时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="到期时间">
                        <el-date-picker
                                editable="false"
                                class="date"
                                size="small"
                                v-model="search.endDateMinT"
                                type="date"
                                placeholder="选择日期时间">
                        </el-date-picker>
                        <el-date-picker
                                editable="false"
                                class="date"
                                size="small"
                                v-model="search.endDateMaxT"
                                type="date"
                                placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="有效状态">
                        <el-select size="small" class="short" v-model="search.status" placeholder="请选择条件">
                            <el-option :label="'全部'" :value="null"></el-option>
                            <el-option :label="'正常'" value="0"></el-option>
                            <el-option :label="'失效'" value="1"></el-option>
                        </el-select>
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
                    <div class="item-box">
                        <el-button @click.native="doReset" size="small" type="primary">重置</el-button>
                        <el-button @click.native="doSearchHandler" size="small" type="primary">查询</el-button>
                    </div>
                </el-form>
            </div>
            <div class="result-box">
                <div class="totals pull-left">
                    <label>授信总金额:</label>
                    <span>{{statistics.creditAmountTotal | moneyFormat}}</span>
                    <label>授信总余额:</label>
                    <span>{{statistics.creditBalanceTotal | moneyFormat}}</span>
                    <label>授信到期笔数:</label>
                    <span>{{ statistics.expireCount}}</span>
                    <label>授信笔数:</label>
                    <span>{{statistics.creditCount}}</span>
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
                        label="姓名"
                        width="100"
                        >
                    <template scope="scope">
                        <span>{{ scope.row.name | nameFormat }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="phone"
                        align="center"
                        label="手机号"
                        min-width="120"
                        >
                </el-table-column>
                <el-table-column
                        prop="certNumber"
                        label="身份证号"
                        align="center"
                        min-width="180"
                        >
                </el-table-column>
                <el-table-column
                        label="授信金额"
                        align="center"
                        width="120"
                        >
                    <template scope="scope">
                        <span>{{ scope.row.creditAmount | moneyFormat }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="授信余额"
                        align="center"
                        width="120"
                >
                    <template scope="scope">
                        <span>{{ scope.row.creditBalance | moneyFormat }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="已用授信"
                        align="center"
                        width="120"
                >
                    <template scope="scope">
                        <span>{{ usedCredit(scope.row.creditAmount,scope.row.creditBalance) | moneyFormat }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="授信时间"
                        width="120"
                        >
                    <template scope="scope">
                        <span>{{ scope.row.startDate | dateFormat }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="授信到期时间"
                        width="120"
                        >
                    <template scope="scope">
                        <span>{{ scope.row.endDate | dateFormat }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="状态(审核)"
                        width="120"
                        >
                    <template scope="scope">
                        <span>{{ scope.row.creditCheckStatus | creditCheckStatus }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="有效(是/否)"
                        width="120"
                        >
                    <template scope="scope">
                        <span>{{ scope.row.status | creditStatus }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="主营销人"
                        width="120"
                >
                    <template scope="scope">
                        <span>{{scope.row.mainMarketerName | nameFormat}}</span>
                    </template>
                </el-table-column>
                <!--<el-table-column-->
                        <!--align="center"-->
                        <!--label="主营销金额"-->
                        <!--width="100">-->
                    <!--<template scope="scope">-->
                        <!--<span>{{ scope.row.mainCreditAmt | moneyFormat }}</span>-->
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
    import auth                 from    'src/js/auth'
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
        {
            value: '3',
            label: '身份证'
    }]
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
                    remainedAmtMin:'',
                    remainedAmtMax:'',
                    remainedAmtMinT:'',
                    remainedAmtMaxT:'',
                    //授信时间
                    startDateMin:'',
                    startDateMinT:'',
                    startDateMax:'',
                    startDateMaxT:'',
                    endDateMin:'',
                    endDateMinT:'',
                    endDateMax:'',
                    endDateMaxT:'',
                    status:'0',
                    creditCheckStatus:null,
                    accountManager:null,
                    deadlineTimeT:null,
                    deadlineTime:null,
                },
                staffList: Staff.list,
                staffLoading:false,
                value7: '',
                total:0,
                pageNum:1,
                loading:false,
                //                    截止日期
                deadlineTimeT:null,
                deadlineTime:null,
                funcId:'R050700',
            }
        },
        watch: {
            "search.startDateMinT": function (val) {
                this.search.startDateMin = val ? new Date(val).getTime() : null
            },
            "search.startDateMaxT": function (val) {
                this.search.startDateMax = val ? (new Date(val).getTime()+86400000-1) : null
            },
            "search.endDateMinT": function (val) {
                this.search.endDateMin = val ? new Date(val).getTime() : null
            },
            "search.endDateMaxT": function (val) {
                this.search.endDateMax = val ? (new Date(val).getTime()+86400000-1) : null
            },
            "search.creditAmtMinT": function (val) {
                this.search.creditAmtMin = val ? accounting.format(val, 0, '') : null
            },
            "search.creditAmtMaxT": function (val) {
                this.search.creditAmtMax = val ? accounting.format(val, 0, '') : null
            },
            "search.remainedAmtMinT": function (val) {
                this.search.remainedAmtMin = val ? accounting.format(val, 0, '') : null
            },
            "search.remainedAmtMaxT": function (val) {
                this.search.remainedAmtMax = val ? accounting.format(val, 0, '') : null
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

                if(search.remainedAmtMinT)
                    search.remainedAmtMinT = accounting.format(search.remainedAmtMin,2,',')

                if(search.remainedAmtMaxT)
                    search.remainedAmtMaxT = accounting.format(search.remainedAmtMaxT,2,',')
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
            usedCredit(a,b){
                let res = parseFloat(a) - parseFloat(b)
                return res
            },
            filterMethod(query){
                if (!!query) {
                    this.staffLoading = true
                    if(!!query.match(/[\u4e00-\u9fa5]/)){
                        this.staffLoading = false
                        this.staffList = Staff.findByName(Staff.list,query)
                    }else if(!!query.match(/^[1]\d*/)){
//                        console.log("手机")
                        this.staffLoading = false
                        this.manageList = Staff.findByPhone(Staff.list,query)
                    }else if(!!query.match(/^\d/)){
                        this.staffLoading = false
                        this.staffList = Staff.findByNo(Staff.list,query)
                    }else if(!!query.match(/[a-zA-Z]/)){
//                        console.log('字母')
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
                let url         = Vue.agent.root + '/statistics/credit/search'
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
                    timeout:30000
                }).then(res => {
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
                let url         = Vue.agent.root + '/statistics/credit/excel'

                let fileName    = "授信查询" + moment().format("YYYY-MM-DD hh:mm:ss")
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
    @import 'src/scss/pages/market/credit.scss';
</style>