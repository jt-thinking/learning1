<template>
    <div class="user-info-dialog">
        <el-dialog title="客户编辑" class="org-dialog" :visible.sync="opened.openUser" size="w1000" >
            <el-tabs v-model="tabActive" type="card" @tab-click="tabClickHandler">
                <el-tab-pane label="个人概况" name="first">
                    <div v-show="show" class="el-table el-table--fit el-table--enable-row-hover el-table--enable-row-transition" style="width: 100%;">
                        <div class="el-table__header-wrapper">
                            <table cellspacing="0" cellpadding="0" border="0" class="el-table__header" style="width: 100%;">
                                <thead>
                                <tr>
                                <th colspan="1" rowspan="4" class="is-leaf">
                                <div class="cell">基本信息</div>
                                </th>
                                </th>
                                </tr>
                                </thead>
                            </table>
                        </div>
                        <div class="el-table__body-wrapper">
                            <el-form label-position="left"  ref="userDetail" label-width="100px"  :model="detail">
                                <table cellspacing="0" cellpadding="0" border="0" class="el-table__body" style="width: 100%;">
                                    <colgroup>
                                    <col width="100px">
                                    <col width="30%">
                                    <col width="10%">
                                    <col width="15%">
                                    <col width="30%">
                                    </colgroup>
                                <tbody>
                                <tr class="el-table__row">
                                    <td colspan="5">
                                        <div class="cell">
                                            <el-row :gutter="10">
                                                <el-col :span="8">
                                                    <el-form-item label="客户编号" required>
                                                        <span>{{detail.custId}}</span>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="8">
                                                    <el-form-item label="客户姓名" required>
                                                        <span>{{detail.custName}}</span>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="8">
                                                    <el-form-item label="性别"  prop="sex" :rules="[
                                                        {required: true, message: '请选择性别'},
                                                        ]">
                                                        <el-radio v-show="editable == true" size="small" class="radio" v-model="detail.sex" :label="1">男</el-radio>
                                                        <el-radio v-show="editable == true" size="small" class="radio" v-model="detail.sex" :label="2">女</el-radio>
                                                        <span v-show="editable == false && detail.sex ==1">男</span>
                                                        <span v-show="editable == false && detail.sex ==2">女</span>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                        </div>
                                    </td>
                                </tr>
                                <tr class="el-table__row">
                                    <td colspan="5">
                                        <div class="cell">
                                            <el-row :gutter="10">
                                                <el-col :span="8">
                                                    <el-form-item label="身份证号" required>
                                                        <span>{{ detail.certNo }}</span>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="8">
                                                    <el-form-item label="注册号码" required>
                                                        <span>{{ detail.registerPhone }}</span>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="8">
                                                    <el-form-item label="其他联系方式">
                                                        <el-input style="width:160px" v-show="editable == true" size="small"  v-model="detail.otherPhone" :placeholder="'其他联系方式'"></el-input>
                                                        <span v-show="editable == false">{{ detail.otherPhone }}</span>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                        </div>
                                    </td>
                                </tr>
                                <tr class="el-table__row">
                                    <td colspan="5">
                                        <div class="cell">
                                            <el-row :gutter="10">
                                                <el-col :span="8">
                                                    <el-form-item label="出生日期" label-position="left"  prop="birthday" :rules="[
                                                        {required: true, message: '请选择出生日期'},
                                                        ]" required>
                                                        <el-date-picker
                                                                v-show="editable == true"
                                                                class="date"
                                                                style="width:160px"
                                                                size="small"
                                                                v-model="detail.birthday"
                                                                type="date"
                                                                placeholder="出生日期">
                                                        </el-date-picker>
                                                        <span v-show="editable == false">{{ detail.birthday | dateFormat }}</span>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="8">
                                                    <el-form-item label="最高学历" label-position="left">
                                                        <el-select style="width:160px" size="small" v-show="editable == true" v-model="detail.education" placeholder="请选择">
                                                            <el-option  label="请选择最高学历" :value="0"></el-option>
                                                            <el-option
                                                                    v-for="item in ops.educationOps"
                                                                    :key="item.id"
                                                                    :label="item.name"
                                                                    :value="parseInt(item.value)">
                                                            </el-option>
                                                        </el-select>
                                                        <span v-show="editable == false">{{ detail.education | opsFormat(ops.educationOps) }}</span>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="8">
                                                    <el-form-item label="婚姻状况" label-position="left" prop="maritalStatus" :rules="[
                                                        {required: true, message: '请选择婚姻状况'},
                                                        ]" required>
                                                        <el-select style="width:160px" v-show="editable == true" size="small" v-model="detail.maritalStatus" placeholder="请选择">
                                                            <el-option  label="请选择婚姻状况" :value="null"></el-option>
                                                            <el-option
                                                                    v-for="item in ops.maritalStatusOps"
                                                                    :key="item.id"
                                                                    :label="item.name"
                                                                    :value="parseInt(item.value)">
                                                            </el-option>
                                                        </el-select>
                                                        <span v-show="editable == false">{{ detail.maritalStatus | opsFormat(ops.maritalStatusOps) }}</span>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                        </div>
                                    </td>
                                </tr>
                                <tr class="el-table__row">
                                    <td colspan="5">
                                        <div class="cell">
                                            <el-row :gutter="10">
                                                <el-col :span="8">
                                                    <el-form-item label="居住状况" label-position="left">
                                                        <el-select style="width:160px" v-show="editable == true" size="small" v-model="detail.residentStatus" placeholder="请选择">
                                                            <el-option  label="请选择居住状况" :value="0"></el-option>
                                                            <el-option
                                                                    v-for="item in ops.residentStatusOps"
                                                                    :key="item.id"
                                                                    :label="item.name"
                                                                    :value="parseInt(item.value)">
                                                            </el-option>
                                                        </el-select>
                                                        <span v-show="editable == false">{{ detail.residentStatus | opsFormat(ops.residentStatusOps) }}</span>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="8">
                                                    <el-form-item label="房屋年限" label-position="left">
                                                        <el-input
                                                                style="width:160px"
                                                                v-show="editable == true"
                                                                size="small"
                                                                placeholder="请输入年限"
                                                                v-model="detail.residentTerm"
                                                        >
                                                            <template slot="append">年</template>
                                                        </el-input>
                                                        <span v-show="editable == false">{{ detail.residentTerm }} 年</span>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="8">
                                                    <el-form-item label="房屋类型" label-position="left" prop="residentHouseType" :rules="[
                                                        {required: true, message: '请选择房屋类型'},
                                                        ]" required>
                                                        <el-select style="width:160px" v-show="editable == true" size="small" v-model="detail.residentHouseType" placeholder="请选择">
                                                            <el-option  label="请选择房屋类型" :value="null"></el-option>
                                                            <el-option
                                                                    v-for="item in ops.residentHouseTypeOps"
                                                                    :key="item.id"
                                                                    :label="item.name"
                                                                    :value="parseInt(item.value)">
                                                            </el-option>
                                                        </el-select>
                                                        <span v-show="editable == false">{{ detail.residentHouseType | opsFormat(ops.residentHouseTypeOps) }}</span>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                        </div>
                                    </td>
                                </tr>
                                <tr class="el-table__row">
                                    <td>
                                        <div class="cell">
                                            <el-form-item  label="经营地址" required>
                                            </el-form-item>

                                        </div>
                                    </td>
                                    <td colspan="4">
                                        <div class="cell">
                                            <el-row :gutter="20">
                                                <el-col :span="4">
                                                    <el-select @change="provinceAreaChange" size="small" v-model="area.provinceId" placeholder="请选择">
                                                        <el-option  label="请选择" :value="null"></el-option>
                                                        <el-option
                                                                v-for="item in area.province"
                                                                :key="item.areaId"
                                                                :label="item.areaName"
                                                                :value="item.areaId">
                                                        </el-option>
                                                    </el-select>
                                                </el-col>
                                                <el-col :span="5">
                                                    <el-select @change="cityAreaChange" size="small" v-model="area.cityId" placeholder="请选择">
                                                        <el-option  label="请选择" :value="null"></el-option>
                                                        <el-option
                                                                v-for="item in area.city"
                                                                :key="item.areaId"
                                                                :label="item.areaName"
                                                                :value="item.areaId">
                                                        </el-option>
                                                    </el-select>
                                                </el-col>
                                                <el-col :span="5">
                                                    <el-select @change="townAreaChange" size="small" v-model="area.townId" placeholder="请选择">
                                                        <el-option  label="请选择" :value="null"></el-option>
                                                        <el-option
                                                                v-for="item in area.town"
                                                                :key="item.areaId"
                                                                :label="item.areaName"
                                                                :value="item.areaId">
                                                        </el-option>

                                                    </el-select>
                                                </el-col>
                                                <el-col :span="5">
                                                    <el-select @change="zoneAreaChange" size="small" v-model="area.zoneId" placeholder="请选择">
                                                        <el-option  label="请选择" :value="null"></el-option>
                                                        <el-option
                                                                v-for="item in area.zone"
                                                                :key="item.areaId"
                                                                :label="item.areaName"
                                                                :value="item.areaId">
                                                        </el-option>

                                                    </el-select>
                                                </el-col>
                                                <el-col :span="5">
                                                    <el-select size="small" v-model="area.countryId" placeholder="请选择">
                                                        <el-option  label="请选择" :value="null"></el-option>
                                                        <el-option
                                                                v-for="item in area.country"
                                                                :key="item.areaId"
                                                                :label="item.areaName"
                                                                :value="item.areaId">
                                                        </el-option>

                                                    </el-select>
                                                </el-col>
                                            </el-row>
                                            <div>
                                                <el-form-item label-width="0" v-show="editable == true">
                                                    <el-input  size="small"  v-model="detail.businessAddress" :placeholder="'请输入经营地址'"></el-input>
                                                </el-form-item>
                                                <span v-show="editable == false">{{ detail.businessAddress }}</span>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr class="el-table__row">
                                    <td>
                                        <div class="cell">
                                            <el-form-item  label="籍贯地址" required>
                                            </el-form-item>
                                        </div>
                                    </td>
                                    <td colspan="4">
                                        <div class="cell">
                                            <el-row :gutter="20">
                                                <el-col :span="4">
                                                    <el-select @change="bProvinceAreaChange" size="small" v-model="bArea.provinceId" placeholder="请选择">
                                                        <el-option  label="请选择" :value="null"></el-option>
                                                        <el-option
                                                                v-for="item in bArea.province"
                                                                :key="item.areaId"
                                                                :label="item.areaName"
                                                                :value="item.areaId">
                                                        </el-option>
                                                    </el-select>
                                                </el-col>
                                                <el-col :span="5">
                                                    <el-select @change="bCityAreaChange" size="small" v-model="bArea.cityId" placeholder="请选择">
                                                        <el-option  label="请选择" :value="null"></el-option>
                                                        <el-option
                                                                v-for="item in bArea.city"
                                                                :key="item.areaId"
                                                                :label="item.areaName"
                                                                :value="item.areaId">
                                                        </el-option>
                                                    </el-select>
                                                </el-col>
                                                <el-col :span="5">
                                                    <el-select @change="bTownAreaChange" size="small" v-model="bArea.townId" placeholder="请选择">
                                                        <el-option  label="请选择" :value="null"></el-option>
                                                        <el-option
                                                                v-for="item in bArea.town"
                                                                :key="item.areaId"
                                                                :label="item.areaName"
                                                                :value="item.areaId">
                                                        </el-option>

                                                    </el-select>
                                                </el-col>
                                                <el-col :span="5">
                                                    <el-select @change="bZoneAreaChange" size="small" v-model="bArea.zoneId" placeholder="请选择">
                                                        <el-option  label="请选择" :value="null"></el-option>
                                                        <el-option
                                                                v-for="item in bArea.zone"
                                                                :key="item.areaId"
                                                                :label="item.areaName"
                                                                :value="item.areaId">
                                                        </el-option>

                                                    </el-select>
                                                </el-col>
                                                <el-col :span="5">
                                                    <el-select size="small" v-model="bArea.countryId" placeholder="请选择">
                                                        <el-option  label="请选择" :value="null"></el-option>
                                                        <el-option
                                                                v-for="item in bArea.country"
                                                                :key="item.areaId"
                                                                :label="item.areaName"
                                                                :value="item.areaId">
                                                        </el-option>

                                                    </el-select>
                                                </el-col>
                                            </el-row>
                                            <div>
                                                <el-form-item label-width="0" v-show="editable == true" prop="address" :rules="[
                                                        { required: true, message: '请输入户籍地址'},
                                                    ]">
                                                    <el-input  size="small"  v-model="detail.address" :placeholder="'请输入户籍地址'"></el-input>
                                                </el-form-item>
                                                <span v-show="editable == false">{{ detail.address }}</span>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr class="el-table__row">
                                    <td colspan="5">
                                        <div class="cell">
                                            <el-row :gutter="10">
                                                <el-col :span="8">
                                                    <el-form-item label="安快黑名单" required>
                                                        <span>{{ detail.isBlack | isBlackFormat }}</span>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="8">
                                                    <el-form-item label="信贷客户" required>
                                                        <span>{{ detail.isLoan | isLoanFormat }}</span>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="8">
                                                    <el-form-item label="他行互保现象">
                                                        <el-select v-show="editable == true" size="small" v-model.number="detail.isMutualGuarantee" placeholder="请选择">
                                                            <el-option  label="是" :value="1"></el-option>
                                                            <el-option  label="否" :value="2"></el-option>
                                                        </el-select>
                                                        <span v-show="editable == false">{{ detail.isMutualGuarantee }}</span>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                        </div>
                                    </td>
                                </tr>
                                <tr class="el-table__row">
                                    <td colspan="5">
                                        <div class="cell">
                                            <el-row :gutter="10">
                                                <el-col :span="8">
                                                    <el-form-item label="职业信息" required>
                                                        <span>{{ detail.occupation}}</span>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="8">
                                                    <el-form-item label-width="130px" label="安快担保余额">
                                                        <span>{{ detail.guaranteeBalance | moneyFormat }}</span>
                                                    </el-form-item>
                                                </el-col>

                                            </el-row>
                                        </div>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                            </el-form>
                        </div><!----><!----><!----><!---->
                        <div class="resize-triggers">
                        <div class="expand-trigger">
                        <div style="width: 761px; height: 201px;"></div>
                        </div>
                        <div class="contract-trigger"></div>
                        </div>
                    </div>
                </el-tab-pane>

                <el-tab-pane  label="客户关联信息" name="2">
                    <el-collapse :value="['2-1']">
                        <el-collapse-item title="关联人信息" name="2-1">
                        <el-button v-show="editable == true" @click.native="showNewRelationShipHandler" size="small">新增</el-button>
                        <div v-show="visible.relationPerson == true" class="el-table el-table--fit el-table--enable-row-hover el-table--enable-row-transition" style="width: 100%;">
                        <div class="el-table__header-wrapper">
                        <table cellspacing="0" cellpadding="0" border="0" class="el-table__header" style="width: 100%;">
                        <thead>
                        <tr>
                        <th colspan="1" rowspan="4" class="el-table_1_column_76 is-leaf">
                        <div class="cell">
                        <span>关联人新增</span>
                        <div class="pull-right">
                        <el-button @click.native="addRelationPersonHandler('relationPersonForm')" size="small">保存</el-button>
                        <el-button icon="close" @click.native="visible.relationPerson = false" size="small"></el-button>
                        </div>
                        </div>
                        </th>
                        </tr>
                        </thead>
                        </table>
                        </div>
                        <div class="el-table__body-wrapper">
                        <el-form   :model="relationP" ref="relationPersonForm">
                        <table cellspacing="0" cellpadding="0" border="0" class="el-table__body" style="width: 100%;">
                        <colgroup>
                        <col width="20%">
                        <col width="26%">
                        <col width="8%">
                        <col width="20%">
                        <col width="26%">
                        </colgroup>
                        <tbody>
                        <tr class="el-table__row">
                        <td>
                        <div class="cell">
                        关联方身份证号
                        </div>
                        </td>
                        <td>
                        <div class="cell">
                        <el-form-item prop="relateCertNo" :rules="[
                        { required: true, message: '请输入身份证号'},
                        { min: 18, max: 18, message: '请输入18位证件号'}
                        ]">
                        <el-input @change="getUserByCertNoHandler"  size="small"  v-model="relationP.relateCertNo" placeholder="关联身份证号"></el-input>
                        </el-form-item>
                        </div>
                        </td>
                        <td>
                        <div class="cell"></div>
                        </td>
                        <td>
                        <div class="cell">关联方名称</div>
                        </td>
                        <td>
                        <div class="cell">
                        <el-form-item>
                        <el-input  size="small"  v-model="relationP.relateCustName" placeholder="请输入关联人姓名"></el-input>
                        </el-form-item>
                        </div>
                        </td>
                        </tr>
                        <tr class="el-table__row">
                        <td>
                        <div class="cell">
                        关联类型
                        </div>
                        </td>
                        <td>
                        <div class="cell">
                        <el-select size="small" v-model="relationP.relateCustType" placeholder="请选择">
                        <el-option  label="夫妻" :value="1"></el-option>
                        <el-option  label="父母" :value="2"></el-option>
                        </el-select>
                        </div>
                        </td>
                        <td>
                        <div class="cell"></div>
                        </td>
                        <td>
                        <div class="cell">联系方式</div>
                        </td>
                        <td>
                        <div class="cell">
                        <el-form-item>
                        <el-input  size="small"  v-model="relationP.telephone" :placeholder="'请输入联系方式'"></el-input>
                        </el-form-item>
                        </div>
                        </td>
                        </tr>
                        <tr class="el-table__row">
                        <td>
                        <div class="cell">
                        户籍地址
                        </div>
                        </td>
                        <td>
                        <div class="cell">
                        <el-form-item>
                        <el-input  size="small"   :placeholder="'请输入户籍地址'"></el-input>
                        </el-form-item>
                        </div>
                        </td>
                        <td>
                        <div class="cell"></div>
                        </td>
                        <td>
                        <div class="cell">职业信息</div>
                        </td>
                        <td>
                        <div class="cell">
                        <el-form-item>
                        <el-input  size="small"  v-model="relationP.occupation" :placeholder="'请输入职业信息'"></el-input>
                        </el-form-item>
                        </div>
                        </td>
                        </tr>
                        <tr class="el-table__row">
                        <td>
                        <div class="cell">
                        备注
                        </div>
                        </td>
                        <td>
                        <div class="cell">
                        <el-form-item>
                        <el-input  size="small"  v-model="relationP.remark" :placeholder="'请输入备注'"></el-input>
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
                        <div class="table">
                        <el-table
                        v-loading.body="loading"
                        :data="personRelations"
                        :stripe="true"
                        border
                        style="width: 100%">

                        <el-table-column  align="center" prop="relationType"   label="类型" min-width="80"></el-table-column>
                        <el-table-column  align="center" prop="relateCustName" label="姓名" min-width="80"></el-table-column>
                        <el-table-column  align="center" prop="relateCertNo"   label="身份证号" min-width="140"></el-table-column>
                        <el-table-column  align="center" prop="remark"         label="备注" min-width="140">
                        <template scope="scope">
                        <span>{{ scope.row.remark}}</span>
                        </template>
                        </el-table-column>
                        <!--<el-table-column-->
                        <!--prop="type"-->
                        <!--align="center"-->
                        <!--label="身份证号"-->
                        <!--min-width="120"-->
                        <!--&gt;-->
                        <!--<template scope="scope">-->
                        <!--<span>{{ scope.row.certNo }}</span>-->
                        <!--</template>-->
                        <!--</el-table-column>-->
                        <el-table-column
                            align="center"
                            label="操作"
                            width="170"
                        >
                            <template scope="scope">
                            <!--<el-button @click.native="showEditHandler(scope)" size="mini">变更</el-button>-->
                                <el-button v-show="editable == true" :disabled="scope.row.status !=  1 " @click.native="deleteHandler(scope)" size="mini">删除</el-button>
                            </template>
                        </el-table-column>

                        </el-table>
                        </div>

                        </el-collapse-item>
                    <!--<el-collapse-item title="关联企业信息" name="2">-->
                    <!--<div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>-->
                    <!--<div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>-->
                    <!--</el-collapse-item>-->
                    </el-collapse>
                </el-tab-pane>

                <el-tab-pane   label="客户经营情况" name="3">
                    <el-collapse :value="['3-1']">
                    <el-collapse-item title="客户经营情况" name="3-1">
                    <div class="table">
                    <el-table
                    :data="operation.list"
                    :stripe="true"
                    border
                    style="width: 100%">
                    <el-table-column  align="center" prop="industry"   label="目前从事行业" min-width="80"></el-table-column>
                    <el-table-column  align="center" prop="industryDuration" label="从事年限" min-width="80"></el-table-column>
                    <el-table-column  align="center" prop="mainProduct"   label="主营产品名称" min-width="140"></el-table-column>
                    <el-table-column  align="center" prop="estimate"         label="总体评估" min-width="140">
                    </el-table-column>
                    <el-table-column  align="center"  label="操作时间" min-width="140">
                        <template scope="scope">
                        <span>{{ scope.row.updateTime | dateFormat}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column  align="center"  label="操作" min-width="100">
                    <template scope="scope">
                    <el-button size="small" @click.native="showUserOperateInfoHandler(scope)">详 情</el-button>
                    </template>
                    </el-table-column>
                    </el-table>
                    </div>

                    </el-collapse-item>
                    <!--<el-collapse-item title="关联企业信息" name="2">-->
                    <!--<div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>-->
                    <!--<div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>-->
                    <!--</el-collapse-item>-->
                    </el-collapse>
                </el-tab-pane>

                <el-tab-pane   label="客户负债信息" name="4">
                    <el-collapse :value="['4-1']">
                        <el-collapse-item title="关联人信息" name="4-1">
                            <div class="table">
                                <el-table
                                        :data="balance.list"
                                        :stripe="true"
                                        border
                                        style="width: 100%">
                                    <el-table-column  align="center" prop="assetsTotal"   label="资产合计(万元)" min-width="120"></el-table-column>
                                    <el-table-column  align="center" prop="liabilitiesTotal" label="负债合计(万元)" min-width="120"></el-table-column>
                                    <el-table-column  align="center" prop="netAssets"   label="净资产(万元)" min-width="140"></el-table-column>
                                    <el-table-column  align="center" prop="assetLiabilityRatio"         label="资产负债率(%)" min-width="140"></el-table-column>
                                    <el-table-column  align="center" prop="operaterName"         label="经办人" min-width="100"></el-table-column>
                                    <el-table-column  align="center" prop="operaterOrganizationName"         label="经办机构" min-width="140"></el-table-column>
                                    <el-table-column  align="center" label="操作" min-width="100">
                                        <template scope="scope">
                                            <el-button size="small" @click.native="showUserBalanceInfoHandler(scope)">详 情</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>

                        </el-collapse-item>
                        <!--<el-collapse-item title="关联企业信息" name="2">-->
                        <!--<div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>-->
                        <!--<div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>-->
                        <!--</el-collapse-item>-->
                    </el-collapse>
                </el-tab-pane>

                <el-tab-pane   label="客户授信一览" name="5">
                    <el-collapse :value="['5-1','5-2','5-3']">
                        <el-collapse-item title="客户授信信息" name="5-1">
                            <div class="table">
                                <el-table
                                        :data="credit.credit"
                                        :stripe="true"
                                        border
                                        style="width: 100%">
                                    <el-table-column  align="center" prop="creditNo"   label="授信合同编号" min-width="140"></el-table-column>
                                    <el-table-column  align="center" prop="basePrdName" label="基本产品" min-width="100"></el-table-column>
                                    <el-table-column  align="center"   label="授信金额" min-width="100">
                                        <template scope="scope">
                                            <span>{{ scope.row.creditAmt | moneyFormat }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column  align="center"  label="可用余额" min-width="100">
                                        <template scope="scope">
                                            <span>{{ scope.row.blanace | moneyFormat }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column  align="center"      label="额度生效日" min-width="120">
                                        <template scope="scope">
                                            <span>{{ scope.row.startDate | dateFormat }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column  align="center"  label="额度到期日" min-width="120">
                                        <template scope="scope">
                                            <span>{{ scope.row.endDate | dateFormat }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column  align="center"  label="授信状态" min-width="140">
                                        <template scope="scope">
                                            <span>{{ scope.row.status}}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column  align="center"  label="经办人" min-width="100">
                                        <template scope="scope">
                                            <!--<span>{{ scope.row.remark}}</span>-->
                                        </template>
                                    </el-table-column>
                                    <el-table-column  align="center"  label="经办机构" min-width="100">
                                        <template scope="scope">
                                            <!--<span>{{ scope.row.remark}}</span>-->
                                        </template>
                                    </el-table-column>

                                </el-table>
                            </div>

                        </el-collapse-item>
                        <el-collapse-item title="客户贷款信息" name="5-2">
                            <div class="table">
                                <el-table
                                        :data="credit.loan"
                                        :stripe="true"
                                        border
                                        style="width: 100%">
                                    <el-table-column  align="center" prop="contractId"   label="借款合同编号" min-width="140"></el-table-column>
                                    <el-table-column  align="center" prop="basePrdName" label="借款金额" min-width="100">
                                        <template scope="scope">
                                            <span>{{ scope.row.principal | moneyFormat }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column  align="center"   label="放款日" min-width="100">
                                        <template scope="scope">
                                            <span>{{ scope.row.startDate | dateFormat }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column  align="center"  label="到期日" min-width="100">
                                        <template scope="scope">
                                            <span>{{ scope.row.endDate | dateFormat }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column  align="center"      label="状态" min-width="120">
                                        <template scope="scope">
                                            <span>{{ scope.row.status | opsFormat(ops.lifeCycle)}}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column  align="center"  label="计息方式" min-width="120">
                                        <template scope="scope">
                                            <span>{{ scope.row.returnType  | opsFormat(ops.repayType) }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column  align="center"  label="年化利率" min-width="140">
                                        <template scope="scope">
                                            <span>{{ scope.row.rate}}%</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column  align="center"  label="经办人" min-width="100">
                                        <template scope="scope">
                                            <!--<span>{{ scope.row.remark}}</span>-->
                                        </template>
                                    </el-table-column>
                                    <!--<el-table-column  align="center"  label="操作" min-width="100">-->
                                    <!--<template scope="scope">-->
                                    <!--&lt;!&ndash;<span>{{ scope.row.remark}}</span>&ndash;&gt;-->
                                    <!--</template>-->
                                    </el-table-column>

                                </el-table>
                            </div>
                        </el-collapse-item>
                        <el-collapse-item title="客户担保信息" name="5-3">
                            <div class="table">
                                <el-table
                                        :data="credit.guarantee"
                                        :stripe="true"
                                        border
                                        style="width: 100%">
                                    <el-table-column  align="center" prop="guaranteeNo"   label="担保合同号" min-width="220"></el-table-column>
                                    <el-table-column  align="center" prop="custName" label="担保对象" min-width="100"></el-table-column>
                                    <el-table-column  align="center"   label="担保金额" min-width="100">
                                        <template scope="scope">
                                            <span>{{ scope.row.guaranteeAmt | moneyFormat }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column  align="center"  label="担保类型" min-width="100">
                                        <template scope="scope">
                                            <span>{{ scope.row.guaranteeType | opsFormat(ops.guaranteeTypeOps) }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column  align="center"  label="起效日" min-width="120">
                                        <template scope="scope">
                                            <span>{{ scope.row.startDate | dateFormat }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column  align="center"  label="到期日" min-width="140">
                                        <template scope="scope">
                                            <span>{{ scope.row.endDate | dateFormat }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column  align="center"  label="状态" min-width="100">
                                        <template scope="scope">
                                            <span>{{ scope.row.status}}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column  align="center"  label="经办人" min-width="100">
                                        <template scope="scope">
                                            <!--<span>{{ scope.row.remark}}</span>-->
                                        </template>
                                    </el-table-column>
                                    <el-table-column  align="center"  label="经办机构" min-width="100">
                                        <template scope="scope">
                                            <!--<span>{{ scope.row.remark}}</span>-->
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </el-collapse-item>
                    </el-collapse>
                </el-tab-pane>

                <el-tab-pane   label="客户投资一览" name="6">
                    <el-collapse :value="['6-1','6-2']">
                        <el-collapse-item title="在投投资信息" name="6-1">
                            <div class="table">
                                <el-table
                                        :data="invest.pending"
                                        :stripe="true"
                                        border
                                        style="width: 100%">
                                    <el-table-column  align="center" prop="contractId"   label="投资合同号" min-width="140"></el-table-column>
                                    <el-table-column  align="center" prop="basePrdName" label="投资金额" min-width="100">
                                        <template scope="scope">
                                            <span>{{ scope.row.principal | moneyFormat }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column  align="center"   label="投资利率" min-width="100">
                                        <template scope="scope">
                                            <span>{{ scope.row.rate }}%</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column  align="center"  label="结息方式" min-width="100">
                                        <template scope="scope">
                                            <span>{{ scope.row.returnType | opsFormat(ops.repayType) }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column  align="center"      label="投资日期" min-width="120">
                                        <template scope="scope">
                                            <span>{{ scope.row.startDate | dateFormat }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column  align="center"  label="到期日期" min-width="120">
                                        <template scope="scope">
                                            <span>{{ scope.row.endDate | dateFormat }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column  align="center"  label="借款人" min-width="140">
                                        <template scope="scope">
                                            <span>{{ scope.row.loanCustName}}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column  align="center"  label="经办人" min-width="100">
                                        <template scope="scope">
                                            <!--<span>{{ scope.row.remark}}</span>-->
                                        </template>
                                    </el-table-column>
                                    <el-table-column  align="center"  label="经办机构" min-width="100">
                                        <template scope="scope">
                                            <!--<span>{{ scope.row.remark}}</span>-->
                                        </template>
                                    </el-table-column>

                                </el-table>
                            </div>

                        </el-collapse-item>
                        <el-collapse-item title="到期投资信息" name="6-2">
                            <div class="table">
                                <el-table
                                        :data="invest.end"
                                        :stripe="true"
                                        border
                                        style="width: 100%">
                                    <el-table-column  align="center" prop="contractId"   label="投资合同号" min-width="140"></el-table-column>
                                    <el-table-column  align="center" prop="basePrdName" label="投资金额" min-width="100">
                                        <template scope="scope">
                                            <span>{{ scope.row.principal | moneyFormat }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column  align="center"   label="投资利率" min-width="100">
                                        <template scope="scope">
                                            <span>{{ scope.row.rate }}%</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column  align="center"  label="结息方式" min-width="100">
                                        <template scope="scope">
                                            <span>{{ scope.row.returnType | opsFormat(ops.repayType) }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column  align="center"      label="投资日期" min-width="120">
                                        <template scope="scope">
                                            <span>{{ scope.row.startDate | dateFormat }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column  align="center"  label="到期日期" min-width="120">
                                        <template scope="scope">
                                            <span>{{ scope.row.endDate | dateFormat }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column  align="center"  label="借款人" min-width="140">
                                        <template scope="scope">
                                            <span>{{ scope.row.loanCustName}}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column  align="center"  label="经办人" min-width="100">
                                        <template scope="scope">
                                            <!--<span>{{ scope.row.remark}}</span>-->
                                        </template>
                                    </el-table-column>
                                    <el-table-column  align="center"  label="经办机构" min-width="100">
                                        <template scope="scope">
                                            <!--<span>{{ scope.row.remark}}</span>-->
                                        </template>
                                    </el-table-column>

                                </el-table>
                            </div>
                        </el-collapse-item>
                    </el-collapse>
                </el-tab-pane>
                <el-tab-pane   label="征信及五查询" name="7">
                    <el-collapse :value="['7-1']">
                        <el-collapse-item title="征信及法院五查询" name="7-1">
                            <div class="table">
                                <el-table
                                        :data="creditMaterial.list"
                                        :stripe="true"
                                        border
                                        style="width: 100%">
                                    <el-table-column  align="center" label="查询时间" min-width="140">
                                        <template scope="scope">
                                            <span>{{ scope.row.queryTime | dateFormat }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column  align="center" prop="operaterName" label="经办人" min-width="100"></el-table-column>
                                    <el-table-column  align="center"  prop="operaterOrganization"  label="经办机构" min-width="100">
                                    </el-table-column>
                                    <el-table-column  align="center"  label="操作时间" min-width="100">
                                        <template scope="scope">
                                            <span>{{ scope.row.createTime | detaFormat }}</span>
                                        </template>
                                    </el-table-column>

                                    <el-table-column  align="center"  label="操作" min-width="100">
                                        <template scope="scope">
                                            <el-button @click.native="showDetailCreditMaterialHandler(scope)" type="text">详情</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>

                        </el-collapse-item>

                    </el-collapse>
                </el-tab-pane>
                <el-tab-pane   label="其他附件" name="8">
                    <el-collapse :value="['8-1']">
                        <el-collapse-item title="其他附件" name="8-1">
                            <div class="table">
                                <el-table
                                        :data="other.list"
                                        :stripe="true"
                                        border
                                        style="width: 100%">
                                    <el-table-column  align="center" label="附件名">
                                        <template scope="scope">
                                            <el-button type="text" @click.native="showUploadDetailHandler(scope.row.id)" href="javascript:(0)">{{ scope.row.name}}</el-button>
                                        </template>
                                    </el-table-column>
                                    <el-table-column  align="center" prop="remark" label="备注"></el-table-column>
                                    <el-table-column  align="center" label="操作时间">
                                        <template scope="scope">
                                            <span>{{ scope.row.uploadTime | dateFormat }}</span>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>

                        </el-collapse-item>

                    </el-collapse>
                </el-tab-pane>

            </el-tabs>

            <div slot="footer" class="dialog-footer clearfix">
                <el-button class="pull-left" @click.native="opened.openUser = false">取 消</el-button>
                <el-button type="primary" v-show="tabActive =='first' && editable == true" @click.native="doSaveDetailCacheHandler('userDetail')">暂 存</el-button>
                <el-button type="primary" v-show="editable == true" @click.native="doSaveDetailHandler">保 存</el-button>
            </div>
        </el-dialog>


        <!--经营性情况-->
        <el-dialog title="经营性情况" class="operation-dialog" :visible.sync="visible.operate" size="small">
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
                    <el-form   :model="operation" ref="creditOperate" label-width="120px">
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
                                        <el-form-item label="目前从事行业:">
                                            <span>{{operation.detail.industry}}</span>
                                        </el-form-item>
                                    </div>
                                </td>
                                <td>
                                    <div class="cell"></div>
                                </td>
                                <td>
                                    <div class="cell">
                                        <el-form-item  label="从事年限:">
                                            <span>{{operation.detail.industryDuration}}</span>
                                        </el-form-item>
                                    </div>
                                </td>
                            </tr>
                            <tr class="el-table__row">
                                <td>
                                    <div class="cell">
                                        <el-form-item size="small" label="是否从事其他行业:">
                                            <span v-show="operation.detail.isOtherIndustry == 0">是</span>
                                            <span v-show="operation.detail.isOtherIndustry == 1">否</span>
                                        </el-form-item>
                                    </div>
                                </td>
                                <td>
                                    <div class="cell">

                                    </div>
                                </td>
                                <td>
                                    <div class="cell">
                                        <el-form-item  label="其他行业名称:">
                                            <span>{{operation.detail.otherIndustry}}</span>
                                        </el-form-item>
                                    </div>
                                </td>
                            </tr>
                            <tr class="el-table__row">
                                <td>
                                    <div class="cell">
                                        <el-form-item size="small" label="主营产品名称:">
                                            <span>{{operation.detail.mainProduct}}</span>
                                        </el-form-item>
                                    </div>
                                </td>
                                <td>
                                    <div class="cell">

                                    </div>
                                </td>
                                <td>
                                    <div class="cell">
                                        <el-form-item  label="稳定程度:">
                                            <span>{{operation.detail.stable | opsFormat(ops.stabilizeType) }}</span>
                                        </el-form-item>
                                    </div>
                                </td>
                            </tr>
                            <tr class="el-table__row">
                                <td>
                                    <div class="cell">
                                        <el-form-item size="small" label="雇佣人数:">
                                            <span>{{operation.detail.employers}} 人</span>
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
                                                <el-form-item size="small" label="今年销售额(万):">
                                                    <span>{{operation.detail.salesVolume}} 万</span>
                                                </el-form-item>
                                            </div>
                                        </el-col>
                                        <el-col :span="8">
                                            <div class="cell">
                                                <el-form-item size="small" label="今年利润(万):" prop="profit" :rules="[
                                                        { required: true, message: '今年利润'},
                                                        { type: 'number', message: '必须数字'},
                                                    ]">
                                                    <span>{{operation.detail.profit}} 万</span>
                                                </el-form-item>
                                            </div>
                                        </el-col>
                                        <el-col :span="8">
                                            <div class="cell">
                                                <el-form-item size="small" label="今年利润率:">
                                                    <span v-if="!!operation.detail.profit && !!operation.detail.salesVolume">{{operation.detail.profit / operation.detail.salesVolume * 100}}%</span>
                                                    <span v-else="">0%</span>
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
                                                <el-form-item size="small" label="去年销售额(万):">
                                                    <span>{{operation.detail.lastSalesVolume }} 万</span>
                                                </el-form-item>
                                            </div>
                                        </el-col>
                                        <el-col :span="8">
                                            <div class="cell">
                                                <el-form-item size="small" label="去年利润(万):">
                                                    <span>{{operation.detail.lastProfit }} 万</span>
                                                </el-form-item>
                                            </div>
                                        </el-col>
                                        <el-col :span="8">
                                            <div class="cell">
                                                <el-form-item size="small" label="去年利润率:">
                                                    <span v-if="!!operation.detail.lastProfit && !!operation.detail.lastSalesVolume">{{operation.detail.lastProfit / operation.detail.lastSalesVolume * 100}}%</span>
                                                    <span v-else="">0%</span>
                                                </el-form-item>
                                            </div>
                                        </el-col>
                                    </el-row>
                                </td>
                            </tr>
                            <tr class="el-table__row">
                                <td>
                                    <div class="cell">
                                        <el-form-item size="small" label="主要销往:">
                                            <span>{{operation.detail.salesTarget}}</span>
                                        </el-form-item>
                                    </div>
                                </td>
                                <td>
                                    <div class="cell">

                                    </div>
                                </td>
                                <td>
                                    <div class="cell">
                                        <el-form-item size="small" label="季节性是否明显:">
                                            <span v-show="operation.detail.isSeasonal == 0">是</span>
                                            <span v-show="operation.detail.isSeasonal == 1">否</span>
                                        </el-form-item>
                                    </div>
                                </td>
                            </tr>
                            <tr class="el-table__row">
                                <td>
                                    <div class="cell">
                                        <el-form-item size="small" label="旺季月份:">
                                            <span>{{operation.detail.busySeason}}</span>
                                        </el-form-item>
                                    </div>
                                </td>
                                <td>
                                    <div class="cell">

                                    </div>
                                </td>
                                <td>
                                    <div class="cell">
                                        <el-form-item size="small" label="淡季月份:">
                                            <span>{{operation.detail.lowSeason}}</span>
                                        </el-form-item>
                                    </div>
                                </td>
                            </tr>
                            <tr class="el-table__row">
                                <td colspan="4">
                                    <div class="cell">
                                        <el-form-item  label="总体评价">
                                            <p>{{operation.detail.estimate}}</p>
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
        </el-dialog>


        <!--负债情况-->
        <el-dialog title="负债情况" class="operation-dialog" :visible.sync="visible.balance" size="small">
            <div class="el-table el-table--fit el-table--enable-row-transition" style="width: 100%;">
                <div class="el-table__header-wrapper">
                    <table cellspacing="0" cellpadding="0" border="0" class="el-table__header" style="width: 100%;">
                        <thead>
                        <tr>
                            <th colspan="1" rowspan="4" class="is-leaf">
                                <div class="cell">资产负债信息</div>
                            </th>
                        </tr>
                        </thead>
                    </table>
                </div>
                <div class="el-table__body-wrapper">
                    <el-form   :model="balance.detail">
                        <table cellspacing="0" cellpadding="0" border="0" class="el-table__body" style="width: 100%;">
                            <colgroup>
                                <col width="100px">
                                <col width="14%">
                                <col width="12%">
                                <col width="10%">
                                <col width="10%">
                                <col width="12%">
                                <col width="100px">
                            </colgroup>
                            <thead>
                            <tr>
                                <td>
                                    <div class="cell">
                                        <span>项目</span>
                                    </div>
                                </td>
                                <td colspan="5">
                                    <div class="cell">
                                        <span>简要情况</span>
                                    </div>
                                </td>
                                <td>
                                    <div class="cell">
                                        <span>金额(万元)</span>
                                    </div>
                                </td>
                            </tr>
                            </thead>
                            <tbody>
                            <template   v-for="asset in balance.detail.asset">
                                <tr class="el-table__row">
                                    <td>
                                        <div class="cell">
                                            {{asset.typeName}}
                                        </div>
                                    </td>
                                    <td colspan="5">
                                        <div class="cell">
                                            <span>{{asset.remark}}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="cell">
                                            <span>{{asset.balance}}</span>
                                        </div>
                                    </td>
                                </tr>
                            </template>
                            <tr>
                                <td class="is-leaf" colspan="6">
                                    <div class="cell">
                                        <span>资产合计</span>
                                    </div>
                                </td>
                                <td>
                                    <div class="cell">
                                        <span>{{ balance.detail.assetsTotal }}</span>
                                    </div>
                                </td>
                            </tr>
                            <tr class="el-table__row">
                                <td>
                                    <div class="cell">
                                        <span>银行贷款</span>
                                    </div>
                                </td>
                                <td>
                                    <div class="cell">
                                        <span>受信人名称</span>
                                    </div>
                                </td>
                                <td>
                                    <div class="cell">
                                        <span>贷款金额</span>
                                    </div>
                                </td>
                                <td>
                                    <div class="cell">
                                        <span>放款日期</span>
                                    </div>
                                </td>
                                <td>
                                    <div class="cell">
                                        <span>还款日期</span>
                                    </div>
                                </td>
                                <td>
                                    <div class="cell">
                                        <span>贷款次数</span>
                                    </div>
                                </td>
                            </tr>
                            <template   v-for="loan in balance.detail.loan">
                                <tr class="el-table__row">
                                    <td>
                                        <div class="cell">
                                            <span>{{loan.bankName}}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="cell">
                                            <span>{{loan.name}}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="cell">
                                            <span>{{loan.principal}}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="cell">
                                            <span>{{loan.startDate | dateFormat}}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="cell">
                                            <span>{{loan.expirationDate | dateFormat}}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="cell">
                                            <span>{{loan.loanTimes}}</span>
                                        </div>
                                    </td>
                                </tr>
                            </template>
                            <template   v-for="liabilities in balance.detail.liabilities">
                                <tr class="el-table__row">
                                    <td>
                                        <div class="cell">
                                            {{liabilities.typeName}}
                                        </div>
                                    </td>
                                    <td colspan="5">
                                        <div class="cell">
                                            <span>{{liabilities.remark}}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="cell">
                                            <span>{{liabilities.balance}}</span>
                                        </div>
                                    </td>
                                </tr>
                            </template>
                            <tr>
                                <td class="is-leaf" colspan="6">
                                    <div class="cell">
                                        <span>负债合计</span>
                                    </div>
                                </td>
                                <td>
                                    <div class="cell">
                                        <span>{{ balance.detail.liabilitiesTotal }}</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td class="is-leaf" colspan="6">
                                    <div class="cell">
                                        <span>净资产</span>
                                    </div>
                                </td>
                                <td>
                                    <div class="cell">
                                        <span>{{ balance.detail.netAssets }}</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td class="is-leaf" colspan="6">
                                    <div class="cell">
                                        <span>资产负债率</span>
                                    </div>
                                </td>
                                <td>
                                    <div class="cell">
                                        <span>{{ balance.detail.assetLiabilityRatio }}%</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="7">
                                    <div class="cell">
                                        <span>对外担保</span>
                                    </div>
                                </td>
                            </tr>
                            <template   v-for="externalSecurity in balance.detail.externalSecurity">
                                <tr class="el-table__row">
                                    <td>
                                        <div class="cell">
                                            {{externalSecurity.typeName}}
                                        </div>
                                    </td>
                                    <td colspan="5">
                                        <div class="cell">
                                            <span>{{externalSecurity.remark}}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="cell">
                                            <span>{{externalSecurity.balance}}</span>
                                        </div>
                                    </td>
                                </tr>
                            </template>

                            </tbody>
                        </table>
                    </el-form>
                </div>
            </div>
        </el-dialog>



        <!--五查询详情-->
        <el-dialog title="征信及五查询" class="operation-dialog" :visible.sync="visible.creditMaterial" size="w1000">
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-card :body-style="{ padding: '0px' }">
                        <img alt="暂无图片" style="min-height: 160px" @click="handlePicturePreview('credit_report')" :src="getCreditMaterialDownload('credit_report',credit.creditId)" >
                        <div style="padding: 14px;">
                            <span>征信报告: {{creditMaterial.detail.creditReportRemark}} </span>
                            <div class="bottom clearfix">
                                <time class="time">{{ creditMaterial.detail.creditReportUpdateTime | dateFormat }}</time>
                                <!--<el-button type="text" class="button">查看大图</el-button>-->
                            </div>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="8">
                    <el-card :body-style="{ padding: '0px' }">
                        <img alt="暂无图片" style="min-height: 160px" @click="handlePicturePreview('litigation')" :src="getCreditMaterialDownload('litigation',credit.creditId)" >
                        <div style="padding: 14px;">
                            <span>诉讼案件信息查询记录:{{ creditMaterial.detail.litigationRemark }}</span>
                            <div class="bottom clearfix">
                                <time class="time">{{ creditMaterial.detail.litigationUpdateTime | dateFormat }}</time>
                                <!--<el-button type="text" class="button">查看大图</el-button>-->
                            </div>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="8">
                    <el-card :body-style="{ padding: '0px' }">
                        <img alt="暂无图片" style="min-height: 160px" @click="handlePicturePreview('notice')" :src="getCreditMaterialDownload('notice',credit.creditId)" >
                        <div style="padding: 14px;">
                            <span>开庭公告查询记录:{{ creditMaterial.detail.noticeRemark }}</span>
                            <div class="bottom clearfix">
                                <time class="time">{{ creditMaterial.detail.noticeUpdateTime | dateFormat }}</time>
                                <!--<el-button type="text" class="button">操作按钮</el-button>-->
                            </div>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-card :body-style="{ padding: '0px' }">
                        <img alt="暂无图片" style="min-height: 160px" @click="handlePicturePreview('sentence')" :src="getCreditMaterialDownload('sentence',credit.creditId)" >
                        <div style="padding: 14px;">
                            <span>裁判文书查询记录:{{ creditMaterial.detail.sentenceRemark }}</span>
                            <div class="bottom clearfix">
                                <time class="time">{{ creditMaterial.detail.sentenceUpdateTime | dateFormat }}</time>
                                <!--<el-button type="text" class="button">操作按钮</el-button>-->
                            </div>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="8">
                    <el-card :body-style="{ padding: '0px' }">
                        <img alt="暂无图片" style="min-height: 160px" @click="handlePicturePreview('execute')" :src="getCreditMaterialDownload('execute',credit.creditId)" >
                        <div style="padding: 14px;">
                            <span>执行案件查询记录:{{ creditMaterial.detail.executeRemark }}</span>
                            <div class="bottom clearfix">
                                <time class="time">{{ creditMaterial.detail.executeUpdateTime | dateFormat }}</time>
                                <!--<el-button type="text" class="button">操作按钮</el-button>-->
                            </div>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="8">
                    <el-card :body-style="{ padding: '0px' }">
                        <img alt="暂无图片" style="min-height: 160px" @click="handlePicturePreview('courtExecute')" :src="getCreditMaterialDownload('courtExecute',credit.creditId)" >
                        <div style="padding: 14px;">
                            <span>法院执行网查询记录:{{ creditMaterial.detail.courtExecuteRemark }}</span>
                            <div class="bottom clearfix">
                                <time class="time">{{ creditMaterial.detail.courtExecuteUpdateTime | dateFormat }}</time>
                                <!--<el-button type="text" class="button">操作按钮</el-button>-->
                            </div>
                        </div>
                    </el-card>
                </el-col>
            </el-row>



        </el-dialog>



        <!--新建资料item -->
        <el-dialog title="其他资料" class="org-dialog" :visible.sync="visible.uploadDetail" size="w800">
            <el-form  :model="other"  ref="uploadItem" label-width="100px">
                <div>
                    <el-upload
                            action="root/business/material/other/file/upload"
                            list-type="picture-card"
                            :on-preview="handlePictureCardPreview"
                            :file-list="other.fileList"
                            :multiple="true"
                            :auto-upload="true"
                            :headers="headers"
                            ref="uploadItem"
                            >
                        <i class="el-icon-plus"></i>
                    </el-upload>

                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button class="pull-left" @click.native="visible.uploadDetail = false">取 消</el-button>
                <!--<el-button type="primary" @click.native="visible.uploadDetail = false">确 认</el-button>-->
            </div>
        </el-dialog>
        <el-dialog v-model="visible.bigImg" size="w1000">
            <img style="min-height: 400px" width="100%" :src="dialogImageUrl" alt="图片缺失">
        </el-dialog>
    </div>
</template>
<style lang="scss">
    .user-info-dialog{
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
        .el-upload{
            display: none;
        }
        .el-upload-list__item-delete{
            display: none!important;
        }
    }
</style>
<script>

    import Util         from  '../../js/util'
    import Auth         from  '../../js/auth'

    export default{
        data(){
            return{
                msg:'hello vue',
                tabActive:'first',
                funcId:"R040100",
                detail:{
                    "cacheId": null,
                    "custId": null,
                    custNo: null,
                    custName: null,
                    "custType": 1,
                    "certType": 1,
                    certNo: null,
                    registerPhone: null,
                    otherPhone: null,
                    isMutualGuarantee: null,
                    isLoan: null,
                    isBlack: 0,
                    status: 1,
                    sex: 1,
                    birthday: null,
                    maritalStatus: null,
                    education: null,
                    "residentStatus": null,
                    "residentTerm": null,
                    "residentHouseType": null,
                    "address": null,
                    "businessAddress": null,
                },
                personRelations:[],
                relationP:{
                    relateCustType:1,
                    relateCustName:null,
                    telephone:null
                },
                operation:{
                    list:[],
                    detail:{
                        busySeason:null,
                        creditId:null,
                        custId:null,
                        employers:1,
                        estimate:null,
                        industry:"IT",
                        industryDuration:10,
                        isOtherIndustry:0,
                        isSeasonal:0,
                        lastProfit:1,
                        lastProfitRate:0,
                        lastSalesVolume:8,
                        lowSeason:null,
                        mainProduct:null,
                        otherIndustry:null,
                        profit:2,
                        profitRate:0,
                        salesTarget:null,
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
                    loan:[],
                    guarantee:[],
                },
                invest:{
                    pending:[],
                    end:[]
                },
                creditMaterial:{
                    list:[],
                    detail:{
                        courtExecuteFile:null,
                        courtExecuteRemark:null,
                        courtExecuteUpdateTime:0,
                        creditId:null,
                        creditReportFile:"F3582642177396736.jpeg",
                        creditReportRemark:"征信",
                        creditReportUpdateTime:null,
                        custId:100005903,
                        executeFile:null,
                        executeRemark:null,
                        executeUpdateTime:0,
                        litigationFile:null,
                        litigationRemark:null,
                        litigationUpdateTime:0,
                        noticeFile:null,
                        noticeRemark:null,
                        noticeUpdateTime:0,
                        queryTime:null,
                        sentenceFile:null,
                        sentenceRemark:null,
                        sentenceUpdateTime:0
                    }
                },
                other:{
                    list:[],
                    detail:[],
                    fileList:[],
                    fileId:null
                },
                ops:{
                    educationOps:[],
                    stabilizeType:[],
                    residentHouseTypeOps:[],
                    residentStatusOps:[],
                    maritalStatusOps:[],
                    stabilizeTypeOptions:[],
                    repayType:[],
                    lifeCycle:[]
                },
                area:{
                    province:[],
                    city:[],
                    town:[],
                    zone:[],
                    country:[],
                    cityId:null,
                    townId:null,
                    zoneId:null,
                    provinceId:null,
                    countryId:null,
                },
                bArea:{
                    province:[],
                    city:[],
                    town:[],
                    zone:[],
                    country:[],
                    cityId:null,
                    townId:null,
                    zoneId:null,
                    provinceId:null,
                    countryId:null,
                },
                visible:{
                    quickAdd:false,
                    blacklist:false,
                    relationPerson:false,
                    introduce:false,
                    operate:false,
                    balance:false,
                    creditMaterial:false,
                    uploadDetail:false,
                    bigImg:false
                }
            }
        },
        props:{
            custId:Number,
            opened:{
                type:Object,
                default:{
                    openUser:false,
                }
            },
            editable:{
                type:Boolean,
                default:false
            }

        },
        computed:{

        },
        watch:{
            custId:function () {
                let that        = this
                that.tabActive  = 'first'
                that.show       = false
                let custId      = that.custId
                that.getDetail(custId)
            }
        },
        methods:{

            //获取客户信息
            getDetail(custId){
                let that        = this
                let url         = Vue.agent.root + '/customer/person/details'
                var reqData     = {
                    custId  :custId,
                    funcId  :that.funcId,
                }
                Object.assign(reqData,that.person)
                Util.dataClear(reqData)

                that.$http.get(url,{
                    params:reqData
                }).then(function (res) {
                    if (res.body.code == "200") {
                        let data = res.body.data
                        Object.assign(that.detail,data)
                        if(that.detail.maritalStatus == 0)
                            that.detail.maritalStatus = null
                        if(that.detail.residentHouseType == 0)
                            that.detail.residentHouseType = null

                        that.setAreaCode()
                        that.detail.operateId = Auth.getUserId()
                        that.show = true
                    }
                })
            },
            doSaveDetailCacheHandler(form){
                let that = this
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        that.saveDetailCache()
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });

            },
            saveDetailCache(){
                let that        = this
                let url         = Vue.agent.root + '/customer/person/saveCache'
                var reqData     = {

                }
                Object.assign(reqData,that.detail)

                reqData.birthday = that.detail.birthday ? new Date(that.detail.birthday).getTime() : null

                reqData.areaId    = that.area.countryId  ? that.area.countryId : that.detail.areaId

                reqData.businessAreaId    = that.bArea.countryId  ? that.bArea.countryId : that.detail.businessAreaId

                Util.dataClear(reqData)

                that.$http.post(url,reqData).then(function (res) {
                    if (res.body.code == "200") {
                        let data = res.body.data
                        Object.assign(that.detail,data)
                        that.$notify({title: '成功',message: '暂存成功',type: 'success'});
                    }
//                    that.visible.edit = false
                })
            },
            doSaveDetailHandler(){
                let that = this
                that.saveDetail()
            },

            saveDetail(){
                let that        = this
                let url         = Vue.agent.root + '/customer/person/save'
                var reqData     = {

                }
                Object.assign(reqData,that.detail)

                reqData.birthday = that.detail.birthday ? new Date(that.detail.birthday).getTime() : null

                Util.dataClear(reqData)

                that.$http.post(url,reqData).then(function (res) {
                    if (res.body.code == "200") {
                        let data = res.body.data
                        Object.assign(that.detail,data)
                        that.$notify({title: '成功',message: '保存成功',type: 'success'});
                    }
                    that.visible.edit = false
                })
            },
            //获取关联人列表
            getRelationShips(){
//
                let that        = this
                let url         = Vue.agent.root + '/customer/relation/searchByCustId'
                var reqData     = {
                    custId:that.custId,
                    cacheId:that.detail.cacheId,
                }
//                Object.assign(reqData,that.person)
//                Util.dataClear(reqData)

                that.$http.get(url,{
                    params:reqData
                }).then(function (res) {
                    if (res.body.code == "200") {
                        let list              = res.body.data.list
                        that.personRelations  = list
                    }
                })
            },
            showNewRelationShipHandler(){
                let that = this
                that.visible.relationPerson = true
                Util.dataReset(that.relationP)
                that.relationP.relateCustType = 1
            },
            //          添加关联人
            addRelationPersonHandler(form){
                let that        = this
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        that.addRelationPerson()
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });

            },
            addRelationPerson(){
                let that        = this
                let url         = Vue.agent.root + '/customer/relation/addCache'
                var reqData     = {
                    custId:that.detail.custId,
                    cacheId:that.detail.cacheId,
                    funcId:that.funcId,
                    relateType:1,
                    relateCertType:1,
                    relateCertNo:that.relationP.relateCertNo,
                    relateCustType:that.relationP.relateCustType,
                    relateCustName:that.relationP.relateCustName
                }
//                Object.assign(reqData,that.person)
//                Util.dataClear(reqData)

                that.$http.post(url,reqData).then(function (res) {
                    if (res.body.code == "200") {
                        that.$notify({title: '成功',message: '添加成功',type: 'success'});
                        that.getRelationShips()
                        that.visible.relationPerson = false
                    }
                })
            },

            getUserByCertNoHandler(val){
                let that = this
                if(val.length == 18){
                    that.getUserByCertNo(val)
                }
            },
            getUserByCertNo(certNo){
                let that        = this
                let url         = Vue.agent.root + '/customer/person/getSingleCustByCertNo'
                var reqData     = {
                    funcId  :that.funcId,
                    certNo  :certNo
                }
                that.$http.get(url,{params:reqData}).then(function (res) {
                    if(res.body.code == "200") {
                        let data     = res.body.data
                        that.relationP.relateCustName = data.custName
                        that.relationP.telephone      = data.registerPhone
                    }
                });
            },



            //获取客户经营情况
            getUserOperationByCustomerId(custId){
                let that        = this
                let url         = Vue.agent.root + '/business/creditOperation/list'
                var reqData     = {
                    id:custId,
                    funcId  :that.funcId,
                }
                that.$http.get(url,{
                    params:reqData
                }).then(function (res) {
                    if (res.body.code == "200") {
                        let list = res.body.data
                        that.operation.list = list
                    }
                })
            },
            //经营
            showUserOperateInfoHandler(scope){
                let that = this
                that.visible.operate = true
                that.getUserOperationByCreditId(scope.row.creditId)

            },


            //获取客户经营情况详情
            getUserOperationByCreditId(creditId){
                let that        = this
                let url         = Vue.agent.root + '/business/creditOperation/fetch'
                var reqData     = {
                    id:creditId,
                    funcId  :that.funcId,
                }
                that.$http.get(url,{
                    params:reqData
                }).then(function (res) {
                    if (res.body.code == "200") {
                        that.operation.detail = res.body.data
//                        let list = res.body.data
//                        that.credit.user.operation = list
                    }
                })
            },

            //获取负债信息情况
            getUserBalanceByCustomerId(custId){
                let that        = this
                let url         = Vue.agent.root + '/business/balanceSheet/list'
                var reqData     = {
                    id:custId,
                    funcId  :that.funcId,
                }
                that.$http.get(url,{
                    params:reqData
                }).then(function (res) {
                    if (res.body.code == "200") {
                        let list = res.body.data
                        that.balance.list = list
                    }
                })
            },
            //显示负债详情窗口
            showUserBalanceInfoHandler(scope){
                let that = this
                that.getUserBalanceDetailByCreditId(scope.row.creditId)

            },
            //获取客户负债情况详情
            getUserBalanceDetailByCreditId(creditId){
                let that        = this
                let url         = Vue.agent.root + '/business/balanceSheet/fetch'
                var reqData     = {
                    id:creditId,
                    funcId  :that.funcId,
                }
                that.$http.get(url,{
                    params:reqData
                }).then(function (res) {
                    if (res.body.code == "200") {
                        that.visible.balance = true
                        that.balance.detail = res.body.data
                    }
                })
            },


            //获取客户授信信息
            getUserCreditListByCustomerId(custId){
                let that        = this
                let url         = Vue.agent.root + '/cust/details/listCredit'
                var reqData     = {
                    custId:custId,
                    funcId  :that.funcId,
                }
                that.$http.get(url,{
                    params:reqData
                }).then(function (res) {
                    if (res.body.code == "200") {
                        let list = res.body.data.list
                        that.credit.credit = list
                    }
                })
            },
            //获取客户授信一览贷款记录
            getUserCreditLoanByCustomerId(custId){
                let that        = this
                let url         = Vue.agent.root + '/cust/details/listLoanOfCust'
                var reqData     = {
                    custId  :custId,
                    funcId  :that.funcId,
                }
                that.$http.get(url,{
                    params:reqData
                }).then(function (res) {
                    if (res.body.code == "200") {
                        let list = res.body.data.list
                        that.credit.loan = list
                    }
                })
            },
            //获取客户授信贷款记录
            getUserCreditGuaranteeByCreditId(creditId){
                let that        = this
                let url         = Vue.agent.root + '/cust/details/listGuarantee4Credit'
                var reqData     = {
                    creditId:creditId,
                    funcId  :that.funcId,
                }
                that.$http.get(url,{
                    params:reqData
                }).then(function (res) {
                    if (res.body.code == "200") {
                        let list = res.body.data.list
                        that.credit.guarantee = list
                    }
                })
            },

            //获取客户已结束投资
            getUserInvestEndByCustomerId(custId){
                let that        = this
                let url         = Vue.agent.root + '/cust/details/listFundEnd'
                var reqData     = {
                    custId  :custId,
                    funcId  :that.funcId,
                }
                that.$http.get(url,{
                    params:reqData
                }).then(function (res) {
                    if (res.body.code == "200") {
                        let list = res.body.data.list
                        that.invest.end = list
                    }
                })
            },
            //获取客户在投投资记录
            getUserInvestPendingByCustomerId(custId){
                let that        = this
                let url         = Vue.agent.root + '/cust/details/listFundIng'
                var reqData     = {
                    custId  :custId,
                    funcId  :that.funcId,
                }
                that.$http.get(url,{
                    params:reqData
                }).then(function (res) {
                    if (res.body.code == "200") {
                        let list = res.body.data.list
                        that.invest.pending = list
                    }
                })
            },

            //获取征信五查询列表
            getUserCreditQueryByCustomerId(custId){
                let that        = this
                let url         = Vue.agent.root + '/business/material/list'
                var reqData     = {
                    id  :custId,
                    funcId  :that.funcId,
                }
                that.$http.get(url,{
                    params:reqData
                }).then(function (res) {
                    if (res.body.code == "200") {
                        let list = res.body.data
                        that.creditMaterial.list = list
                    }
                })
            },
            //获取其他附件列表
            getUserOtherFilesByCustomerId(custId){
                let that        = this
                let url         = Vue.agent.root + '/business/material/other/listCustomer'
                var reqData     = {
                    id  :custId,
                    funcId  :that.funcId,
                }
                that.$http.get(url,{
                    params:reqData
                }).then(function (res) {
                    if (res.body.code == "200") {
                        let list = res.body.data
                        that.other.list = list
                    }
                })
            },
            showDetailCreditMaterialHandler(scope){
                let that = this
                that.visible.creditMaterial = true
                let creditId    = scope.row.creditId
                that.getCreditMaterial(creditId)
            },
            getCreditMaterial(creditId){
                let that        = this
                let url         = Vue.agent.root + '/business/material/fetch'
                var reqData     = {
                    id :creditId,
                    funcId  :that.funcId
                }

                that.$http.get(url,{
                    params:reqData,
                }).then(res => {
                    if(res.body.code == 200) {
                        let data            = res.body.data
                        that.creditMaterial.detail = data
                    }
                });
            },

            //            通用下载
            getCreditMaterialDownload(type,creditId){
                let that        = this
                let url         = Vue.agent.root + '/business/material/download?token=' + Auth.getToken() + '&device=1&type='+type+'&id='+creditId
                return url
            },

            //显示其他附件详情
            showUploadDetailHandler(fileId){
                let that                    = this

                that.other.fileList = []
                that.other.fileId = fileId
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
                        that.other.fileList = data
                        that.visible.uploadDetail   = true
                    }
                });
            },
            //            图片预览
            handlePictureCardPreview(file){
                this.dialogImageUrl = file.url;
                this.visible.bigImg = true;
            },

            //            Tab事件监听
            tabClickHandler(val){
                let that    = this
                let custId  = that.custId
                if(val.name == "2")
                    that.getRelationShips()
                if(val.name == "3")
                    that.getUserOperationByCustomerId(custId)
                if(val.name == "4")
                    that.getUserBalanceByCustomerId(custId)
                if(val.name == "5"){
                    that.getUserCreditLoanByCustomerId(custId)
                    that.getUserCreditListByCustomerId(custId)
                    that.getUserCreditGuaranteeByCreditId(custId)
                }
                if(val.name == "6"){
                    that.getUserInvestEndByCustomerId(custId)
                    that.getUserInvestPendingByCustomerId(custId)
                }
                if(val.name == "7"){
                    that.getUserCreditQueryByCustomerId(custId)
                }
                if(val.name == "8"){
                    that.getUserOtherFilesByCustomerId(custId)
                }


            },
            getOps(){
                let that                 = this
                let opsUrl      = Vue.agent.root + '/dictionary/dict/querys'

                that.$http && that.$http.get(opsUrl,{params:{
                    names:"education,residentStatus,residentHouseType,maritalStatus,stabilizeType,repayType,lifeCycle",
                    funcId:that.funcId
                }}).then(function (res) {
                    if(res.body.code == "200") {
                        let data                        = res.body.data
                        that.ops.educationOps           = data.educationOptions
                        that.ops.residentHouseTypeOps   = data.residentHouseTypeOptions
                        that.ops.residentStatusOps      = data.residentStatusOptions
                        that.ops.maritalStatusOps       = data.maritalStatusOptions
                        that.ops.stabilizeType          = data.stabilizeTypeOptions
                        that.ops.repayType              = data.repayTypeOptions
                        that.ops.lifeCycle              = data.lifeCycleOptions
                    }
                });
            },
            getAreaList(code,type,callback){
                let that        = this
                let url         = Vue.agent.root + '/area/subArea/list'

                var reqData     = {
                    areaId  :code,
                    funcId  :that.funcId

                }
                that.$http.get(url,{
                    params:reqData,
                }).then(res => {
                    if(res.body.code == 200) {
                        let data            = res.body.data
                        if(type == 'province')
                            that.area.province      = data
                        if(type == 'bProvince')
                            that.bArea.province      = data
                        if(type == 'city')
                            that.area.city          = data
                        if(type == 'bCity')
                            that.bArea.city          = data
                        if(type == 'town')
                            that.area.town          = data
                        if(type == 'bTown')
                            that.bArea.town         = data
                        if(type == 'zone')
                            that.area.zone          = data
                        if(type == 'bZone')
                            that.bArea.zone          = data
                        if(type == 'country')
                            that.area.country       = data
                        if(type == 'bCountry')
                            that.bArea.country       = data

                        !!callback && callback()
                    }else{

                    }
                });
            },
            provinceAreaChange(val){
                let that = this
                that.area.cityId = null
                that.getAreaList(val,'city')
            },
            cityAreaChange(val){
                let that = this
                that.area.townId = null
                that.getAreaList(val,'town')
            },
            townAreaChange(val){
                let that = this
                that.area.zoneId = null
                that.getAreaList(val,'zone')
            },
            zoneAreaChange(val){
                let that = this
                that.area.countryId = null
                that.getAreaList(val,'country')
            },
            bProvinceAreaChange(val){
                let that = this
                that.bArea.cityId = null
                that.getAreaList(val,'bCity')
            },
            bCityAreaChange(val){
                let that = this
                that.bArea.townId = null
                that.getAreaList(val,'bTown')
            },
            bTownAreaChange(val){
                let that = this
                that.bArea.zoneId = null
                that.getAreaList(val,'bZone')
            },
            bZoneAreaChange(val){
                let that = this
                that.bArea.countryId = null
                that.getAreaList(val,'bCountry')
            },
            setAreaCode(){
                let that            = this

                let areaId          = this.detail.areaId
                let provinceId      = (!!areaId ? areaId : '331000000000').slice(0,2)+ '0000000000'
                let cityId          = (!!areaId ? areaId : '331000000000').slice(0,4)+ '00000000'
                let townId          = (!!areaId ? areaId : '331081000000').slice(0,6)+ '000000'
                let zoneId          = (!!areaId ? areaId : '331081000000').slice(0,9)+ '000'
                let countryId       = (!!areaId ? areaId : '331081000000')
                that.area.provinceId    = provinceId

                that.getAreaList('000000000000','province',function () {
                    that.area.cityId        = cityId
                    that.getAreaList(provinceId,'city',function () {
                        that.area.townId        = townId
                        that.getAreaList(cityId,'town',function () {
                            if(zoneId.slice(6,9) == '000'){
                                that.area.zoneId        = null
                            }else{
                                that.area.zoneId        = zoneId
                            }
                            that.getAreaList(townId,'country',function () {
                                if(countryId.slice(9) == '000'){
                                    that.area.countryId        = null
                                }else{
                                    that.area.countryId        = countryId
                                }
                            })
                        })
                    })
                })


                let bAreaId          = this.detail.businessAreaId
                let bProvinceId      = (!!bAreaId   ? bAreaId : '331000000000').slice(0,2)+ '0000000000'
                let bCityId          = (!!bAreaId   ? bAreaId : '331000000000').slice(0,4)+ '00000000'
                let bTownId          = (!!bAreaId   ? bAreaId : '331081000000').slice(0,6)+ '000000'
                let bZoneId          = (!!bAreaId   ? bAreaId : '331081000000').slice(0,9)+ '000'
                let bCountryId       = (!!bAreaId   ? bAreaId : '331081000000')
                that.bArea.provinceId    = bProvinceId
//
                that.getAreaList('000000000000','bProvince',function () {
                    that.bArea.cityId        = bCityId
                    that.getAreaList(bProvinceId,'bCity',function () {
                        that.bArea.townId        = bTownId
                        that.getAreaList(bCityId,'bTown',function () {
                            if(bZoneId.slice(6,9) == '000'){
                                that.bArea.zoneId        = null
                            }else{
                                that.bArea.zoneId        = bZoneId
                            }
                            that.getAreaList(bTownId,'bZone',function () {
                                if(bCountryId.slice(9) == '000'){
                                    that.bArea.countryId        = null
                                }else{
                                    that.bArea.countryId        = bCountryId
                                }
                            })
                        })
                    })
                })


//                that.getAreaList(townId,'zone')


            },
        },
        created:function () {
            let that                 = this
            that.getOps()

        },
        components:{

        }
    }
</script>
