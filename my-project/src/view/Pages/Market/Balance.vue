<template>
    <div class="stat-loan">
        <div class="stat-box">
            <div class="search-box">
                <el-form   :model="formInline" label-width="66px" >
                    <el-select @change="mixChange"  v-model="mix.value" placeholder="条件" size="small" class="middle">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                    <el-input v-show="mix.value == 0 " size="small"  v-model="search.contractNumber" :placeholder="'请输入合同号'"></el-input>
                    <el-input v-show="mix.value == 1 " size="small"  v-model="search.name" :placeholder="'请输入姓名'"></el-input>
                    <el-input v-show="mix.value == 2 " size="small"  v-model="search.phone" :placeholder="'请输入手机'"></el-input>
                    <el-input v-show="mix.value == 3 " size="small"  v-model="search.certNumber" :placeholder="'请输入身份证'"></el-input>

                    <!--<el-form-item label="更新日期">-->
                        <!--<el-date-picker-->
                                <!--class="date"-->
                                <!--size="small"-->
                                <!--v-model="search.updateStartTimeT"-->
                                <!--type="date"-->
                                <!--placeholder="开始日期时间">-->
                        <!--</el-date-picker>-->
                        <!--<el-date-picker-->
                                <!--class="date"-->
                                <!--size="small"-->
                                <!--v-model="search.updateEndTimeT"-->
                                <!--type="date"-->
                                <!--placeholder="截至日期时间">-->
                        <!--</el-date-picker>-->

                    <!--</el-form-item>-->
                    <!--v-if="checkRole()"-->
                    <el-form-item  label="客户经理">
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

        <div  class="table">
            <el-table
                    v-loading="loading"
                    :data="list"
                    :stripe="true"
                    border
                    style="width: 100%">
                <el-table-column
                        prop="userId"
                        align="center"
                        label="用户编号"
                ></el-table-column>
                <el-table-column
                        prop="name"
                        align="center"
                        label="姓名"
                        >
                </el-table-column>
                <el-table-column
                        prop="phone"
                        label="手机号"
                        align="center"
                        >
                </el-table-column>
                <el-table-column
                        prop="certNumber"
                        align="center"
                        label="身份证号码"
                        >
                </el-table-column>
                <el-table-column
                        prop="balance"
                        align="center"
                        label="账号余额"
                >
                </el-table-column>
                <el-table-column
                        align="center"
                        label="更新时间"
                >
                    <template scope="scope">
                        <span>{{ scope.row.updateTime | dateTimeFormat }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="mainMarketerName"
                        align="center"
                        label="主营销人"
                >
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
    import leverBar         from    '../../Com/LeverBar.vue'
    import Util             from    'src/js/util'
    import Staff            from    '../../../data/loan/staff'
    import auth             from    'src/js/auth'

    let wrpEle;
    let ops =[
        {
            value: '0',
            label: '合同号'
        },
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
                value: '',
                options: ops,
                value: '',
                mix:{
                    //混合选项 合同 身份证 手机号
                    value:'1',
                },
                totals:{
                    prePrincipalAmtTotal:0
                },
                search:{
                    name:'',
                    phone:'',
                    certNumber:'',
                    contractNumber:'',
                    accountManager:null
                },
                pageNum:1,
                pageSize:15,
                loading: false,
                staffList: Staff.list,
                staffLoading:false,
                funcId:'R050800',
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
            mixChange(val){
                let search = this.search
                search.contractNumber       = ''
                search.name                 = ''
                search.phone                = ''
                search.certNumber           = ''
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
                let url         = Vue.agent.root + '/statistics/userBalance/search'
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
                }).then(res => {
                    that.loading = false
                    if(res.body.code == "200") {
                        that.loading = false
                        let data            = res.body.data
                        Object.assign(that,data)
                    }
                },res=>{
                    that.loading = false
                });
            },
            doExport(){
                let that        = this
                let url         = Vue.agent.root + '/statistics/userBalance/excel'
                let fileName    = "余额查询" + moment().format("YYYY-MM-DD hh:mm:ss")
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

        },
        components:{
        }
    }
</script>
<style lang="scss">
    @import 'src/scss/pages/stat/remained.scss';
</style>