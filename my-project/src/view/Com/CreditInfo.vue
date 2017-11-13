<template>
    <div class="credit-info-dialog">
        <!--客户编辑-->
        <el-dialog title="授信编辑" class="credit-edit-dialog" :visible.sync="opened.openCredit"  :before-close="handleClose" size="w1000" >
            <el-tabs v-model="tabActive" type="card" @tab-click="creditInfoTabClickHandler">
                <!--申请信息-->
                <el-tab-pane v-show="show" label="申请信息" name="first">
                    <div class="el-table el-table--fit el-table--enable-row-transition" style="width: 100%;">
                        <div class="el-table__header-wrapper">
                            <table cellspacing="0" cellpadding="0" border="0" class="el-table__header" style="width: 100%;">
                                <thead>
                                <tr>
                                    <th colspan="1" rowspan="4" class="is-leaf">
                                        <div class="cell">申请信息</div>
                                    </th>
                                    </th>
                                </tr>
                                </thead>
                            </table>
                        </div>
                        <div class="el-table__body-wrapper">
                            <el-form   :model="credit.apply"  ref="creditApply" label-width="100px">
                                <table cellspacing="0" cellpadding="0" border="0" class="el-table__body" style="width: 100%;">
                                    <colgroup>
                                        <col width="45%">
                                        <col width="10%">
                                        <col width="45%">
                                    </colgroup>
                                    <tbody>
                                    <tr class="el-table__row">
                                        <td colspan="3">
                                            <div class="cell">
                                                <el-row>
                                                    <el-col :span="6">
                                                        <el-form-item label-width="90px" label="授信合同号">
                                                            <span>{{credit.apply.creditNo }}</span>
                                                        </el-form-item>
                                                    </el-col>
                                                    <el-col :span="6">
                                                        <el-form-item label-width="90px" label="客户编号">
                                                            <span>{{credit.apply.custId }}</span>
                                                        </el-form-item>
                                                    </el-col>
                                                    <el-col :span="6">
                                                        <el-form-item label-width="90px" label="客户名称">
                                                            <span>{{credit.apply.custName }}</span>
                                                        </el-form-item>
                                                    </el-col>
                                                    <el-col :span="6">
                                                        <el-form-item label-width="90px" label="证件号">
                                                            <span>{{credit.apply.certificateNumber }}</span>
                                                        </el-form-item>
                                                    </el-col>
                                                </el-row>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr class="el-table__row">
                                        <td colspan="3">
                                            <div class="cell">
                                                <el-row>
                                                    <el-col :span="8">
                                                        <el-form-item label-width="90px" label="申请日期" prop="applyDate" :rules="[
                                                        {required: true, message: '请选择时间'}
                                                    ]">
                                                            <el-date-picker
                                                                    style="width:200px"
                                                                    class="date"
                                                                    size="small"
                                                                    v-model="credit.apply.applyDate"
                                                                    type="date"
                                                                    placeholder="到期日期">
                                                            </el-date-picker>
                                                        </el-form-item>
                                                    </el-col>
                                                    <el-col :span="8">
                                                        <el-form-item label-width="90px" label="到期日期" prop="expirationDate" :rules="[
                                                        {required: true, message: '请选择时间'}
                                                    ]">
                                                            <el-date-picker
                                                                    style="width:200px"
                                                                    class="date"
                                                                    size="small"
                                                                    v-model="credit.apply.expirationDate"
                                                                    type="date"
                                                                    :picker-options="pickerOptions"
                                                                    placeholder="到期日期">
                                                            </el-date-picker>
                                                        </el-form-item>
                                                    </el-col>
                                                    <el-col :span="8">
                                                        <el-form-item  label-width="90px" label="授信期限">
                                                            <el-input :readonly="true" style="width:200px"  size="small"  v-model="creditDuration" placeholder="授信期限">
                                                                <template slot="append">天</template>
                                                            </el-input>
                                                        </el-form-item>
                                                    </el-col>
                                                </el-row>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr class="el-table__row">
                                        <td>
                                            <div class="cell">
                                                <el-form-item  label="申请金额"  prop="creditAmt" :rules="[
                                                        { required: true, message: '金额不能为空'},
                                                        { type: 'number', message: '金额必须为数字值'}
                                                    ]">
                                                    <el-input style="width:200px"  size="small"  v-model.number="credit.apply.creditAmt" placeholder="申请金额"></el-input>
                                                </el-form-item>
                                            </div>
                                        </td>
                                        <td colspan="2">
                                            <div class="cell">
                                                <h3>{{ credit.apply.creditAmt | moneyFormat }} 元</h3>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr class="el-table__row">
                                        <td>
                                            <div class="cell">
                                                <el-form-item  label="担保方式" prop="guaranteeType" :rules="[
                                                            { required: true, message: '请选择担保方式'}
                                                        ]">
                                                    <el-select style="width:200px" size="small" v-model.number="credit.apply.guaranteeType" placeholder="请选择担保方式">
                                                        <el-option  label="请选择担保方式" :value="null"></el-option>
                                                        <el-option
                                                                v-for="item in ops.assureType"
                                                                :key="item.id"
                                                                :label="item.name"
                                                                :value="parseInt(item.value)">
                                                        </el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="cell">

                                            </div>
                                        </td>
                                        <td>
                                            <div class="cell">
                                                <el-form-item  label="特殊业务标识" required>
                                                    <el-radio  v-model.number="credit.apply.isSpecialService" :label="0">正常</el-radio>
                                                    <el-radio  v-model.number="credit.apply.isSpecialService" :label="1">重组</el-radio>
                                                </el-form-item>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr class="el-table__row">
                                        <td>
                                            <div class="cell">
                                                <el-form-item  label="客户来源" prop="custSourceType" :rules="[
                                                            { required: true, message: '请选择客户来源'}
                                                        ]">
                                                    <el-select style="width:200px" size="small" v-model.number="credit.apply.custSourceType" placeholder="请选择客户来源">
                                                        <el-option  label="请选择客户来源" :value="0"></el-option>
                                                        <el-option
                                                                v-for="item in ops.custSourceType"
                                                                :key="item.id"
                                                                :label="item.name"
                                                                :value="parseInt(item.value)">
                                                        </el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="cell">

                                            </div>
                                        </td>
                                        <td>
                                            <div class="cell">
                                                <el-form-item  label="客户来源备注" required>
                                                    <el-input style="width:200px"  size="small"  v-model="credit.apply.custSourceRemark" placeholder="客户来源备注">
                                                    </el-input>
                                                </el-form-item>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr class="el-table__row">
                                        <td colspan="4">
                                            <div class="cell">
                                                <el-form-item  label="适用产品">
                                                    <ul class="prod-list">
                                                        <li>
                                                            <div class="prod-item">
                                                                <el-form-item label-width="140px" label="基本产品" prop="basePrdId" :rules="[
                                                                { required: true, message: '请选择基本产品'}
                                                            ]">
                                                                    <el-select @change="prodBaseChangeHandler"  style="width:160px" size="small" v-model="credit.apply.basePrdId" placeholder="请选择产品">
                                                                        <el-option  label="选择产品" :value="null"></el-option>
                                                                        <el-option
                                                                                v-for="item in prodData.list"
                                                                                :key="item.prdId"
                                                                                :label="item.prdName"
                                                                                :value="item.currentPId">
                                                                        </el-option>
                                                                    </el-select>
                                                                    <span>
                                                                        期限范围:{{prodData.base.minDuration}}天-{{prodData.base.maxDuration}}天 |
                                                                        借款利率:{{prodData.base.loanRate}}% |
                                                                    </span>
                                                                    <span v-show="prodData.base.repayType != 4">服务费率:</span>
                                                                    <span v-show="prodData.base.repayType == 4">分期服务费率:</span>
                                                                    <span>{{prodData.base.serviceRate}}% |
                                                                        借款成本:{{prodData.base.minCostRate}}%~{{prodData.base.maxCostRate}}%
                                                                    </span>
                                                                </el-form-item>
                                                            </div>
                                                            <div class="prod-item">
                                                                <el-form-item class="in-line" label-width="90px" label="使用有效期" prop="baseEndDate"  :rules="[
                                                                        {required: true,message: '请选择时间'}
                                                                    ]">
                                                                    <el-date-picker
                                                                            style="width:120px"
                                                                            class="date"
                                                                            size="small"
                                                                            v-model="credit.apply.baseStartDate"
                                                                            type="date"
                                                                            placeholder="使用有效期">
                                                                    </el-date-picker>
                                                                    <span>-</span>
                                                                    <el-date-picker
                                                                            style="width:120px"
                                                                            class="date"
                                                                            size="small"
                                                                            :picker-options="pickerOptions"
                                                                            v-model="credit.apply.baseEndDate"
                                                                            type="date"
                                                                            placeholder="使用有效期">
                                                                    </el-date-picker>
                                                                </el-form-item>
                                                                <el-form-item class="in-line" label-width="120px"  label="借款成本调整为" prop="baseCostRate" :rules="[
                                                                    { validator: baseCostRateValidate}
                                                                ]">
                                                                    <el-input style="width:100px"  size="small"  v-model.number="credit.apply.baseCostRate" placeholder="授信期限">
                                                                        <template slot="append">%</template>
                                                                    </el-input>
                                                                </el-form-item>
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <div class="prod-item">
                                                                <el-form-item label-width="140px" label="附属产品">
                                                                    <el-select @change="prodSubsidiaryChangeHandler"  style="width:160px" size="small" v-model="credit.apply.subsidiaryPrdId" placeholder="请选择产品">
                                                                        <el-option  label="选择产品" :value="null"></el-option>
                                                                        <el-option
                                                                                v-for="item in prodData.list"
                                                                                :key="item.prdId"
                                                                                :label="item.prdName"
                                                                                :value="item.currentPId">
                                                                        </el-option>
                                                                    </el-select>
                                                                    <span>
                                                                    期限范围:{{prodData.subsidiary.minDuration}}天-{{prodData.subsidiary.maxDuration}}天 |
                                                                    借款利率:{{prodData.subsidiary.loanRate}}% | 服务费率:{{prodData.subsidiary.serviceRate}}% |
                                                                    借款成本:{{prodData.subsidiary.minCostRate}}%~{{prodData.subsidiary.maxCostRate}}%
                                                                </span>
                                                                </el-form-item>
                                                            </div>
                                                            <div class="prod-item">
                                                                <el-form-item class="in-line" label-width="90px" label="使用有效期">
                                                                    <el-date-picker
                                                                            style="width:120px"
                                                                            class="date"
                                                                            size="small"
                                                                            v-model="credit.apply.subsidiaryStartDate"
                                                                            type="date"
                                                                            placeholder="使用有效期">
                                                                    </el-date-picker>
                                                                    <span>-</span>
                                                                    <el-date-picker
                                                                            style="width:120px"
                                                                            class="date"
                                                                            size="small"
                                                                            v-model="credit.apply.subsidiaryEndDate"
                                                                            type="date"
                                                                            placeholder="使用有效期">
                                                                    </el-date-picker>
                                                                </el-form-item>
                                                                <el-form-item class="in-line" label-width="120px" label="借款成本调整为" prop="subsidiaryCostRate" :rules="[
                                                                    { validator: subsidiaryCostRateValidate}
                                                                ]">
                                                                    <el-input style="width:100px"  size="small"  v-model="credit.apply.subsidiaryCostRate" placeholder="借款成本">
                                                                        <template slot="append">%</template>
                                                                    </el-input>
                                                                </el-form-item>
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <div class="prod-item">
                                                                <el-form-item label-width="140px" label="营销产品">
                                                                    <el-select @change="prodMarketChangeHandler"  style="width:160px" size="small" v-model="credit.apply.marketPrdId" placeholder="请选择产品">
                                                                        <el-option  label="选择产品" :value="null"></el-option>
                                                                        <el-option
                                                                                v-for="item in prodData.list"
                                                                                :key="item.prdId"
                                                                                :label="item.prdName"
                                                                                :value="item.currentPId">
                                                                        </el-option>
                                                                    </el-select>
                                                                    <span>
                                                                    期限范围:{{prodData.market.minDuration}}天-{{prodData.market.maxDuration}}天 |
                                                                    借款利率:{{prodData.market.loanRate}}% | 服务费率:{{prodData.market.serviceRate}}% |
                                                                    借款成本:{{prodData.market.minCostRate}}%~{{prodData.market.maxCostRate}}%
                                                                </span>
                                                                </el-form-item>
                                                            </div>
                                                            <div class="prod-item">
                                                                <el-form-item class="in-line" label-width="90px" label="使用有效期">
                                                                    <el-date-picker
                                                                            style="width:120px"
                                                                            class="date"
                                                                            size="small"
                                                                            v-model="credit.apply.marketStartDate"
                                                                            type="date"
                                                                            placeholder="使用有效期">
                                                                    </el-date-picker>
                                                                    <span>-</span>
                                                                    <el-date-picker
                                                                            style="width:120px"
                                                                            class="date"
                                                                            size="small"
                                                                            v-model="credit.apply.marketEndDate"
                                                                            type="date"
                                                                            placeholder="使用有效期">
                                                                    </el-date-picker>
                                                                </el-form-item>
                                                                <el-form-item class="in-line" label-width="120px" label="借款成本调整为" prop="marketCostRate" :rules="[
                                                                    { validator: marketCostRateValidate}
                                                                ]">
                                                                    <el-input style="width:100px"  size="small"  v-model="credit.apply.marketCostRate" placeholder="借款成本">
                                                                        <template slot="append">%</template>
                                                                    </el-input>
                                                                </el-form-item>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </el-form-item>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr class="el-table__row">
                                        <td colspan="4">
                                            <div class="cell">
                                                <el-form-item  label="借款用途及合理性分析" prop="purpose" :rules="[
                                                        { required: true, message: '请输入借款用途及合理性分析'}
                                                    ]">
                                                    <el-input
                                                            type="textarea"
                                                            :autosize="{ minRows: 4, maxRows: 4}"
                                                            placeholder="请输入借款用途及合理性分析"
                                                            v-model="credit.apply.purpose">
                                                    </el-input>
                                                </el-form-item>
                                            </div>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </el-form>
                        </div>
                        <div class="resize-triggers">
                            <div class="expand-trigger">
                                <div style="width: 761px; height: 201px;"></div>
                            </div>
                            <div class="contract-trigger"></div>
                        </div>
                    </div>
                </el-tab-pane>

                <!--客户经营情况-->
                <el-tab-pane  label="客户经营情况" name="second">
                    <div class="el-table el-table--fit el-table--enable-row-transition" style="width: 100%;">
                        <div class="el-table__header-wrapper">
                            <table cellspacing="0" cellpadding="0" border="0" class="el-table__header" style="width: 100%;">
                                <thead>
                                <tr>
                                    <th colspan="1" rowspan="4" class="is-leaf">
                                        <div class="cell">客户经营情况</div>
                                    </th>
                                    </th>
                                </tr>
                                </thead>
                            </table>
                        </div>
                        <div class="el-table__body-wrapper">
                            <el-form   :model="credit.operate" ref="creditOperate" label-width="120px">
                                <table cellspacing="0" cellpadding="0" border="0" class="el-table__body" style="width: 100%;">
                                    <colgroup>
                                        <col width="45%">
                                        <col width="10%">
                                        <col width="45%">
                                    </colgroup>
                                    <tbody>
                                    <tr class="el-table__row">
                                        <td>
                                            <div class="cell">
                                                <el-form-item label="目前从事行业" prop="industry" :rules="[
                                                        { required: true, message: '输入从事行业'},
                                                    ]">
                                                    <el-input style="width:180px"  size="small"  v-model="credit.operate.industry" placeholder="从事行业"></el-input>

                                                </el-form-item>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="cell"></div>
                                        </td>
                                        <td>
                                            <div class="cell">
                                                <el-form-item  label="从事年限" prop="industryDuration" :rules="[
                                                        { required: true, message: '输入从事年限'},
                                                        { type: 'number', message: '年限为数字值'}
                                                    ]">
                                                    <el-input style="width:180px"  size="small"  v-model.number="credit.operate.industryDuration" placeholder="从事年限"></el-input>
                                                </el-form-item>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr class="el-table__row">
                                        <td>
                                            <div class="cell">
                                                <el-form-item size="small" label="是否从事其他行业" prop="isOtherIndustry" :rules="[
                                                        { required: true, message: '请选择'},
                                                    ]">
                                                    <el-radio  v-model.number="credit.operate.isOtherIndustry" :label="0">是</el-radio>
                                                    <el-radio  v-model.number="credit.operate.isOtherIndustry" :label="1">否</el-radio>
                                                </el-form-item>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="cell">

                                            </div>
                                        </td>
                                        <td>
                                            <div class="cell">
                                                <el-form-item  label="其他行业名称">
                                                    <el-input style="width:180px"  size="small"  v-model="credit.operate.otherIndustry" placeholder="其他行业名称"></el-input>
                                                </el-form-item>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr class="el-table__row">
                                        <td>
                                            <div class="cell">
                                                <el-form-item size="small" label="主营产品名称" prop="mainProduct" :rules="[
                                                        { required: true, message: '输入主营产品'},
                                                    ]">
                                                    <el-input style="width:180px"  size="small"  v-model="credit.operate.mainProduct" placeholder="主营产品名称"></el-input>
                                                </el-form-item>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="cell">

                                            </div>
                                        </td>
                                        <td>
                                            <div class="cell">
                                                <el-form-item  label="稳定程度" prop="stable" :rules="[
                                                        { required: true, message: '请选择稳定程度'},
                                                    ]">
                                                    <el-select style="width:180px" size="small" v-model.number="credit.operate.stable" placeholder="请选择稳定程度">
                                                        <el-option  label="稳定程度" :value="0"></el-option>
                                                        <el-option
                                                                v-for="item in ops.stabilizeType"
                                                                :key="item.id"
                                                                :label="item.name"
                                                                :value="parseInt(item.value)">
                                                        </el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr class="el-table__row">
                                        <td>
                                            <div class="cell">
                                                <el-form-item size="small" label="雇佣人数" prop="employers" :rules="[
                                                        { required: true, message: '请选择稳定程度'},
                                                        { type: 'number', message: '必须数字'},
                                                    ]">
                                                    <el-input style="width:180px"  size="small"  v-model.number="credit.operate.employers" placeholder="雇佣人数"></el-input>
                                                </el-form-item>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="cell">

                                            </div>
                                        </td>
                                        <td>
                                            <div class="cell">

                                            </div>
                                        </td>
                                    </tr>
                                    <tr class="el-table__row">
                                        <td colspan="3">
                                            <el-row>
                                                <el-col :span="8">
                                                    <div class="cell">
                                                        <el-form-item size="small" label="今年销售额（万）" prop="salesVolume" :rules="[
                                                        { required: true, message: '今年销售额'},
                                                        { type: 'number', message: '必须数字'},
                                                    ]">
                                                            <el-input style="width:100px"  size="small"  v-model.number="credit.operate.salesVolume" placeholder="今年销售额"></el-input>
                                                        </el-form-item>
                                                    </div>
                                                </el-col>
                                                <el-col :span="8">
                                                    <div class="cell">
                                                        <el-form-item size="small" label="今年利润(万)" prop="profit" :rules="[
                                                        { required: true, message: '今年利润'},
                                                        { type: 'number', message: '必须数字'},
                                                    ]">
                                                            <el-input style="width:100px"  size="small"  v-model.number="credit.operate.profit" placeholder="今年利润"></el-input>
                                                        </el-form-item>
                                                    </div>
                                                </el-col>
                                                <el-col :span="8">
                                                    <div class="cell">
                                                        <el-form-item size="small" label="今年利润率:">
                                                            <span v-show="!!credit.operate.profit && !!credit.operate.salesVolume">{{ (credit.operate.profit / credit.operate.salesVolume * 100).toFixed(2) }}%</span>
                                                        </el-form-item>
                                                    </div>
                                                </el-col>
                                            </el-row>
                                        </td>
                                    </tr>
                                    <tr class="el-table__row">
                                        <td colspan="3">
                                            <el-row>
                                                <el-col :span="8">
                                                    <div class="cell">
                                                        <el-form-item size="small" label="去年销售额(万)" prop="lastSalesVolume" :rules="[
                                                        { required: true, message: '去年销售额'},
                                                        { type: 'number', message: '必须数字'},
                                                    ]">
                                                            <el-input style="width:100px"  size="small"  v-model.number="credit.operate.lastSalesVolume" placeholder="去年销售额"></el-input>
                                                        </el-form-item>
                                                    </div>
                                                </el-col>
                                                <el-col :span="8">
                                                    <div class="cell">
                                                        <el-form-item size="small" label="去年利润(万)" prop="profit" :rules="[
                                                        { required: true, message: '去年利润'},
                                                        { type: 'number', message: '必须数字'},
                                                    ]">
                                                            <el-input style="width:100px"  size="small"  v-model.number="credit.operate.lastProfit" placeholder="去年利润"></el-input>
                                                        </el-form-item>
                                                    </div>
                                                </el-col>
                                                <el-col :span="8">
                                                    <div class="cell">
                                                        <el-form-item size="small" label="去年利润率:">
                                                            <span v-show="!!credit.operate.lastProfit && !!credit.operate.lastSalesVolume">{{credit.operate.lastProfit / credit.operate.lastSalesVolume * 100}}%</span>
                                                        </el-form-item>
                                                    </div>
                                                </el-col>
                                            </el-row>
                                        </td>
                                    </tr>
                                    <tr class="el-table__row">
                                        <td>
                                            <div class="cell">
                                                <el-form-item size="small" label="主要销往" prop="salesTarget" :rules="[
                                                        { required: true, message: '主要销往'},
                                                    ]">
                                                    <el-input style="width:180px"  size="small"  v-model="credit.operate.salesTarget" placeholder="主要销往"></el-input>
                                                </el-form-item>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="cell">

                                            </div>
                                        </td>
                                        <td>
                                            <div class="cell">
                                                <el-form-item size="small" label="季节性是否明显" required>
                                                    <el-radio  v-model.number="credit.operate.isSeasonal" :label="0">是</el-radio>
                                                    <el-radio  v-model.number="credit.operate.isSeasonal" :label="1">否</el-radio>
                                                </el-form-item>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr class="el-table__row">
                                        <td>
                                            <div class="cell">
                                                <el-form-item size="small" label="旺季月份">
                                                    <el-input style="width:180px"  size="small"  v-model="credit.operate.busySeason" placeholder="旺季"></el-input>
                                                </el-form-item>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="cell">

                                            </div>
                                        </td>
                                        <td>
                                            <div class="cell">
                                                <el-form-item size="small" label="淡季月份">
                                                    <el-input style="width:180px"  size="small"  v-model="credit.operate.lowSeason" placeholder="淡季"></el-input>
                                                </el-form-item>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr class="el-table__row">
                                        <td colspan="4">
                                            <div class="cell">
                                                <el-form-item  label="总体评价" prop="estimate" :rules="[
                                                        { required: true, message: '请输入总体评价'},
                                                    ]">
                                                    <el-input
                                                            type="textarea"
                                                            :autosize="{ minRows: 4, maxRows: 4}"
                                                            placeholder="请输入总体评价"
                                                            v-model="credit.operate.estimate">
                                                    </el-input>
                                                </el-form-item>
                                            </div>
                                        </td>
                                    </tr>

                                    </tbody>
                                </table>
                            </el-form>
                        </div>
                        <div class="resize-triggers">
                            <div class="expand-trigger">
                                <div style="width: 761px; height: 201px;"></div>
                            </div>
                            <div class="contract-trigger"></div>
                        </div>
                    </div>
                </el-tab-pane>

                <!--资产负债-->
                <el-tab-pane  label="资产负债信息" name="third">

                </el-tab-pane>

                <!--履历简述-->
                <el-tab-pane  label="履历简述" name="4">
                    <el-button size="mini" v-show=" editable == true "  @click.native="doAddGuaranteeHandler">新 增</el-button>
                    <div class="el-table el-table--fit el-table--enable-row-transition" style="width: 100%;">
                        <div class="el-table__header-wrapper">
                            <table cellspacing="0" cellpadding="0" border="0" class="el-table__header" style="width: 100%;">
                                <thead>
                                <tr>
                                    <th colspan="1" rowspan="4" class="is-leaf">
                                        <div class="cell">担保信息</div>
                                    </th>
                                </tr>
                                </thead>
                            </table>
                        </div>
                        <div class="el-table__body-wrapper">
                            <el-form   :model="detail">
                                <el-table
                                        :data="credit.guarantee.list"
                                        border
                                        style="width: 100%">
                                    <el-table-column
                                            prop="guaranteeNo"
                                            label="担保合同号"
                                            align="center"
                                            min-width="160">
                                    </el-table-column>
                                    <el-table-column
                                            prop="guaranteeType"
                                            align="center"
                                            label="担保类型"
                                            min-width="140">
                                    </el-table-column>
                                    <el-table-column
                                            prop="custType"
                                            align="center"
                                            label="客户类型"
                                            min-width="140">
                                    </el-table-column>
                                    <el-table-column
                                            prop="custName"
                                            align="center"
                                            label="担保人姓名"
                                            min-width="140">
                                    </el-table-column>
                                    <el-table-column
                                            prop="guaranteeAmt"
                                            align="center"
                                            label="担保合同金额"
                                            min-width="140">
                                    </el-table-column>
                                    <el-table-column
                                            label="担保起始日期"
                                            align="center"
                                            width="140">
                                        <template scope="scope">
                                            <span>{{ scope.row.startDate | dateFormat }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                            label="担保到期日期"
                                            align="center"
                                            min-width="130">
                                        <template scope="scope">
                                            <span>{{ scope.row.expirationDate | dateFormat }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                            label="担保合同状态"
                                            align="center"
                                            min-width="130">
                                        <template scope="scope">
                                            <span>{{ scope.row.applyDate | dateFormat}}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                            align="center"
                                            label="操作"
                                            width="80"
                                            fixed="right"
                                    >
                                        <template scope="scope">
                                            <el-button @click.native="doDeleteGuaranteeHandler(scope)" size="small">删除</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-form>
                        </div>
                        <div class="resize-triggers">
                            <div class="expand-trigger">
                                <div style="width: 761px; height: 201px;"></div>
                            </div>
                            <div class="contract-trigger"></div>
                        </div>
                    </div>
                </el-tab-pane>


                <!--担保信息-->
                <el-tab-pane  label="担保信息" name="5">
                    <el-button size="mini" v-show=" editable == true "  @click.native="doAddGuaranteeHandler">新 增</el-button>
                    <div class="el-table el-table--fit el-table--enable-row-transition" style="width: 100%;">
                        <div class="el-table__header-wrapper">
                            <table cellspacing="0" cellpadding="0" border="0" class="el-table__header" style="width: 100%;">
                                <thead>
                                <tr>
                                    <th colspan="1" rowspan="4" class="is-leaf">
                                        <div class="cell">担保信息</div>
                                    </th>
                                </tr>
                                </thead>
                            </table>
                        </div>
                        <div class="el-table__body-wrapper">
                            <el-form   :model="detail">
                                <el-table
                                        :data="credit.guarantee.list"
                                        border
                                        style="width: 100%">
                                    <el-table-column
                                            prop="guaranteeNo"
                                            label="担保合同号"
                                            align="center"
                                            min-width="160">
                                    </el-table-column>
                                    <el-table-column
                                            prop="guaranteeType"
                                            align="center"
                                            label="担保类型"
                                            min-width="140">
                                    </el-table-column>
                                    <el-table-column
                                            prop="custType"
                                            align="center"
                                            label="客户类型"
                                            min-width="140">
                                    </el-table-column>
                                    <el-table-column
                                            prop="custName"
                                            align="center"
                                            label="担保人姓名"
                                            min-width="140">
                                    </el-table-column>
                                    <el-table-column
                                            prop="guaranteeAmt"
                                            align="center"
                                            label="担保合同金额"
                                            min-width="140">
                                    </el-table-column>
                                    <el-table-column
                                            label="担保起始日期"
                                            align="center"
                                            width="140">
                                        <template scope="scope">
                                            <span>{{ scope.row.startDate | dateFormat }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                            label="担保到期日期"
                                            align="center"
                                            min-width="130">
                                        <template scope="scope">
                                            <span>{{ scope.row.expirationDate | dateFormat }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                            label="担保合同状态"
                                            align="center"
                                            min-width="130">
                                        <template scope="scope">
                                            <span>{{ scope.row.applyDate | dateFormat}}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                            align="center"
                                            label="操作"
                                            width="80"
                                            fixed="right"
                                    >
                                        <template scope="scope">
                                            <el-button @click.native="doDeleteGuaranteeHandler(scope)" size="small">删除</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-form>
                        </div>
                        <div class="resize-triggers">
                            <div class="expand-trigger">
                                <div style="width: 761px; height: 201px;"></div>
                            </div>
                            <div class="contract-trigger"></div>
                        </div>
                    </div>
                </el-tab-pane>

                <!--资料清单-->
                <el-tab-pane  label="资料清单" name="6">
                    <el-collapse :value="['6-1','6-2']" @change="handleChange">
                        <el-collapse-item title="征信及法院五查询" name="6-1">

                            <el-form :model="credit.material" label-position="left"  ref="materialForm" label-width="160px">
                                <el-form-item label="报告查询时间" prop="queryTime" :rules="[
                                                        { required: true, message: '报告查询时间'},
                                                    ]">
                                    <el-row :gutter="20">
                                        <el-col :span="7">
                                            <el-date-picker
                                                    size="small"
                                                    class="date"
                                                    style="width:100%"
                                                    v-model="credit.material.queryTime"
                                                    type="date"
                                                    placeholder="放款日期">
                                            </el-date-picker>
                                        </el-col>
                                    </el-row>
                                </el-form-item>
                                <el-form-item label-width="0px">
                                    <el-alert
                                            title="上传后可查看预览,确认无误后上传到服务器,修改备注请重新上传文件.(只能上传jpg/png文件，且不超过500kb)"
                                            type="info"
                                            show-icon>
                                    </el-alert>
                                </el-form-item>


                                <el-form-item label="征信报告">
                                    <el-row :gutter="20">
                                        <el-col :span="3">
                                            <a class="img-box">
                                                <img @click="handlePicturePreview('credit_report')" :src="getCreditMaterialDownload('credit_report',creditId)" >
                                            </a>
                                        </el-col>

                                        <el-col :span="7">
                                            <el-upload
                                                    class="upload-demo"
                                                    :headers="headers"
                                                    action="root/business/material/upload"
                                                    :multiple="false"
                                                    :on-success="handleUploadSuccess"
                                                    :on-preview="handlePictureCardPreview"
                                                    :on-remove="handleRemove"
                                                    :data="creditReportData"
                                                    :auto-upload="false"
                                                    ref="creditReportUpload"
                                            >
                                                <el-button size="small" type="primary">选择文件</el-button>
                                            </el-upload>
                                        </el-col>
                                        <el-col :span="8">
                                            <el-form-item label="备注" label-width="40px">
                                                <el-input size="small" v-model="credit.material.creditReportRemark"  placeholder="备注"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="3">
                                            <el-button  style="margin-left: 10px;" size="small" type="success" @click="submitUpload('creditReportUpload')">上传到服务器</el-button>
                                            <!--<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
                                        </el-col>
                                    </el-row>
                                </el-form-item>
                                <el-form-item label="诉讼案件信息查询记录">
                                    <el-row :gutter="20">
                                        <el-col :span="3">
                                            <a class="img-box">
                                                <img @click="handlePicturePreview('litigation')" :src="getCreditMaterialDownload('litigation',creditId)" >
                                            </a>
                                        </el-col>
                                        <el-col :span="7">
                                            <el-upload
                                                    class="upload-demo"
                                                    :headers="headers"
                                                    :multiple="false"
                                                    :on-success="handleUploadSuccess"
                                                    action="root/business/material/upload"
                                                    :on-preview="handlePictureCardPreview"
                                                    :on-remove="handleRemove"
                                                    :data="litigationReportData"
                                                    :auto-upload="false"
                                                    ref="litigationReportUpload"
                                            >
                                                <el-button size="small" type="primary">选择文件</el-button>
                                            </el-upload>
                                            <!--<el-input size="small"  v-model="credit.material.litigationFile"  placeholder="文件名"></el-input>-->
                                        </el-col>
                                        <el-col :span="8">
                                            <el-form-item label="备注" label-width="40px">
                                                <el-input size="small" v-model="credit.material.litigationRemark"  placeholder="备注"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="3">
                                            <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload('litigationReportUpload')">上传到服务器</el-button>
                                        </el-col>
                                    </el-row>
                                </el-form-item>
                                <el-form-item label="开庭公告查询记录">
                                    <el-row :gutter="20">
                                        <el-col :span="3">
                                            <a class="img-box">
                                                <img @click="handlePicturePreview('notice')" :src="getCreditMaterialDownload('notice',creditId)" >
                                            </a>
                                        </el-col>
                                        <el-col :span="7">
                                            <el-upload
                                                    class="upload-demo"
                                                    :headers="headers"
                                                    :multiple="false"
                                                    :on-success="handleUploadSuccess"
                                                    action="root/business/material/upload"
                                                    :on-preview="handlePictureCardPreview"
                                                    :on-remove="handleRemove"
                                                    :data="noticeReportData"
                                                    :auto-upload="false"
                                                    ref="noticeReportUpload"
                                            >
                                                <el-button size="small" type="primary">选择文件</el-button>
                                            </el-upload>
                                        </el-col>
                                        <el-col :span="8">
                                            <el-form-item label="备注" label-width="40px">
                                                <el-input size="small" v-model="credit.material.noticeRemark"  placeholder="备注"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="3">
                                            <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload('noticeReportUpload')">上传到服务器</el-button>
                                        </el-col>
                                    </el-row>
                                </el-form-item>
                                <el-form-item label="裁判文书查询记录">
                                    <el-row :gutter="20">
                                        <el-col :span="3">
                                            <a class="img-box">
                                                <img @click="handlePicturePreview('sentence')" :src="getCreditMaterialDownload('sentence',creditId)" >
                                            </a>
                                        </el-col>
                                        <el-col :span="7">
                                            <el-upload
                                                    class="upload-demo"
                                                    :headers="headers"
                                                    :multiple="false"
                                                    :on-success="handleUploadSuccess"
                                                    action="root/business/material/upload"
                                                    :on-preview="handlePictureCardPreview"
                                                    :on-remove="handleRemove"
                                                    :data="sentenceReportData"
                                                    :auto-upload="false"
                                                    ref="sentenceReportUpload"
                                            >
                                                <el-button size="small" type="primary">选择文件</el-button>
                                                <!--<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
                                            </el-upload>
                                            <!--<el-input size="small"  v-model="credit.material.sentenceFile"  placeholder="文件名"></el-input>-->
                                        </el-col>
                                        <el-col :span="8">
                                            <el-form-item label="备注" label-width="40px">
                                                <el-input size="small" v-model="credit.material.sentenceRemark"  placeholder="备注"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="3">
                                            <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload('sentenceReportUpload')">上传到服务器</el-button>
                                        </el-col>
                                    </el-row>
                                </el-form-item>
                                <el-form-item label="执行案件查询记录">
                                    <el-row :gutter="20">
                                        <el-col :span="3">
                                            <a class="img-box">
                                                <img @click="handlePicturePreview('execute')" :src="getCreditMaterialDownload('execute',creditId)" >
                                            </a>
                                        </el-col>
                                        <el-col :span="7">
                                            <el-upload
                                                    class="upload-demo"
                                                    :headers="headers"
                                                    :on-success="handleUploadSuccess"
                                                    action="root/business/material/upload"
                                                    :on-preview="handlePictureCardPreview"
                                                    :on-remove="handleRemove"
                                                    :data="executeReportData"
                                                    :auto-upload="false"
                                                    ref="executeReportUpload"
                                            >
                                                <el-button size="small" type="primary">点击上传</el-button>
                                                <!--<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
                                            </el-upload>
                                            <!--<el-input size="small"  v-model="credit.material.executeFile"  placeholder="文件名"></el-input>-->
                                        </el-col>
                                        <el-col :span="8">
                                            <el-form-item label="备注" label-width="40px">
                                                <el-input size="small" v-model="credit.material.executeRemark"  placeholder="备注"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="3">
                                            <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload('executeReportUpload')">上传到服务器</el-button>
                                        </el-col>
                                    </el-row>
                                </el-form-item>
                                <el-form-item label="法院执行网查询记录">
                                    <el-row :gutter="20">
                                        <el-col :span="3">
                                            <a class="img-box">
                                                <img @click="handlePicturePreview('court_execute')" :src="getCreditMaterialDownload('court_execute',creditId)" >
                                            </a>
                                        </el-col>
                                        <el-col :span="7">
                                            <el-upload
                                                    class="upload-demo"
                                                    :headers="headers"
                                                    action="root/business/material/upload"
                                                    :on-preview="handlePictureCardPreview"
                                                    :multiple="false"
                                                    :on-success="handleUploadSuccess"
                                                    :on-remove="handleRemove"
                                                    :data="courtExecuteReportData"
                                                    :auto-upload="false"
                                                    ref="courtExecuteReportUpload"
                                            >
                                                <el-button size="small" type="primary">点击上传</el-button>
                                                <!--<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
                                            </el-upload>
                                            <!--<el-input size="small"  v-model="credit.material.courtExecuteFile"  placeholder="文件名"></el-input>-->
                                        </el-col>
                                        <el-col :span="8">
                                            <el-form-item label="备注" label-width="40px">
                                                <el-input size="small" v-model="credit.material.courtExecuteRemark"  placeholder="备注"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="3">
                                            <!--<el-button size="small" type="primary">点击上传</el-button>-->
                                            <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload('courtExecuteReportUpload')">上传到服务器</el-button>
                                        </el-col>
                                    </el-row>
                                </el-form-item>
                                <el-form-item label="疑点备注">
                                    <el-input
                                            type="textarea"
                                            :autosize="{ minRows: 3, maxRows: 3}"
                                            placeholder="请输入内容"
                                            v-model="credit.material.doubtfulRemark">
                                    </el-input>
                                </el-form-item>
                            </el-form>

                        </el-collapse-item>

                        <el-collapse-item title="其他附件" name="6-2">
                            <el-button size="mini"  v-show=" editable == true " @click.native="doAddUploadItemHandler">新 增</el-button>
                            <el-table
                                    :data="credit.material.list"
                                    border
                                    style="width: 100%">
                                <el-table-column
                                        label="序号"
                                        align="center"
                                        min-width="160">
                                    <template scope="scope">
                                        <a @click="showUploadDetailHandler(scope.row.id)" href="javascript:(0)">{{ scope.row.id}}</a>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        prop="name"
                                        align="center"
                                        label="附件名称"
                                        min-width="140">
                                </el-table-column>
                                <el-table-column
                                        label="上传时间"
                                        align="center"
                                        min-width="130">
                                    <template scope="scope">
                                        <span>{{ scope.row.uploadTime | dateFormat}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        prop="remark"
                                        align="center"
                                        label="备注"
                                        min-width="140">
                                </el-table-column>
                                <el-table-column
                                        align="center"
                                        label="操作"
                                        width="120"
                                >
                                    <template scope="scope">
                                        <el-button v-show=" editable == true " @click.native="deleteUpdateItemHandler(scope)" size="small">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>

                        </el-collapse-item>
                        <!--<el-collapse-item title="关联企业信息" name="2">-->
                        <!--<div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>-->
                        <!--<div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>-->
                        <!--</el-collapse-item>-->
                    </el-collapse>
                </el-tab-pane>

                <el-tab-pane  label="客户信息" name="7">

                </el-tab-pane>
            </el-tabs>
            <div slot="footer" class="dialog-footer">
                <el-button class="pull-left" @click.native="opened.openCredit = false">取 消</el-button>
                <el-button type="primary" v-show="tabActive =='first' && editable == true " @click.native="doSaveUserApplyCacheHandler('creditApply')">暂 存</el-button>
                <el-button type="primary" v-show="tabActive =='second' && editable == true " @click.native="doSaveUserOperateCacheHandler('creditOperate')">暂 存</el-button>
                <el-button type="primary" v-show="tabActive =='third' && editable == true " @click.native="doSaveUserBalanceCacheHandler('creditOperate')">暂 存</el-button>
                <el-button type="primary" v-show="tabActive =='fifth' && editable == true " @click.native="doSaveMaterialRemarkCacheHandler">暂 存</el-button>
                <el-button type="primary" v-show=" editable == true " @click.native="doSubmitApplyHandler">提交申请</el-button>
            </div>
        </el-dialog>

        <!--新建担保 -->
        <el-dialog title="新建担保信息" class="org-dialog" :visible.sync="visible.addGuarantee" size="tiny" >
            <el-form :model="credit.guarantee.item"  ref="guarantee" label-width="100px">
                <el-form-item label="担保类型" prop="guaranteeType" :rules="[
                            {required: true, message: '请选择担保类型'},
                            ]">
                    <el-radio  v-model.number="credit.guarantee.item.guaranteeType" :label="1">最高额担保</el-radio>
                </el-form-item>
                <el-form-item label="证件号">
                    <el-select
                            v-model="credit.guarantee.item.guaranteerId"
                            filterable
                            remote
                            @change="selectedCustomHandler"
                            placeholder="请输入证件号"
                            :no-data-text="身份证号输入有误或该客户不存在"
                            :remote-method="getCustomByCertNo"
                            :loading="customer.loading">
                        <el-option
                                v-for="item in customer.options"
                                :key="item.custId"
                                :label="item.certNo"
                                :value="item.custId">
                            <span style="float: left">{{ item.certNo }}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.custName }}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="担保人名称"  >
                    <el-input  :readonly="true"  v-model="credit.guarantee.item.custName"  placeholder="请输入担保人名称"></el-input>
                </el-form-item>
                <el-form-item label="担保金额"  prop="guaranteeAmt" :rules="[
                            {required: true, message: '请输入担保金额'},
                            { type:'number', message: '必须为数字'}
                            ]">
                    <el-input @change="certNumberChangeHandler"  v-model.number="credit.guarantee.item.guaranteeAmt"  placeholder="请输入担保金额"></el-input>
                </el-form-item>
                <el-form-item label="起效日期"  prop="startDateTime" :rules="[
                            {required: true, message: '选择时间'},
                            ]">

                    <el-date-picker
                            :readonly="true"
                            class="date"
                            style="width:100%"
                            v-model="credit.guarantee.item.startDateTime"
                            type="date"
                            placeholder="起效日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="到期日期"  prop="expirationDateTime" :rules="[
                                {required: true, message: '选择时间'},
                            ]">
                    <el-date-picker
                            style="width:100%"
                            class="date"
                            v-model="credit.guarantee.item.expirationDateTime"
                            type="date"
                            :picker-options="pickerOptions"
                            placeholder="放款日期">
                    </el-date-picker>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button class="pull-left" @click.native="visible.addGuarantee = false">取 消</el-button>
                <el-button type="primary" @click.native="doSaveGuaranteeHandler('guarantee')">确 认</el-button>
            </div>
        </el-dialog>

        <!--新建资料item -->
        <el-dialog title="新建资料" class="org-dialog" :visible.sync="visible.upload" size="tiny" >
            <el-form :model="credit.material.item"  ref="uploadItem" label-width="100px">

                <el-form-item label="附件名称"  prop="name" :rules="[
                                {required: true, message: '附件名称'},
                            ]">
                    <el-input  size="small"  v-model="credit.material.item.name" placeholder="附件名称"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input  size="small"  v-model="credit.material.item.remark" placeholder="备注"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button class="pull-left" @click.native="visible.upload = false">取 消</el-button>
                <el-button type="primary" @click.native="doSaveUploadItemHandler('uploadItem')">确 认</el-button>
            </div>
        </el-dialog>

        <!--其他资料 -->
        <el-dialog title="其他资料上传" class="org-dialog" :visible.sync="visible.uploadDetail" size="w800">
            <el-form  :model="credit.material.item"  ref="uploadItem" label-width="100px">
                <div>
                    <el-upload
                            action="root/business/material/other/file/upload"
                            list-type="picture-card"
                            :on-preview="handlePictureCardPreview"
                            :file-list="credit.material.otherFileList"
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
                <el-button class="pull-left" @click.native="visible.uploadDetail = false">取 消</el-button>
                <el-button type="primary" @click.native="visible.uploadDetail = false">确 认</el-button>
            </div>
        </el-dialog>
        <el-dialog v-model="visible.bigImg" size="w1000">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
        <user-info :editable="false" :opened.sync="visible"  :custId.sync="current.custId"></user-info>
    </div>
