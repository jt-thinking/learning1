<template>
    <div class="business-loan">
        <el-tabs v-model="tab.active" type="card" @tab-click="handleClick">
            <el-tab-pane label="产品维护" name="loan">
                <div class="busy-box">
                    <div class="search-box">
                        <el-form   :model="formInline" label-width="66px" >

                            <el-form-item label-width="30px" >
                                <el-button @click.native="showAddProdHandler" size="small" type="primary">新增</el-button>
                                <el-button @click.native="doProdSearchHandler" size="small" type="primary">查询</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
                <div class="table">
                    <el-table
                            v-loading="prodData.loading"
                            :data="prodData.list"
                            :row-class-name="rowClassName"
                            border
                            style="width: 100%">
                        <el-table-column
                                prop="prdId"
                                label="序号"
                                align="center"
                                min-width="160">
                        </el-table-column>
                        <el-table-column
                                prop="prdName"
                                align="center"
                                label="产品名称"
                                min-width="140">
                        </el-table-column>
                        <el-table-column
                                prop="phone"
                                align="center"
                                label="借款额度（元）"
                                min-width="180">
                            <template scope="scope">
                                <span v-show="scope.row.minPrincipal">{{ scope.row.minPrincipal | moneyFormat }} - {{ scope.row.maxPrincipal | moneyFormat }}</span>
                                <span v-show="!scope.row.minPrincipal">无</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="借款期限（天）"
                                align="center"
                                min-width="130">
                            <template scope="scope">
                                <span v-show="scope.row.minDuration">{{scope.row.minDuration}}天 - {{scope.row.maxDuration}}天</span>
                                <span v-show="!scope.row.minDuration">无</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="借款利率(%)"
                                align="center"
                                min-width="130">
                            <template scope="scope">
                                <span v-show="scope.row.loanRate">{{ scope.row.loanRate}}%</span>
                                <span v-show="!scope.row.loanRate">无</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="还款方式"
                                align="center"
                                width="140">
                            <template scope="scope">
                                <span v-show="scope.row.repayType">{{ scope.row.repayType | opsFormat(ops.repayType) }}</span>
                                <span v-show="!scope.row.repayType">无</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="借款服务费率(%)"
                                align="center"
                                min-width="140">
                            <template scope="scope">
                                <span v-show="scope.row.serviceRate">{{ scope.row.serviceRate }}%</span>
                                <span v-show="!scope.row.serviceRate">无</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                align="center"
                                label="逾期罚息(%)"
                                min-width="140">
                            <template scope="scope">
                                <span v-show="scope.row.penaltyRate">{{ scope.row.penaltyRate}}%</span>
                                <span v-show="!scope.row.penaltyRate">无</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                align="center"
                                label="借款综合成本(%)"
                                min-width="140">
                            <template scope="scope">
                                <span v-show="scope.row.minCostRate">{{ scope.row.minCostRate }}% - {{ scope.row.maxCostRate }}%</span>
                                <span v-show="!scope.row.minCostRate">无</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                align="center"
                                label="操作"
                                width="360"
                                fixed="right"
                        >
                            <template scope="scope">
                                <el-button @click.native="showAddAttrHandler(scope)" size="small">新增属性</el-button>
                                <el-button @click.native="showChooseAttrHandler(scope)" size="small">选择属性</el-button>
                                <el-button v-show="scope.row.enableFlag == 1" @click.native="disableProdHandler(scope)" size="small">禁用</el-button>
                                <el-button v-show="scope.row.enableFlag != 1" @click.native="enableProdHandler(scope)" size="small">启用</el-button>
                                <el-button @click.native="showEditHandler(scope)" size="small">更名</el-button>
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
            <el-tab-pane label="产品上线记录" name="record">
                <div class="busy-box">
                    <div class="search-box">
                        <el-form   :model="formInline" label-width="66px" >
                            <el-form-item label="产品名称" label-width="80px">
                                <el-input  size="small"  v-model="searchRecord.name" :placeholder="'请输入产品名'"></el-input>
                            </el-form-item>
                            <el-form-item label="借款利率">
                                <el-select size="small" v-model="searchRecord.loanRate" placeholder="请选择借款利率">
                                    <el-option  label="请选择借款利率" :value="null"></el-option>
                                    <el-option
                                            v-for="item in ops.loanRate"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="借款综合成本" label-width="100px">
                                <el-select size="small" v-model="searchRecord.costRate" placeholder="请选择综合成本">
                                    <el-option  label="请选择综合成本" :value="null"></el-option>
                                    <el-option
                                            v-for="item in ops.costRate"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="更新日期">
                                <el-date-picker
                                    class="date"
                                    size="small"
                                    v-model="searchRecord.releaseStartDatetimeT"
                                    type="date"
                                    placeholder="开始日期时间">
                                </el-date-picker>
                                <el-date-picker
                                    class="date"
                                    size="small"
                                    v-model="searchRecord.releaseEndDatetimeT"
                                    type="date"
                                    placeholder="截至日期时间">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label-width="30px" >
                                <!--<el-button @click.native="showAddProdHandler" size="small" type="primary">新增</el-button>-->
                                <el-button @click.native="doRecordSearchHandler" size="small" type="primary">查询</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
                <div class="table">
                    <el-table
                            v-loading="recordData.loading"
                            :data="recordData.list"
                            border
                            style="width: 100%">
                        <!--<el-table-column-->
                                <!--prop="prdId"-->
                                <!--label="序号"-->
                                <!--align="center"-->
                                <!--min-width="160">-->
                        <!--</el-table-column>-->
                        <el-table-column
                                prop="prdName"
                                align="center"
                                label="产品名称"
                                min-width="140">
                        </el-table-column>
                        <el-table-column
                                prop="phone"
                                align="center"
                                label="借款额度（元）"
                                min-width="180">
                            <template scope="scope">
                                <span v-show="scope.row.minPrincipal">{{ scope.row.minPrincipal | moneyFormat }} - {{ scope.row.maxPrincipal | moneyFormat }}</span>
                                <span v-show="!scope.row.minPrincipal">无</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="借款期限（天）"
                                align="center"
                                min-width="130">
                            <template scope="scope">
                                <span v-show="scope.row.minDuration">{{scope.row.minDuration}}天 - {{scope.row.maxDuration}}天</span>
                                <span v-show="!scope.row.minDuration">无</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="借款利率(%)"
                                align="center"
                                min-width="130">
                            <template scope="scope">
                                <span v-show="scope.row.loanRate">{{ scope.row.loanRate}}%</span>
                                <span v-show="!scope.row.loanRate">无</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="还款方式"
                                align="center"
                                width="140">
                            <template scope="scope">
                                <span v-show="scope.row.repayType">{{ scope.row.repayType | opsFormat(ops.repayType) }}</span>
                                <span v-show="!scope.row.repayType">无</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="借款服务费率(%)"
                                align="center"
                                min-width="140">
                            <template scope="scope">
                                <span v-show="scope.row.serviceRate">{{ scope.row.serviceRate }}%</span>
                                <span v-show="!scope.row.serviceRate">无</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                align="center"
                                label="逾期罚息(%)"
                                min-width="140">
                            <template scope="scope">
                                <span v-show="scope.row.penaltyRate">{{ scope.row.penaltyRate}}%</span>
                                <span v-show="!scope.row.penaltyRate">无</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                align="center"
                                label="借款综合成本(%)"
                                min-width="140">
                            <template scope="scope">
                                <span v-show="scope.row.minCostRate">{{ scope.row.minCostRate }}% - {{ scope.row.maxCostRate }}%</span>
                                <span v-show="!scope.row.minCostRate">无</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                align="center"
                                label="上线时间"
                                min-width="180">
                            <template scope="scope">
                                <span>{{ scope.row.releaseTime | dateTimeFormat }}</span>
                            </template>
                        </el-table-column>

                    </el-table>
                </div>
                <div class="footer-box">
                    <span v-if="startRow" class="pull-left">显示{{startRow}}-{{endRow}} 总共有{{total}}条目</span>
                    <div class="pagination pull-right">
                        <el-pagination
                                layout="prev, pager, next"
                                @current-change="recordCurrentPageChange"
                                :page-size="recordData.pageSize"
                                :current-page.sync="recordData.pageNum"
                                :total="recordData.total">
                        </el-pagination>
                    </div>
                </div>
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


        <!--选择属性 -->
        <el-dialog title="借款产品"  class="attr-dialog" :visible.sync="visible.chooseAttr" size="w1200">
                <el-radio-group  v-model="current.pId">
                    <el-table
                            :data="attrList"
                            :stripe="true"
                            border
                            style="width: 100%">

                            <el-table-column
                                    label=""
                                    align="center"
                                    min-width="60">
                                <template scope="scope">
                                        <el-radio :disabled="scope.row.status != 5" :label="scope.row.pid"><span></span></el-radio>
                                </template>
                            </el-table-column>

                        <el-table-column
                                label="额度范围"
                                align="center"
                                min-width="180">
                            <template scope="scope">
                                <span>{{ scope.row.minPrincipal | moneyFormat }} - {{ scope.row.maxPrincipal | moneyFormat }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="prdName"
                                align="center"
                                label="期限范围"
                                min-width="160">
                            <template scope="scope">
                                <span>{{ scope.row.minDuration}}天 - {{ scope.row.maxDuration}}天</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="phone"
                                align="center"
                                label="借款利率"
                                min-width="100">
                            <template scope="scope">
                                <span>{{ scope.row.loanRate}}%</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="还款方式"
                                align="center"
                                min-width="100">
                            <template scope="scope">
                                <span>{{ scope.row.repayType | opsFormat(ops.repayType) }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="借款服务费率"
                                align="center"
                                min-width="120">
                            <template scope="scope">
                                <span>{{ scope.row.serviceRate}}%</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                align="center"
                                label="逾期罚息"
                                min-width="120">
                            <template scope="scope">
                                <span>{{ scope.row.penaltyRate }}%</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                align="center"
                                label="借款综合成本(%)"
                                min-width="140">
                            <template scope="scope">
                                <span>{{ scope.row.minCostRate}}% - {{ scope.row.maxCostRate}}%</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                align="center"
                                label="状态"
                                min-width="100">
                            <template scope="scope">
                                <span>{{ scope.row.status | opsFormat(ops.approvalStatus) }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                align="center"
                                label="操作"
                                width="160"
                        >
                            <template scope="scope">
                                <el-button :disabled="scope.row.status == 5 || scope.row.status == 2" @click.native="showEditAttributeHandler(scope)" size="small">修改</el-button>
                                <el-button :disabled="attributeDisabledStatus(scope)" @click.native="disabledAttributeHandler(scope)" size="small">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-radio-group>
            <div slot="footer" class="dialog-footer">
                <el-button class="pull-left" @click.native="visible.chooseAttr = false">取 消</el-button>
                <el-button type="primary" @click.native="doSaveCurrentAttr">确 认</el-button>
            </div>
        </el-dialog>

    </div>

</template>

<script>
    import Util             from    'src/js/util'
    import auth             from    'src/js/auth'

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
                tab:{
                  active:'loan'
                },
                attrList:[],
                value: '',
                visible:{
                    addProd:false,
                    editProd:false,
                    addAttr:false,
                    chooseAttr:false
                },
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
                    attr:null

                },
                attr:{

                },
                ops:{
                    repayType:[],
                    loanRate:[],
                    costRate:[],
                    approvalStatus:[]
                },
                loading: false,
                prodRules: {
                    prdName: [
                        {required: true, message: '请输入产品名称', trigger: 'blur'},
                    ],
                },
                attrRules: {

                },
                funcId:'R060100',
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
        methods: {
            attributeDisabledStatus(scope){
                let that = this
                if(that.current.pId == scope.row.pid)
                    return true
                if(scope.row.status != 4 && scope.row.status !=5)
                    return true
            },
            rowClassName(row, index) {
                if (row.enableFlag == 0) {
                    return 'disable-row';
                }
                return '';
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
                let url         = Vue.agent.root + '/business/loanProduct/search'
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
//            显示编辑
            showEditHandler(scope){
                currentScope            = scope
                let that = this
                that.prod.prdName       = scope.row.prdName
                that.prod.prdId         = scope.row.prdId
                that.visible.editProd   = true
            },
            //新增产品
            showAddProdHandler(){
                let that = this
                Util.dataReset(that.prod)
                that.visible.addProd  = true

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
//            禁用产品
            disableProdHandler(scope){
                let that = this
                let prod  = scope.row
                that.$confirm('确认要禁用吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    that.switchProd(prod)
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            //  启用产品
            enableProdHandler(scope){
                let that  = this
                let prod  = scope.row
                that.switchProd(prod)
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
//            显示添加属性
            showAddAttrHandler(scope){
                let that = this
                Util.dataReset(that.prod)
                that.prod.prdId         = scope.row.prdId
                that.prod.prdName       = scope.row.prdName
                that.visible.addAttr    = true
                that.current.action     = "add"
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
//            显示选择属性界面
            showChooseAttrHandler(scope){
                let that                = this
                that.visible.chooseAttr = true
                let id                  = scope.row.prdId
                that.current.prod       = scope.row
                that.current.pId        = scope.row.currentPId
                that.getAttrList(id)
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
                    names:"repayType,loanRate,costRate,approvalStatus",
                    funcId:that.funcId
                }}).then(function (res) {
                    if(res.body.code == "200") {
                        let data                     = res.body.data
                        that.ops.repayType           = data.repayTypeOptions
                        that.ops.loanRate            = data.loanRateOptions
                        that.ops.costRate            = data.costRateOptions
                        that.ops.approvalStatus       = data.approvalStatusOptions
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
        }
    }
</script>
<style lang="scss">
    @import 'src/scss/pages/business/loan.scss';
</style>