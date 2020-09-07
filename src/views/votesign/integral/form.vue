<template>
  <el-dialog :visible.sync="dialog" :close-on-click-modal="false" :before-close="cancel" title="规则管理" append-to-body width="900px">
    <h3>非消费积分</h3>
    <el-divider/>
    <el-row class="row-bg">
      <span>签到：每日签到获得</span> <el-input v-model="sign" size="mini" style="width: 100px" placeholder="请输入"/><span>积分，公众号和APP一日只能计算1次。</span>
    </el-row>
    <el-row class="row-bg">
      <span>活动：参加投票、报名、调查等活动每次获得</span>  <el-input v-model="active" style="width: 100px" size="mini" placeholder="请输入"/><span>积分。</span>
    </el-row>
    <h3>消费积分</h3>
    <el-row v-for="(item,index) in integralRuleVoList" class="row-bg">
      <span>规则{{ index+1 }}：每次消费金额</span> <el-input v-model="item.ruleStart" size="mini" style="width: 100px" placeholder="请输入"/>  ———  <el-input v-model="item.ruleEnd" size="mini" style="width: 100px" placeholder="请输入"/>
      <span>元，获得积分的比例为<el-input v-model="item.rulePercentage" size="mini" style="width: 100px" placeholder="请输入"/></span> <span>%</span>
    </el-row>
    <el-row>
      <el-button type="primary" @click="addRuleList">规则添加</el-button>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>

import { updateIntegralRule } from '@/api/java'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  components: { Treeselect },
  props: {
    isAdd: {
      type: Boolean,
      required: true
    },
    dicts: {
      type: Array,
      required: true
    }
  },
  data() {
    const validPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入电话号码'))
      } else if (!this.isvalidPhone(value)) {
        callback(new Error('请输入正确的11位手机号码'))
      } else {
        callback()
      }
    }
    return {
      dialog: false, loading: false,
      active: '',
      sign: '',
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        phone: [
          { required: true, trigger: 'blur', validator: validPhone }
        ],
        enabled: [
          { required: true, message: '状态不能为空', trigger: 'blur' }
        ]
      },
      integralRuleVoList: []
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      if (this.sign === null || this.sign === undefined) {
        this.$message({
          message: '非消费积分签到获得积分不能为空',
          type: 'warning'
        })
        return
      }
      if (this.active === null || this.active === undefined) {
        this.$message({
          message: '非消费积分活动获得积分不能为空',
          type: 'warning'
        })
        return
      }
      this.doAddOrEdit()
    },
    doAddOrEdit() {
      console.log(this.integralRuleVoList)

      const integralRule = {}
      integralRule.active = this.active
      integralRule.sign = this.sign
      for (let i = 0; i < this.integralRuleVoList.length; i++) {
        this.integralRuleVoList[i].ruleId = i + 3
      }
      integralRule.integralRuleVoList = this.integralRuleVoList

      updateIntegralRule(integralRule).then(res => {
        this.resetForm()
        this.$notify({
          title: '修改成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.$parent.init()
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    resetForm() {
      this.dialog = false
      this.integralRuleVoList = []
      this.sign = ''
      this.active = ''
    },
    addRuleList() {
      this.integralRuleVoList.push({})
    }
  }
}
</script>

<style scoped>
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>