</template>
<style lang="scss">
    .credit-info-dialog{
        .el-dialog--w1000{
            width: 1000px;
        }
        .el-dialog--w800{
            width: 800px;
        }
        .dialog-footer{
            min-height: 32px;
        }
        .el-row {
            margin-bottom: 20px;
        &:last-child {
             margin-bottom: 0;
         }
        }


    .center{
        text-align: center;
    }
    h3{
        font-size: 20px;
        font-weight: 400;
        margin: 12px 0;
    }
    .el-dialog--w1000{
        width: 1000px;
    }
    .el-dialog--w800{
        width: 800px;
    }
    width: 100%;
    padding: 1.5rem 1rem 0;
    box-sizing: border-box;
    .stat-box{
        padding-top: .4rem;
    }
    .item-box{
        display: inline-block;
        padding-left: 1rem;
    }
    .search-box{
        padding-top: 1rem;
    .el-input{
        width: 160px;
    &.date{
         width: 140px;
     }
    &.money{
         width: 100px;
     }
    &.manager{
         width: 160px;
     }
    }
    .lang{
    .el-input{
        width: 200px;
    }
    }
    .short{
    .el-input{
        width: 80px;
    }
    }
    .middle{
    .el-input{
        width: 110px;
    }
    }
    .status{
    .el-input{
        width: 160px;
    }
    }
    .long{
        &.el-date-editor{
             width: 330px;
         }
    }
    label{
        font-size: 1rem;
    }
    .el-form-item{
        display: inline-block;
        margin-bottom: 1rem;
    }
    }
    .table{
        cursor: move;
    .el-loading-mask{
        z-index: 10;
    }
    .disable-row {
        background: #f1f1f1;
    }
    }

    .el-form{
    .el-select{
        width: 100%;
    }
    }

    .attr-dialog{
    .el-radio-group{
        display: block;
    }
    }


    .credit-edit-dialog{
    .el-form-item{
    .el-form-item__label{
        font-size: 12px;
    }
    .el-form-item__content{
        font-size: 12px;
    }
    }
    .prod-list{
    .prod-item{
        padding-bottom: 1rem;
    }
    .in-line{
        display: inline-block;
    }
    }
    .img-box{
        width: 60px;
        height: 60px;
        display: block;
    }
    }

    .operation-dialog{
        .el-form-item{
            .el-form-item__label{
                font-size: 12px;
            }
            .el-form-item__content{
                font-size: 12px;
            }
        }
    }

    }
