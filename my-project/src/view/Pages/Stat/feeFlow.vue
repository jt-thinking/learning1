<template>
    <div class="stat-fee-flow">
        <div class="stat-box">
            <div class="search-box">
                <el-form   :model="formInline" label-width="66px" >
                    <el-form-item label="更新日期" label-width="80px">
                        <el-date-picker
                                class="time"
                                size="small"
                                v-model="search.updateStartTimeT"
                                type="date"
                                placeholder="开始日期时间">
                        </el-date-picker>
                        <el-date-picker
                                class="time"
                                size="small"
                                v-model="search.updateEndTimeT"
                                type="date"
                                placeholder="截至日期时间">
                        </el-date-picker>
                    </el-form-item>

                    <el-form-item label-width="30px" >
                        <el-button @click.native="doReset" size="small" type="primary">重置</el-button>
                        <el-button @click.native="doSearchHandler" size="small" type="primary">查询</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="result-box">
                <div class="totals pull-left">

                </div>


                <div class="pull-right">
                    <!--<a href="#">-->
                        <!--<span>导出</span>-->
                        <!--<i class="fa fa-download" aria-hidden="true"></i>-->
                    <!--</a>-->
                    <a @click="doExport" href="javascript:(0)">
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
                        prop="contractNumber"
                        align="center"
                        label="合同号"
                        >
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="借款人"
                        align="center"
                        >
                </el-table-column>
                <el-table-column
                        prop="phone"
                        align="center"
                        label="手机号"
                        >
                </el-table-column>
                <el-table-column
                        prop="amount"
                        align="center"
                        label="金额">
                    <template scope="scope">
                        <span>{{ scope.row.amount | moneyFormat }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="创建时间"
                       >
                    <template scope="scope">
                        <span>{{ scope.row.createAt | dateTimeFormat }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="更新时间"
                        >
                    <template scope="scope">
                        <span>{{ scope.row.updateAt | dateTimeFormat }}</span>
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
    import Util             from    'src/js/util'

    export default {
        data() {
            return {
                list: [],
                value: '',
                totals:{
                    prePrincipalAmtTotal:0
                },
                search:{
                    updateStartTimeT:null,
                    updateStartTime:null,
                    updateEndTimeT:null,
                    updateEndTime:null,
                },
                funcId:'R020800',
                loading: false,
                pageNum:1
            }
        },
        watch: {
            "search.updateStartTimeT": function (val) {
                this.search.updateStartTime = val ? new Date(val).getTime() : null
            },
            "search.updateEndTimeT": function (val) {
                this.search.updateEndTime = val ? (new Date(val).getTime()+86400000-1) : null
            },
        },
        methods: {
            doSearch(){
                let that        = this
                let url         = Vue.agent.root + '/feeFlow/search'
                var reqData     = {
                    pageSize:15,
                    pageNum:that.pageNum,
                    funcId:that.funcId
                }
                that.loading = true
                Object.assign(reqData,that.search)
                Util.dataClear(reqData)

                that.$http.get(url,{params:reqData}).then(function (res) {
                    if(res.body.code == "200") {
                        that.loading = false
                        let data            = res.body.data
                        Object.assign(that,data)
                    }
                });
            },
            doSearchHandler(){
                let that     = this
                if(that.pageNum == 1){
                    that.doSearch()
                }else{
                    that.pageNum = 1
                }
            },
            doExport(){
                let that        = this
                let url         = Vue.agent.root + '/feeFlow/excel'
                let fileName    = "手续费流水" + moment().format("YYYY-MM-DD hh:mm:ss")
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
        mounted:function () {

        },
        components:{
        }
    }
</script>
<style lang="scss">
    @import 'src/scss/pages/stat/feeFlow.scss';
</style>