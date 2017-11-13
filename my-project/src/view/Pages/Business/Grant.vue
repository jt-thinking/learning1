<template>
    <div class="business-loan">
        <el-tabs v-model="tab.active" type="card" @tab-click="handleClick">
            <el-tab-pane label="个人授信" name="loan">
                <div class="busy-box">
                    <div class="search-box">
                        <el-form   :model="formInline" label-width="66px" >
                            <el-form-item label-width="30px" >
                                <el-button @click.native="doProdSearchHandler" size="small" type="primary">查询</el-button>
                                <el-button @click.native="doLendLoanHandler" size="small" type="primary">提交放款</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
                <div class="table">
                    <el-table
                            expand="expandHandler"
                            v-loading="prodData.loading"
                            :data="prodData.list"
                            border
                            @selection-change="selectionHandler"
                            style="width: 100%">
                        <el-table-column
                                type="selection"
                                width="55">
                        </el-table-column>
                        <el-table-column
                                label="操作"
                                align="center"
                                min-width="80">
                            <template scope="scope">
                                <el-button size="small" @click.native="showContractListHandler(scope)" type="text">查看合同</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="授信合同编号"
                                align="center"
                                min-width="160">
                            <template scope="scope">
                                <el-button size="small" @click.native="showCreditEditHandler(scope)" type="text">{{scope.row.creditNo}}</el-button>
                            </template>
                        </el-table-column>

                        <el-table-column
                                align="center"
                                label="客户姓名"
                                min-width="100">
                            <template scope="scope">
                                <el-button type="text" @click.native="showCustomInfoHandler(scope.row.custId)">{{ scope.row.custName }}</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="certNo"
                                align="center"
                                label="身份证号"
                                min-width="160">
                        </el-table-column>
                        <el-table-column
                                prop="basePrdName"
                                label="基本产品"
                                align="center"
                                min-width="130">
                        </el-table-column>
                        <el-table-column
                                prop="subPrdName"
                                label="附属产品"
                                align="center"
                                min-width="130">
                        </el-table-column>
                        <el-table-column
                                prop="marketPrdName"
                                label="营销产品"
                                align="center"
                                width="140">
                        </el-table-column>
                        <el-table-column
                                label="申请金额"
                                align="center"
                                min-width="140">
                            <template scope="scope">
                                <span>{{ scope.row.creditAmt | moneyFormat }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                align="center"
                                label="申请期限"
                                min-width="100">
                            <template scope="scope">
                                <span>{{ scope.row.duration }}天</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="operaterName"
                                align="center"
                                label="经办人"
                                min-width="100">
                        </el-table-column>
                        <el-table-column type="expand">
                            <template scope="props">
                                <el-form label-position="left" inline class="table-expand">
                                    <el-form-item label="授信合同编号">
                                        <span>{{ props.row.creditNo }}</span>
                                    </el-form-item>
                                    <el-form-item label="客户姓名">
                                        <span>{{ props.row.custName }}</span>
                                    </el-form-item>
                                    <el-form-item label="身份证号">
                                        <span>{{ props.row.certNo }}</span>
                                    </el-form-item>
                                    <el-form-item label="基本产品">
                                        <span>{{ props.row.basePrdName }}</span>
                                    </el-form-item>
                                    <el-form-item label="附属产品">
                                        <span>{{ props.row.subPrdName }}</span>
                                    </el-form-item>
                                    <el-form-item label="营销产品">
                                        <span>{{ props.row.marketPrdName }}</span>
                                    </el-form-item>
                                    <el-form-item label="申请期限">
                                        <span>{{ props.row.duration }}天</span>
                                    </el-form-item>
                                    <el-form-item label="经办人">
                                        <span>{{ props.row.operaterName }}</span>
                                    </el-form-item>
                                    <el-form-item label="受理机构">
                                        <span>{{ props.row.operaterOrgName }}</span>
                                    </el-form-item>
                                </el-form>

                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="footer-box">
                    <span v-if="startRow" class="pull-left">显示{{startRow}}-{{endRow}} 总共有{{total}}条目</span>
                    <div class="pagination pull-right">
                        <el-pagination
                                layout="prev, pager, next"
                                @current-change="prodCurrentPageChange"
                                :page-size="prodData.pageSize"
                                :current-page.sync="prodData.pageNum"
                                :total="prodData.total">
                        </el-pagination>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="单笔借款" name="record">

            </el-tab-pane>
        </el-tabs>



        <!--新建产品 -->
        <el-dialog title="借款产品" class="org-dialog" :visible.sync="visible.addProd" size="tiny" >
            <el-form :model="prod" :rules="prodRules" ref="prod" label-width="100px">
                <el-form-item label="产品名称" prop="prdName">
                    <el-input v-model="prod.prdName"  placeholder="请输入产品名称"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button class="pull-left" @click.native="visible.addProd = false">取 消</el-button>
                <el-button type="primary" @click.native="doSaveProdHandler('prod')">确 认</el-button>
            </div>
        </el-dialog>

        <!--修改产品 -->
        <el-dialog title="借款产品" class="org-dialog" :visible.sync="visible.editProd" size="tiny" >
            <el-form :model="prod" :rules="prodRules" ref="prod" label-width="100px">
                <el-form-item label="产品名称" prop="prdName">
                    <el-input v-model="prod.prdName"  placeholder="请输入产品名称"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button class="pull-left" @click.native="visible.editProd = false">取 消</el-button>
                <el-button type="primary" @click.native="doProdUpdateHandler('prod')">确 认</el-button>
            </div>
        </el-dialog>


        <!--新增属性 -->
        <el-dialog title="产品属性" class="org-dialog" :visible.sync="visible.addAttr" size="tiny" >
            <el-form :model="prod" :rules="attrRules" ref="prod" label-width="140px">
                <el-form-item label="产品名称" prop="prdName">
                    <span>{{ prod.prdName }}</span>
                </el-form-item>

                <el-form-item label="出借金额" required>
                    <el-col :span="11">
                        <el-form-item prop="minPrincipal" :rules="[
                            {required: true, message: '输入最小起借金额'},
                            { type: 'number', message: '必须为数字值'}
                            ]">
                            <el-input v-model.number="prod.minPrincipal" placeholder="最小金额(元)"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="line" :span="2">-</el-col>
                    <el-col :span="11">
                        <el-form-item prop="maxPrincipal" :rules="[
                            {required: true, message: '输入最大可借金额'},
                            { type: 'number', message: '必须为数字值'}
                            ]">
                            <el-input v-model.number="prod.maxPrincipal"  placeholder="最大金额(元)"></el-input>
                        </el-form-item>
                    </el-col>
                </el-form-item>
                <el-form-item label="出借期限" required>
                    <el-col :span="11">
                        <el-form-item prop="minDuration" :rules="[
                                {required: true, message: '输入最小期限'},
                                { type: 'number', message: '必须为数字值'}
                            ]">
                            <el-input v-model.number="prod.minDuration"   placeholder="最小期限(天)"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="line" :span="2">-</el-col>
                    <el-col :span="11">
                        <el-form-item prop="maxDuration" :rules="[
                                {required: true, message: '输入最大期限'},
                                { type: 'number', message: '必须为数字值'}
                            ]">
                            <el-input v-model.number="prod.maxDuration"  placeholder="最大期限(天)"></el-input>
                        </el-form-item>
                    </el-col>
                </el-form-item>
                <el-form-item label="综合成本" required>
                    <el-col :span="11">
                        <el-form-item prop="minCostRate" :rules="[
                                {required: true, message: '输入最小综合成本'},
                                { type: 'number', message: '必须为数字值'}
                            ]">
                            <el-input v-model.number="prod.minCostRate"  placeholder="最小综合成本">
                                <template slot="append">%</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="line" :span="2">-</el-col>
                    <el-col :span="11">
                        <el-form-item prop="maxCostRate" :rules="[
                                {required: true, message: '输入最大综合成本'},
                                { type: 'number', message: '必须为数字值'}
                            ]">
                            <el-input v-model.number="prod.maxCostRate"  placeholder="最大综合成本">
                                <template slot="append">%</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-form-item>

                <el-form-item label="借款利率" prop="loanRate" :rules="[
                        {required: true, message: '输入借款利率'},
                        { type: 'number', message: '必须为数字值'}
                    ]">
                    <el-input v-model.number="prod.loanRate"  placeholder="借款利率">
                        <template slot="append">%</template>
                    </el-input>
                </el-form-item>

                <el-form-item v-show="prod.repayType != 4 " label="服务费率">
                    <span>{{prod.minCostRate - prod.loanRate}}%</span>
                </el-form-item>
                <el-form-item v-show="prod.repayType == 4 " label="分期服务费率">
                    <span>{{prod.minCostRate - prod.loanRate}}%</span>
                </el-form-item>


                <el-form-item label="罚息利率" prop="penaltyRate"  :rules="[
                        {required: true, message: '输入罚息利率'},
                        { type: 'number', message: '必须为数字值'}
                    ]">
                    <el-input v-model.number="prod.penaltyRate"  placeholder="请输入罚息利率">
                        <template slot="append">%</template>
                    </el-input>
                </el-form-item>

                <el-form-item label="还款类型" prop="repayType" :rules="[
                        { required: true, message: '请选择还款类型'}
                    ]">
                    <el-select v-model="prod.repayType" placeholder="请选择还款类型">
                        <el-option  label="请选择还款类型" :value="null"></el-option>
                        <el-option
                                v-for="item in ops.repayType"
                                :key="item.id"
                                :label="item.name"
                                :value="parseInt(item.value)">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button class="pull-left" @click.native="visible.addAttr = false">取 消</el-button>
                <el-button v-show="current.action == 'add'" type="primary" @click.native="doAddAttributeHandler('prod')">提交审核</el-button>
                <el-button v-show="current.action == 'edit'" type="primary" @click.native="doEditAttributeHandler('prod')">提交审核</el-button>
            </div>
        </el-dialog>


        <!--合同列表 -->
        <el-dialog title="合同列表" class="org-dialog" :visible.sync="visible.contract" size="large" >
            <div class="table">
                <el-table
                        :data="contract.list"
                        border
                        style="width: 100%">
                    <el-table-column
                            prop="guaranteeId"
                            align="center"
                            label="担保合同编号"
                            min-width="140">
                    </el-table-column>
                    <el-table-column
                            prop="custName"
                            align="center"
                            label="担保人姓名"
                            min-width="140">
                        <template scope="scope">
                            <el-button type="text" @click.native="showCustomInfoHandler(scope.row.guaranteerId)">{{ scope.row.custName }}</el-button>
                        </template>
                    </el-table-column>

                    <el-table-column
                            align="center"
                            label="担保类型"
                            min-width="140">
                        <template scope="scope">
                            <span>{{scope.row.guaranteeType | opsFormat(ops.guaranteeType)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="担保合同金额"
                            min-width="140">
                        <template scope="scope">
                            <span>{{scope.row.guaranteeAmt | moneyFormat }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="担保起始日期"
                            min-width="140">
                        <template scope="scope">
                            <span>{{scope.row.startDate | dateFormat }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="担保到期日期"
                            min-width="140">
                        <template scope="scope">
                            <span>{{scope.row.expirationDate | dateFormat }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="担保合同状态"
                            min-width="140">
                        <template scope="scope">
                            <span>{{scope.row.status | opsFormat(ops.guaranteeContractStatus)}}</span>
                        </template>
                    </el-table-column>


                    <el-table-column
                    align="center"
                    label="操作"
                    min-width="180">
                        <template scope="scope">
                            <el-button size="mini" @click.native="createContractHandler(scope)">生成合同</el-button>
                            <el-button size="mini" @click.native="manageContractHandler(scope)">管理合同</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button class="pull-left" @click.native="visible.contract = false">取 消</el-button>
                <!--<el-button type="primary" @click.native="doSaveProdHandler('prod')">确 认</el-button>-->
            </div>
        </el-dialog>



        <!--管理合同 -->
        <el-dialog title="管理合同" class="org-dialog" :visible.sync="visible.files" size="small">
            <el-form  :model="contract.files"  ref="uploadItem" label-width="100px">
                <div>
                    <el-upload
                            action="root/business/guarantee/contract/upload"
                            list-type="picture-card"
                            :on-preview="handlePictureCardPreview"
                            :file-list="contract.fileList"
                            :on-success="handleUploadSuccess"
                            :data="uploadItemData"
                            :multiple="true"
                            :auto-upload="true"
                            :headers="headers"
                            ref="uploadItem"
                            :on-remove="uploadDetailRemoveHandler">
                        <i class="el-icon-plus"></i>
                    </el-upload>

                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button class="pull-left" @click.native="visible.files = false">取 消</el-button>
                <el-button type="primary" @click.native="visible.files = false">确 认</el-button>
            </div>
        </el-dialog>
        <el-dialog v-model="visible.bigImg" size="w800">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>

        <user-info :editable="false" :opened.sync="visible"  :custId.sync="current.custId"></user-info>
        <credit-info :editable="current.creditEditable" :opened.sync="visible"  :creditId.sync="current.creditId"></credit-info>

    </div>

</template>

<script>
    import Util             from    'src/js/util'
    import auth             from    'src/js/auth'
    import UserInfo         from    '../../Com/UserInfo.vue'
    import CreditInfo       from    '../../Com/CreditInfo.vue'

    let currentScope        = null

    export default {
        data() {
            return {
                prodData:{
                    list:[],
                    pageNum:1,
                    pageSize:15,
                    total:null,
                    loading:false
                },
                recordData:{
                    list:[],
                    pageNum:1,
                    pageSize:15,
                    total:null,
                    loading:false
                },
                list: [],
                contract:{
                    list:[],
                    fileList:[],

                },
                tab:{
                  active:'loan'
                },
                attrList:[],
                value: '',
                visible:{
                    addProd:false,
                    editProd:false,
                    addAttr:false,
                    chooseAttr:false,
                    contract:false,
                    files:false,
                    bigImg:false,
                    openUser:false,
                    openCredit:false,
                },
                dialogImageUrl:null,
                searchRecord:{
                    name:null,
                    releaseStartDatetimeT:null,
                    releaseStartDatetime:null,
                    releaseEndDatetime:null,
                    releaseEndDatetimeT:null,
                    loanRate:null,
                    costRate:null
                },
//                search:{
//
//                },
                prod:{
                    id:null,
                    prdName:null,
                    minPrincipal:null,
                    maxPrincipal:null,
                    minDuration:null,
                    maxDuration:null,
                    minCostRate:null,
                    maxCostRate:null,
                    loanRate:null,
                    penaltyRate:null,
                    repayType:null,
                },
                current:{
                    pId:null,
                    prod:null,
                    attr:null,
                    action:"add",
                    attr:null,
                    guaranteeId:null,
                    custId:null,
                    creditEditable:false,
                    creditId:null
                },
                attr:{

                },
                ops:{
                    repayType:[],
                    loanRate:[],
                    costRate:[],
                    approvalStatus:[],
                    guaranteeType:[],
                    guaranteeContractStatus:[]
                },
                loading: false,
                prodRules: {
                    prdName: [
                        {required: true, message: '请输入产品名称', trigger: 'blur'},
                    ],
                },
                attrRules: {

                },
                multipleSelection:[],
                funcId:'R060300',
                headers:{
                    'authorization':auth.getToken(),
//                    'Content-Type': 'multipart/form-data',
//                    'Accept':'application/json',
                }
            }
        },
        watch: {
            "searchRecord.releaseStartDatetimeT": function (val) {
                this.searchRecord.releaseStartDatetime = val ? new Date(val).getTime() : null
            },
            "searchRecord.releaseEndDatetimeT": function (val) {
                this.searchRecord.releaseEndDatetime = val ? (new Date(val).getTime()+86400000-1) : null
            },
        },
        computed:{
            uploadItemData:function () {
                let that            = this
                let ob = {
                    guaranteeId:that.current.guaranteeId,
                }
                return ob
            },
        },
        methods: {
//            选项事件
            selectionHandler(val){
                this.multipleSelection = val;
            },
//            展开事件
            expandHandler(row,expanded){

            },
            getCreditContract(){

            },

            //图片预览
            handlePictureCardPreview(file){
                this.dialogImageUrl = file.url;
                this.visible.bigImg = true;
            },

            //显示编辑用户 dialog
            showCustomInfoHandler(custId){
                let that = this
                that.visible.openUser = true
                that.current.custId = custId
            },

            //查看授信
            showCreditEditHandler(scope){
                let that    = this
                let credit  = scope.row
                that.current.creditId = credit.creditId
                that.visible.openCredit = true
                that.current.creditEditable = false
            },

            doLendLoanHandler(){
                let that = this
                let arr  =  []
                that.multipleSelection.forEach(v=>{
                    arr.push(v.creditId)
                })
                that.doLendLoan(arr.join(','),function () {

                })
            },
            doLendLoan(creditIds){
                let that        = this
                let url         = Vue.agent.root + '/business/lend/apply'
                let prod        = that.prod

                var reqData     = {
                    funcId:that.funcId,
                    creditIds:creditIds,
                }

                that.$http && that.$http.post(url,reqData).then(function (res) {
                    if(res.body.code == "200") {
                        that.$notify({title: '成功',message: '发放成功',type: 'success'});
//                        let data                = res.body.data
//                        that.visible.addProd    = false
//                        that.list.push(data)
                    }
                });
            },
//            显示合同列表
            showContractListHandler(scope){
                let that  = this
                that.getGuaranteeList(scope.row.creditId)

            },



//            获取担保人列表
            getGuaranteeList(creditId){
                let that        = this
                let url         = Vue.agent.root + '/business/guarantee/list'
                var reqData     = {
                    funcId  :that.funcId,
                    creditId:creditId
                }
                that.$http.get(url,{
                    params:reqData,
                }).then(res => {
                    if(res.body.code == 200) {
                        that.visible.contract = true
                        let list                    = res.body.data.list
                        that.contract.list          = list
//                        Object.assign(that.toDoData,data)
                    }
                });
            },
            //生成合同
            createContractHandler(scope){
                let that                = this
                let guaranteeId         = scope.row.guaranteeId

                that.getPrintData(guaranteeId,function () {
                })
            },

            getPrintData(guaranteeId,callback){
                let that        = this
                let url         = Vue.agent.root + '/business/guarantee/contract'
                var reqData     = {
                    funcId:that.funcId,
                    guaranteeId:guaranteeId
                }

                that.$http.get(url,{
                    params:reqData,
                }).then(res => {
                    if(res.body.code == "200") {
                        let data            = res.body.data
                        let  win= window.open('','','fullscreen=yes')
                        win.document.write(data)
                        win.focus()
                        !!callback && callback()
                    }
                });
            },


            //显示其他附件详情
            manageContractHandler(scope){
                let that                    = this
                let guaranteeId = scope.row.guaranteeId
                that.current.guaranteeId = guaranteeId
                that.getFilesList(guaranteeId)
            },
            getFilesList(guaranteeId){
                let that        = this
                let url         = Vue.agent.root + '/business/guarantee/contract/getFiles'
                var reqData     = {
                    guaranteeId :guaranteeId,
                    funcId  :that.funcId
                }

                that.$http.get(url,{
                    params:reqData,
                }).then(res => {
                    if(res.body.code == 200) {
                        let list            = res.body.data.list
//                        that.credit.material.list = data
                        that.contract.fileList = []
                        list.forEach(v=>{
                            that.contract.fileList.push({
                                url:Vue.agent.root + '/business/guarantee/contract/download?token=' + auth.getToken() + '&device=1&guaranteeId='+guaranteeId+ '&enclosureName='+ v,
                                fileName:v,
                                guaranteeId:guaranteeId
                            })
                        })
                        that.visible.files   = true
                    }
                });
            },
            uploadDetailRemoveHandler(file, fileList){
                this.deleteUpdateDetailItem(file.fileName,file.guaranteeId)
//                console.log(file, fileList);
            },
            deleteUpdateDetailItem(fileName,guaranteeId){
                let that        = this
                let url         = Vue.agent.root + '/business/guarantee/contract/remove'
                var reqData     = {
                    guaranteeId  :guaranteeId,
                    enclosureName:fileName,
                    funcId  :that.funcId
                }

                that.$http.post(url,reqData).then(res => {
                    if(res.body.code == 200) {
                        that.$notify({title: '成功',message: '删除成功',type: 'success'});
                    }
                });

            },

//            上传后显示图片
            handleUploadSuccess(res, file){
                let that = this
                if(res.code == 200){
                    that.$notify({title: '成功',message: '上传成功',type: 'success'});
                }
                if(res.code == 400){
                    that.$notify({title: '失败',message: res.message,type: 'warning'});
                }
            },


//          产品搜索
            doProdSearchHandler(){
                let that     = this
                if(that.prodData.pageNum == 1){
                    that.doProdSearch()
                }else{
                    that.prodData.pageNum = 1
                }
            },
//            记录搜索
            doRecordSearchHandler(){
                let that     = this
                if(that.recordData.pageNum == 1){
                    that.doRecordSearch()
                }else{
                    that.recordData.pageNum = 1
                }
            },
//            doReset(){
//                let search = this.search
//                Util.dataReset(search)
//            },
            prodCurrentPageChange(val) {
                let that = this
                if(that.prodData.loading == true){
                    that.$notify({title: '提示',message: '请勿频繁操作',type: 'warning'});
                }else{
                    that.prodData.pageNum = val
                    that.doProdSearch()
                }
            },
            recordCurrentPageChange(val) {
                let that = this
                if(that.recordData.loading == true){
                    that.$notify({title: '提示',message: '请勿频繁操作',type: 'warning'});
                }else{
                    that.recordData.pageNum = val
                    that.doRecordSearch()
                }
            },
            doProdSearch(){
                let that        = this
                let url         = Vue.agent.root + '/business/lend/credits'
                var reqData     = {
                    pageSize:that.prodData.pageSize,
                    pageNum :that.prodData.pageNum,
                    funcId  :that.funcId
                }
                that.prodData.loading = true
//                Object.assign(reqData,that.search)
//                Util.dataClear(reqData)

                that.$http.get(url,{
                    params:reqData,
                    timeout:30000
                }).then(res => {
                    that.prodData.loading = false
                    if(res.body.code == 200) {
                        let data            = res.body.data
                        Object.assign(that.prodData,data)
                    }
                },res =>{
                    that.prodData.loading = false
                });
            },
            doRecordSearch(){
                let that        = this
                let url         = Vue.agent.root + '/business/loanProductRelease/search'
                var reqData     = {
                    pageSize:that.recordData.pageSize,
                    pageNum :that.recordData.pageNum,
                    funcId  :that.funcId
                }
                that.recordData.loading = true
                Object.assign(reqData,that.searchRecord)
                Util.dataClear(reqData)

                that.$http.get(url,{
                    params:reqData,
                    timeout:30000
                }).then(res => {
                    that.recordData.loading = false
                    if(res.body.code == 200) {
                        let data            = res.body.data
                        Object.assign(that.recordData,data)
                    }
                },res =>{
                    that.recordData.loading = false
                });
            },
//            新增产品保存事件
            doSaveProdHandler(formName){
                let that = this
                that.$refs[formName].validate((valid) => {
                    if (valid) {
                        that.addProd()
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
//            执行添加
            addProd(){
                let that        = this
                let url         = Vue.agent.root + '/business/loanProduct/add'
                let prod        = that.prod

                var reqData     = {
                    funcId:that.funcId,
                    name:prod.prdName,
                }

                that.$http && that.$http.post(url,reqData).then(function (res) {
                    if(res.body.code == "200") {
                        that.$notify({title: '成功',message: '添加成功',type: 'success'});
                        let data                = res.body.data
                        that.visible.addProd    = false
                        that.list.push(data)
                    }
                });
            },
//            更新产品名
            doProdUpdateHandler(){
                let that        = this
                let url         = Vue.agent.root + '/business/loanProduct/update'
                let prod        = that.prod

                var reqData     = {
                    funcId:that.funcId,
                    id:prod.prdId,
                    name:prod.prdName
                }

                that.$http && that.$http.put(url,reqData).then(function (res) {
                    if(res.body.code == "200") {
                        that.$notify({title: '成功',message: '更新成功',type: 'success'});
                        currentScope.row.prdName = prod.prdName
                        that.visible.editProd    = false
                    }
                });

            },

//            产品启用禁用
            switchProd(prod){
                let that        = this
                let url         = Vue.agent.root + '/business/loanProduct/enable'

                var reqData     = {
                    funcId:that.funcId,
                    id:prod.prdId,
                }

                that.$http && that.$http.put(url,reqData).then(function (res) {
                    if(res.body.code == "200") {
                        that.$notify({title: '成功',message: '禁用成功',type: 'success'});
//                        that.visible.chooseAttr    = false
                        prod.enableFlag = res.body.data
                    }
                });
            },

//            添加属性响应
            doAddAttributeHandler(formName){
                let that = this
                that.$refs[formName].validate((valid) => {
                    if (valid) {
                        that.addAttribute()
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
//            新增属性
            addAttribute(){
                let that        = this
                let url         = Vue.agent.root + '/business/loanProductAttribute/add'
                let prod        = that.prod

                var reqData     = {
                    funcId:that.funcId,
                    id:prod.prdId,
                    minPrincipal:prod.minPrincipal,
                    maxPrincipal:prod.maxPrincipal,
                    minDuration:prod.minDuration,
                    maxDuration:prod.maxDuration,
                    loanRate:prod.loanRate,
                    minCostRate:prod.minCostRate,
                    maxCostRate:prod.maxCostRate,
                    penaltyRate:prod.penaltyRate,
                    repayType:prod.repayType
                }

                that.$http && that.$http.post(url,reqData).then(function (res) {
                    if(res.body.code == "200") {
                        that.$notify({title: '成功',message: '提交成功',type: 'success'});
                        that.visible.addAttr    = false
                    }
                });
            },
//            显示修改属性界面
            showEditAttributeHandler(scope){
                let that = this
                Object.assign(that.prod,scope.row)
                that.visible.addAttr    = true
                that.current.action     = "edit"
                that.current.attr       = scope.row
            },
            doEditAttributeHandler(formName){
                let that = this
                that.$refs[formName].validate((valid) => {
                    if (valid) {
                        that.editAttribute()
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
//            更改属性
            editAttribute(){
                let that        = this
                let url         = Vue.agent.root + '/business/loanProductAttribute/update'
                let prod        = that.prod
                let pId         = that.current.pId

                var reqData     = {
                    funcId:that.funcId,
                    id:prod.pid,
                    minPrincipal:prod.minPrincipal,
                    maxPrincipal:prod.maxPrincipal,
                    minDuration:prod.minDuration,
                    maxDuration:prod.maxDuration,
                    loanRate:prod.loanRate,
                    minCostRate:prod.minCostRate,
                    maxCostRate:prod.maxCostRate,
                    penaltyRate:prod.penaltyRate,
                    repayType:prod.repayType
                }

                that.$http && that.$http.put(url,reqData).then(function (res) {
                    if(res.body.code == "200") {
                        that.$notify({title: '成功',message: '更改成功',type: 'success'});
                        that.visible.addAttr    = false
                        Object.assign(that.current.attr,prod)
                    }
                });
            },


//            获取属性列表
            getAttrList(prdId){
                let that        = this
                let url         = Vue.agent.root + '/business/loanProductAttribute/list'

                var reqData     = {
                    funcId:that.funcId,
                    id:prdId,
                }

                that.$http && that.$http.get(url,{
                    params:reqData
                }).then(function (res) {
                    if(res.body.code == "200") {
                        let  list       =  res.body.data.list
                        that.attrList   = list
                    }
                });
            },
//            保存事件响应
            doSaveCurrentAttr(){
                let that =  this
                that.setCurrentAttr()
            },
//            设置当前属性
            setCurrentAttr(){
                let that        = this
                let url         = Vue.agent.root + '/business/loanProductAttribute/choose'
                let pId         = that.current.pId

                if(pId == null){
                    that.visible.chooseAttr    = false
                    return false
                }


                var reqData     = {
                    funcId:that.funcId,
                    id:pId,
                }

                that.$http && that.$http.put(url,reqData).then(function (res) {
                    if(res.body.code == "200") {
                        let ele = that.attrList.find(v=>{
                            return v.pid == pId
                        })
                        let prod = that.current.prod

                        prod.currentPId     = pId
                        prod.loanRate       = ele.loanRate
                        prod.minDuration    = ele.minDuration
                        prod.maxDuration    = ele.maxDuration
                        prod.minCostRate    = ele.minCostRate
                        prod.maxCostRate    = ele.maxCostRate
                        prod.penaltyRate    = ele.penaltyRate
                        prod.minPrincipal   = ele.minPrincipal
                        prod.maxPrincipal   = ele.maxPrincipal
                        prod.serviceRate    = ele.serviceRate
                        prod.repayType      = ele.repayType

                        that.$notify({title: '成功',message: '设置成功',type: 'success'});
                        that.visible.chooseAttr    = false
                        that.current.pId           = null
                        that.current.prod          = null

                    }
                });
            },
//            禁用属性按钮
            disabledAttributeHandler(scope){
                let that = this
                let pId  = scope.row.pid
                that.$confirm('确认要禁用吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    that.disabledAttribute(pId)
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });

            },
//            禁用属性网络请求
            disabledAttribute(pId){
                let that        = this
                let url         = Vue.agent.root + '/business/loanProductAttribute/forbid'

                var reqData     = {
                    funcId:that.funcId,
                    id:pId,
                }

                that.$http && that.$http.put(url,reqData).then(function (res) {
                    if(res.body.code == "200") {
                        that.$notify({title: '成功',message: '禁用成功',type: 'success'});
//                        that.visible.chooseAttr    = false
                    }
                });
            },
//            获取ops
            getOps(){
                let that        = this
                let opsUrl      = Vue.agent.root + '/dictionary/dict/querys'

                that.$http && that.$http.get(opsUrl,{params:{
                    names:"repayType,loanRate,costRate,approvalStatus,guaranteeType,guaranteeContractStatus",
                    funcId:that.funcId
                }}).then(function (res) {
                    if(res.body.code == "200") {
                        let data                            = res.body.data
                        that.ops.repayType                  = data.repayTypeOptions
                        that.ops.loanRate                   = data.loanRateOptions
                        that.ops.costRate                   = data.costRateOptions
                        that.ops.approvalStatus             = data.approvalStatusOptions
                        that.ops.guaranteeType              = data.guaranteeTypeOptions
                        that.ops.guaranteeContractStatus    = data.guaranteeContractStatusOptions

                    }
                });
            }
        },
        created:function () {
            let that        = this
            that.getOps()
        },
        mounted:function () {

        },
        components:{
            'user-info':UserInfo,
            'credit-info':CreditInfo
        }
    }
</script>
<style lang="scss">
    @import 'src/scss/pages/business/loan.scss';
</style>