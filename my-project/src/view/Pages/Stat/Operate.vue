<template>
    <div class="stat-loan">
        <div class="stat-box">
            <div class="search-box">
                <el-form   :model="formInline" label-width="66px" >
                    <el-form-item label="开始时间">
                        <el-date-picker
                                class="time"
                                size="small"
                                v-model="search.startTimeT"
                                type="date"
                                placeholder="开始日期时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="截至时间">
                        <el-date-picker
                                class="time"
                                size="small"
                                v-model="search.endTimeT"
                                type="date"
                                placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>
                    <div class="item-box">
                        <el-button size="small" @click.native="doReset" type="primary">重置</el-button>
                        <el-button @click.native="doSearch" size="small" type="primary">查询</el-button>
                    </div>
                </el-form>
            </div>
            <div class="result-box">
                <div class="totals">
                    <p>
                        <label>授信净增金额:</label>
                        <span class="money">{{statistics.netCreditAmountTotal | moneyFormat}}</span>
                        <label>授信净增人数</label>
                        <span class="money">{{statistics.netCreditCount}}</span>
                    </p>
                    <p>
                        <label>借款净增金额</label>
                        <span class="money">{{statistics.netLoanAmountTotal | moneyFormat}}</span>
                        <label>借款净增人数</label>
                        <span class="money">{{statistics.netLoanCount}}</span>
                    </p>
                    <p>
                        <label>借款流失金额</label>
                        <span class="money">{{statistics.loanLossAmountTotal | moneyFormat}}</span>
                        <label>借款流失人数</label>
                        <span class="money">{{statistics.loanLossCount}}</span>
                    </p>
                    <p>
                        <label>投资净增金额</label>
                        <span class="money">{{statistics.netInvestmentAmountTotal | moneyFormat}}</span>
                        <label>投资净增人数</label>
                        <span class="money">{{statistics.netLoanCount}}</span>
                    </p>
                    <p>
                        <label>投资流失金额</label>
                        <span class="money">{{statistics.investmentLossAmountTotal | moneyFormat}}</span>
                        <label>投资流失人数</label>
                        <span class="money">{{statistics.investmentLossCount}}</span>
                    </p>
                </div>
            </div>
        </div>
        <div class="data-wrp">

        </div>
    </div>

</template>

<script>
    import leverBar         from    '../../Com/LeverBar.vue'
    import list             from    '../../../../src/data/loan/list'
    import Staff            from    '../../../data/loan/staff'
    import Util             from    'src/js/util'

    var divide = function (val) {
        let [n,d] = val.replace(/[^(\.|\d)]/g,'').split('.')
        var res = n.replace(/^(\d{1,3})((?:\d{3})*)$/,function (b,c,d) {
            console.log(' b:'+b,' c:'+c,' d:'+d)
            return c + d.replace(/(\d{3})/g,",$&")
        })
        if(!!d)
            res += ('.' + d.slice(0,2))
        return res
    }


    let ops =[{
        value: '0',
        label: '合同号'
    }, {
        value: '1',
        label: '借款人'
    }, {
        value: '2',
        label: '手机号'
    }, {
        value: '3',
        label: '身份证号'
    }]
    export default {
        data() {
            return {
                list: list,
                options: ops,
                value: '',
                mix:{
                    //混合选项 合同 身份证 手机号
                    value:'0',
                    placeholder:'请输入合同号',
                    input:''
                },
                statistics:{

                },
                search:{
                    startTime:null,
                    startTimeT:null,
                    endTime:null,
                    endTimeT:null,
                },
                staffList: Staff.list,
                staffLoading:false,
                funcId:'R020700',
            }
        },
        watch: {
            "search.startTimeT": function (val) {
                this.search.startTime = val ? new Date(val).getTime() : null
            },
            "search.endTimeT": function (val) {
                this.search.endTime = val ? (new Date(val).getTime()+86400000-1) : null
            }
        },
        methods: {

            doSearch(){
                let that        = this
                let url         = Vue.agent.root +'/statistics/marketingTotal/total'
                var reqData     = {
                    funcId:that.funcId
                }
                Object.assign(reqData,that.search)
                Util.dataClear(reqData)

                if(Util.isEmpty(reqData)){
                    this.$notify({
                        title: '提示',
                        message: '请选择时间范围',
                        type: 'warning'
                    });
                    return false
                }

                that.$http.get(url,{params:reqData}).then(function (res) {
                    if(res.body.code == "200") {
                        let data            = res.body.data
                        Object.assign(that,data)
                    }
                });
            },
            doReset(){
                let search = this.search
                Util.dataReset(search)
            },
        },
        mounted:function () {
        },
        components:{
            leverBar
        }
    }
</script>
<style lang="scss">
    @import 'src/scss/pages/stat/loan.scss';
</style>