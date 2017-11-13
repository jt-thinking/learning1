<template>
    <div class="login-wrap">
        <div class="login-box">
            <div class="ms-title">
                <img class="icon" src="../../img/logo.png">
                <span>
                    信审管理系统
                </span>
            </div>
            <div class="ms-login">
                <el-form :model="user" :rules="rules" ref="user" label-width="0px" class="demo-ruleForm">
                    <el-form-item prop="jobNumber">
                        <el-input v-model="user.jobNumber" placeholder="工号"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input type="password" placeholder="密码" v-model="user.password" @keyup.enter.native="submitForm('user')"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-col :span="12">
                            <el-input placeholder="验证码"></el-input>
                        </el-col>
                        <el-col :span="12">
                            <div class="code">
                                <img height="36" alt="" src="https://passport.netease.im/czc/cregcp?&amp;t=1489112941457">
                            </div>
                        </el-col>
                    </el-form-item>
                    <!--<el-form-item>-->
                    <!--<el-input type="password" placeholder="手机验证码"></el-input>-->
                    <!--</el-form-item>-->
                    <div class="login-btn">
                        <el-button class="el-button-login" type="primary" @click="submitForm('user')">登录</el-button>
                    </div>
                    <p class="tips">Tips : 忘记密码联系管理员</p>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    import auth from '../../js/auth.js'
    import util from '../../js/util.js'
    export default {
        data: function(){
            return {
                user: {
                    jobNumber: '',
                    password: ''
                },
                rules: {
                    jobNumber: [
                        { required: true, message: '请输入帐号', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            submitForm(formName) {
                const self = this;
                self.$refs[formName].validate((valid) => {
                    if (valid) {
//                        auth.login();
                        //localStorage.setItem('ms_username',self.ruleForm.username);
//                        self.$router.push('/index');
                        self.doLogin()

                    } else {
//                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            doLogin(){
                let that        = this
                let user        = that.user
                let url         = Vue.agent.root + '/login/signIn'
                var reqData     = {
                    jobNumber:user.jobNumber,
                    password:util.md5Encrypt(user.password)
                }

                that.$http.post(url,reqData,{
                    timeout:3000
                }).then(function (res) {
                    if(res.body.code == "200") {
                        let user  = res.body.data
                        auth.login(user);
                        auth.setUser(user)
                        that.doGetRole(function () {
                            that.$router.replace('/index-dashboad');
                        })
                    }else{
                        that.$message.error(res.body.message);
                    }
                });
            },
            doGetRole(callback){
                let that        = this
                let url         = Vue.agent.root + '/role/selectUserFuncsOnlyOwn'
                var reqData     = {
                    userId:auth.getUserId()
                }

                that.$http.get(url,{params:reqData}).then(function (res) {
                    if(res.body.code == "200") {
                        let roles = res.body.data
                        auth.setRoles(roles)
                    }else{
                        that.$message.error(res.body.message);
                    }
                    !!callback && callback()
                });
            }
        },

    }
</script>

<style lang="scss">
    @import "../../scss/com/login.scss";
</style>