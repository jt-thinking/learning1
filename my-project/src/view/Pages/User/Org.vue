<template>
    <div class="user-org">
        <div class="stat-box">
            <div  class="search-box">
                <el-form   :model="formInline" label-width="66px" >
                    <div class="item-box">
                        <el-button @click.native="showAdd" size="small" type="primary">添加</el-button>
                        <el-button @click.native="doSearch" size="small" type="primary">查询</el-button>
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

                <el-table-column
                        align="center"
                        label="机构编号"
                        width="90"
                        >
                    <template scope="scope">
                        <span>{{ scope.row.number}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="机构名称"
                        width="100"
                >
                    <template scope="scope">
                        <span>{{ scope.row.name }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="type"
                        align="center"
                        label="机构类型"
                        width="110"
                        >
                    <template scope="scope">
                        <span>{{ typeFilter(scope.row.type) }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="机构地址"
                        align="center"
                        min-width="220"
                        >
                    <template scope="scope">
                        <span>{{ scope.row.address }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="机构电话"
                        align="center"
                        width="100"
                >
                    <template scope="scope">
                        <span>{{ scope.row.telephone }}</span>
                    </template>
                </el-table-column>

                <el-table-column
                        label="上级机构"
                        align="center"
                        width="100"
                >
                    <template scope="scope">
                        <span>{{ scope.row.parentName }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="机构负责人"
                        align="center"
                        width="120"
                >
                    <template scope="scope">
                        <span>{{ scope.row.manageName }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="负责人手机号"
                        align="center"
                        width="160"
                >
                    <template scope="scope">
                        <span>{{ scope.row.managePhone }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="负责人电话"
                        width="120"
                >
                    <template scope="scope">
                        <span>
                            {{ scope.row.orgPrincipalTel }}
                            <!--（{{ scope.row.mainMarketerId }}）-->
                        </span>
                    </template>
                </el-table-column>

                <el-table-column
                        align="center"
                        label="操作"
                        min-width="110"
                        fixed="right"
                >
                    <template scope="scope">
                        <el-button @click.native="showUpdate(scope.row)" size="small">修改</el-button>
                        <el-button @click.native="doDelete(scope)" size="small">删除</el-button>
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

        <el-dialog :title="title" class="org-dialog" :visible.sync="visible" size="tiny" >
            <el-form :model="org" :rules="orgRule" ref="org" label-width="100px">
                <el-form-item prop="number" label="机构编号">
                    <el-input v-model="org.number" placeholder="请输入机构编号"></el-input>
                </el-form-item>
                <el-form-item prop="name" label="机构名称">
                    <el-input  v-model="org.name" placeholder="请输入机构名称"></el-input>
                </el-form-item>
                <el-form-item prop="type" label="机构类型">
                    <el-select v-model="org.type" placeholder="请选择机构类型">
                        <el-option  label="请选择机构类型" :value="null"></el-option>
                        <el-option
                                v-for="item in typeList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="机构地址">
                    <el-input  v-model="org.address" placeholder="请输入机构地址"></el-input>
                </el-form-item>
                <el-form-item label="机构电话">
                    <el-input  v-model="org.telephone" placeholder="请输入机构电话"></el-input>
                </el-form-item>
                <el-form-item prop="parentId" label="上级机构">
                    <el-select  v-model="org.parentId" placeholder="请选择上级机构">
                        <el-option  label="无" :value="null"></el-option>
                        <el-option
                                v-for="item in orgList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <!--filterable-->
                <!--:filter-method="filterMethod"-->
                <el-form-item prop="manageUserId" label="机构负责人">
                    <el-select  class="manager" size="small"
                               :loading="staffLoading"
                               @visible-change="expandHandler"
                               v-model="org.manageUserId" placeholder="请选择负责人">
                        <el-option label="无" :value="null"></el-option>
                        <el-option-group
                                v-for="group in manageList"
                                :key="group.label"
                                :label="group.label">
                            <el-option
                                    v-for="item in group.options"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value">
                                <span style="float: left">{{ item.name }}</span>
                                <span style="float: right; color: #8492a6; font-size: 13px">工号:{{ item.no }}</span>
                            </el-option>

                        </el-option-group>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button class="pull-left" @click.native="visible = false">取 消</el-button>
                <el-button type="primary" @click.native="doSave('org')">确 认</el-button>
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

            let checkOrgType = (rule, value, callback) => {
                if (this.org.type == null) {
                    callback(new Error('请选择机构类型'));
                } else {
                    callback();
                }
            };

            let checkParentId = (rule, value, callback) => {
                if (this.org.parentId == null) {
                    callback(new Error('请选择上级机构'));
                } else {
                    callback();
                }
            };


            let checkManageUser = (rule, value, callback) => {
                if (this.org.manageUserId == null) {
                    callback(new Error('请选择机构管理者'));
                } else {
                    callback();
                }
            };



            return {
                list: list,
                visible:false,
                v:true,
                org:{
                    number:'',
                    name:'',
                    type:null,
                    address:null,
                    parentId:null,
                    id:null,
                    manageUserId:null,
                    manageName: null,
                    managePhone: null
                },
                title:'',
                action:'',
                search:{
                },
                staffList: Staff.list,
                orgList:[],
                typeList:[],
                staffLoading:false,
                total:0,
                pageNum:1,
                loading:false,
                pageSize:15,
                funcId:'R030200',
                orgRule:{
                    'number': [
                        {required: true, message: '请输入机构编号', trigger: 'blur'},
                        { min: 1, max: 3, message: '请输入1到3位机构编号', trigger: 'blur' }
                    ],
                    'name': [
                        {required: true, message: '请输入机构名称', trigger: 'blur' },
                    ],
                    type: [
                        {required: true, validator: checkOrgType, trigger: 'blur' },
                    ],
                    parentId:[
                        {required: true, validator: checkParentId, trigger: 'blur' }
                    ],
                    manageUserId:[
                        {validator: checkManageUser,required: true, trigger: 'blur' },
                    ],

                }
            }
        },
        watch: {

        },
        methods: {
            expandHandler(val){
                if(val == true){
                    this.staffList = Array.from(Staff.list)
                }
            },
            filterMethod(query){
                if (!!query) {
                    this.staffLoading = true
                    if(!!query.match(/[\u4e00-\u9fa5]/)){
                        this.staffLoading = false
                        this.staffList = Staff.findByName(Staff.list,query)
                    }
//                    else if(!!query.match(/^[1]\d*/) && query.length >= 4){
//                        console.log("手机")
//                        this.staffLoading = false
//                        this.manageList = Staff.findByPhone(Staff.list,query)
//                    }
                    else if(!!query.match(/^\d/)){
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
            typeFilter(val){
                let list = this.typeList
                let res  = ''
                list.forEach((v,i)=>{
                    if(v.id == val)
                        res = v.name
                })
                return res

            },
            doSearch(){
                let that        = this
                let url         = Vue.agent.root + '/organization/search'
                var reqData     = {
                    pageSize:15,
                    pageNum:that.pageNum,
                    parentId:-1,
                    funcId:that.funcId
                }
                that.loading = true
                Object.assign(reqData,that.search)
                Util.dataClear(reqData)

                that.$http.get(url,{params:reqData}).then(function (res) {
                    if(res.body.code == "200") {
                        let data     = res.body.data
                        data.list.forEach((v)=>{
                            v.show = true
                            v.manageUserId = v.manageUserId + ""
                            v.type  = v.type + ""
                        })
                        that.loading = false
                        Object.assign(that,data)
                    }
                });
            },
            //显示添加窗口
            showAdd(){
                let that     = this
                that.title   = "添加机构"
                that.action  = 'add'
                Util.dataReset(that.org)

                that.visible = true
            },
            showUpdate(val){
                let that      = this
                that.titile   = "修改机构"
                that.action   = 'update'
                current       = val
                Object.assign(that.org,val)
                if(that.org.parentId == 0)
                    that.org.parentId = null

                that.visible  = true

            },
            //保存事件响应
            doSave(formName){
                let that = this
                if(that.action == 'add'){
                    that.$refs[formName].validate((valid) => {
                        if (valid) {
                            that.add(function () {

                                that.visible = false
                            })
                        } else {
                            console.log('error submit!!');
                            return false;
                        }
                    });
                }
                if(that.action == 'update'){
                    that.update(function () {
                        that.visible  = false
                    })
                }



            },
            //添加机构
            add(callback){
                let that        = this
                let url         = Vue.agent.root + '/organization/add'
                var reqData     = {
                    funcId:that.funcId
                }
                Object.assign(reqData,that.org)
                Util.dataClear(reqData)

                that.$http.post(url,reqData).then(function (res) {
                    if(res.body.code == "200") {
                        that.$notify({title: '成功',message: '添加成功',type: 'success'});
                        let data = res.body.data
                        data.manageUserId = data.manageUserId + ""
                        that.list.push(data)
                        !!callback && callback()
                    }
                });
            },
            update(callback){
                let that        = this
                let url         = Vue.agent.root + '/organization/update'
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
                    managePhone: org.managePhone,
                    funcId:that.funcId
                }

                that.$http.put(url,reqData).then(function (res) {
                    if(res.body.code == "200") {
                        that.$notify({title: '成功',message: '修改成功',type: 'success'});
                        callback()
                        Object.assign(current,reqData)

                    }
                });
            },
            doDelete(val){
                let index = val.$index
                let that  = this
                let id    = val.row.id
                this.$confirm('确认要删除?, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.delete(id,function () {
                        that.list.splice(index,1)
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            delete(id,callback){
                let that        = this
                let url         = Vue.agent.root + '/organization/delete'
                var reqData     = {
                    id:id,
                    funcId:that.funcId
                }

                that.$http.delete(url,{
                    params:reqData
                }).then(function (res) {
                    if(res.body.code == "200") {
                        that.$notify({title: '成功',message: '删除成功',type: 'success'});
                        !!callback && callback()
                    }
                });

            },
            handleCurrentChange(val) {
                this.pageNum = val
                this.doSearch()
            }
        },
        created:function () {
            let that        = this
            let urlOps      = Vue.agent.root + '/manageUser/options'

            var reqData     = {
                funcId:that.funcId
            }

            that.$http && that.$http.get(urlOps,{params:reqData}).then(function (res) {
                if(res.body.code == "200") {
                    let data = res.body.data

                    data.forEach((v)=>{
                        v.value = parseInt(v.value)
                    })

                    Staff.list      = data

                    that.manageList = Array.from(Staff.list)
                }
            });


            let urlOrgs     = Vue.agent.root + '/organization/search'

            that.$http && that.$http.get(urlOrgs,{params:{
                pageSize:20,
                pageNum:1,
                parentId:-1,
                funcId:that.funcId
            }}).then(function (res) {
                if(res.body.code == "200") {
                    let list     = res.body.data.list
                    that.orgList = list
                }
            });

            let orgTypeUrl     = Vue.agent.root + '/dictionary/dict/query'

            that.$http && that.$http.get(orgTypeUrl,{params:{
                name:"orgType",
                funcId:that.funcId
            }}).then(function (res) {
                if(res.body.code == "200") {
                    let list = res.body.data
                    that.typeList = list
                }
            });



        },
        mounted:function () {
            this.doSearch()
        },
        components:{
        }
    }
</script>
<style lang="scss">
    @import 'src/scss/pages/org/org.scss';
</style>