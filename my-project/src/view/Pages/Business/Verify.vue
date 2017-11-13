<template>
    <div class="business-loan">
        <el-tabs v-model="tab.active" type="card" @tab-click="handleClick">
            <el-tab-pane label="个人授信" name="loan">
                <div class="busy-box">
                    <div class="search-box">
                        <el-form   :model="formInline" label-width="66px" >
                            <el-form-item label="客户名称">
                                <el-input  size="small"  v-model="search.custName" placeholder="请输入姓名"></el-input>
                            </el-form-item>
                            <el-form-item label-width="30px" >
                                <el-button @click.native="doProdSearchHandler" size="small" type="primary">查询</el-button>
                                <el-button @click.native="doLendLoanHandler" size="small" type="primary">确认发放</el-button>
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
                            style="width: 100%">
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
                        <el-table-column
                                label="授信合同编号"
                                align="center"
                                min-width="160">
                            <template scope="scope">
                                <el-button size="small" @click.native="showContractListHandler(scope)" type="text">{{scope.row.creditNo}}</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="custName"
                                align="center"
                                label="客户姓名"
                                min-width="120">
                        </el-table-column>
                        <el-table-column
                                prop="certNo"
                                align="center"
                                label="身份证号"
                                min-width="180">
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
                        <el-table-column
                                align="center"
                                label="操作"
                                min-width="200"
                        >
                            <template scope="scope">
                                <el-button v-show="scope.row.enableFlag == 2  && roleCheck('R060401')" @click.native="doVerifyHandler(scope)" size="small">确认</el-button>
                                <el-button v-show="scope.row.enableFlag == 3 && roleCheck('R060402')" @click.native="doLoanHandler(scope)" size="small">放款</el-button>
                                <el-button @click.native="doRollbackHandler(scope)" size="small">回退</el-button>
                                <el-button @click.native="doStopHandler(scope)" size="small">终结</el-button>
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
                <!--<div class="busy-box">-->
                    <!--<div class="search-box">-->
                        <!--<el-form   :model="formInline" label-width="66px" >-->
                            <!--<el-form-item label="产品名称" label-width="80px">-->
                                <!--<el-input  size="small"  v-model="searchRecord.name" :placeholder="'请输入产品名'"></el-input>-->
                            <!--</el-form-item>-->
                            <!--<el-form-item label="借款利率">-->
                                <!--<el-select size="small" v-model="searchRecord.loanRate" placeholder="请选择借款利率">-->
                                    <!--<el-option  label="请选择借款利率" :value="null"></el-option>-->
                                    <!--<el-option-->
                                            <!--v-for="item in ops.loanRate"-->
                                            <!--:key="item.id"-->
                                            <!--:label="item.name"-->
                                            <!--:value="item.value">-->
                                    <!--</el-option>-->
                                <!--</el-select>-->
                            <!--</el-form-item>-->
                            <!--<el-form-item label="借款综合成本" label-width="100px">-->
                                <!--<el-select size="small" v-model="searchRecord.costRate" placeholder="请选择综合成本">-->
                                    <!--<el-option  label="请选择综合成本" :value="null"></el-option>-->
                                    <!--<el-option-->
                                            <!--v-for="item in ops.costRate"-->
                                            <!--:key="item.id"-->
                                            <!--:label="item.name"-->
                                            <!--:value="item.value">-->
                                    <!--</el-option>-->
                                <!--</el-select>-->
                            <!--</el-form-item>-->
                            <!--<el-form-item label="更新日期">-->
                                <!--<el-date-picker-->
                                    <!--class="date"-->
                                    <!--size="small"-->
                                    <!--v-model="searchRecord.releaseStartDatetimeT"-->
                                    <!--type="date"-->
                                    <!--placeholder="开始日期时间">-->
                                <!--</el-date-picker>-->
                                <!--<el-date-picker-->
                                    <!--class="date"-->
                                    <!--size="small"-->
                                    <!--v-model="searchRecord.releaseEndDatetimeT"-->
                                    <!--type="date"-->
                                    <!--placeholder="截至日期时间">-->
                                <!--</el-date-picker>-->
                            <!--</el-form-item>-->
                            <!--<el-form-item label-width="30px" >-->
                                <!--<el-button @click.native="doRecordSearchHandler" size="small" type="primary">查询</el-button>-->
                            <!--</el-form-item>-->
                        <!--</el-form>-->
                    <!--</div>-->
                <!--</div>-->
                <!--<div class="table">-->
                    <!--<el-table-->
                            <!--v-loading="recordData.loading"-->
                            <!--:data="recordData.list"-->
                            <!--border-->
                            <!--style="width: 100%">-->
                        <!--&lt;!&ndash;<el-table-column&ndash;&gt;-->
                                <!--&lt;!&ndash;prop="prdId"&ndash;&gt;-->
                                <!--&lt;!&ndash;label="序号"&ndash;&gt;-->
                                <!--&lt;!&ndash;align="center"&ndash;&gt;-->
                                <!--&lt;!&ndash;min-width="160">&ndash;&gt;-->
                        <!--&lt;!&ndash;</el-table-column>&ndash;&gt;-->
                        <!--<el-table-column-->
                                <!--prop="prdName"-->
                                <!--align="center"-->
                                <!--label="产品名称"-->
                                <!--min-width="140">-->
                        <!--</el-table-column>-->
                        <!--<el-table-column-->
                                <!--prop="phone"-->
                                <!--align="center"-->
                                <!--label="借款额度（元）"-->
                                <!--min-width="180">-->
                            <!--<template scope="scope">-->
                                <!--<span v-show="scope.row.minPrincipal">{{ scope.row.minPrincipal | moneyFormat }} - {{ scope.row.maxPrincipal | moneyFormat }}</span>-->
                                <!--<span v-show="!scope.row.minPrincipal">无</span>-->
                            <!--</template>-->
                        <!--</el-table-column>-->
                        <!--<el-table-column-->
                                <!--label="借款期限（天）"-->
                                <!--align="center"-->
                                <!--min-width="130">-->
                            <!--<template scope="scope">-->
                                <!--<span v-show="scope.row.minDuration">{{scope.row.minDuration}}天 - {{scope.row.maxDuration}}天</span>-->
                                <!--<span v-show="!scope.row.minDuration">无</span>-->
                            <!--</template>-->
                        <!--</el-table-column>-->
                        <!--<el-table-column-->
                                <!--label="借款利率(%)"-->
                                <!--align="center"-->
                                <!--min-width="130">-->
                            <!--<template scope="scope">-->
                                <!--<span v-show="scope.row.loanRate">{{ scope.row.loanRate}}%</span>-->
                                <!--<span v-show="!scope.row.loanRate">无</span>-->
                            <!--</template>-->
                        <!--</el-table-column>-->
                        <!--<el-table-column-->
                                <!--label="还款方式"-->
                                <!--align="center"-->
                                <!--width="140">-->
                            <!--<template scope="scope">-->
                                <!--<span v-show="scope.row.repayType">{{ scope.row.repayType | opsFormat(ops.repayType) }}</span>-->
                                <!--<span v-show="!scope.row.repayType">无</span>-->
                            <!--</template>-->
                        <!--</el-table-column>-->
                        <!--<el-table-column-->
                                <!--label="借款服务费率(%)"-->
                                <!--align="center"-->
                                <!--min-width="140">-->
                            <!--<template scope="scope">-->
                                <!--<span v-show="scope.row.serviceRate">{{ scope.row.serviceRate }}%</span>-->
                                <!--<span v-show="!scope.row.serviceRate">无</span>-->
                            <!--</template>-->
                        <!--</el-table-column>-->
                        <!--<el-table-column-->
                                <!--align="center"-->
                                <!--label="逾期罚息(%)"-->
                                <!--min-width="140">-->
                            <!--<template scope="scope">-->
                                <!--<span v-show="scope.row.penaltyRate">{{ scope.row.penaltyRate}}%</span>-->
                                <!--<span v-show="!scope.row.penaltyRate">无</span>-->
                            <!--</template>-->
                        <!--</el-table-column>-->
                        <!--<el-table-column-->
                                <!--align="center"-->
                                <!--label="借款综合成本(%)"-->
                                <!--min-width="140">-->
                            <!--<template scope="scope">-->
                                <!--<span v-show="scope.row.minCostRate">{{ scope.row.minCostRate }}% - {{ scope.row.maxCostRate }}%</span>-->
                                <!--<span v-show="!scope.row.minCostRate">无</span>-->
                            <!--</template>-->
                        <!--</el-table-column>-->
                        <!--<el-table-column-->
                                <!--align="center"-->
                                <!--label="上线时间"-->
                                <!--min-width="180">-->
                            <!--<template scope="scope">-->
                                <!--<span>{{ scope.row.releaseTime | dateTimeFormat }}</span>-->
                            <!--</template>-->
                        <!--</el-table-column>-->

                    <!--</el-table>-->
                <!--</div>-->
                <!--<div class="footer-box">-->
                    <!--<span v-if="startRow" class="pull-left">显示{{startRow}}-{{endRow}} 总共有{{total}}条目</span>-->
                    <!--<div class="pagination pull-right">-->
                        <!--<el-pagination-->
                                <!--layout="prev, pager, next"-->
                                <!--@current-change="recordCurrentPageChange"-->
                                <!--:page-size="recordData.pageSize"-->
                                <!--:current-page.sync="recordData.pageNum"-->
                                <!--:total="recordData.total">-->
                        <!--</el-pagination>-->
                    <!--</div>-->
                <!--</div>-->
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
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="担保类型"
                            min-width="140">
                        <template scope="scope">
                            <span>{{scope.row.guaranteeType}}</span>
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
                            <span>{{scope.row.status}}</span>
                        </template>
                    </el-table-column>


                    <el-table-column
                            align="center"
                            label="操作"
                            min-width="180">
                        <template scope="scope">
                            <el-button size="mini" @click.native="manageContractHandler(scope)">管理合同</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button class="pull-left" @click.native="visible.contract = false">取 消</el-button>
                <el-button type="primary" @click.native="doSaveProdHandler('prod')">确 认</el-button>
            </div>
        </el-dialog>


        <!--管理合同 -->
        <el-dialog title="管理合同" class="org-dialog" :visible.sync="visible.files" size="small">
            <el-form  :model="contract.files"  ref="uploadItem" label-width="100px">
                <div>
                    <el-upload
                            list-type="picture-card"
                            :on-preview="handlePictureCardPreview"
                            :file-list="contract.fileList"
                            ref="uploadItem"
                            >
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
                    chooseAttr:false,
                    contract:false,
                    files:false,
                    bigImg:false
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
                search:{
                    custName:null
                },
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
                contract:{
                    list:[]
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
                multipleSelection:[],
                funcId:'R060400',
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
            roleCheck(funcId){
                return auth.checkRole(funcId)
            },
//            选项事件
            selectionHandler(val){
                this.multipleSelection = val;
            },
//            展开事件
            expandHandler(row,expanded){

            },
            getCreditContract(){

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
                let url         = Vue.agent.root + '/business/lend/lended'
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
            doVerifyHandler(scope){
                let that     = this
                let creditId = scope.row.creditId
                that.$confirm('您确认此笔申请资料齐全了吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    that.verifyCredit(creditId)
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            verifyCredit(creditId){
                let that        = this
                let url         = Vue.agent.root + '/business/lend/reviewed'
                let prod        = that.prod

                var reqData     = {
                    funcId:that.funcId,
                    creditId:creditId,
                }

                that.$http && that.$http.post(url,reqData).then(function (res) {
                    if(res.body.code == "200") {
                        that.$notify({title: '成功',message: '操作成功',type: 'success'});
//                        let data                = res.body.data
//                        that.visible.addProd    = false
//                        that.list.push(data)
                    }
                });
            },
            doLoanHandler(scope){
                let that     = this
                let creditId = scope.row.creditId
                that.$confirm('您确认要放款吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    that.loanCredit(creditId)
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            loanCredit(creditId){
                let that        = this
                let url         = Vue.agent.root + '/business/lend/lended'

                var reqData     = {
                    funcId:that.funcId,
                    creditIds:creditId,
                }

                that.$http && that.$http.post(url,reqData).then(function (res) {
                    if(res.body.code == "200") {
                        that.$notify({title: '成功',message: '操作成功',type: 'success'});
//                        let data                = res.body.data
//                        that.visible.addProd    = false
//                        that.list.push(data)
                    }
                });
            },
            doRollbackHandler(scope){
                let that     = this
                let index    = scope.row.index
                let creditId = scope.row.creditId
                that.$confirm('您确认回退此笔申请吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    that.rollbackCredit(creditId,function () {
                        that.prodData.list.splice(index,1)
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            rollbackCredit(creditId,callback){
                let that        = this
                let url         = Vue.agent.root + '/business/lend/rollback/lender'
                let prod        = that.prod

                var reqData     = {
                    funcId:that.funcId,
                    creditId:creditId,
                }

                that.$http && that.$http.post(url,reqData).then(function (res) {
                    if(res.body.code == "200") {
                        !!callback && callback()
                        that.$notify({title: '成功',message: '操作成功',type: 'success'});
                    }
                });
            },
            doStopHandler(scope){
                let that     = this
                let index    = scope.row.index
                let creditId = scope.row.creditId
                that.$confirm('您确认终结此笔申请吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    that.stopCredit(creditId,function () {
                        that.prodData.list.splice(index,1)
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            stopCredit(creditId,callback){
                let that        = this
                let url         = Vue.agent.root + '/business/lend/stop'
                let prod        = that.prod

                var reqData     = {
                    funcId:that.funcId,
                    creditId:creditId,
                }

                that.$http && that.$http.post(url,reqData).then(function (res) {
                    if(res.body.code == "200") {
                        !!callback && callback()
                        that.$notify({title: '成功',message: '操作成功',type: 'success'});
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

            //            图片预览
            handlePictureCardPreview(file){
                console.log(file)
                this.dialogImageUrl = file.url;
                this.visible.bigImg = true;
            },
//    /business/lend/rollback/lender

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
                let url         = Vue.agent.root + '/business/lend/review/credits'
                var reqData     = {
                    pageSize:that.prodData.pageSize,
                    pageNum :that.prodData.pageNum,
                    funcId  :that.funcId,
                }
                that.prodData.loading = true
                Object.assign(reqData,that.search)
                Util.dataClear(reqData)

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