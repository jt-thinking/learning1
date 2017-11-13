<template>
    <div class="stat-loan">
        <el-tabs v-model="tabActive" type="card" @tab-click="creditTabChangeHandler">
            <el-tab-pane label="变更" name="a">
                <div class="stat-box">
                    <div class="search-box">
                        <el-form   :model="formInline" >
                            <el-form-item  label="客户名称:" label-width="100px" >
                                <el-input  size="small"  v-model="search.custName" :placeholder="'请输入客户名称'"></el-input>
                            </el-form-item>
                            <el-form-item label-width="100px"   label="客户经理">
                                <el-select class="lang" size="small" filterable
                                           clearable
                                           :filter-method="filterMethod"
                                           :loading="staffLoading"
                                           @visible-change="expandHandler"
                                           v-model="search.oldManagerIds"
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
                                <el-button @click.native="doSearchHandler" size="small" type="primary">查询</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
                <div  class="table">
                    <el-table
                    v-loading="loading"
                    :data="list"
                    :stripe="true"
                    border
                    @selection-change="handleSelectionChange">
                    style="width: 100%">
                        <el-table-column
                                type="selection"
                                width="55">
                        </el-table-column>
                        <el-table-column
                        prop="custId"
                        align="center"
                        label="客户编号"
                        >
                        </el-table-column>
                        <el-table-column
                        prop="custName"
                        align="center"
                        label="客户名称"
                        >
                        </el-table-column>
                        <el-table-column
                        prop="certNo"
                        label="身份证号"
                        align="center"
                        >
                        </el-table-column>
                        <el-table-column
                        prop="mainMarketerName"
                        align="center"
                        label="社区经理"
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

                <div class="stat-box">
                    <div class="search-box">
                        <el-form :model="receive"  ref="transferForm" >
                            <el-form-item label-width="100px"   label="客户经理" prop="managerId" :rules="[
                                {required: true, message: '请选择客户经理'},
                            ]">
                                <el-select class="lang" size="small" filterable
                                           clearable
                                           :filter-method="manageFilterMethod"
                                           :loading="staffLoading"
                                           @visible-change="expandManageHandler"
                                           v-model="receive.managerId"
                                           placeholder="请选择">
                                    <el-option :label="'请选择'" :value="null"></el-option>
                                    <el-option-group
                                            v-for="group in allManager"
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
                                <el-button @click.native="doApplyTransportHandler('transferForm')" size="small" type="primary">移交选中</el-button>
                                <el-button @click.native="doApplyTransportAllHandler('transferForm')" size="small" type="primary">移交搜索集</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="变更记录" name="b">
                <div class="stat-box">
                    <div class="search-box">
                        <el-form   :model="search">
                            <el-form-item label-width="100px"   label="移交社区经理:">
                                <el-select class="lang" size="small" filterable
                                           :filter-method="filterMethod"
                                           :loading="staffLoading"
                                           @visible-change="expandHandler"
                                           v-model="search.oldMgId"
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
                            <el-form-item label-width="100px"   label="接收社区经理:">
                                <el-select class="lang" size="small" filterable
                                           :filter-method="filterMethod"
                                           :loading="staffLoading"
                                           @visible-change="expandHandler"
                                           v-model="search.newMgId"
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
                            <el-form-item label-width="100px" label="移交时间:">
                                <el-date-picker
                                        class="date"
                                        style="width:140px"
                                        size="small"
                                        v-model="search.minCreateTimeT"
                                        type="date"
                                        placeholder="起始日期">
                                </el-date-picker>
                                <el-date-picker
                                        style="width:140px"
                                        size="small"
                                        class="date"
                                        v-model="search.maxCreateTimeT"
                                        type="date"
                                        placeholder="结束日期">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label-width="30px" >
                                <el-button @click.native="historySearchHandler" size="small" type="primary">查询</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
                <div  class="table">
                    <el-table
                            v-loading="history.loading"
                            :data="history.list"
                            :stripe="true"
                            border
                            style="width: 100%">
                        <el-table-column
                                prop="oldMgName"
                                align="center"
                                label="移交社区经理"
                        ></el-table-column>
                        <el-table-column
                                prop="newMgName"
                                align="center"
                                label="接受社区经理"
                        ></el-table-column>

                        <!--<el-table-column-->
                                <!--prop="custName"-->
                                <!--align="center"-->
                                <!--label="客户名称"-->
                        <!--&gt;-->
                        <!--</el-table-column>-->
                        <el-table-column
                                align="center"
                                label="移交时间"
                        >
                            <template scope="scope">
                                <span>{{ scope.row.createTime | dateTimeFormat }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="businessType"
                                label="变更类型"
                                align="center"
                        >
                            <template scope="scope">
                                <span>{{ scope.row.businessType | opsFormat(ops.approvalType) }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                align="center"
                                label="审核状态"
                        >
                            <template scope="scope">
                                <span>{{ scope.row.status | opsFormat(ops.approvalStatus) }}</span>
                            </template>

                        </el-table-column>
                        <el-table-column
                                prop="accepterName"
                                align="center"
                                label="审批人"
                        >
                        </el-table-column>

                    </el-table>
                </div>
                <div class="footer-box">
                    <span v-if="startRow" class="pull-left">显示{{startRow}}-{{endRow}} 总共有{{total}}条目</span>
                    <div class="pagination pull-right">
                        <el-pagination
                                layout="prev, pager, next"
                                @current-change="historyHandleCurrentChange"
                                :page-size="history.pageSize"
                                :current-page.sync="history.pageNum"
                                :total="history.total">
                        </el-pagination>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>

</template>

<script>
    import Util             from    'src/js/util'
    import auth             from    'src/js/auth'
    import Staff            from    '../../../data/loan/staff'
    import Manager          from    '../../../data/loan/manager'
    export default {
        data() {
            return {
                list: [],
                value: '',
                value: '',
                totals:{
                    prePrincipalAmtTotal:0
                },
                search:{
                    custName:'',
                    oldManagerIds:null,
                    oldMgId:null,
                    newMgId:null,
                    minCreateTimeT:null,
                    minCreateTime:null,
                    maxCreateTimeT:null,
                    maxCreateTime:null,
                },
                receive:{
                    managerId:null
                },
                history:{
                    list:[],
                    pageNum:1,
                    pageSize:15,
                    total:null,
                    loading:false
                },
                ops:{
                    approvalType:[],
                    approvalStatus:[]
                },
                allManager:Manager.list,
                staffList: Staff.list,
                tabActive:'a',
                pageNum:1,
                pageSize:15,
                loading: false,
                staffLoading:false,
                multipleSelection:[],
                funcId:'R070700',
            }
        },
        watch: {
            "search.minCreateTimeT": function (val) {
                this.search.minCreateTime = val ? new Date(val).getTime() : null
            },
            "search.maxCreateTimeT": function (val) {
                this.search.maxCreateTime = val ? (new Date(val).getTime()+86400000-1) : null
            },
        },
        methods: {
//            tab切换
            creditTabChangeHandler(){
                let that = this
                that.doReset()
            },
//            重置
            doReset(){
                let search = this.search
                Util.dataReset(search)
            },
//            获取授信变更记录
            historySearchHandler(){
                let that = this
                if(that.history.pageNum == 1){
                    that.historySearch()
                }else{
                    that.history.pageNum = 1
                }
            },
            historySearch(){
                let that        = this
                let history     = that.history
                let url         = Vue.agent.root + '/customer/chg/transport/history'
                var reqData     = {
                    pageSize:history.pageSize,
                    pageNum:history.pageNum,
                    funcId:that.funcId
                }
                Object.assign(reqData,that.search)
                Util.dataClear(reqData)

                that.$http.get(url,{
                    params:reqData,
                }).then(res => {
                    if(res.body.code == "200") {
                        let data            = res.body.data
                        that.history        = data
                    }
                });
            },
            historyHandleCurrentChange(val) {
                let that = this
                if(that.history.loading == true){
                    that.$notify({title: '提示',message: '请勿频繁操作',type: 'warning'});
                }else{
                    that.history.pageNum = val
                    that.historySearch()
                }
            },

            handleSelectionChange(val) {
                this.multipleSelection = val;
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
                let url         = Vue.agent.root + '/customer/chg/transport/list'
                var reqData     = {
                    pageSize:that.pageSize,
                    pageNum:that.pageNum,
                    funcId:that.funcId
                }
                Object.assign(reqData,that.search)
                Util.dataClear(reqData)

                that.$http.get(url,{
                    params:reqData
                }).then(res => {
                    if(res.body.code == "200") {
                        let data            = res.body.data
                        Object.assign(that,data)
                    }
                });
            },
            doApplyTransportHandler(form){
                let that = this
                let custIds = []
                that.multipleSelection.forEach(v => {
                    custIds.push(v.custId)
                })
                that.$refs[form].validate((valid) => {
                    if (valid) {
                        that.applyTransport(custIds.join(','))
                    } else {
                        return false;
                    }
                });
            },
            applyTransport(custIds){
                let that        = this
                let url         = Vue.agent.root + '/customer/chg/transport'
                let receive     = that.receive
                var reqData     = {
                    custIds:custIds,
                    newManagerId:receive.managerId,
                    funcId:that.funcId
                }
//                Object.assign(reqData,that.search)
//                Util.dataClear(reqData)

                that.$http.post(url,reqData).then(res => {
                    if(res.body.code == "200") {
                        that.$notify({title: '提示',message: '操作成功',type: 'success'});
                    }
                });
            },
//            移交搜索集
            doApplyTransportAllHandler(form){
                let that = this
                that.$refs[form].validate((valid) => {
                    if (valid) {
                        that.applyTransportAll()
                    } else {
                        return false;
                    }
                });

            },
            applyTransportAll(){
                let that        = this
                let url         = Vue.agent.root + '/customer/chg/transport'
                let search      = that.search
                let receive     = that.receive
                var reqData     = {
                    newManagerId:receive.managerId,
                    funcId:that.funcId,
                    allFlag:true,
                }
                Object.assign(reqData,that.search)
                Util.dataClear(reqData)

                that.$http.post(url,reqData).then(res => {
                    if(res.body.code == "200") {
                        that.$notify({title: '提示',message: '操作成功',type: 'success'});
                    }
                });
            },
            handleCurrentChange(val) {
                let that = this
                if(that.loading == true){
                    that.$notify({title: '提示',message: '请勿频繁操作',type: 'warning'});
                }else{
                    that.pageNum = val
                    that.doSearch()
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
                } else {
                    this.staffLoading = true;
                    this.staffList = []
                    setTimeout(()=>{
                        this.staffLoading = false;
                        this.staffList = Array.from(Staff.list)
                    })

                }
            },
            manageFilterMethod(query){
                if (!!query) {
                    this.staffLoading = true
                    if(!!query.match(/[\u4e00-\u9fa5]/)){
                        this.staffLoading = false
                        this.allManager = Manager.findByName(query)
//                        console.log('test:',Staff.list)
                    }else if(!!query.match(/^[1]\d*/)){
                        console.log("手机")
                        this.staffLoading = false
                        this.allManager = Manager.findByPhone(query)
                    }else if(!!query.match(/^\d/)){
                        this.staffLoading = false
                        this.staffList = Manager.findByNo(query)
                    }else if(!!query.match(/[a-zA-Z]/)){
                        console.log('字母')
                        this.staffLoading = false
                        this.allManager = Manager.findByInitial(query.toUpperCase())
                    }else{
                        this.staffLoading = false;

                    }
                } else {
                    this.staffLoading = true;
                    this.staffList = []
                    setTimeout(()=>{
                        this.staffLoading = false;
                        this.allManager = Array.from(Manager.list)
                    })

                }
            },
            expandHandler(val){
                if(val == true){
                    this.staffList = Staff.list
                }
            },
            expandManageHandler(val){
                if(val == true){
                    this.allManager = Manager.list
                }
            },
            getManageUser(){
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
            getAllManageUser(){
                let that        = this
                let url         = Vue.agent.root + '/manageUser/dimission/list'

                var reqData     = {
                    funcId:that.funcId
                }

                that.$http && that.$http.get(url,{params:reqData}).then(function (res) {
                    if(res.body.code == "200") {
                        Manager.list      = res.body.data

//                    console.log(Staff.list)
                        that.allManager = Manager.list

                    }
                });
            },


            //获取ops
            getOps(){
                let that        = this
                let opsUrl      = Vue.agent.root + '/dictionary/dict/querys'

                that.$http && that.$http.get(opsUrl,{params:{
                    names:"approvalType,approvalStatus",
                    funcId:that.funcId
                }}).then(function (res) {
                    if(res.body.code == "200") {
                        let data                     = res.body.data
                        that.ops.approvalType        = data.approvalTypeOptions
                        that.ops.approvalStatus      = data.approvalStatusOptions

                    }
                });
            },
        },
        created:function () {
            let that        = this
            that.getManageUser()
            that.getAllManageUser()
            that.getOps()
        },
        mounted:function () {

        },
        components:{
        }
    }
</script>
<style lang="scss">
    @import 'src/scss/pages/special.scss';
</style>