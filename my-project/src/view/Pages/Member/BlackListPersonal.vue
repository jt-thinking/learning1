<template>
    <div class="user-org">
        <div class="stat-box">
            <div  class="search-box">
                <el-form   :model="formInline" label-width="66px" >
                    <el-form-item label="客户姓名" label-width="80px">
                        <el-input  size="small"  v-model="search.name" :placeholder="'请输入姓名'"></el-input>
                    </el-form-item>
                    <div class="item-box">
                        <el-button @click.native="showAdd" size="small" type="primary">添加</el-button>
                        <el-button @click.native="doSearchHandler" size="small" type="primary">查询</el-button>
                    </div>
                </el-form>

                <!--<el-form   :model="formInline">-->

                    <!--<el-form-item label="是否黑名单" label-width="90px">-->
                        <!--<el-select v-model="search.isBlack" placeholder="请选择">-->
                            <!--<el-option  label="全部" :value="null"></el-option>-->
                            <!--<el-option  label="是" value="1"></el-option>-->
                            <!--<el-option  label="否" value="2"></el-option>-->
                        <!--</el-select>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item label="是否信贷客户" label-width="100px">-->
                        <!--<el-select v-model="search.isLoan" placeholder="请选择">-->
                            <!--<el-option  label="全部" :value="null"></el-option>-->
                            <!--<el-option  label="是" value="1"></el-option>-->
                            <!--<el-option  label="否" value="2"></el-option>-->
                        <!--</el-select>-->
                    <!--</el-form-item>-->
                    <!--<div class="item-box">-->
                        <!--<el-button @click.native="doSearchHandler" size="small" type="primary">查询</el-button>-->
                        <!--<el-button @click.native="showAdd" size="small" type="primary">新建</el-button>-->
                    <!--</div>-->
                <!--</el-form>-->
            </div>
        </div>
        <div class="table">
            <el-table
                    v-loading.body="loading"
                    :data="list"
                    :stripe="true"
                    border
                    style="width: 100%">

                <el-table-column
                        align="center"
                        label="客户编号"
                        min-width="120"
                        >
                    <template scope="scope">
                        <span>{{ scope.row.custId }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="客户姓名"
                        min-width="120"
                >
                    <template scope="scope">
                        <span>{{ scope.row.custName }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="type"
                        align="center"
                        label="证件类型"
                        min-width="100"
                        >
                    <template scope="scope">
                        <span>{{ scope.row.certType | certTypeFormat }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="certNo"
                        align="center"
                        label="证件号码"
                        min-width="120"
                >
                </el-table-column>
                <el-table-column
                        prop="operaterName"
                        align="center"
                        label="经办人"
                        min-width="100"
                >
                </el-table-column>
                <el-table-column
                        prop="organizationName"
                        align="center"
                        label="办理机构"
                        min-width="100"
                >
                </el-table-column>
                <el-table-column

                        align="center"
                        label="加入原因"
                        min-width="240"
                >
                    <template scope="scope">
                        <span>{{ scope.row.joinRemark}}</span>
                        <el-popover
                                ref="popover1"
                                placement="top-start"
                                title="标题"
                                width="200"
                                trigger="hover"
                                content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="操作"
                        width="100"
                        fixed="right"
                >
                    <template scope="scope">
                        <el-button @click.native="showRevoke(scope)" size="small">撤销</el-button>
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
                <el-button type="primary"    @click.native="doRevokeBlackListHandler">提 交</el-button>
            </div>
        </el-dialog>


    </div>

</template>

<script>
    import Staff                from    '../../../data/loan/staff'
    import Util                 from    '../../../js/util'
    import auth                 from    '../../../js/auth'

    let list = [

    ]
    let current



    export default {
        data() {

            var validateCertNo = (rule, value, callback) => {
                console.log(value)
                if (!this.person.certNoRepeat) {
                    callback(new Error('请再次输入证件号'));
                } else if (this.person.certNoRepeat != this.person.certNo) {
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
                    name:null
                },
                visible:{
                    quickAdd:false,
                    blacklist:false

                },
                blackList:{
                    reason:null,
                    id:null,
                    custName:null,
                    certNo:null
                },
                staffList: Staff.list,
                orgList:[],
                typeList:[],
                staffLoading:false,
                total:0,
                pageSize:15,
                pageNum:1,
                loading:false,
                personRules: {
                    custName: [
                        {required: true, message: '请输入客户名称', trigger: 'blur'},
                    ],
                    certNo: [
                        {required: true, message: '请输入证件号码', trigger: 'blur'},
                    ],
                    checkCertNo: [
                        {required: true, validator: validateCertNo, trigger: 'blur' }
                    ],
                }
            }
        },
        watch: {

        },
        methods: {
            expandHandler(val){
                if(val == true){
                    this.staffList = Staff.list
                }
            },
            typeFilter(val){
                let list = this.typeList
                let res  = ''
                list.forEach((v,i)=>{
                    if(v.id == val)
                        res = v.name
                })
                return res

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
                let url         = Vue.agent.root + '/blacklist/blacklist/search'
                var reqData     = {
                    pageSize:that.pageSize,
                    pageNum:that.pageNum,
                    managerId:60,
//                    isBlack
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
                Util.dataReset(that.org)

                that.visible.quickAdd = true
            },
            //快速添加用户事件监听
            doQuickAddHandler(person){
                let that = this
                this.$refs[person].validate((valid) => {
                    if (valid) {
                        that.doQuickAdd()
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
            showUpdate(val){
                let that      = this
                that.titile   = "修改机构"
                that.action   = 'update'
                current       = val
                Object.assign(that.org,val)
                if(that.org.parentId != "0"){
                    that.org.parentId = parseInt(that.org.parentId)
                }else{
                    that.org.parentId = null
                }


                that.visible  = true

            },
            doSave(){
                let that = this
                if(that.action == 'add'){
                    that.add(function () {
                        that.list.push(that.org)
                    })
                }
                if(that.action == 'update'){
                    that.update(function () {
                        that.visible  = false
                    })
                }



            },
            add(callback){
                let that        = this
                let url         = Vue.agent.root + '/organization/add'
                var reqData     = {}
                Object.assign(reqData,that.org)
                Util.dataClear(reqData)

                that.$http.post(url,reqData).then(function (res) {
                    if(res.body.code == "200") {
                        this.$message({type: 'success',message: '添加成功'});
                        callback()
                    }
                });
            },
            update(callback){
                let that        = this
                let url         = Vue.agent.beta + '/organization/update'
                let org         = that.org

                var reqData     = {
                    id:org.id,
                    address:org.address,
                    telephone:org.telephone,
                    name:org.name,
                    type:org.type,
                    parentId:org.parentId,
                    manageUserId:org.manageUserId,
                    number:org.number,
                    manageName: org.manageName,
                    managePhone: org.managePhone
                }

                that.$http.put(url,reqData).then(function (res) {
                    if(res.body.code == "200") {
                        this.$message({type: 'success',message: '修改成功'});
                        callback()
                        Object.assign(current,reqData)

                    }
                });
            },
            showRevoke(val){
                let that = this
                that.blackList.custName = val.row.custName
                that.blackList.certNo   = val.row.certNo
                that.blackList.id       = val.row.id

                that.visible.blacklist  = true

            },
            doRevokeBlackListHandler(val){
                let that = this
                that.revokeBlackList()
            },
//            撤销黑名单
            revokeBlackList(){
                let that        = this
                let url         = Vue.agent.root + '/blacklist/blacklist/revoke'
                var reqData     = {
                    id:that.blackList.id,
                    reason:that.blackList.reason
                }

                that.$http.post(url,reqData).then(function (res) {
                    if(res.body.code == "200") {
                        this.$message({type: 'success',message: '提交成功'});
                    }else{
                        this.$message({type: 'error',message: '操作失败'});
                    }
                    that.visible.blacklist  = false
                });

            },
            handleCurrentChange(val) {
                this.pageNum = val
                this.doSearch()
            }
        },
        created:function () {
            let that        = this
        },
        mounted:function () {
//            wrpEle = document.querySelector('.table .el-table__body-wrapper')
        },
        components:{
        }
    }
</script>
<style lang="scss">
    @import 'src/scss/pages/member/personal.scss';
</style>