element 版本为1.4.x
1、远程搜索组件
<el-select
        v-model=""
        filterable
        remote
        clearable
        placeholder="客户名称/证件编号"
        no-data-text="身份证号输入有误或该客户不存在"
        :remote-method="getCustId"
        :loading="loading">
    <el-option
            v-for="item in custIdCollection"
            :key="item.custId"
            :label="item.certNo"
            :value="item.custId">
        <span style="float: left; color: #8492a6; font-size: 13px">{{ item.custName }}</span>
        <span style="float: right">证件:{{ item.certNo }}</span>
    </el-option>
</el-select>




 3、对话框
<el-dialog title="提示" :visible.sync="dialogVisible" width='50%' :close-on-click-modal='false'>
  <span>这是一段信息</span>
  <span slot="footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
</el-dialog>
    可以通过 size="1" 配合 el-dialog--1 设置宽度 

    modal=true 有遮罩层


4、分页 
    <div class='paging'>
      <el-pagination @size-change="sizeChange" @current-change="numChange"  :page-sizes="[15,10,1,20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <!-- 简单版 -->
    <div class="paging">
      <el-pagination layout="total, pager, next" :total="total" :page-size='pageSize' @current-change='currentChange'></el-pagination>
    </div>

5、Form

<el-form :inline="true">
    <el-form-item label='客户名称/证件编号'></el-form-item>    
</el-form>
    
    5.1 表单校验 
       <!--  1、trigger应该是代表'触发的条件' 
        2、pattern 可以传入一个正则
        3、type 和 pattern 是有冲突的
        4、表单校验的时候一定要传入:model="form" 和 prop='' -->
        :rules="[{ required: true, message: '请输入邮箱地址', trigger: 'blur' },{ type: 'email', message: '请输入正确的邮箱地址', pattern: /^[a-z]+$/, trigger: 'blur,change' }
        
          this.$refs[formName].validate((valid) => {
            if (valid) {

            } else {
              console.log('error submit!!')
              return false
            }
          })
        resetFields 方法可以移除校验结果

2、button  
 <el-button type="primary" size='small'></el-button>
 <el-button type="success/warning/danger/info" :plain="true" size='small'></el-button>

3、input
<el-input size='mini'  placeholder=""  ></el-input> 
<el-input size='mini'  placeholder=""  type='textarea' :autosize='{ minRows: 6, maxRows: 10 }'></el-input>
带icon的input
    <el-input placeholder="请选择日期"  prefix-icon/suffix-icon="el-icon-date" v-model="input2"></el-input>
  
4、select

4.0  普通select
    <el-select v-model="value" placeholder="请选择" size='large/small/mini' filterable>
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
    </el-select>

4.1 社区经理select组件
    <el-select  size="small" filterable         
       v-model="manager" placeholder="请选择" class='wide-175'>
        <el-option :label="'全部'" :value="null"></el-option>
        <el-option-group
            v-for="group in managerList"
            :key="group.label"
            :label="group.label">
            <el-option
                v-for="item in group.options"
                :key="item.name"
                :label="item.name"
                :value="item.value">
                <span style="float: left">{{ item.name }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.no }}</span>
            </el-option>
        </el-option-group>
    </el-select>

4.2 远程搜索select
    <el-select v-model="selectValue" filterable remote placeholder="客户名称/证件编号" no-data-text="身份证号输入有误或该客户不存在" :remote-method="getCustId" :loading="loading2" class='form-input' size='small'>
        <el-option v-for="item in custIdCollection" :key="item.custId" :label="item.certNo" :value="item.custId">
            <span style="float: left; color: #8492a6; font-size: 13px">{{ item.custName }}</span>
            <span style="float: right">证件:{{ item.certNo }}</span>
        </el-option>
    </el-select> 
        getCustId(query) {

            let url = 'root/credit/inpesct/queryCustByNameOrCertNo'
            let params = {
                info: query
            }
            this.custIdCollection = []
            if (query != null && query != '') {
                // console.log(query.match(/^\d{5,}$/))
                //至少一个汉字或者5位数字
                if (query.match(/^[\u4e00-\u9fa5]{1,}$/) != null || query.match(/^\d{15,}$/) != null) {
                    this.loading2 = true
                    this.$http.get(url, { params }).then(res => {
                        this.loading2 = false
                        if (res.body.code == "200") {
                            this.custIdCollection = res.body.data.list
                            // this.custIdCollection = res.body.data.list
                        }

                    })
                }

            } else {
                this.selectValue = ''
                // console.log(this.selectValue)
            }

        },



5、时间选择器
<el-date-picker v-model="startTime" type="date" placeholder="选择日期" size='mini' :editable="false"></el-date-picker>
<span>—</span>
<el-date-picker v-model="endTime" type="date" placeholder="选择日期" size='mini' :editable="false"></el-date-picker>
    startTime: isNaN(Date.parse(this.startTime)) == true ? undefined : Date.parse(this.startTime),
    endTime: isNaN(Date.parse(this.endTime)) == true ? undefined  : Date.parse(this.endTime),


6、表格
<el-table :data="tableData" style="width: 100%"  stripe border v-loading="loading" size='mini'>
    <el-table-column prop='goodsName' label="借款合同号" width="180"></el-table-column>
    <el-table-column  label="客户姓名" width="180" >
        <template slot-scope="scope">
            <a @click='openUserInfo(scope.row.custId)'>{{ scope.row.name}}</a>
        </template>
    </el-table-column>
</el-table>


7、tab页

<el-tabs v-model="activeTab" type="card" class='tab-box'>
     <el-tab-pane label="授信年检" name="first"></el-tab-pane>
     <el-tab-pane label="授信年检" name="first"></el-tab-pane>
</el-tabs>
        //tab-click 事件
8、布局
<el-row>
    <el-col :span="24">
      
    </el-col>
</el-row>

9、折叠面板--手风琴模式
<el-collapse  v-model="activeName">
    <el-collapse-item title="一致性 Consistency" name="1">
        
    </el-collapse-item>
</el-collapse>


10.弹框
    this.$confirm('删除该, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {

    }).catch(() => {})




11、 Notification 类型   success/warning/info/error
this.$notify.info/ this.$notify.error /this.$notify.success/this.$notify.warning
this.$notify({title: '成功', message: '添加成功', type: 'success'})



12、单选框
    <el-radio class="radio" v-model="radio" label="1">备选项</el-radio>
    <el-radio class="radio" v-model="radio" label="2">备选项</el-radio>


13、icon
    <i class="el-icon-plus"></i>


14、input 金额格式化
  <template>
    <div>
    <el-form-item label="担保金额"   :rules="[{required: true, message: '请输入担保金额'},{ pattern:/^\d[,\d]{0,}$/,message: '必须为数字'}]">
      <el-input v-model="money" placeholder="请输入金额" @change='inputMoneyFormat'></el-input>
      <!-- money 的类型还是string 最后提交的时候还要转化成number -->
      parseFloat(guarantee.guaranteeAmt.replace(/,/g,''))  
    </el-form-item>
    </div>
  </template>
  <script>
  export default {
    props: {
      money:String,
    },
    methods: {
      inputMoneyFormat (money) {
        /*accounting.js 全局依赖*/
        var a = accounting.format(money, 0, ',')
        this.money = a 
      }     
    }
  }
  </script>


15、对象resret
Object.assign(this.$data.form, this.$options.data().form)