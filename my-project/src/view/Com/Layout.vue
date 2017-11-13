<template>
    <div class="layout" :class="{'layout-left-hide': toggleActive}">
        <div class="layout-wrp ivu-row-flex">
            <div class="layout-menu-left ivu-col">
                <Menu @on-select="menuSelected" :open-names="openMenus" :active-name.sync="active" theme="light" width="auto">
                    <div class="layout-logo-left">
                        <img src="../../img/logo.jpg">
                    </div>
                    <template  v-for="menu in leftMenus.children">
                        <Menu-item v-if="!menu.children && checkRole(menu.funcId)" :name="menu.index">
                            <router-link class="link" :to="menu.path">
                                <!--<Icon :type="menu.icon" :size="iconSize"></Icon>-->
                                <span class="layout-text">{{menu.alias}}</span>
                            </router-link>
                        </Menu-item>
                        <!--&& checkRole(menu)-->
                        <Submenu v-if="!!menu.children" :name="menu.index">
                            <template slot="title">
                                <!--<Icon :type="menu.icon" :size="iconSize"></Icon>-->
                                <span class="layout-text">{{menu.alias}}</span>
                            </template>
                            <template v-for="subMenu in menu.children">
                                <Menu-item  :name="subMenu.index">
                                    <router-link class="link" :to="subMenu.path">
                                        <span class="link-text">{{subMenu.alias}}</span>
                                    </router-link>
                                </Menu-item>
                            </template>
                        </Submenu>
                    </template>
                </Menu>
            </div>
            <div class="ivu-col layout-right">
                <!--<div class="layout-header">-->
                    <Menu @on-select="navSelected" :active-name.sync="activeNav"
                          class="layout-header" mode="horizontal" theme="light" >
                        <div class="layout-toggle pull-left">
                            <i-button type="text" @click.native="toggleClick">
                                <Icon type="navicon" size="26"></Icon>
                            </i-button>
                        </div>
                        <div class="layout-nav">
                            <template  v-for="menu in menus">
                                <Menu-item v-if="checkRole(menu.funcId)" :name="menu.index">
                                    <!--<Icon :type="menu.icon"></Icon>-->
                                    {{menu.name}}
                                </Menu-item>
                            </template>
                        </div>
                        <div class="fr nav_fr layout-user pull-right">
                            <Dropdown trigger="click">
                                <a href="javascript:void(0)">
                                    {{user.name}}
                                    <Icon type="arrow-down-b"></Icon>
                                </a>
                                <Dropdown-menu slot="list">
                                    <Dropdown-item>
                                        <a @click.prevent="showUpdatePwd">修改密码</a>
                                    </Dropdown-item>
                                    <Dropdown-item>
                                        <a @click.prevent="doLogout">安全退出</a>
                                    </Dropdown-item>
                                    <!--<Dropdown-item>炸酱面</Dropdown-item>-->
                                    <!--<Dropdown-item disabled>豆汁儿</Dropdown-item>-->
                                    <!--<Dropdown-item>冰糖葫芦</Dropdown-item>-->
                                    <!--<Dropdown-item divided>北京烤鸭</Dropdown-item>-->
                                </Dropdown-menu>
                            </Dropdown>
                        </div>
                    </Menu>
                <!--</div>-->
                <div class="layout-breadcrumb">
                    <Breadcrumb>
                        <!--<Breadcrumb-item href="index">首页</Breadcrumb-item>-->
                        <Breadcrumb-item v-if="!!lever.parent">{{lever.parent}}</Breadcrumb-item>
                        <Breadcrumb-item v-if="!!lever.middle">{{lever.middle}}</Breadcrumb-item>
                        <Breadcrumb-item>{{lever.name}}</Breadcrumb-item>
                    </Breadcrumb>
                </div>
                <div class="layout-content">
                    <transition name="move" mode="out-in">
                        <router-view></router-view>
                    </transition>
                </div>
                <div class="layout-copy">
                    2015-2020 &copy; Anfast
                </div>
            </div>
        </div>

        <!--新建客户-->
        <el-dialog title="修改密码" class="org-dialog" :visible.sync="visible.updatePwd" size="tiny" >
            <el-form :model="pwd" :rules="pwdRules" ref="pwd" label-width="100px">
                <el-form-item label="密码" prop="password">
                    <el-input v-model="pwd.password" type="password"  placeholder="请输入密码"></el-input>
                </el-form-item>
                <!--<el-form-item label="身份证号" prop="certNo">-->
                    <!--<el-input  v-model="person.certNo" placeholder="请输入身份证号"></el-input>-->
                <!--</el-form-item>-->
                <el-form-item label="确认密码" prop="checkPwd">
                    <el-input type="password"  v-model="pwd.repeat" placeholder="请确认密码"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button class="pull-left" @click.native="visible.updatePwd = false">取 消</el-button>
                <el-button type="primary" @click.native="doUpdatePwdHandler('pwd')">确 认</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<style lang="scss">
    @import "../../scss/com/layout.scss";
