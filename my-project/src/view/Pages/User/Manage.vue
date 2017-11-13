<template>
    <div class="user-manage">
        <!--<el-tree-->
                <!--:data="data2"-->
                <!--:props="defaultProps"-->
                <!--show-checkbox-->
                <!--node-key="id"-->
                <!--default-expand-all-->
                <!--:expand-on-click-node="false"-->
                <!--:render-content="renderContent">-->
        <!--</el-tree>-->
        <div class="role-layout ivu-row-flex">
            <div class="role-left ivu-col">
                <el-tree
                        :data="orgTrees"
                        :props="defaultProps"
                        node-key="id"
                        accordion
                        @node-click="getNode"
                        default-expand-all
                        :highlight-current="true"
                >
                    <!--:expand-on-click-node="false"-->

                    <!--:render-content="renderContent"-->
                </el-tree>
            </div>
            <div class="role-right ivu-col">
                <div class="manage-box">
                    <div  class="search-box">
                        <el-form   :model="formInline" label-width="66px">
                            <el-form-item label="姓名" label-width="50px">
                                <el-input  size="small"  v-model="search.name" :placeholder="'请输入姓名'"></el-input>
                            </el-form-item>
                            <el-form-item label="岗位" label-width="50px">
                                <el-select class="manager" size="small" filterable
                                :filter-method="filterMethod"
                                :loading="staffLoading"
                                @visible-change="expandHandler"
                                v-model="search.postId" placeholder="请选择">
                                <el-option :label="'全部'" :value="null"></el-option>
                                <el-option
                                v-for="item in stationList"
                                :key="item.id"
                                :label="item.roleName"
                                :value="item.id">
                                    <span style="float: left">{{ item.roleName }}</span>
                                <!--<span style="float: right; color: #8492a6; font-size: 13px">{{ item.no }}</span>-->
                                </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="入职时间">
                                <el-date-picker
                                editable="false"
                                class="date"
                                size="small"
                                v-model="search.startDateT"
                                type="date"
                                placeholder="开始日期时间">
                                </el-date-picker>
                                <el-date-picker
                                editable="false"
                                class="date"
                                size="small"
                                v-model="search.endDateT"
                                type="date"
                                placeholder="截至日期时间">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="就职状态" label-width="100px">
                                <el-select v-model="search.dimissionFlag"  size="small">
                                    <el-option :label="'全部'" :value="null"></el-option>
                                    <el-option label="在职" value="0"></el-option>
                                    <el-option label="离职" value="1"></el-option>
                                </el-select>
                            </el-form-item>
                            <div class="item-box">
                                <el-button @click.native="doReset" size="small" type="primary">重置</el-button>
                                <el-button @click.native="doSearchHandler" size="small" type="primary">查询</el-button>
                            </div>
                        </el-form>
                    </div>
                        <div class="item-box">
                            <el-button @click.native="showAdd" size="small" type="primary">新增</el-button>
                            <el-button :disabled="userCheckList.length < 1" @click.native="showStation" size="small" type="primary">分配岗位</el-button>
                        </div>
                </div>

                <div class="table">
                        <el-checkbox-group v-model="userCheckList">
                            <el-table
                            v-loading.body="loading"
                            :data="list"
                            :stripe="true"
                            border
                            style="width: 100%">
                                <el-table-column
                                    fixed="left"
                                    align="center"
                                    label="用户名称"
                                    width="110"
                                    >
                                    <template scope="scope">
                                        <div style="text-align: left;">
                                            <el-checkbox size="small" :label="scope.row.id">
                                                <span></span>
                                            </el-checkbox>
                                            <span>{{ scope.row.name | nameFormat }}</span>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    align="center"
                                    label="用户工号"
                                    width="90"
                                    >
                                    <template scope="scope">
                                        <span>{{ scope.row.jobNumber }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        label="状态"
                                        align="center"
                                        width="80"
                                >
                                    <template scope="scope">
                                        <span>{{ scope.row.enableFlag | userEnableFlagFormat }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    label="所属机构"
                                    align="center"
                                    width="120"
                                    >
                                    <template scope="scope">
                                        <span>{{ scope.row.organizationName}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        label="岗位"
                                        align="center"
                                        width="120"
                                >
                                    <template scope="scope">
                                        <span>{{ userPostFormat(scope.row.post) }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        label="就职状态"
                                        align="center"
                                        width="100"
                                >
                                    <template scope="scope">
                                        <span v-show="scope.row.dimissionFlag == 0">在职</span>
                                        <span v-show="scope.row.dimissionFlag == 1">离职</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    align="center"
                                    label="入职时间"
                                    width="120"
                                    >
                                    <template scope="scope">
                                        <span>{{ scope.row.entryTime | dateFormat }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        align="center"
                                        label="离职时间"
                                        width="120"
                                >
                                    <template scope="scope">
                                        <span v-show="scope.row.dimissionTime != null">{{ scope.row.dimissionTime | dateFormat }}</span>
                                        <span v-show="scope.row.dimissionTime == null">无</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    label="手机"
                                    prop="phone"
                                    align="center"
                                    width="120"
                                    >
                                </el-table-column>
                                <el-table-column
                                        label="电话"
                                        prop="telephone"
                                        align="center"
                                        width="120"
                                >
                                </el-table-column>
                                <el-table-column
                                label="权限类型"
                                align="center"
                                width="100"
                                >
                                    <template scope="scope">
                                    <span>{{ scope.row.permissionType | roleTypeFormat}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        align="center"
                                        label="操作"
                                        min-width="380"
                                        fixed="right"
                                >
                                    <template scope="scope">
                                        <el-button @click.native="showEdit(scope.row)" size="mini">修改</el-button>
                                        <el-button @click.native="showSubordinate(scope)" size="mini">分配下属</el-button>
                                        <el-button @click.native="showRoleHandler(scope)" size="mini">修改权限</el-button>
                                        <el-button @click.native="showStationSingle(scope)" size="mini">修改岗位</el-button>
                                        <el-button v-show="scope.row.enableFlag == 1" @click.native="doEnableUser(scope)" size="mini">禁用</el-button>
                                        <el-button v-show="scope.row.enableFlag == 0" @click.native="doEnableUser(scope)" size="mini">启用</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-checkbox-group>
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
            </div>
        </div>

        <el-dialog title="分配岗位" class="station-dialog" size="small" :visible.sync="visible.station">
            <div class="ivu-table-wrapper">
                <div class="ivu-table ivu-table-border">
                    <div class="ivu-table-body">
                        <el-checkbox-group v-model.sync="stationCheckList">
                        <table class="station-table" cellspacing="0" cellpadding="0" border="0">
                            <colgroup>
                                <col width="120">
                            </colgroup>
                            <tbody class="ivu-table-tbody">

                                    <template v-for="group in stationTree">
                                        <tr class="ivu-table-row">
                                            <td>
                                                <div class="ivu-table-cell">
                                                    <span>{{ group.description }}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div class="ivu-table-cell">
                                                    <template v-if="group.children != null"  v-for="s in group.children">
                                                        <el-checkbox :label="s.id">
                                                            {{ s.roleName }}
                                                        </el-checkbox>
                                                        <!--<div class="role-com-wrp">-->
                                                            <!--<p class="role-com-title">-->
                                                                <!---->
                                                            <!--</p>-->
                                                                <!--<div>-->
                                                                    <!--<template v-if="route.children != null"  v-for="com in route.children">-->
                                                                        <!--<Checkbox v-model="com.deleteFlag">{{ com.label }}</Checkbox>-->
                                                                    <!--</template>-->
                                                                <!--</div>-->
                                                        <!--</div>-->
                                                    </template>
                                                </div>
                                            </td>
                                        </tr>
                                    </template>
                            </tbody>
                        </table>
                        </el-checkbox-group>
                    </div>
                </div>
            </div>

            <div slot="footer" class="dialog-footer">
                <el-button class="pull-left" @click.native="visible.station = false">取 消</el-button>
                <el-button type="primary" @click.native="doUpdateStationHandler">确 认</el-button>
            </div>
        </el-dialog>

        <!--用户新增修改-->
        <el-dialog :title="title" class="user-dialog" :visible.sync="visible.user" size="tiny" >

            <el-form :model="user" :rules="userRules"  ref="user" label-width="100px">
                <el-form-item prop="name" label="用户名称">
                    <el-input v-model="user.name" placeholder="请输入姓名"></el-input>
                </el-form-item>
                <el-form-item prop="jobNumber" label="工号">
                    <el-input v-model="user.jobNumber" placeholder="工号"></el-input>
                </el-form-item>
                <el-form-item v-if="action == 'add' " label="登录密码" prop="password" :rules="[
                            {required: true, message: '请输入密码'},
                            { min: 6, max: 18, message: '长度必须大于6位'}
                            ]">
                    <el-input type="password" v-model="user.password" placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item v-else="action == 'update' " label="登录密码">
                    <el-input type="password" v-model="user.password" placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item prop="organizationId" label="所属机构">
                    <el-select  v-model="user.organizationId" placeholder="请选择所属机构">
                        <el-option  label="无" :value="null"></el-option>
                        <el-option
                                v-for="item in orgList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="就职状态" required>
                    <el-select  v-model.number="user.dimissionFlag" placeholder="就职状态">
                        <el-option  label="在职" :value="0"></el-option>
                        <el-option  label="离职" :value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="entryTime" label="入职时间">
                    <el-date-picker
                            editable="false"
                            v-model="user.entryTime"
                            type="date"
                            placeholder="入职日期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="离职时间">
                    <el-date-picker
                            editable="false"
                            v-model="user.dimissionTime"
                            type="date"
                            placeholder="离职日期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="手机号">
                    <el-input  v-model="user.phone" placeholder="请输入手机号"></el-input>
                </el-form-item>
                <el-form-item label="固话">
                    <el-input  v-model="user.telephone" placeholder="请输入电话号码"></el-input>
                </el-form-item>

                <el-form-item label="公司邮箱">
                    <el-input  v-model="user.email" placeholder="请输入邮箱"></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button class="pull-left" @click.native="visible.user = false">取 消</el-button>
                <el-button type="primary" @click.native="doSave('user')">确 认</el-button>
            </div>
        </el-dialog>

        <!--设置权限-->
        <el-dialog title="设置权限" class="rule-dialog" size="small" :visible.sync="visible.role">
            <el-radio-group v-model="current.custom">
                <el-radio size="small" :label="0">标准</el-radio>
                <el-radio size="small" :label="1">自定义</el-radio>
            </el-radio-group>
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
                                            <Checkbox :disabled="current.custom == 0 " v-model="nav.deleteFlag">{{ nav.label }}</Checkbox>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="ivu-table-cell">
                                            <template v-if="nav.children != null"  v-for="route in nav.children">
                                                <div class="role-com-wrp">
                                                    <p class="role-com-title">
                                                        <Checkbox :disabled="current.custom == 0 " v-model="route.deleteFlag">{{ route.label }}</Checkbox>
                                                    </p>
                                                    <div>
                                                        <template v-if="route.children != null"  v-for="com in route.children">
                                                            <Checkbox :disabled="current.custom == 0 " v-model="com.deleteFlag">{{ com.label }}</Checkbox>
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
                <el-button type="primary" @click.native="updateUserRoleHandler">确 认</el-button>
            </div>
        </el-dialog>



        <!--分配下属-->
        <el-dialog title="分配下属" class="rule-dialog subordinate-dialog" size="small" :visible.sync="visible.subordinate">
            <div class="ivu-table-wrapper">
                <div class="ivu-table ivu-table-border">
                    <div class="ivu-table-body">
                        <el-checkbox-group v-model.sync="subordinateCheckList">
                        <table class="rule-table" cellspacing="0" cellpadding="0" border="0">
                            <colgroup>
                                <col width="120">
                            </colgroup>
                            <tbody class="ivu-table-tbody">
                            <template v-model.sync="subordinateTree" v-for="large in subordinateTree">
                                <tr class="ivu-table-row">
                                    <td>
                                        <div class="ivu-table-cell">
                                            {{ large.label }}
                                        </div>
                                    </td>
                                    <td>
                                        <div class="ivu-table-cell">
                                            <template v-if="large.children != null"  v-for="middle in large.children">
                                                <div class="role-com-wrp">
                                                    <p class="role-com-title">
                                                        {{ middle.label }}
                                                    </p>
                                                    <div>
                                                        <template v-if="middle.users != null"  v-for="mUser in middle.users">
                                                            <el-checkbox size="small" :label="mUser.id"> {{ mUser.name }} </el-checkbox>
                                                        </template>
                                                    </div>
                                                </div>
                                            </template>
                                            <template v-if="large.users != null"  v-for="lUser in large.users">
                                                <el-checkbox size="small" :label="lUser.id"> {{ lUser.name }} </el-checkbox>
                                            </template>

                                                <!--<template v-if="route.children != null"  v-for="com in route.children">-->
                                                    <!--<Checkbox :disabled="current.custom == 0 " v-model="com.deleteFlag">{{ com.label }}</Checkbox>-->
                                                <!--</template>-->

                                        </div>
                                    </td>
                                </tr>
                            </template>
                            </tbody>
                        </table>
                        </el-checkbox-group>
                    </div>
                </div>
            </div>

            <div slot="footer" class="dialog-footer">
                <el-button class="pull-left" @click.native="visible.subordinate = false">取 消</el-button>
                <el-button type="primary" @click.native="doSubordinateHandler">确 认</el-button>
            </div>
        </el-dialog>

    </div>

</template>

<script>
    import Staff                from    '../../../data/loan/staff'
    import Util                 from    '../../../js/util'
    import auth                 from    '../../../js/auth'
    import Item                 from    './Item.vue'

    const OrgItem = Vue.extend(Item);


    let ops =[
//        {
//            value: '0',
//            label: '合同号'
//        },
        {
            value: '1',
            label: '姓名'
        },
//        {
//            value: '2',
//            label: '手机号'
//        },
//        {
//            value: '3',
//            label: '身份证'
//        }
    ]

    let currentUser = null
    let list = []
    export default {
        data() {
            let checkEntryTime = (rule, value, callback) => {
                if (this.user.entryTime == null) {
                    callback(new Error('请选择入职时间'));
                } else {
                    callback();
                }
            };
            let checkName = (rule, value, callback) => {
                if (this.user.name == null) {
                    callback(new Error('请填写姓名'));
                } else {
                    callback();
                }
            };

            let checkJob = (rule, value, callback) => {
                if (this.user.jobNumber == null) {
                    callback(new Error('请填写工号'));
                } else {
                    callback();
                }
            };

            let checkOrg = (rule, value, callback) => {
                if (this.user.organizationId == null) {
                    callback(new Error('请选择机构'));
                } else {
                    callback();
                }
            };



            return {
                orgTrees:[],
                stationTree:[],
                roleTree:[],
                subordinateTree:[],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                userCheckList:[],
                stationCheckList:[],
                subordinateCheckList:[],
                stationList:[],
                list: list,
                options: ops,
                value: '',
                mix:{
                    //混合选项 合同 身份证 手机号
                    value:'1',
                },
                totals:{

                },
                statistics:{

                },
                search:{
//                    岗位ID
                    postId:null,
//                    //用户姓名
                    name:null,
                    startDate:null,
                    startDateT:null,
                    endDate:null,
                    endDateT:null,
                    dimissionFlag:null
//                    //手机号
                },
                visible:{
                    station:false,
                    user:false,
                    role:false,
                    subordinate:false
                },

                current:{
                    node:null,
                    userId:null,
                    custom:0
                },
                orgList:[],
                staffList: Staff.list,
                staffLoading:false,
                funcId:'R030100',
                total:0,
                pageNum:1,
                pageSize:15,
                loading:false,
                user:{
                    id:null,
                    name:null,
                    organizationId:null,
                    jobNumber:null,
                    entryTime:null,
                    dimissionFlag:null,
                    phone:null,
                    telephone:null,
                    email:null,
                    password:null,
                    dimissionTime:null
                },
                userRules: {
                    entryTime: [
                        {required: true, validator: checkEntryTime, trigger: 'blur'},
                    ],
                    name: [
                        {required: true, validator: checkName, trigger: 'blur' },
                    ],
                    jobNumber:[
                        {required: true, validator: checkJob, trigger: 'blur' }
                    ],
                    organizationId:[
                        {validator: checkOrg,required: true, trigger: 'blur' },
                    ],
                    dimissionFlag:[
                        {required: true, trigger: 'change' },
                    ]
                }
            }
        },
        watch: {
            "search.startDateT": function (val) {
                this.search.startDate = val ? new Date(val).getTime() : null
            },
            "search.endDateT": function (val) {
                this.search.endDate = val ? (new Date(val).getTime()+86400000-1) : null
            }
        },
        methods: {
            append(store, data) {
                store.append({ id: id++, label: 'testtest', children: [] }, data);
            },

            remove(store, data) {
                store.remove(data);
            },
            getNode(nodeData,b,c){
                let that                    = this
                that.current.node           = nodeData
                Util.dataReset(that.search)
                that.search.organizationId  = that.current.node.id
                this.doSearch()
//                if(nodeData.children == null)
//                    nodeData.children = []
//                that.list = nodeData.children
            },
//            handleNodeClick(data) {
//                console.log(data);
//            },
            expandHandler(val){
                if(val == true){
                    this.staffList = Staff.list
                }
            },
            expandHandler(val){
                if(val == true){
                    this.staffList = Staff.list
                }
            },
            checkRole(){
                let role = this.role

//                console.log("角色:",role)

                if(role == null){
                    return false
                }
                return true
            },
            doSearchHandler(){
                let that = this
                that.search.organizationId = null
                that.doSearch()
            },
            doSearch(){
                let that        = this
                let url         = Vue.agent.root + '/manageUser/user/search'
                var reqData     = {
                    pageSize:that.pageSize,
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

            //显示分配岗位
            showStation(val){
                let that      = this
                that.action   = 'update'
//                Object.assign(that.user,val)
                that.visible.station  = true
            },

            //
            handleCheckedChange(val){
                console.log("checkList",this.checkList)
            },
            //批量分配岗位
            doUpdateStationHandler(){
                let that = this
                if(that.userCheckList.length < 1){
                    this.updateStation(that.current.userId,this.stationCheckList.join(","),function () {
                        that.stationCheckList = []
                        that.current.userId = null
                        that.visible.station = false
                    })
                }else{
                    this.updateStationBatch(this.userCheckList.join(","),this.stationCheckList.join(","),function () {
                        that.userCheckList = []
                        that.stationCheckList = []
                        that.visible.station = false
                    })
                }

            },
//            显示修改单个岗位
            showStationSingle(val){
                let that      = this
                let post      = !!(val.row.post) ? (val.row.post).slice(1,-1).split(",") : []
                let userId    = val.row.id
                for(let i= 0;i<post.length;i++)
                    post[i] = parseInt(post[i])
                console.log(post)
                that.userCheckList    = []
                that.action           = 'update'
                that.stationCheckList = post
                that.current.userId   = userId
                that.visible.station  = true
            },
            //批量更新岗位
            updateStationBatch(users,stations,callback){
                let that        = this
                let url         = Vue.agent.root + '/role/batchInsertUserRole'
                that.$http.post(url,{
                    userIds:users,
                    roleIds:stations,
                    funcId:that.funcId
                }).then(function (res) {
                    if(res.body.code == "200") {
//                        console.log(res)
                    }else{
                        this.$message({type: 'error',message: '修改失败'});
                    }
                    !!callback && callback()
                });
            },
            //更新岗位
            updateStation(userId,stations,callback){
                let that        = this
                let url         = Vue.agent.root + '/role/updateUserRoles'
                that.$http.post(url,{
                    userId:userId,
                    roleIds:stations,
                    funcId:that.funcId
                }).then(function (res) {
                    if(res.body.code == "200") {
                        console.log(res)
                    }else{
                        this.$message({type: 'error',message: '修改失败'});
                    }
                    if(callback)
                        callback()
                });
            },
            showAdd(val){
                let that      = this
                that.titile   = "新增用户"
                that.action   = 'add'
                Util.dataReset(that.user)
                that.getJobNum(function () {
                    that.visible.user  = true
                })

            },
            //获取最新工号
            getJobNum(callback){
                let that        = this
                let url         = Vue.agent.root + '/manageUser/user/jobNumber'
                that.$http.get(url,{params:{}}).then(function (res) {
                    if(res.body.code == "200") {
                        that.user.jobNumber = res.body.data
                        callback()
                    }
                });
            },
            //处理用户新增和修改
            doSave(formName){
                let that = this
                if(that.action == 'add'){
                    that.$refs[formName].validate((valid) => {
                        if (valid) {
                            that.add(function () {
//                                that.list.push(that.org)
                                that.visible.user  = false
                            })
                        } else {
                            console.log('error submit!!');
                            return false;
                        }
                    });

                }
                if(that.action == 'update'){
                    that.$refs[formName].validate((valid) => {
                        if (valid) {
                            that.update(function () {
                                that.visible.user  = false
                            })
                        } else {
                            console.log('error submit!!');
                            return false;
                        }
                    });

                }
            },
            //列表显示修改用户dialog
            showEdit(val){
                let that            = this
                that.titile         = "修改用户"
                that.action         = 'update'
                currentUser         = val

                Object.assign(that.user,val)

                that.user.password  = null

                that.visible.user   = true

            },
            //修改用户
            update(callback){
                let that        = this
                let url         = Vue.agent.root + '/manageUser/user/update'
                let user        = that.user
                let pwd         = !!user.password ? Util.md5Encrypt(user.password) : null

                var reqData     = {
                    id:user.id,
                    name:user.name,
                    organizationId:user.organizationId,
                    jobNumber:user.jobNumber,
                    entryTime:new Date(user.entryTime).getTime(),
                    phone:user.phone,
                    telephone:user.telephone,
                    dimissionTime: !!user.dimissionTime ? new Date(user.dimissionTime).getTime() : null,
                    dimissionFlag:user.dimissionFlag,
                    password:pwd,
                    funcId:that.funcId
                }

                Util.dataClear(reqData)

                that.$http.put(url,reqData).then(function (res) {
                    if(res.body.code == "200") {
                        that.$notify({title: '成功',message: '修改成功',type: 'success'});
                        callback()
                        Object.assign(currentUser,reqData)
                    }
                });
            },
//            新建用户
            add(callback){
                let that        = this
                let user        = that.user
                let url         = Vue.agent.root + '/manageUser/user/add'
                var reqData     = {
                    name:user.name,
                    organizationId:user.organizationId,
                    jobNumber:user.jobNumber,
                    entryTime:new Date(user.entryTime).getTime(),
                    phone:user.phone,
                    telephone:user.telephone,
//                    email:user.email,
                    password:Util.md5Encrypt(user.password),
                    funcId:that.funcId,
//                    dimissionTime:new Date(user.dimissionTime).getTime(),
                    dimissionFlag:user.dimissionFlag,
                }

                that.$http.post(url,reqData).then(function (res) {
                    if(res.body.code == "200") {
                        that.$notify({title: '成功',message: '添加成功',type: 'success'});
                        that.visible.user  = false
                        callback()
                    }
                });
            },
//            禁用用户事件响应
            doEnableUser(scope){
                let index  = scope.$index
                let that   = this
                let id     = scope.row.id

                that.$confirm('确认要更改?, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    that.enableUser(id,function () {
                        scope.row.enableFlag = scope.row.enableFlag == 1 ? 0 : 1
//                        that.list.splice(index,1)
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
//            禁用用户
            enableUser(id,callback){
                let that        = this
                let url         = Vue.agent.root + '/manageUser/user/enable'
                var reqData     = {
                    id:id,
                    funcId:that.funcId
                }

                that.$http.put(url,reqData).then(function (res) {
                    if(res.body.code == 200) {
                        that.$message({type: 'success',message: '操作成功'});
                        !!callback && callback()
                    }else{
                        that.$message({type: 'error',message: '操作失败'});
                    }
                });
            },
            //显示个人权限dialog
            showRoleHandler(val){
//                console.log(val)
                let userId        = val.row.id
                let that          = this
                that.current.userId = userId
                that.current.custom = val.row.permissionType
                that.getRole(userId,function () {
//                    that.current.roleId = roleId
                    that.visible.role   = true
                })
            },
            //显示分配下属dialog
            showSubordinate(scope){
                let that                   = this
                let userId                 = scope.row.id
                that.current.userId        = userId
                that.visible.subordinate   = true
                that.subordinateCheckList  = []
                that.getSubordinateList()
            },
            doSubordinateHandler(){
                let that = this
                that.setSubordinate()

            },
            //设置下属
            setSubordinate(){
                let that            = this
                let url             = Vue.agent.root + '/manageUser/subordinate/set'
                let manageUserId    = that.current.userId
                let subordinateIds  = that.subordinateCheckList.join(",")
                var reqData     = {
                    subordinateIds:subordinateIds,
                    manageUserId:manageUserId,
                    funcId:that.funcId
                }

                that.$http.put(url,reqData).then(function (res) {
                    if(res.body.code == "200") {
                        this.$message({type: 'success',message: '修改成功'});
                    }else{
                        this.$message({type: 'error',message: '操作失败'});
                    }
                    that.subordinateCheckList = []
                    that.current.userId = null
                    that.visible.subordinate   = false
                });

            },
//            获取可分配下属列表
            getSubordinateList(){
                let that        = this
                let roleUrl     = Vue.agent.root + '/manageUser/subordinate/list'
                let userId      = that.current.userId
                let reqData     = {
                    manageUserId:userId,
                    funcId:that.funcId
                }
                that.$http && that.$http.get(roleUrl,{
                    params:reqData
                }).then(function (res) {
                    if(res.body.code == "200") {
                        let data        = res.body.data[0]
                        let obj         = {
                            id:data.id,
                            label:data.label,
                            users:data.users
                        }

                        data.children.unshift(obj)
                        data.children.forEach(v=>{
                            if(!!v.children &&  v.children.length > 0){
                                v.children.forEach(c=>{
                                    c.users.forEach(u=>{
                                        if(u.selected == 1)
                                            that.subordinateCheckList.push(u.id)
                                    })
                                })
                            }
                            v.users.forEach(u=>{
                                if(u.selected == 1)
                                    that.subordinateCheckList.push(u.id)
                            })
                        })
                        that.subordinateTree = []
                        that.subordinateTree = data.children
//                        console.log(that.subordinateTree)
                    }
                });
            },
            //更新用户权限
            updateUserRoleHandler(){
                let that        = this
                let userId      = that.current.userId
                let opType      = that.current.custom
                let url         = Vue.agent.root + '/role/updateUserFuncs'
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
                console.log(funcs)

                let reqData     = {
                    userId:userId,
                    funcIds:funcs,
                    opType:opType,
                    funcId:that.funcId
                }

                that.$http && that.$http.post(url,reqData,{
                    timeout:3000
                }).then(function (res) {
                    if(res.body.code == "200") {
                        this.$message({type: 'success',message: '更新成功'});
                        that.visible.role   = false
                    }
                });
            },
            //获取用户权限
            getRole(userId,callback){
                let that        = this
                let roleUrl     = Vue.agent.root + '/role/selectUserFuncs'
                let reqData     = {
                    userId:userId,
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
            doExport(){
                let that        = this
                let url         = Vue.agent.root + '/customer/excel'

                let fileName    = "客户基本情况" + moment().format("YYYY-MM-DD hh:mm:ss")
                var reqData     = {
                    funcId:that.funcId
                }

                Object.assign(reqData,that.search)
                Util.dataClear(reqData)

                this.$http.post(url, {},{responseType: 'arraybuffer'})
                    .then(response=>{
                        Util.getFile(response,fileName)
                    })
                    .catch((err) => {
                        console.log(err)
                    })

            },
            doReset(){
                let search = this.search
                Util.dataReset(search)
            },
            handleCurrentChange(val) {
                this.pageNum = val
                this.doSearch()
            },
//            岗位格式化
            userPostFormat(val){
                let that     = this
                let post     = !!val ? val.slice(1,-1).split(",") : []
                let arr      = []
                let list     = that.stationList
                post.forEach((v)=>{
                    let a = list.find((e)=>{
                        return e.id == v
                    })
                    if(!!a)
                        arr.push(a.roleName)
                })

                let str = arr.join(",")

                return str
            }
        },
        created:function () {
            let that        = this

            let urlTrees     = Vue.agent.root + '/organization/list'

            that.$http && that.$http.get(urlTrees,{
                params:{
                    funcId:that.funcId
                }
            }).then(function (res) {
                if(res.body.code == "200") {
                    let data = res.body.data
//                    data.forEach((v)=>{
//                        v.label = v.name
//                        v.label = v.name
//                    })
//                })
                    that.orgTrees = data
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

            //获取岗位列表

            let urlStation         = Vue.agent.root + '/role/selectAll'

            that.$http.get(urlStation,{params:{
                pageSize:100,
                pageNum:1,
                funcId:that.funcId
            }}).then(function (res) {
                if(res.body.code == "200") {
                    let data          = res.body.data

                    that.stationTree  = Util.arrayGroupBy(Array.from(data.list))
                    that.stationList  = Array.from(data.list)
//                    console.log(that.stationTree)
//                    console.log("stationList",that.stationList)
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
    @import 'src/scss/pages/org/manage.scss';
</style>