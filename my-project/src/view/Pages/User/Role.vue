<template>
    <div class="user-role">
        <div class="stat-box">
            <div  class="search-box">
                <el-form   :model="formInline" label-width="66px" >
                    <div class="item-box">
                        <el-button :disabled="node == null" @click.native="showAdd" size="small" type="primary">添加</el-button>
                        <!--<el-button @click.native="doSearch" size="small" type="primary">查询</el-button>-->
                        <!--<el-button @click.native="doDelete" size="small" type="primary">删除</el-button>-->
                        <!--<el-button @click.native="doEdit" size="small" type="primary">修改</el-button>-->
                    </div>
                </el-form>
            </div>

        </div>
        <div class="role-layout ivu-row-flex">
            <div class="role-left ivu-col">
                <el-tree
                        :data="roleTree"
                        :props="defaultProps"
                        node-key="id"
                        accordion
                        @node-click="getNode"
                        :default-expanded-keys="[3]"
                        :highlight-current="true"
                        >
                </el-tree>
                <!--:expand-on-click-node="false"-->
            </div>
            <div class="role-right ivu-col">
                <div class="table">
                    <el-table
                            v-loading.body="loading"
                            :data="list"
                            :stripe="true"
                            border
                            style="width: 100%">

                        <el-table-column width="60px" align="center" label="主键" prop="id"></el-table-column>
                        <el-table-column align="center" label="权限名称" prop="label"></el-table-column>
                        <el-table-column align="center" label="权限编号" prop="funcId" ></el-table-column>
                        <el-table-column align="center" label="权限类型">
                            <template scope="scope">
                                <span>{{ scope.row.funcType | funcTypeFormat }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="父级权限" prop="supFuncId"></el-table-column>
                        <el-table-column align="center" label="备注" prop="remark"></el-table-column>
                        <el-table-column align="center" label="操作" >
                            <template scope="scope">
                                <el-button @click.native="showEdit(scope.row)" size="small">修改</el-button>
                                <el-button @click.native="doDelete(scope)" size="small">删除</el-button>
                            </template>
                        </el-table-column>

                    </el-table>
                </div>
            </div>
        </div>

        <el-dialog :title="title" class="func-dialog" :visible.sync="funcVisible" size="tiny" >
            <el-form :model="func" label-width="100px">
                <el-form-item label="权限编号">
                    <el-input v-model="func.funcId" placeholder="请输入权限编号"></el-input>
                </el-form-item>
                <el-form-item label="权限名称">
                    <el-input v-model="func.label" placeholder="请输入权限名称"></el-input>
                </el-form-item>


                <el-form-item label="机构类型">
                    <el-select v-model="func.funcType" placeholder="请选择权限类型">
                        <el-option
                                v-for="item in funcTypeOps"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input  v-model="func.remark" placeholder="请输入备注"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button class="pull-left" @click.native="funcVisible = false">取 消</el-button>
                <el-button type="primary" @click.native="doSave">确 认</el-button>
            </div>
        </el-dialog>

    </div>

</template>

<script>
    import Staff                from    '../../../data/loan/staff'
    import Util                 from    '../../../js/util'
    import auth                 from    '../../../js/auth'
    import Item                 from    './Item.vue'


    let id = 1000;
    let current;

    let ops =[
        {
            value: null,
            label: '请选择权限类型'
        },
        {
            value: 0,
            label: '导航菜单'
        },
        {
            value: 1,
            label: '页面组件'
        },
//        {
//            value: '3',
//            label: '身份证'
//        }
    ]
    let list = []
    export default {
        data() {
            return {
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                list: list,
                funcTypeOps: ops,
                value: '',
                funcVisible:false,
                totals:{

                },
                func:{
                    id:null,
                    funcId:null,
                    funcType:null,
                    label:null,
                    supFuncId:null,
                    remark:null
                },
                roleTree:[],
                search:{
                },
                title:null,
                action:null,
                node:null,
                staffList: Staff.list,
                staffLoading:false,
                value7: '',
                total:0,
                pageNum:1,
                loading:false,
                funcId:'R030300',
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
            getNode(nodeData,b,c){
                let that = this
                that.node = nodeData
                if(nodeData.children == null)
                    nodeData.children = []
                that.list = nodeData.children
            },
            doSearch(){
                let that        = this
                let url         = Vue.agent.root + '/transactionRecord/search'
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
            doAdd(){
                this.funcVisible = true
//                Util.dataReset(search)
            },
            showAdd(val){
                let that      = this
                that.title    = "新增权限"
                that.action   = 'add'
                Util.dataReset(that.func)
                that.funcVisible  = true
            },
            add(callback){
                let that        = this
                let func        = that.func
                let url         = Vue.agent.root + '/function/add'
                func.supFuncId  = that.node.id
                var reqData     = {
                    funcNo:func.funcId,
                    funcName:func.label,
                    funcType:func.funcType,
                    supFuncId:func.supFuncId,
                    deviceFlag:0,
                    funcId:that.funcId
                }

                that.$http.post(url,reqData).then(function (res) {
                    if(res.body.code == "200") {
                        this.$message({type: 'success',message: '添加成功'});
                        that.funcVisible  = false
                        let data = res.body.data
                        data.label = data.funcName
                        that.list.push(data)
                    }
                });
            },
            showEdit(val){
                let that      = this
                that.titile   = "修改权限"
                that.action   = 'update'
                current       = val
                Object.assign(that.func,val)

                that.funcVisible = true
            },

            update(callback){
                let that        = this
                let url         = Vue.agent.root + '/function/update'
                let func        = that.func

                var reqData     = {
                    id:func.id,
                    funcNo:func.funcId,
                    funcName:func.label,
                    funcType:func.funcType,
                    supFuncId:func.supFuncId,
                    funcId:that.funcId
                }

                that.$http.post(url,reqData).then(function (res) {
                    if(res.body.code == "200") {
                        this.$message({type: 'success',message: '修改成功'});
                        callback()
                        Object.assign(current,func)
                    }
                });
            },
            doSave(){
                let that = this
                if(that.action == 'add'){
                    that.add()
                }
                if(that.action == 'update'){
                    that.update(function () {
                        that.funcVisible = false
                    })
                }
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
            //删除权限
            delete(id,callback){
                let that        = this
                let url         = Vue.agent.root + '/function/delete'
                var reqData     = {
                    id:id,
                    funcId:that.funcId
                }

                that.$http.get(url,{
                    params:reqData
                }).then(function (res) {
                    if(res.body.code == "200") {
                        this.$message({type: 'success',message: '删除成功'});

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

            let roleUrl     = Vue.agent.root + '/function/selectAll'

            that.$http && that.$http.get(roleUrl,{params:{
                funcId:that.funcId
            }}).then(function (res) {
                if(res.body.code == "200") {
                    that.roleTree      = res.body.data

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
    @import 'src/scss/pages/org/role.scss';
</style>