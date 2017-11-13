<template>
    <div class="print-wrp">
        <div class="data-wrp">
            <el-form ref="form" :model="form" label-width="0">
                <el-form-item>
                    <el-button @click="doPrint" type="primary">打印</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="print-zone">
            <template   v-for="item in list">
                <div class="page">
                    <el-form ref="form" :model="form">
                        <el-row>
                            <el-col :span="12">
                                <h3  class="title">安快金融对账单</h3>
                            </el-col>
                            <el-col :span="12">
                                <div class="grid-content bg-purple-light"></div>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="姓名:">
                                    <span>{{item.custName}}</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="用户号">
                                    <span>{{item.custId}}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="江西银行帐号:">
                                    <span>{{item.netBankCardNo}}</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="开户银行:">
                                    <span>{{item.netBankName}}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="绑定银行卡号:">
                                    <span>{{item.bankCardNo}}</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="绑定银行:">
                                    <span>{{item.bankName}}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="截至日期:">
                                    <span>{{item.delineateDate | dateFormat}}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="江西银行账户余额:">
                                    <span>{{item.netBankBalance | moneyFormat}}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row v-show="item.funds.length > 0">
                            <el-col :span="12">
                                <el-form-item label="平台投资总额:">
                                    <span>{{item.fundBalance | moneyFormat}}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row v-show="item.funds.length > 0">
                            <el-col :span="12">
                                <el-form-item label="投资明细:">
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <div v-show="item.funds.length > 0"  class="table">
                            <el-table
                                    :data="item.funds"
                                    :stripe="true"
                                    border
                                    style="width: 100%">
                                <el-table-column
                                        prop="contractId"
                                        align="center"
                                        label="合同号"
                                        min-width="120px"
                                ></el-table-column>
                                <el-table-column
                                        align="center"
                                        label="投资金额"
                                >
                                    <template scope="scope">
                                        <span>{{ scope.row.principal | moneyFormat }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        align="center"
                                        label="起息日期"
                                >
                                    <template scope="scope">
                                        <span>{{ scope.row.startDate | dateFormat }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        align="center"
                                        label="到期日期"
                                >
                                    <template scope="scope">
                                        <span>{{ scope.row.endDate | dateFormat }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        align="center"
                                        label="投资利率"
                                >
                                    <template scope="scope">
                                        {{scope.row.rate}}%
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        align="center"
                                        label="投资期限"
                                >
                                    <template scope="scope">
                                        {{scope.row.fundLimit}}天
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        align="center"
                                        label="结息方式"
                                >
                                    <template scope="scope">
                                        {{ scope.row.returnType | opsFormat(ops.interestType) }}
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                        <el-row v-show="item.funds.length > 0">
                            <el-col :span="12">
                                <el-form-item label="如有不明之处，请致电:400-88-96576。">
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row style="margin-top: 2rem" v-show="item.loans.length > 0" >
                            <el-col :span="12">
                                <el-form-item label="借款总额:">
                                    <span>{{item.loanBalance | moneyFormat}}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row v-show="item.loans.length > 0" >
                            <el-col :span="12">
                                <el-form-item label="借款明细:">
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <div v-show="item.loans.length > 0"  class="table">
                            <el-table
                                    :data="item.loans"
                                    :stripe="true"
                                    border
                                    style="width: 100%">
                                <el-table-column
                                        prop="contractId"
                                        align="center"
                                        label="合同号"
                                        min-width="120px"
                                ></el-table-column>
                                <el-table-column
                                        align="center"
                                        label="借款金额"
                                >
                                    <template scope="scope">
                                        <span>{{ scope.row.balance | moneyFormat }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        align="center"
                                        label="起息日期"
                                >
                                    <template scope="scope">
                                        <span>{{ scope.row.startDate | dateFormat }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        align="center"
                                        label="到期日期"
                                >
                                    <template scope="scope">
                                        <span>{{ scope.row.endDate | dateFormat }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        align="center"
                                        label="借款利率"
                                >
                                    <template scope="scope">
                                        {{scope.row.rate}}%
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        align="center"
                                        label="借款利率"
                                >
                                    <template scope="scope">
                                        {{scope.row.serviceRate}}%
                                    </template>
                                </el-table-column>

                                <el-table-column
                                        align="center"
                                        label="借款期限"
                                >
                                    <template scope="scope">
                                        {{scope.row.loanLimit}}天
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        align="center"
                                        label="结息方式"
                                >
                                    <template scope="scope">
                                        {{ scope.row.returnType | opsFormat(ops.interestType) }}
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                        <el-row v-show="item.loans.length > 0" >
                            <el-col :span="12">
                                <el-form-item label="如有不明之处，请致电:400-88-96576。">
                                </el-form-item>
                            </el-col>
                        </el-row>

                        <el-row>
                            <el-col :span="8" :offset="16">
                                <div style="text-align: center">
                                    <h3>浙江安快金融服务外包有限公司</h3>
                                    <h3>{{new Date() | dateFormat}}</h3>
                                </div>
                            </el-col>
                        </el-row>

                    </el-form>
                </div>
                <hr>
            </template>

    </div>
    </div>
</template>
<style lang="scss">

    @media print{
        .print {display:block;}
        .notPrint {display:none;}
        .Noprn,.data-wrp { DISPLAY: none }
        .page{
            page-break-after: always;
            page-break-inside: avoid;
            padding-bottom: 0;
        }
        hr{
            display: none;
        }
    }

    .title{
        font-size: 15px;
        font-weight: 600;
        padding-bottom: 1rem;
    }
    .page{
        padding: 4rem 4rem 0;
        padding-bottom: 4rem;
    }

    .print-zone{

        width: 1000px;
        margin: 0 auto;

        .el-form-item{
            margin-bottom: 0;
        }
    }
    .table table{
        font-size: 12px;
    }

    .el-form-item__label,.el-form-item__content{
        font-size: 13px;
    }
    .print-wrp{
        display: flex;
    }
    .data-wrp{
        top:4rem;
        position: fixed;
        padding: 1rem;
        .el-input{
            width: 100% !important;
        }
    }
    .mydiv{
    }
    td{
        text-align:left;
    }

    .fontsize{
        font-size:13px;
        font-family:Arial,"宋体";
    }
</style>
<script>

    import cache from 'src/js/cache'

    export default{
        data(){
            return{
                msg:'hello vue',
                form:{
                    contract:'',
                    borrowdate:'',
                    duedate:'',
                    money:'',
                    name:'',
                    bank:'',
                    account:''
                },
                ops:{
                    interestType:[]
                },
                list:cache.get('print')
            }
        },
        computed:{

        },
        methods:{
            doPrint(){
//                document.getElementById('print').style.display='none';
//                document.getElementById('summoney2').style.display='none';
                window.print();
            },
//            获取ops
            getOps(){
                let that        = this
                let opsUrl      = Vue.agent.root + '/dictionary/dict/querys'

                that.$http && that.$http.get(opsUrl,{params:{
                    names:"repayType,interestType",
                    funcId:that.funcId
                }}).then(function (res) {
                    if(res.body.code == "200") {
                        let data                     = res.body.data
                        that.ops.interestType           = data.interestTypeOptions
//                        that.ops.loanRate            = data.loanRateOptions
//                        that.ops.costRate            = data.costRateOptions
//                        that.ops.approvalStatus      = data.approvalStatusOptions
//                        that.ops.assureType        = data.assureTypeOptions
//                        that.ops.stabilizeType        = data.stabilizeTypeOptions

                    }
                });
            },
        },
        components:{

        },
        created:function () {
            let that        = this
            that.getOps()
        },

    }
</script>
