<template>
    <div class="user-station">
        <div class="stat-box">
            <div  class="search-box">
                <el-form   :model="formInline" label-width="66px" >
                    <div class="item-box">
                        <el-button @click.native="showAdd" size="small" type="primary">添加</el-button>
                        <el-button @click.native="doSearchHandler" size="small" type="primary">查询</el-button>
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
                        label="序号"
                        >
                    <template scope="scope">
                        <span>{{ scope.row.id }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="岗位名称"
                >
                    <template scope="scope">
                        <span>{{ scope.row.roleName }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="description"
                        align="center"
                        label="岗位描述"
                        >
                </el-table-column>
                <el-table-column
                        label="用户数"
                        align="center"
                        >
                    <template scope="scope">
                        <span>{{ scope.row.borrowAmount}}</span>
                    </template>
                </el-table-column>

                <el-table-column
                        align="center"
                        label="操作"
                        width="300"
                >
                    <template scope="scope">
                        <el-button @click.native="showEdit(scope.row)" size="small">修改</el-button>
                        <el-button @click.native="showRole(scope)" size="small">设置权限</el-button>
                        <el-button @click.native="showDetail(scope.row)" size="small">用户详情</el-button>
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
                        :page-size="pageSize"
                        :current-page.sync="pageNum"
                        :total="total">
                </el-pagination>
            </div>
        </div>


        <el-dialog :title="title" class="org-dialog" :visible.sync="roleVisible" size="tiny" >
            <el-form :model="station" label-width="100px">
                <el-form-item label="岗位名称">
                    <el-input  v-model="station.roleName" placeholder="请输入岗位名称"></el-input>
                </el-form-item>
                <el-form-item label="岗位描述">
                    <el-input rows="6"  type="textarea" v-model="station.description" placeholder="请输入岗位电话"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button class="pull-left" @click.native="roleVisible = false">取 消</el-button>
                <el-button type="primary" @click.native="doSave">确 认</el-button>
            </div>
        </el-dialog>



        <el-dialog title="设置权限" class="rule-dialog" size="small" :visible.sync="visible.role">
            <div class="ivu-table-wrapper">
                <div class="ivu-table ivu-table-border">
                    <div class="ivu-table-body">
                        <table class="rule-table" cellspacing="0" cellpadding="0" border="0">
                            <colgroup>
                                <col width="120">
                            </colgroup>
                            <tbody class="ivu-table-tbody">
                            <template v-for="nav in roleTree">
                                <tr class="ivu-table-row">
                                    <td>
                                        <div class="ivu-table-cell">
                                            <Checkbox v-model="nav.deleteFlag">{{ nav.label }}</Checkbox>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="ivu-table-cell">
                                            <template v-if="nav.children != null"  v-for="route in nav.children">
                                                <div class="role-com-wrp">
                                                    <div>
                                                        <Checkbox v-model="route.deleteFlag">{{ route.label }}:</Checkbox>
                                                        <template v-if="route.children != null"  v-for="com in route.children">
                                                            <Checkbox v-model="com.deleteFlag">{{ com.label }}</Checkbox>
                                                        </template>
                                                    </div>
                                                </div>
                                            </template>
                                        </div>
                                    </td>
                                </tr>

                            </template>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div slot="footer" class="dialog-footer">
                <el-button class="pull-left" @click.native="visible.role = false">取 消</el-button>
                <el-button type="primary" @click.native="saveRole">确 认</el-button>
            </div>
        </el-dialog>


        <el-dialog title="用户详情" class="org-dialog" size="large" :visible.sync="visible.info">
            <el-table
                    v-loading.body="loading"
                    :data="list"
                    :stripe="true"
                    border
                    style="width: 100%">

                <el-table-column
                        align="center"
                        label="用户工号"
                >
                    <template scope="scope">
                        <span>{{ scope.row.name | nameFormat }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="用户名称"
                >
                    <template scope="scope">
                        <span>{{ scope.row.userId }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="phone"
                        align="center"
                        label="所属机构"
                >
                </el-table-column>
                <el-table-column
                        label="所属部门"
                        align="center"
                >
                    <template scope="scope">
                        <span>{{ scope.row.borrowAmount}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="入职时间"
                        align="center"
                >
                    <template scope="scope">
                        <span>{{ scope.row.borrowAmount}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="手机号"
                        align="center"
                >
                    <template scope="scope">
                        <span>{{ scope.row.borrowAmount}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="岗位"
                        align="center"
                >
                    <template scope="scope">
                        <span>{{ scope.row.borrowAmount}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="权限类型"
                        align="center"
                >
                    <template scope="scope">
                        <span>{{ scope.row.borrowAmount}}</span>
                    </template>
                </el-table-column>

            </el-table>
        </el-dialog>

    </div>

</template>

<script>
    import Staff                from    '../../../data/loan/staff'
    import Util                 from    '../../../js/util'
    import auth                 from    '../../../js/auth'

    let current = null

    let list = []
    export default {
        data() {
            return {
                list: list,
                visible:{
                    info:false,
                    role:false
                },
                value: '',
                bankVisible:false,
                roleVisible:false,
                totals:{

                },
                action:"",
                station:{
                    description:null,
                    roleName:null,
                    enableFlag:null,
                    id:null
                },
                title:'',
                search:{
                },
                current:{
                    roleId:null
                },
                roleTree:[],
                staffList: Staff.list,
                staffLoading:false,
                funcId:'R030200',
                total:0,
                pageNum:1,
                loading:false
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
//            filterMethod(query){
//                if (!!query) {
//                    this.staffLoading = true
//                    if(!!query.match(/[\u4e00-\u9fa5]/)){
//                        this.staffLoading = false
//                        this.staffList = Staff.findByName(Staff.list,query)
//                    }else if(!!query.match(/^[1]\d*/)){
////                        console.log("手机")
//                        this.staffLoading = false
//                        this.manageList = Staff.findByPhone(Staff.list,query)
//                    }else if(!!query.match(/^\d/)){
//                        this.staffLoading = false
//                        this.staffList = Staff.findByNo(Staff.list,query)
//                    }else if(!!query.match(/[a-zA-Z]/)){
////                        console.log('字母')
//                        this.staffLoading = false
//                        this.staffList = Staff.findByInitial(Staff.list,query.toUpperCase())
//                    }else{
//                        this.staffLoading = false;
//
//                    }
//                } else {
//                    this.staffLoading = true;
//                    this.staffList = []
//                    setTimeout(()=>{
//                        this.staffLoading = false;
//                        this.staffList = Array.from(Staff.list)
//                    })
//
//                }
//            },
//            查询事件响应
            doSearchHandler(){
                let that = this
                that.doSearch()
                if(that.pageNum == 1){
                    that.doSearch()
                }else{
                    that.pageNum = 1
                }
            },
            doSearch(){
                let that        = this
                let url         = Vue.agent.root + '/role/selectAll'
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
                        let data     = res.body.data
                        that.loading = false
                        Object.assign(that,data)
                    }
                });
            },
            showDetail(val){
                this.visible.info = true
//                console.log(val)
            },
            showRole(val){
//                console.log(val)
                let roleId        = val.row.id
                let that          = this

                that.getRole(roleId,function () {
                    that.current.roleId = roleId
                    that.visible.role   = true
                })
            },
            getRole(roleId,callback){
                let that        = this
                let roleUrl     = Vue.agent.root + '/role/selectRoleFuncs'
                let reqData     = {
                    roleId:roleId,
                    funcId:that.funcId
                }
                that.$http && that.$http.get(roleUrl,{
                    params:reqData
                }).then(function (res) {
                    if(res.body.code == "200") {
                        let data        = res.body.data
                        that.roleTree   = data[0].children
                        callback()
//                        console.log(that.roleTree)
                    }
                });
            },
            saveRole(){
                let that        = this
                let roleId      = that.current.roleId
                let roleUrl     = Vue.agent.root + '/role/updateRoleFuncs'
                let roleTree    = that.roleTree
                let arr         = []

                roleTree.forEach((v)=>{
                    if(v.deleteFlag == 1){
                        arr.push(v.id)
                    }
                    if(v.children){
                        v.children.forEach((t)=>{
                            if(t.deleteFlag == 1){
                                arr.push(t.id)
                            }
                            if(t.children){
                                t.children.forEach((e)=>{
                                    if(e.deleteFlag == 1){
                                        arr.push(e.id)
                                    }
                                })
                            }
                        })
                    }
                })

                let funcs = arr.join(",")

                let reqData     = {
                    roleId:roleId,
                    funcs:funcs,
                    funcId:that.funcId
                }
                that.$http && that.$http.post(roleUrl,reqData).then(function (res) {
                    if(res.body.code == "200") {
                        this.$message({type: 'success',message: '更新成功'});
                        that.visible.role   = false
                    }
                });
            },
            showAdd(){
                this.roleVisible = true
                Util.dataReset(this.station)
                this.action = "add"
            },
            showEdit(val){
                this.roleVisible = true
                this.action = "update"

                let that      = this
                that.titile   = "修改岗位"
                that.action   = 'update'
                current       = val
                Object.assign(that.station,val)
            },
            doSave(){
                let that = this
                if(that.action == "add"){
                  that.add(function () {
                      that.roleVisible = false
                  })
                }
                if(that.action == "update"){
                    that.update(function () {
                        that.roleVisible = false
                    })
                }
            },
            update(callback){
                let that        = this
                let url         = Vue.agent.root + '/role/update'
                let station     = that.station

                var reqData     = {
                    roleId:station.id,
                    roleName:station.roleName,
                    description:station.description,
                    enableFlag:station.enableFlag,
                    funcId:that.funcId
                }

                that.$http.post(url,reqData).then(function (res) {
                    if(res.body.code == "200") {
                        that.$notify({title: '成功',message: '修改成功',type: 'success'});
                        callback()
                        Object.assign(current,reqData)

                    }
                });
            },
            add(callback){
                let that        = this
                let url         = Vue.agent.root + '/role/add'
                var reqData     = {
                    roleName   :that.station.roleName,
                    description:that.station.description,
                    enableFlag :1,
                    funcId:that.funcId
                }
                that.$http.post(url,reqData).then(function (res) {
                    if(res.body.code == "200") {
                        let data     = res.body.data
                        that.$notify({title: '成功',message: '添加成功',type: 'success'});
                        that.list.push(reqData)
                        callback()
                    }
                });

            },
            doAdd(){
                this.bankVisible = true
//                Util.dataReset(search)
            },
            doUpdate(val){
                this.bankVisible = true
//                console.log(val)
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
            delete(id,cb){
                let that        = this
                let url         = Vue.agent.root + '/role/delete'
                var reqData     = {
                    roleId:id,
                    funcId:that.funcId
                }

                that.$http.get(url,{
                    params:reqData
                }).then(function (res) {
                    if(res.body.code == "200") {
                        this.$message({type: 'success',message: '删除成功'});
                        cb()
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
            this.doSearch()
        },
        components:{
        }
    }
</script>
<style lang="scss">
    @import 'src/scss/pages/org/station.scss';
</style>