</style>
<script>
    import vHead        from  './Header.vue'
    import vSidebar     from  './Sidebar.vue'
    import Util         from  '../../js/util'
    import auth         from '../../js/auth.js'

    import {list}       from  'src/js/router'

    //    import Levelbar from './Levelbar.vue'
    export default{
        name: "Layout",
        data: function () {

            var validatePwd = (rule, value, callback) => {
                if (!this.pwd.repeat) {
                    callback(new Error('请再次输入密码'));
                } else if (this.pwd.repeat != this.pwd.password) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };

            return {
                spanLeft: 4,
                spanRight: 20,
                menus: list,
                lever: {
                    parent: "",
                    name: '',
                    middle:''
                },
                visible:{
                  updatePwd:false
                },
                active:"",
                activeNav:"",
                leftMenus:[],
                openMenus:[],
                toggleActive:false,
                user:auth.getUser(),
                pwd:{
                  password:null
                },
//                role:auth.getRole(),
                pwdRules: {
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                    ],
                    checkPwd: [
                        {required: true, validator: validatePwd, trigger: 'blur' }
                    ],
                }

            }
        },
        watch:{
            "$route": function (val) {
                this.restNavSelection()
            },
        },
        computed: {

        },
        methods: {
            //显示修改密码
            showUpdatePwd(){
                let that = this
                that.visible.updatePwd = true
            },
            doUpdatePwdHandler(pwd){
                let that = this
                this.$refs[pwd].validate((valid) => {
                    if (valid) {
                        that.updatePwd(function () {
                            that.visible.updatePwd = false
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            updatePwd(callback){
                let that        = this
                let url         = Vue.agent.root + '/manageUser/user/changePassword'
                let reqData     = {
                    password:Util.md5Encrypt(that.pwd.password)
                }
                that.$http.put(url,reqData).then(function (res) {
                    if(res.body.code == "200") {
                        this.$message({type: 'success',message: '修改成功'});
                        !!callback && callback()
                    }
                });

            },
            checkRole(funcId){
                return auth.checkRole(funcId)
            },
            toggleClick () {
                this.toggleActive = !this.toggleActive
            },
            menuSelected: function (val) {
                let lever = this.lever
                Util.dataReset(lever)
                list.forEach((ele, index) => {
                    if (!!ele.children) {
                        let menus = ele.children

                        menus.forEach((menu, i) => {
                            if(!!menu.children){
                                let subMenus = menu.children
                                subMenus.forEach(sub=>{
                                    if(sub.index == val){
                                        lever.name      = sub.alias
                                        lever.middle    = menu.alias
                                        lever.parent    = ele.name
                                    }
                                })
                            }else{
                                if (menu.index == val) {
                                    lever.name = menu.alias
                                    lever.parent = ele.name
                                }
                            }

                        })
                    } else {
                        if (ele.index == val) {
                            lever.name = ele.name
                            lever.parent = null
                        }
                    }
                })
//                console.log(val)
            },
            navSelected:function (val) {
                let that  = this
                let lever = that.lever

                let res   = list.find((el)=>{
                    return el.index == val
                })

                that.leftMenus = res

                if(res.redirect){
                    that.$router.push(res.redirect);
                    let path  = res.redirect.slice(1)
                    let route = res.children.find((el)=>{
                        return el.path == path
                    })
                    setTimeout(function () {
                        that.active = route.index
                    },100)
                    lever.name      = route.alias
                    lever.parent    = res.name

                }

            },
            doLogout(){
                this.$confirm('确认登出, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.logout()
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            logout(){
                let that        = this
                let url         = Vue.agent.root + '/login/signOut'
                that.$http.get(url).then(function (res) {
                    auth.logout()
                    that.$router.replace('/login');
                    this.$message({
                        type: 'success',
                        message: '登出成功!'
                    });

                });
            },
            restNavSelection(){
                let that  = this
                let lever = that.lever
                let path  = that.$route.path.slice(1)

                let m     = null

                list.forEach((ele, index) => {
                    if (!!ele.children) {
                        let menus = ele.children
                        menus.forEach((menu, i) => {
                            if(!!menu.children){
                                let subMenus = menu.children
                                subMenus.forEach(sub=>{
                                    if(sub.path == path){
                                        lever.name      = sub.alias
                                        lever.middle    = menu.alias
                                        lever.parent    = ele.name
                                        that.active     = sub.index
                                        that.activeNav  = ele.index
                                        m               = ele
                                    }
                                })
                            }else{
                                if (menu.path == path) {
                                    lever.name      = menu.alias
                                    lever.parent    = ele.name
                                    that.active     = menu.index
                                    that.activeNav  = ele.index
                                    that.openMenus  = [ele.index]
                                    m               = ele
                                }
                            }

                        })
                    } else {
                        if (ele.path == path) {
                            lever.name      = ele.name
                            lever.parent    = null
                            that.active     = ele.index
                            that.activeNav  = ele.index
                            m               = ele
                        }
                    }
                })
                that.leftMenus = m
            }
        },
        created(){
            this.restNavSelection()
        },
        components: {
            'v-head': vHead,
            'v-sidebar': vSidebar
        }
    }
</script>
