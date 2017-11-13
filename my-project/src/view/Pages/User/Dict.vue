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
                        label="字典名"
                >
                    <template scope="scope">
                        <span>{{ scope.row.name }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="value"
                        align="center"
                        label="字典值"
                        >
                </el-table-column>
                <el-table-column
                        align="center"
                        label="操作"
                        width="300"
                >
                    <template scope="scope">
                        <el-button @click.native="showSubDictDetail(scope)" size="small">属性</el-button>
                        <el-button @click.native="showMainDictEdit(scope.row)" size="small">修改</el-button>
                        <el-button @click.native="doDeleteMainDict(scope)" size="small">删除</el-button>

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


        <el-dialog :title="title" class="org-dialog" :visible.sync="visible.mDict" size="tiny" >
            <el-form :model="mDict" label-width="100px">
                <el-form-item label="键名">
                    <el-input  v-model="mDict.name" placeholder="请输入键名"></el-input>
                </el-form-item>
                <el-form-item label="键值">
                    <el-input  v-model="mDict.value" placeholder="请输入键值"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button class="pull-left" @click.native="visible.mDict = false">取 消</el-button>
                <el-button type="primary" @click.native="doSaveMainDict">确 认</el-button>
            </div>
        </el-dialog>

        <el-dialog title="字典清单" class="rule-dialog" size="small" :visible.sync="visible.sDict">
            <div class="table">
                <el-table
                        v-loading.body="loading"
                        :data="sDictList"
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
                            label="字典名"
                    >
                        <template scope="scope">
                            <span v-show="scope.row.edit == 1" >{{ scope.row.name }}</span>
                            <el-input size="small" v-show="scope.row.edit == 2 || scope.row.edit == 3"  v-model="scope.row.name" placeholder="请输入键名"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="字典值"
                    >
                        <template scope="scope">
                            <span v-show="scope.row.edit == 1" >{{ scope.row.value }}</span>
                            <el-input size="small" v-show="scope.row.edit == 2  || scope.row.edit == 3"  v-model="scope.row.value" placeholder="请输入键名"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="操作"
                            width="200"
                    >
                        <template scope="scope">
                            <el-button v-show="scope.row.edit == 1" @click.native="scope.row.edit = 2" size="small">修改</el-button>
                            <el-button v-show="scope.row.edit == 2" @click.native="saveSubDict(scope)" size="small">保存</el-button>
                            <el-button v-show="scope.row.edit == 3" @click.native="addSubDict(scope)" size="small">新增</el-button>
                            <el-button @click.native="doDeleteSubDict(scope)" size="small">删除</el-button>

                        </template>
                    </el-table-column>

                </el-table>
            </div>

            <div slot="footer" class="dialog-footer">
                <el-button class="pull-left" @click.native="visible.sDict = false">取 消</el-button>
                <el-button type="primary" @click.native="newSubDict">新 建</el-button>
            </div>
        </el-dialog>

    </div>

</template>

<script>
    import Util                 from    '../../../js/util'
    import auth                 from    '../../../js/auth'
    import Item                 from    './Item.vue'

    let current = null

    let list = []
    export default {
        data() {
            return {
                list: list,
                sDictList:[],
                visible:{
                    info:false,
                    role:false,
                    mDict:false,
                    sDict:false
                },
                value: '',
                bankVisible:false,
                roleVisible:false,
                totals:{

                },
                action:"",
                mDict:{
                    id:null,
                    name:null,
                    value:null
                },
                sDict:{
                },
                title:'',
                search:{
                },
                current:{
                    manageDictId:null
                },
                roleTree:[],
                staffLoading:false,
                funcId:'R030500',
                total:0,
                pageNum:1,
                loading:false
            }
        },
        watch: {

        },
        methods: {
//            查询事件响应
            doSearchHandler(){
                let that = this
                if(that.pageNum == 1){
                    that.doSearch()
                }else{
                    that.pageNum = 1
                }
            },
            doSearch(){
                let that        = this
                let url         = Vue.agent.root + '/dictionary/dict/search'
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
            //显示字典items
            showSubDictDetail(scope){
                let that                    = this
                that.visible.sDict          = true
                let id                      = scope.row.id
                that.current.manageDictId   = id

                that.getSubDictList(id)
            },
            //获取字典items
            getSubDictList(id,callback){
                let that        = this
                let roleUrl     = Vue.agent.root + '/dictionary/dictItem/search'
                let reqData     = {
                    manageDictId:id,
                    pageNum:1,
                    pageSize:20,
                    funcId:that.funcId
                }
                that.$http && that.$http.get(roleUrl,{
                    params:reqData
                }).then(function (res) {
                    if(res.body.code == "200") {
                        let sList       = res.body.data.list
                        sList.forEach(v=>{
                            v.edit = 1
                        })
                        console.log(sList)
                        that.sDictList = sList
                        !!callback && callback()
                    }
                });
            },
//            新建字典item
            newSubDict(){
                let that = this
                that.sDictList.push({
                    id:null,
                    name:null,
                    value:null,
                    edit:3
                })
            },
            //添加字典item
            addSubDict(scope){
                let that        = this
                let name        = scope.row.name
                let manageDictId= that.current.manageDictId
                let value       = scope.row.value
                let id          = scope.row.id
                let url         = Vue.agent.root + '/dictionary/dictItem/add'
                var reqData     = {
                    manageDictId:manageDictId,
                    name  :name,
                    value :value,
                    funcId:that.funcId
                }
                that.$http.post(url,reqData).then(function (res) {
                    if(res.body.code == "200") {
                        let data     = res.body.data
                        that.$notify({title: '成功',message: '添加成功',type: 'success'});
                        scope.row.edit = 1
                    }
                });
            },
//            保存字典item
            saveSubDict(scope){
                let that                = this
                let manageDictId        = that.current.manageDictId
                let url                 = Vue.agent.root + '/dictionary/dictItem/update'
                let name                = scope.row.name
                let value               = scope.row.value
                let id                  = scope.row.id

                let reqData     = {
                    manageDictId:manageDictId,
                    id:id,
                    name:name,
                    value:value,
                    funcId:that.funcId
                }

                that.$http && that.$http.put(url,reqData).then(function (res) {
                    if(res.body.code == "200") {
                        that.$notify({title: '成功',message: '修改成功',type: 'success'});
                        scope.row.edit = 1
                    }
                });
            },
            doDeleteSubDict(val){
                let index = val.$index
                let that  = this
                let id    = val.row.id
                this.$confirm('确认要删除?, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteSubDict(id,function () {
                        that.sDictList.splice(index,1)
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            deleteSubDict(id,callback){
                let that        = this
                let url         = Vue.agent.root + '/dictionary/dictItem/delete'
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
            //显示新建主字典
            showAdd(){
                let that = this
                that.visible.mDict = true
                Util.dataReset(that.station)
                that.action = "add"
            },
            //编辑主字典
            showMainDictEdit(val){
                let that           = this
                that.visible.mDict = true
                that.action        = "update"
                that.titile        = "修改字典"
                current            = val
                Object.assign(that.mDict,val)
            },
            //
            doSaveMainDict(){
                let that = this
                if(that.action == "add"){
                  that.add(function () {
                      that.visible.mDict = false
                  })
                }
                if(that.action == "update"){
                    that.update(function () {
                        that.visible.mDict = false
                    })
                }
            },
            update(callback){
                let that        = this
                let url         = Vue.agent.root + '/dictionary/dict/update'
                let mDict       = that.mDict

                var reqData     = {
                    id:mDict.id,
                    name:mDict.name,
                    value:mDict.value,
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
//            新建主字典
            add(callback){
                let that        = this
                let url         = Vue.agent.root + '/dictionary/dict/add'
                var reqData     = {
                    name  :that.mDict.name,
                    value :that.mDict.value,
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
            doDeleteMainDict(val){
                let index = val.$index
                let that  = this
                let id    = val.row.id
                this.$confirm('确认要删除?, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteMainDict(id,function () {
                        that.list.splice(index,1)
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            deleteMainDict(id,callback){
                let that        = this
                let url         = Vue.agent.root + '/dictionary/dict/delete'
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