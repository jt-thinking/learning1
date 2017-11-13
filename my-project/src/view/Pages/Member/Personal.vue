<template>
    <div class="user-org">
        <div class="stat-box">
            <div  class="search-box">
                <el-form   :model="formInline">
                    <el-form-item label="客户姓名" label-width="80px">
                        <el-input  size="small"  v-model="search.custName" :placeholder="'请输入姓名'"></el-input>
                    </el-form-item>
                    <el-form-item label="是否黑名单" label-width="90px">
                        <el-select size="small" v-model="search.isBlack" placeholder="请选择">
                            <el-option  label="全部" :value="null"></el-option>
                            <el-option  label="是" value="1"></el-option>
                            <el-option  label="否" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否信贷客户" label-width="100px">
                        <el-select size="small" v-model="search.isLoan" placeholder="请选择">
                            <el-option  label="全部" :value="null"></el-option>
                            <el-option  label="是" value="1"></el-option>
                            <el-option  label="否" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <div class="item-box">
                        <el-button @click.native="doSearchHandler" size="small" type="primary">查询</el-button>
                        <el-button @click.native="showAdd" size="small" type="primary">新建</el-button>
                        <el-button @click.native="showImportHandler" size="small" type="primary">客户引入</el-button>
                    </div>
                </el-form>
            </div>
        </div>
        <div class="table">
            <el-table
                    v-loading.body="loading"
                    :data="list"
                    :stripe="true"
                    border
                    style="width: 100%">

                <el-table-column  align="center" prop="custId"   label="客户编号" min-width="140"></el-table-column>
                <el-table-column  align="center" prop="custName" label="客户名称" min-width="150"></el-table-column>
                <el-table-column  align="center" label="是否黑名单" min-width="120">
                    <template scope="scope">
                        <span>{{ scope.row.isBlack | isBlackFormat }}</span>
                    </template>
                </el-table-column>
                <el-table-column  align="center" label="是否信贷客户" min-width="140">
                    <template scope="scope">
                        <span>{{ scope.row.isLoan | isLoanFormat }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="type"
                        align="center"
                        label="身份证号"
                        min-width="140"
                        >
                    <template scope="scope">
                        <span>{{ scope.row.certNo }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="type"
                        align="center"
                        label="注册号码"
                        min-width="120"
                >
                    <template scope="scope">
                        <span>{{ scope.row.registerPhone }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="操作"
                        min-width="220"
                        fixed="right"
                >
                    <template scope="scope">

                        <el-button @click.native="showEditHandler(scope)" size="small">编辑</el-button>
                        <el-button @click.native="deleteHandler(scope)" size="small">删除</el-button>
                        <el-button @click.native="showBlackListHandler(scope)" size="small">加入黑名单</el-button>
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
                        :total="total">
                </el-pagination>
            </div>
        </div>
        <!--新建客户-->
        <el-dialog title="新建客户" class="org-dialog" :visible.sync="visible.quickAdd" size="tiny" >
            <el-form :model="person" :rules="personRules" ref="person" label-width="100px">
                <el-form-item label="客户名称" prop="custName">
                    <el-input  v-model="person.custName"  placeholder="请输入客户名称"></el-input>
                </el-form-item>
                <el-form-item label="身份证号" prop="certNo">
                    <el-input maxlength="18" v-model="person.certNo" placeholder="请输入身份证号"></el-input>
                </el-form-item>
                <el-form-item label="确认证件号" prop="checkCertNo">
                    <el-input maxlength="18"  v-model="person.certNoRepeat" placeholder="请确认证件号"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button class="pull-left" @click.native="visible.quickAdd = false">取 消</el-button>
                <el-button type="primary" @click.native="doQuickAddHandler('person')">确 认</el-button>
            </div>
        </el-dialog>
        <!--加入黑名单-->
        <el-dialog title="黑名单" class="org-dialog" :visible.sync="visible.blacklist" size="tiny" >
            <!--:rules="personRules" ref="person"-->
            <el-form :model="blackList"  label-width="100px">
                <el-form-item label="客户名称" prop="custName">
                    <el-input v-model="blackList.custName"  placeholder="请输入客户名称"></el-input>
                </el-form-item>
                <el-form-item label="身份证号" prop="certNo">
                    <el-input  v-model="blackList.certNo" placeholder="请输入身份证号"></el-input>
                </el-form-item>
                <el-form-item label="加入原因" >
                    <el-input
                            type="textarea"
                            :autosize="{ minRows: 4, maxRows: 5}"
                            placeholder="请输入内容"
                            v-model="blackList.reason">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button class="pull-left" @click.native="visible.blacklist = false">取 消</el-button>
                <el-button type="primary" @click.native="doJoinBlackListHandler">加 入</el-button>
            </div>
        </el-dialog>

        <!--客户引入-->
        <el-dialog title="引入客户" class="org-dialog" :visible.sync="visible.introduce" size="large" >
            <div  class="search-box">
                <el-form   :model="introduce.search">
                    <el-form-item label="手机号:" label-width="80px">
                        <el-input  size="small"  v-model="introduce.search.phoneNo" placeholder="请输入手机号"></el-input>
                    </el-form-item>
                    <el-form-item label="证件号:" label-width="80px">
                        <el-input  size="small"  v-model="introduce.search.certNo" placeholder="请输入证件号"></el-input>
                    </el-form-item>

                    <div class="item-box">
                        <el-button @click.native="doIntroduceSearchHandler" size="small" type="primary">查询</el-button>
                    </div>
                </el-form>
            </div>
            <div class="table">
                <el-table
                        v-loading.body="loading"
                        :data="introduce.list"
                        :stripe="true"
                        border
                        style="width: 100%">

                    <el-table-column  align="center" prop="custId"   label="客户编号" min-width="140"></el-table-column>
                    <el-table-column  align="center" prop="custName" label="客户名称" min-width="150"></el-table-column>
                    <el-table-column  align="center" label="是否黑名单" min-width="120">
                        <template scope="scope">
                            <span>{{ scope.row.isBlack | isBlackFormat }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column  align="center" label="是否信贷客户" min-width="140">
                        <template scope="scope">
                            <span>{{ scope.row.isLoan | isLoanFormat }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="type"
                            align="center"
                            label="身份证号"
                            min-width="140"
                    >
                        <template scope="scope">
                            <span>{{ scope.row.certNo }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="操作"
                            min-width="220"
                    >
                        <template scope="scope">
                            <el-button @click.native="doIntroduceHandler(scope)" size="small">引入</el-button>
                        </template>
                    </el-table-column>

                </el-table>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button class="pull-left" @click.native="visible.introduce = false">取 消</el-button>
                <el-button type="primary" @click.native="doQuickAddHandler('person')">确 认</el-button>
            </div>
        </el-dialog>

        <user-info :editable="true" :opened.sync="visible"  :custId.sync="current.custId"></user-info>


    </div>

</template>

<script>
    import Staff                from    '../../../data/loan/staff'
    import Util                 from    '../../../js/util'
    import auth                 from    '../../../js/auth'
    import UserInfo             from    '../../Com/UserInfo.vue'

    let list = [

    ]
    let current


    export default {
        data() {

            var validateCertNo = (rule, value, callback) => {
                if (!this.person.certNoRepeat) {
                    callback(new Error('请再次输入证件号'));
                }else if(this.person.certNoRepeat.length != 18) {
                    callback(new Error('请输入18位证件号'));
                }else if (this.person.certNoRepeat != this.person.certNo) {
                    callback(new Error('两次输入证件号不一致!'));
                } else {
                    callback();
                }
            };

            return {
                list: list,
                visible:false,
                v:true,
                person:{
                    custName:null,
                    certNo:null,
                    certNoRepeat:null,
                },
                title:'',
                action:'',
                search:{
                    isBlack:null,
                    custName:null,
                    isLoan:null
                },
                introduce:{
                  list:[],
                  search:{
                      certNo:null,
                      phoneNo:null
                  }
                },
                visible:{
                    quickAdd:false,
                    openUser:false,
                    blacklist:false,
                    relationPerson:false,
                    introduce:false,
                },
                current:{
                    custId:null
                },
//                黑名单
                blackList:{
                    custId:null,
                    reason:null,
                    custNo:null,
                    certNo:null,
                    custName:null
                },
                //关联信息数组
                staffList: Staff.list,
                staffLoading:false,
                total:0,
                pageSize:15,
                pageNum:1,
                funcId:"R040100",
                loading:false,
                personRules: {
                    custName: [
                        {required: true, message: '请输入客户名称', trigger: 'blur'},

                    ],
                    certNo: [
                        {required: true, message: '请输入证件号码', trigger: 'blur'},
                        { min: 18, max: 18, message: '请输入18位证件号', trigger: 'blur' }
                    ],
                    checkCertNo: [
                        {required: true, validator: validateCertNo, trigger: 'blur' }
                    ],
                }
            }
        },
        watch: {
//            "detail.updateStartTimeT": function (val) {
//                this.search.updateStartTime = val ? new Date(val).getTime() : null
//            },
        },
        methods: {
            showImportHandler(){
                let that = this
                that.visible.introduce = true

            },
            //显示黑名单窗口
            showBlackListHandler(val){
                let that     = this
                that.blackList.custName = val.row.custName
                that.blackList.custId   = val.row.custId
                that.blackList.certNo   = val.row.certNo
                that.visible.blacklist = true
            },
            //加入黑名单事件
            doJoinBlackListHandler(){
                let that        = this
                that.joinBlackList(function () {
                    that.visible.blacklist = false
                })
            },
            joinBlackList(callback){
                let that        = this
                let url         = Vue.agent.root + '/blacklist/blacklist/join'
                var reqData     = that.blackList
                that.$http.post(url,reqData).then(function (res) {
                    if(res.body.code == "200") {
                        let data     = res.body.data
                        that.$message({type: 'success', message: '添加成功'});
                        !!callback && callback()
                    }
                });
            },
            doIntroduceSearchHandler(){
                let that = this
                that.introduceSearch()
            },
            introduceSearch(){
                let that        = this
                let url         = Vue.agent.root + '/customer/person/getCustByCertNoAndPhone'
                var reqData     = {
                    funcId  :that.funcId,
                }
                Object.assign(reqData,that.introduce.search)
                Util.dataClear(reqData)

                that.$http.get(url,{params:reqData}).then(function (res) {
                    if(res.body.code == "200") {
                        let data     = res.body.data
                        that.introduce.list = data
//                        let data     = res.body.data
//                        Object.assign(that,data)
//                        that.loading = false
                    }
                });
            },

            doIntroduceHandler(scope){
                let that = this
                let custId = scope.row.custId
                that.$prompt('请输入引入理由', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(({ value }) => {
                    that.doIntroduce(custId,value)
//                    that.$message({
//                        type: 'success',
//                        message: '你的邮箱是: ' + value
//                    });
                }).catch(() => {
                    that.$message({
                        type: 'info',
                        message: '取消输入'
                    });
                });
            },
            doIntroduce(custId,remark){
                let that        = this
                let url         = Vue.agent.root + '/customer/chg/obtain'
                var reqData     = {
                    funcId :that.funcId,
                    custId :custId,
                    remark :remark
                }
                that.$http.post(url,reqData).then(function (res) {
                    if(res.body.code == "200") {
                        that.$notify({title: '成功',message: '申请成功',type: 'success'});
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
            //查询个人用户列表
            doSearch(){
                let that        = this
                let url         = Vue.agent.root + '/customer/person/search'
                var reqData     = {
                    pageSize:that.pageSize,
                    pageNum:that.pageNum,
                    funcId  :that.funcId,
                }
                that.loading = true
                Object.assign(reqData,that.search)
                Util.dataClear(reqData)

                that.$http.get(url,{params:reqData}).then(function (res) {
                    if(res.body.code == "200") {
                        let data     = res.body.data
                        Object.assign(that,data)
                        that.loading = false
                    }
                });
            },
            //显示快速添加用户 dialog
            showAdd(){
                let that     = this
                that.title   = "添加机构"
                that.action  = 'add'
                Util.dataReset(that.person)

                that.visible.quickAdd = true
            },
            //快速添加用户事件监听
            doQuickAddHandler(person){
                let that = this
                this.$refs[person].validate((valid) => {
                    if (valid) {
                        that.doQuickAdd(function () {
                            that.visible.quickAdd = false
                            that.doSearchHandler()
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            //快速添加用户
            doQuickAdd(callback){
                let that        = this
                let url         = Vue.agent.root + '/customer/person/quicklyAdd'
                var reqData     = {
                    custName:that.person.custName,
                    certNo:that.person.certNo,
                    managerId:60
                }
                Object.assign(reqData,that.person)
                Util.dataClear(reqData)

                that.$http.post(url,reqData).then(function (res) {
                    if (res.body.code == "200") {
                        this.$message({type: 'success', message: '添加成功'});
                        !!callback && callback()
                    }
                })
            },
            //显示编辑用户 dialog
            showEditHandler(val){
                let that = this
                that.visible.openUser = true
                that.current.custId = val.row.custId
            },
            deleteHandler(val){
                let index  = val.$index
                let that   = this
                let custId = val.row.custId
                that.$confirm('确认要删除?, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    that.delete(custId,function () {
                        console.log('delete')
                        that.list.splice(index,1)
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            delete(custId,cb){
                let that        = this
                let url         = Vue.agent.root + '/customer/person/delete'
                var reqData     = {
                    custId:custId
                }

                that.$http.get(url,{
                    params:reqData
                }).then(function (res) {
                    if(res.body.code == 200) {
                        that.$message({type: 'success',message: '删除成功'});
                        cb()
                    }else{
                        that.$message({type: 'error',message: '操作失败'});
                    }
                });

            },
            handleCurrentChange(val) {
                this.pageNum = val
                this.doSearch()
            },
//            getOps(){
//                let that                 = this
//                let opsUrl      = Vue.agent.root + '/dictionary/dict/querys'
//
//                that.$http && that.$http.get(opsUrl,{params:{
//                    names:"education,residentStatus,residentHouseType,maritalStatus,stabilizeType",
//                    funcId:that.funcId
//                }}).then(function (res) {
//                    if(res.body.code == "200") {
//                        let data                    = res.body.data
//                        that.educationOps           = data.educationOptions
//                        that.residentHouseTypeOps   = data.residentHouseTypeOptions
//                        that.residentStatusOps      = data.residentStatusOptions
//                        that.maritalStatusOps       = data.maritalStatusOptions
//                        that.ops.stabilizeType      = data.stabilizeTypeOptions
//                    }
//                });
//            }
        },
        created:function () {
            let that                 = this
//            that.getOps()
            that.doSearchHandler()

        },
        mounted:function () {
//            wrpEle = document.querySelector('.table .el-table__body-wrapper')
        },
        components:{
            'user-info':UserInfo
        }
    }
</script>
<style lang="scss">
    @import 'src/scss/pages/member/personal.scss';
</style>