</style>
<script>

    import Util         from  '../../js/util'
    import Auth         from  '../../js/auth'
    import UserInfo     from    './UserInfo.vue'

    export default{
        data(){
            return{
                msg:'hello vue',
                tabActive:'first',
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                },
                current:{
                    tabIndex:0,
                    custId:null,
                },
                credit:{
                    certNumber:null,
                    creditId:null,
                    apply:{
                        creditNo:null,
                        custId:null,
                        creditAmt:null,
                        custName:null,
                        certificateNumber:null,
                        expirationDate:null,
                        applyDate:null,
                        guaranteeType:null,
                        isSpecialService:0,
                        basePrdId:null,
                        baseEndDate:null,
                        baseStartDate:null,
                        baseCostRate:0,
                        subsidiaryPrdId:null,
                        subsidiaryStartDate:null,
                        subsidiaryEndDate:null,
                        subsidiaryCostRate:null,
                        marketPrdId:null,
                        marketStartDate:null,
                        marketEndDate:null,
                        marketCostRate:null,
                        custSourceType:null,
                        custSourceRemark:null,
                    },
                    operate:{
                        industry:null,
                        industryDuration:null,
                        isOtherIndustry:null,
                        otherIndustry:null,
                        mainProduct:null,
                        stable:null,
                        employers:null,
                        salesVolume:null,
                        profit:null,
                        profitRate:null,
                        lastSalesVolume:null,
                        lastProfit:null,
                        lastProfitRate:null,
                        salesTarget:null,
                        isSeasonal:null,
                        busySeason:null,
                        lowSeason:null,
                        estimate:null,
                    },
                    balance:{
                        asset:[],
                        loan:[],
                        liabilities:[],
                        assetsTotal:0
                    },
                    guarantee:{
                        item:{
                            guaranteeType:1,
                            expirationDateTime:null,
                            startDateTime:null,
                            guaranteeAmt:null,
                            guaranteerId:null,
                            custName:null
                        },
                        list:[]
                    },
//                  资料
                    material:{
                        "custId":100000015,
                        "creditId":"SX3537224811368448",
                        queryTime:1483200000000,
                        "creditReportFile":"F3542389207027712.jpeg",
                        "creditReportRemark":null,
                        "creditReportUpdateTime":1505198170000,
                        "litigationFile":null,
                        "litigationRemark":null,
                        "litigationUpdateTime":0,
                        "noticeFile":null,
                        "noticeRemark":null,
                        "noticeUpdateTime":0,
                        "sentenceFile":null,
                        "sentenceRemark":null,
                        "sentenceUpdateTime":0,
                        "executeFile":null,
                        "executeRemark":null,
                        "executeUpdateTime":0,
                        "courtExecuteFile":null,
                        "courtExecuteRemark":null,
                        "courtExecuteUpdateTime":0,
                        list:[],
                        item:{
                            remark:null,
                            name:null,
                        },
                        otherFileList:[
                        ],
                        fileList:{
                        },
                        fileId:null,
                    },
                    user:{
                        detail:{},
                        relation:{
                            person:[]
                        },
                        operation:{
                            list:[],
                            detail:{
                                busySeason:"七八月份",
                                creditId:"SX3582491459604480",
                                custId:100005903,
                                employers:1,
                                estimate:"不错哦",
                                industry:"IT",
                                industryDuration:10,
                                isOtherIndustry:0,
                                isSeasonal:0,
                                lastProfit:1,
                                lastProfitRate:0,
                                lastSalesVolume:8,
                                lowSeason:"九十月份",
                                mainProduct:"软件开发",
                                otherIndustry:null,
                                profit:2,
                                profitRate:0,
                                salesTarget:"国内",
                                salesVolume:10,
                                stable:1
                            }
                        },
                        balance:{
                            list:[],
                            detail:{

                            }
                        },
                        credit:{
                            credit:[],
                            list:[],
                            loan:[],
                            guarantee:[]
                        },
                        invest:{
                            pending:[],
                            end:[]
                        },
                        material:[],
                        creditMaterial:{
                            list:[],
                            detail:null
                        }
                    }
                },
                prodData:{
                    list:[],
                    base:{
                        minDuration:null,
                        maxDuration:null,
                        loanRate:null,
                        serviceRate:null,
                        minCostRate:null,
                        maxCostRate:null,
                    },
                    subsidiary:{
                        minDuration:null,
                        maxDuration:null,
                        loanRate:null,
                        serviceRate:null,
                        minCostRate:null,
                        maxCostRate:null,
                    },
                    market:{
                        minDuration:null,
                        maxDuration:null,
                        loanRate:null,
                        serviceRate:null,
                        minCostRate:null,
                        maxCostRate:null,
                    },
                    pageNum:1,
                    pageSize:15,
                    total:null,
                    loading:false
                },
                customer:{
                    loading: false,
                    options:[]
                },
                funcId:"R040100",
                headers:{
                    'authorization':Auth.getToken(),
//                    'Content-Type': 'multipart/form-data',
//                    'Accept':'application/json',
                },
                ops:{
                    assureType:[],
                    stabilizeType:[],
                    residentHouseTypeOps:[],
                    residentStatusOps:[],
                    maritalStatusOps:[],
                    stabilizeTypeOptions:[],
                    repayType:[],
                    lifeCycle:[],
                    custSourceType:[],
                },
                visible:{
                    openUser:false,
                    quickAdd:false,
                    blacklist:false,
                    relationPerson:false,
                    introduce:false,
                    operate:false,
                    balance:false,
                    creditMaterial:false,
                    uploadDetail:false,
                    bigImg:false,
                    addGuarantee:false,
                    upload:false,
                }
            }
        },
        props:{
            creditId:Number,
            opened:{
                type:Object,
                default:{
                    openCredit:false,
                }
            },
            editable:{
                type:Boolean,
                default:false
            },
            applyCallBack:Function

        },
        computed: {
            creditReportData:function () {
                let that            = this
                let creditId        = that.creditId
                let material = that.credit.material
                let ob = {
                    id:creditId,
                    type:"credit_report",
                    date: new Date(material.queryTime).getTime(),
                    remark:material.creditReportRemark
                }

                return ob
            },


            litigationReportData:function () {
                let that            = this
                let creditId        = that.creditId

                let material = that.credit.material
                let ob = {
                    id:creditId,
                    type:"litigation",
                    date: new Date(material.queryTime).getTime(),
                    remark:material.litigationRemark
                }

                return ob
            },
            noticeReportData:function () {
                let that            = this
                let creditId        = that.creditId
                let material = that.credit.material
                let ob = {
                    id:creditId,
                    type:"notice",
                    date: new Date(material.queryTime).getTime(),
                    remark:material.noticeRemark
                }

                return ob
            },
            sentenceReportData:function () {
                let that            = this
                let creditId        = that.creditId

                let material = that.credit.material
                let ob = {
                    id:creditId,
                    type:"sentence",
                    date: new Date(material.queryTime).getTime(),
                    remark:material.sentenceRemark
                }

                return ob
            },
            executeReportData:function () {
                let that            = this
                let creditId        = that.creditId

                let material = that.credit.material
                let ob = {
                    id:creditId,
                    type:"execute",
                    date: new Date(material.queryTime).getTime(),
                    remark:material.executeRemark
                }

                return ob
            },
            courtExecuteReportData:function () {
                let that            = this
                let creditId        = that.creditId
                let material = that.credit.material
                let ob = {
                    id:creditId,
                    type:"court_execute",
                    date: new Date(material.queryTime).getTime(),
                    remark:material.courtExecuteRemark
                }

                return ob
            },
            uploadItemData:function () {
                let that            = this
                let creditId        = that.creditId
                let material        = that.credit.material
                let ob = {
                    creditId:creditId,
                    id:material.fileId
                }

                return ob
            },
            assetsTotal:function(){
                let balance = this.credit.balance
                let total   = 0
                if(balance.asset.length>0){
                    balance.asset.forEach(v=>{
                        total += parseFloat(v.balance)
                    })
                    balance.assetsTotal = total
                }
                return balance.assetsTotal
            },
            liabilitiesTotal:function () {
                let balance = this.credit.balance
                let total   = 0
                if(balance.liabilities.length>0){
                    balance.liabilities.forEach(v=>{
                        total += parseFloat(v.balance)
                    })
                }
                if(balance.loan.length>0){
                    balance.loan.forEach(v=>{
                        total += parseFloat(v.principal)
                    })

                }
                balance.liabilitiesTotal = total
                return balance.liabilitiesTotal
            },
            netAssets:function(){
                let balance = this.credit.balance
                balance.netAssets = balance.assetsTotal - balance.liabilitiesTotal
                return balance.netAssets
            },
            assetLiabilityRatio:function () {
                let balance = this.credit.balance
                let assetsTotal     = 0
                let assetLiability  = 0
                if(balance.asset.length>0){
                    balance.asset.forEach(v=>{
                        assetsTotal += parseFloat(v.balance)
                    })
                }
                if(balance.liabilities.length>0){
                    balance.liabilities.forEach(v=>{
                        assetLiability += parseFloat(v.balance)
                    })
                }
                if(balance.loan.length>0){
                    balance.loan.forEach(v=>{
                        assetLiability += parseFloat(v.principal)
                    })

                }
                let rate    = 0
                if(assetsTotal != 0){
                    rate    = (balance.liabilitiesTotal/parseFloat(assetsTotal)*100).toFixed(2)
                }else{
                    rate    = 0
                }

                balance.assetLiabilityRatio = rate

                return balance.assetLiabilityRatio
            },
            //授信期限
            creditDuration:function(){
                let apply      = this.credit.apply
                let duration   = moment(apply.expirationDate).diff(moment(apply.applyDate), 'days')
                apply.duration = duration
                return duration
            }

        },
        watch:{
            creditId:function () {
                let that        = this
                that.tabActive  = 'first'
                that.show       = false
                let creditId    = that.creditId
                if(!!that.$refs['creditApply']){
                    that.$refs['creditApply'].resetFields()
                }
                that.getCreditApplyInfo(creditId)
            },
        },
        methods:{
            handleClose(done) {
                let that = this
                if(that.editable == true) {
                    this.$confirm('确认关闭？')
                        .then(_ => {

                            that.doSaveUserApplyCacheHandler('creditApply')
                            that.doSaveUserOperateCacheHandler('creditOperate')
                            done();
                        })
                        .catch(_ => {
                        });
                }else{
                    done();
                }
            },
            getCreditApplyInfo(creditId){
                let that        = this
                let url         = Vue.agent.root + '/business/credit/fetch'
                var reqData     = {
                    id :creditId,
                    funcId  :that.funcId
                }

                that.$http.get(url,{
                    params:reqData,
                }).then(res => {
                    if(res.body.code == 200) {
                        that.credit.apply.subsidiaryEndDate   = null
                        that.credit.apply.subsidiaryStartDate = null
                        that.credit.apply.marketEndDate   = null
                        that.credit.apply.marketStartDate = null
                        that.credit.apply.subsidiaryPrdId = null
                        that.credit.apply.marketPrdId  = null
                        let data            = res.body.data
                        if(data.applyDate == 0)
                            data.applyDate = new Date().getTime()
                        if(data.expirationDate == 0)
                            data.expirationDate = null
                        if(data.baseStartDate == 0)
                            data.baseStartDate = null
                        if(data.baseEndDate == 0)
                            data.baseEndDate = null
                        if(data.subsidiaryStartDate == 0)
                            data.subsidiaryStartDate = null
                        if(data.subsidiaryEndDate == 0)
                            data.subsidiaryEndDate = null
                        if(data.marketStartDate == 0)
                            data.marketStartDate = null
                        if(data.marketEndDate == 0)
                            data.marketEndDate = null
                        if(data.guaranteeType == 0)
                            data.guaranteeType = null

                        that.visible.editCredit = true
                        Object.assign(that.credit.apply,data)
                        if(!!that.credit.apply.basePrdId )
                            that.prodBaseChangeHandler(that.credit.apply.basePrdId)
                        if(!!that.credit.apply.subsidiaryPrdId )
                            that.prodSubsidiaryChangeHandler(that.credit.apply.subsidiaryPrdId)
                        if(!!that.credit.apply.marketPrdId )
                            that.prodMarketChangeHandler(that.credit.apply.marketPrdId)
                        that.show       = true
                    }
                });
            },
            //基本产品改变
            prodBaseChangeHandler(val){
                let that = this
                let list = that.prodData.list
                let ele  = list.find(v=>{
                    return v.currentPId == val
                })
                if(!!ele){
                    that.prodData.base = ele
                    that.credit.apply.baseCostRate  = that.prodData.base.minCostRate
                    that.credit.apply.baseStartDate = that.credit.apply.applyDate
                    if(!that.credit.apply.expirationDate && !that.credit.apply.baseEndDate){
                        that.credit.apply.baseEndDate = new Date(moment(that.credit.apply.applyDate).add(30,'days')).getTime()
                    }
                    if(!!that.credit.apply.expirationDate && !that.credit.apply.baseEndDate){
                        that.credit.apply.baseEndDate = that.credit.apply.expirationDate
                    }
                }else{
                    Util.dataReset(that.prodData.base)
                }
            },
            //附属产品产品改变
            prodSubsidiaryChangeHandler(val){
                let that = this
                let list = that.prodData.list
                let ele  = list.find(v=>{
                    return v.currentPId == val
                })
                if(!!ele){
                    that.prodData.subsidiary = ele
                    that.credit.apply.subsidiaryStartDate = that.credit.apply.applyDate
                    that.credit.apply.subsidiaryCostRate  = that.prodData.subsidiary.minCostRate
                    if(!that.credit.apply.expirationDate && !that.credit.apply.subsidiaryEndDate){
                        that.credit.apply.subsidiaryEndDate = new Date(moment(that.credit.apply.applyDate).add(30,'days')).getTime()
                    }

                }else{
                    Util.dataReset(that.prodData.subsidiary)
                }

            },

            //营销产品产品改变
            prodMarketChangeHandler(val){
                let that = this
                let list = that.prodData.list
                let ele  = list.find(v=>{
                    return v.currentPId == val
                })
                if(!!ele){
                    that.prodData.market = ele
                    that.credit.apply.marketStartDate = that.credit.apply.applyDate
                    that.credit.apply.marketCostRate  = that.prodData.market.minCostRate
                    if(!that.credit.apply.expirationDate && !that.credit.apply.marketEndDate){
                        that.credit.apply.marketEndDate = new Date(moment(that.credit.apply.applyDate).add(30,'days')).getTime()
                    }
                }else{
                    Util.dataReset(that.prodData.market)
                }
            },

            baseCostRateValidate(rule, value, callback){
                let that =  this
                if (value === '') {
                    callback(new Error('请输入借款成本'));
                } else {
                    let minCostRate = that.prodData.base.minCostRate
                    let maxCostRate = that.prodData.base.maxCostRate
                    if (value < minCostRate || value > maxCostRate ) {
                        callback(new Error('借款成本超出范围'));
                    }
                    callback();
                }
            },
            subsidiaryCostRateValidate(rule, value, callback){
                let that =  this
                if (value === '') {
                    callback(new Error('请输入借款成本'));
                } else {
                    let minCostRate = that.prodData.subsidiary.minCostRate
                    let maxCostRate = that.prodData.subsidiary.maxCostRate
                    if (value < minCostRate || value > maxCostRate ) {
                        callback(new Error('借款成本超出范围'));
                    }
                    callback();
                }
            },

            marketCostRateValidate(rule, value, callback){
                let that =  this
                if (value === '') {
                    callback(new Error('请输入借款成本'));
                } else {
                    let minCostRate = that.prodData.market.minCostRate
                    let maxCostRate = that.prodData.market.maxCostRate
                    if (value < minCostRate || value > maxCostRate ) {
                        callback(new Error('借款成本超出范围'));
                    }
                    callback();
                }
            },

            //个人概况保存
            doSaveUserApplyCacheHandler(apply){
                let that = this
                that.$refs[apply].validate((valid) => {
                    that.doSaveUserApplyCache(function () {
                    })
                });
            },
            doSaveUserApplyCache(callback){
                let that        = this
                let url         = Vue.agent.root + '/business/credit/update'
                let apply       = that.credit.apply
                var reqData     = {
                    funcId  :that.funcId,
                    id:apply.creditId,
                    creditAmt:apply.creditAmt,
                    duration:apply.duration,
                    guaranteeType:apply.guaranteeType,
                    basePrdId:apply.basePrdId,
                    baseCostRate:apply.baseCostRate,
                    subsidiaryPrdId:apply.subsidiaryPrdId,
                    subsidiaryCostRate:apply.subsidiaryCostRate,
                    marketPrdId:apply.marketPrdId,
                    marketCostRate:apply.marketCostRate,
                    isSpecialService:apply.isSpecialService,
                    purpose:apply.purpose,
                    custSourceRemark:apply.custSourceRemark,
                    custSourceType:apply.custSourceType,
                }

                if(apply.applyDate)
                    reqData.applyDate      = new Date(apply.applyDate).getTime()
                if(apply.expirationDate)
                    reqData.expirationDate = new Date(apply.expirationDate).getTime()
                if(apply.baseStartDate)
                    reqData.baseStartDate      = new Date(apply.baseStartDate).getTime()
                if(apply.baseEndDate)
                    reqData.baseEndDate = new Date(apply.baseEndDate).getTime()
                if(apply.subsidiaryStartDate)
                    reqData.subsidiaryStartDate      = new Date(apply.subsidiaryStartDate).getTime()
                if(apply.subsidiaryEndDate)
                    reqData.subsidiaryEndDate = new Date(apply.subsidiaryEndDate).getTime()
                if(apply.marketStartDate)
                    reqData.marketStartDate      = new Date(apply.marketStartDate).getTime()
                if(apply.marketEndDate)
                    reqData.marketEndDate = new Date(apply.marketEndDate).getTime()

                that.$http.put(url,reqData).then(res => {
                    if(res.body.code == 200) {
                        !!callback && callback()
                        that.$notify({title: '成功',message: '暂存成功',type: 'success'});
                    }
                });
            },

            //获取经营情况
            getCreditOperateInfo(creditId){
                let that        = this
                let url         = Vue.agent.root + '/business/creditOperation/fetch'
                var reqData     = {
                    id :creditId,
                    funcId  :that.funcId
                }

                that.$http.get(url,{
                    params:reqData,
                }).then(res => {
                    if(res.body.code == 200) {
                        let data            = res.body.data

                        Object.assign(that.credit.operate,data)
                    }
                });
            },
            //经营情况保存
            doSaveUserOperateCacheHandler(operation){
                let that = this
                that.$refs[operation].validate((valid) => {
                    that.doSaveUserOperateCache(function () {
                    })
                });
            },
            doSaveUserOperateCache(callback){
                let that        = this
                let url         = Vue.agent.root + '/business/creditOperation/save'
                let operate       = that.credit.operate
                let apply       = that.credit.apply
                var reqData     = {
                    id              :apply.creditId,
                    funcId          :that.funcId,
                    industry        :operate.industry,
                    industryDuration:operate.industryDuration,
                    isOtherIndustry :operate.isOtherIndustry,
                    otherIndustry   :operate.otherIndustry,
                    mainProduct     :operate.mainProduct,
                    stable          :operate.stable,
                    employers       :operate.employers,
                    salesVolume     :operate.salesVolume,
                    profit          :operate.profit,
                    profitRate      :operate.profitRate,
                    lastSalesVolume :operate.lastSalesVolume,
                    lastProfit      :operate.lastProfit,
                    lastProfitRate  :operate.lastProfitRate,
                    salesTarget     :operate.salesTarget,
                    isSeasonal      :operate.isSeasonal,
                    busySeason      :operate.busySeason,
                    lowSeason       :operate.lowSeason,
                    estimate        :operate.estimate,
                }

                that.$http.put(url,reqData).then(res => {
                    if(res.body.code == 200) {
                        !!callback && callback()
                        that.$notify({title: '成功',message: '暂存成功',type: 'success'});
                    }
                });
            },


            //获取负债信息
            getCreditBlanceInfo(creditId){
                let that        = this
                let url         = Vue.agent.root + '/business/balanceSheet/fetch'
                var reqData     = {
                    id :creditId,
                    funcId  :that.funcId
                }

                that.$http.get(url,{
                    params:reqData,
                }).then(res => {
                    if(res.body.code == 200) {
                        let data            = res.body.data
                        Object.assign(that.credit.balance,data)
                    }
                });
            },

            doAddBalanceLoanHandler(){
                let that = this
                let loan = that.credit.balance.loan

                let o    = {
                    "bankName": null,
                    "expirationDate": null,
                    "id": 0,
                    "loanTimes": null,
                    "name": null,
                    "principal": null,
                    "startDate": null
                }
                loan.push(o)
            },

            doSaveUserBalanceCacheHandler(){
                let that    = this
                that.doSaveUserBalanceCache()
            },
            doSaveUserBalanceCache(callback){
                let that        = this
                let url         = Vue.agent.root + '/business/balanceSheet/save'
                let balance     = JSON.parse(JSON.stringify(that.credit.balance))
                if(balance.loan && balance.loan.length > 0){
                    balance.loan.forEach(v=>{
                        v.startDate         = new Date(v.startDate).getTime()
                        v.expirationDate    = new Date(v.expirationDate).getTime()
                    })
                }

                that.$http.put(url,JSON.stringify(balance)).then(res => {
                    if(res.body.code == 200) {
                        !!callback && callback()
                        that.$notify({title: '成功',message: '暂存成功',type: 'success'});
                    }
                });
            },


            //            显示添加担保人窗口
            doAddGuaranteeHandler(){
                let that = this
                let credit = that.credit
                that.visible.addGuarantee  = true
                console.log('hh')
                Util.dataReset(that.credit.guarantee.item)
                that.credit.guarantee.item.startDateTime = (new Date()).getTime()
                if(!!credit.apply.expirationDate)
                    credit.guarantee.item.expirationDateTime = credit.apply.expirationDate

            },
//            获取担保用户
            getCustomByCertNo(query){
                let that        = this
                if(query == null || query.length < 4){
                    that.customer.options = []
                    return false
                }
                let url         = Vue.agent.root + '/customer/person/getCustByCertNo'
                var reqData     = {
                    funcId  :that.funcId,
                    certNo:query
                }
                that.$http.get(url,{
                    params:reqData,
                }).then(res => {
                    if(res.body.code == 200) {
                        let list            = res.body.data
                        that.customer.options = list
                        that.customer.loading = false;
                    }else{
                        that.customer.options = []
                    }
                });
            },
//            选择用户后
            selectedCustomHandler(val){
                let that    = this
                let options = that.customer.options
                let res     = options.find(v=>{
                    return val == v.custId
                })
                if(!!res){
                    that.credit.guarantee.item.custName = res.custName
                }else{
                    that.credit.guarantee.item.custName = null
                }

            },
//            获取担保人列表
            getGuaranteeList(){
                let that        = this
                let creditId    = that.creditId
                let url         = Vue.agent.root + '/business/guarantee/list'
                var reqData     = {
                    funcId  :that.funcId,
                    creditId:creditId
                }
                that.$http.get(url,{
                    params:reqData,
                }).then(res => {
                    if(res.body.code == 200) {
                        let list                    = res.body.data.list
                        that.credit.guarantee.list  = list
//                        Object.assign(that.toDoData,data)
                    }
                });
            },
            //保存担保人
            doSaveGuaranteeHandler(formName){
                let that = this
                that.$refs[formName].validate((valid) => {
                    if (valid) {
                        that.addGuarantee()
                    } else {
//                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            //添加担保人
            addGuarantee(){
                let that        = this
                let url         = Vue.agent.root + '/business/guarantee/add'
                let apply       = that.credit.apply
                let guarantee   = that.credit.guarantee.item
                var reqData     = {
                    creditId            :apply.creditId,
                    funcId              :that.funcId,
                    guaranteeType       :guarantee.guaranteeType,
                    custId              :apply.custId,
                    guaranteerId        :guarantee.guaranteerId,
                    startDateTime       :guarantee.startDateTime,
                    expirationDateTime  :new Date(guarantee.expirationDateTime).getTime(),
                    guaranteeAmt        :guarantee.guaranteeAmt
                }


                that.$http.post(url,reqData).then(res => {
                    if(res.body.code == 200) {
//                        !!callback && callback()
                        that.visible.addGuarantee = false
                        Util.dataReset(that.credit.guarantee.item)
                        that.getGuaranteeList()
                        that.$notify({title: '成功',message: '暂存成功',type: 'success'});
                    }
                });
            },
            //            显示编辑
            doDeleteGuaranteeHandler(scope){
                let that = this
                let guaranteeId = scope.row.guaranteeId
                let index  = scope.$index
                that.$confirm('确认要删除?, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    that.deleteGuarantee(guaranteeId,function () {
                        that.credit.guarantee.list.splice(index,1)
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            deleteGuarantee(guaranteeId,callback){
                let that        = this
                let creditId    = that.credit.creditId
                let url         = Vue.agent.root + '/business/guarantee/delete'
                var reqData     = {
                    guaranteeId:guaranteeId,
                    funcId  :that.funcId,
                    creditId:creditId
                }
                that.$http.delete(url,{
                    params:reqData
                }).then(function (res) {
                    if(res.body.code == 200) {
                        that.$notify({title: '成功',message: '删除成功',type: 'success'});
                        !!callback && callback()
                    }
                });
            },
            //            通用下载
            getCreditMaterialDownload(type,creditId){
                let that        = this
                let url         = Vue.agent.root + '/business/material/download?token=' + Auth.getToken() + '&device=1&type='+type+'&id='+creditId
                return url
            },

            getMaterialInfo(creditId){
                let that        = this
                let url         = Vue.agent.root + '/business/material/fetch'
                that.credit.material.doubtfulRemark = null
                var reqData     = {
                    id :creditId,
                    funcId  :that.funcId
                }

                that.$http.get(url,{
                    params:reqData,
                }).then(res => {
                    if(res.body.code == 200) {
                        let data            = res.body.data
                        Object.assign(that.credit.material,data)
                    }
                });
            },

            doSaveMaterialRemarkCacheHandler(){
                let that    = this
                that.doSaveMaterialRemarkCache()
            },
            doSaveMaterialRemarkCache(){
                let that        = this
                let creditId    = that.creditId
                let url         = Vue.agent.root + '/business/save/remark'
                let material   = that.credit.material
                var reqData     = {
                    funcId              :that.funcId,
                    creditId            :creditId,
                    date                :new Date(material.queryTime).getTime(),
                    creditReportRemark  :material.creditReportRemark,
                    litigationRemark    :material.litigationRemark,
                    noticeRemark        :material.noticeRemark,
                    sentenceRemark      :material.sentenceRemark,
                    executeRemark       :material.executeRemark,
                    courtExecuteRemark  :material.courtExecuteRemark,
                    doubtfulRemark      :material.doubtfulRemark
                }


                that.$http.post(url,reqData).then(res => {
                    if(res.body.code == 200) {
//                        !!callback && callback()
                        that.$notify({title: '成功',message: '暂存成功',type: 'success'});
                    }
                });
            },
            getOtherMaterialList(creditId){
                let that        = this
                let url         = Vue.agent.root + '/business/material/other/list'
                var reqData     = {
                    id :creditId,
                    funcId  :that.funcId
                }

                that.$http.get(url,{
                    params:reqData,
                }).then(res => {
                    if(res.body.code == 200) {
                        let data            = res.body.data
                        that.credit.material.list = data
//                        Object.assign(that.credit.material.list,data)
                    }
                });
            },

            doAddUploadItemHandler(){
                let that = this
                that.visible.upload = true
            },
//            添加上传清单
            doSaveUploadItemHandler(uploadItem){
                let that = this
                that.$refs[uploadItem].validate((valid) => {
                    if (valid) {
                        that.addUploadItem()
                    } else {
                        return false;
                    }
                });

            },
            addUploadItem(){
                let that        = this
                let creditId    = that.creditId
                let item        = that.credit.material.item
                let url         = Vue.agent.root + '/business/material/other/add'
                var reqData     = {
                    id      : creditId,
                    funcId  : that.funcId,
                    name    : item.name,
                    remark  : item.remark
                }

                that.$http.post(url,reqData).then(res => {
                    if(res.body.code == 200) {
                        that.visible.upload = false
                        that.$notify({title: '成功',message: '添加成功',type: 'success'});
                        that.getOtherMaterialList(creditId)
                        let data            = res.body.data
//                        Object.assign(that.credit.material.list,data)
                    }
                });
            },
            //删除其他附件目录
            deleteUpdateItemHandler(scope){
                let that     = this
                let reportId = scope.row.id
                let index    = scope.row.index
                let creditId = scope.row.creditId
                that.deleteUpdateItem(reportId,creditId,function () {
//                    console.log(that.credit.user.other)
                    that.credit.material.list.splice(index,1)
                })
            },
            deleteUpdateItem(reportId,creditId,callback){
                let that        = this
                let url         = Vue.agent.root + '/business/material/other/delete'
                var reqData     = {
                    id      :reportId,
                    creditId:creditId,
                    funcId  :that.funcId
                }

                that.$http.delete(url,{
                    params:reqData,
                }).then(res => {
                    if(res.body.code == 200) {
                        !!callback && callback()
                        that.$notify({title: '成功',message: '删除成功',type: 'success'});
                    }
                });

            },
            //显示其他附件详情
            showUploadDetailHandler(fileId){
                let that                    = this

                that.credit.material.otherFileList = []
                that.credit.material.fileId = fileId
                that.getUploadItemDetail(fileId)
            },
            getUploadItemDetail(fileId){
                let that        = this
                let url         = Vue.agent.root + '/business/material/other/file/list'
                var reqData     = {
                    id      :fileId,
                    funcId  :that.funcId
                }

                that.$http.get(url,{
                    params:reqData,
                }).then(res => {
                    if(res.body.code == 200) {
                        let data            = res.body.data
                        data.forEach(v=>{
                            v.url = Vue.agent.root + '/business/material/other/file/download?token=' + Auth.getToken() + '&device=1&id='+v.id+ '&reportId='+v.reportId
                        })
                        that.credit.material.otherFileList = data
                        that.visible.uploadDetail   = true
                    }
                });
            },
            //            上传到服务器
            submitUpload(uploadName) {
                let that = this
                that.$refs['materialForm'].validate((valid) => {
                    if (valid) {
                        if(this.$refs[uploadName].uploadFiles.length == 0){
                            that.$notify({title: '提示',message: '未上传文件',type: 'warning'});
                        }else{
                            this.$refs[uploadName].submit();
                        }
                    } else {
//                        console.log('error submit!!');
                        return false;
                    }
                });


            },
            uploadDetailRemoveHandler(file, fileList){
                this.deleteUpdateDetailItem(file.reportId,file.creditId,file.id)
            },
            deleteUpdateDetailItem(reportId,creditId,fileId){
                let that        = this
                let url         = Vue.agent.root + '/business/material/other/file/delete'
                var reqData     = {
                    id      :fileId,
                    reportId:reportId,
                    creditId:creditId,
                    funcId  :that.funcId
                }

                that.$http.delete(url,{
                    params:reqData,
                }).then(res => {
                    if(res.body.code == 200) {
                        that.$notify({title: '成功',message: '删除成功',type: 'success'});
                    }
                });

            },
            //图片预览
            handlePictureCardPreview(file){
                this.dialogImageUrl = file.url;
                this.visible.bigImg = true;
            },
            //图片预览
            handlePicturePreview(type){
                let that        = this
                let creditId    = that.creditId
                let url         = Vue.agent.root + '/business/material/download?token=' + Auth.getToken() + '&device=1&type='+type+'&id='+creditId
                this.dialogImageUrl = url;
                this.visible.bigImg = true;
            },
            //上传后显示图片
            handleUploadSuccess(res, file){
                let that = this
                if(res.code == 200){
                    that.$notify({title: '成功',message: '上传成功',type: 'success'});
                }
            },

            //            提交授信审批
            doSubmitApplyHandler(){
                let that        = this
                let url         = Vue.agent.root + '/business/credit/audit'
                let creditId    = that.creditId
                var reqData     = {
                    id              :creditId,
                    funcId          :that.funcId,
                }
                that.$http.put(url,reqData).then(res => {
                    if(res.body.code == 200) {
                        that.$notify({title: '成功',message: '提交审批成功',type: 'success'});
                        that.opened.openCredit = false
                        if(that.applyCallBack){
                            that.applyCallBack()
                        }

                    }
                });
            },

            //            监听授信Tab事件
            creditInfoTabClickHandler(tab){
                let that    = this
                let credit  = that.credit
                let creditId= that.creditId

                if(that.current.tabIndex == 0 && tab.index != 0 && that.editable == true){
                    that.doSaveUserApplyCacheHandler('creditApply')
                }
                if(that.current.tabIndex == 1 && tab.index != 1 && that.editable == true){
                    that.doSaveUserOperateCacheHandler('creditOperate')
                }
                if(that.current.tabIndex == 2 && tab.index != 2 && that.editable == true){
                    that.doSaveUserBalanceCacheHandler()
                }


                if(tab.index == 0 && !!creditId){
                }
                if(tab.index == 1 && !!creditId){

                    that.getCreditOperateInfo(creditId)
                }
                if(tab.index == 2 && !!creditId){
                    that.getCreditBlanceInfo(creditId)
                }
                if(tab.index == 3 && !!creditId){
                    that.getGuaranteeList()
                }
                if(tab.index == 4 && !!creditId){
                    that.getGuaranteeList()
                }
                if(tab.index == 5 && !!creditId){
                    that.getMaterialInfo(creditId)
                    that.getOtherMaterialList(creditId)
                }

                if(tab.index == 6 && !!creditId){
                    that.visible.openUser = true
                    that.current.custId = credit.apply.custId
                }
                that.current.tabIndex = tab.index
            },
            getProds(){
                let that        = this
                let url         = Vue.agent.root + '/business/loanProduct/list'
                var reqData     = {
                    funcId  :that.funcId
                }

                that.$http.get(url,{
                    params:reqData,
                }).then(res => {
                    if(res.body.code == 200) {
                        let list            = res.body.data.list
                        that.prodData.list       = list
                    }
                });
            },
            getOps(){
                let that                 = this
                let opsUrl      = Vue.agent.root + '/dictionary/dict/querys'

                that.$http && that.$http.get(opsUrl,{params:{
                    names:"assureType,residentStatus,residentHouseType,maritalStatus,stabilizeType,repayType,lifeCycle,custSourceType",
                    funcId:that.funcId
                }}).then(function (res) {
                    if(res.body.code == "200") {
                        let data                        = res.body.data
                        that.ops.assureType             = data.assureTypeOptions
                        that.ops.residentHouseTypeOps   = data.residentHouseTypeOptions
                        that.ops.residentStatusOps      = data.residentStatusOptions
                        that.ops.maritalStatusOps       = data.maritalStatusOptions
                        that.ops.stabilizeType          = data.stabilizeTypeOptions
                        that.ops.repayType              = data.repayTypeOptions
                        that.ops.lifeCycle              = data.lifeCycleOptions
                        that.ops.custSourceType         = data.custSourceTypeOptions

                    }
                });
            }
        },
        created:function () {
            let that                 = this
            that.getOps()
            that.getProds()
        },
        components:{
            'user-info':UserInfo,
        }
    }
</script>
