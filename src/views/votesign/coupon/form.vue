<template>
  <el-dialog :visible.sync="dialog" :close-on-click-modal="false" :before-close="cancel" :title="isAdd ? '新增广告' : '编辑广告'" append-to-body width="800px">
    <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="100px">
      <el-row>
        <el-col>
          <el-form-item label="优惠券名称" prop="adTitle">
            <el-input v-model="form.couponName"/>
          </el-form-item>
        </el-col>
        <!--</el-row>-->
        <!--<el-row>-->
        <el-form-item label="优惠券类型" prop="adTypes">
          <el-radio v-for="item in couponTypeList" v-model="form.couponType" :label="item.value">{{ item.label }}</el-radio>
        </el-form-item>
      </el-row>
      <el-row>
        <el-col :span="11">  <el-form-item label="满" prop="adTitle">
          <el-input v-model="form.couponFull"/>
        </el-form-item></el-col>
        <el-col :span="11">
          <el-form-item label="————   减" prop="adTitle">
            <el-input v-model="form.couponReduce"/>
          </el-form-item>
        </el-col>
      </el-row>
      <!--<el-row>-->
        <!--<el-col :span="11">-->
          <!--<el-form-item label="开始时间" prop="advertisersId">-->
            <!--<el-date-picker-->
              <!--v-model="form.couponStarttime"-->
              <!--style="width: 185px"-->
              <!--type="date"-->
              <!--placeholder="选择日期"/>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
        <!--<el-col :span="11">-->
          <!--<el-form-item label="结束时间" prop="adAddress">-->
            <!--<el-date-picker-->
              <!--v-model="form.couponEndtime"-->
              <!--type="date"-->
              <!--style="width: 185px"-->
              <!--placeholder="选择日期"/>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
      <!--</el-row>-->
      <el-row>
        <el-form-item label="备注" prop="">
          <el-input v-model="form.couponRemark"/>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="保存为模板" prop="adAddress">
          <el-checkbox v-model="form.templateStatus"/>
        </el-form-item>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>

import { addCoupon, updateCoupon } from '@/api/java'
import { getDepts } from '@/api/dept'
import { getAll, getLevel } from '@/api/role'
import { getAllJob } from '@/api/job'
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
      form: {
      },
      couponTypeList: [{ value: 1, label: '通用优惠券' }, { value: 2, label: '满减优惠券' }],
      adAddressList: [{ value: 1, label: '汇生活' }, { value: 2, label: '停车' }, { value: 3, label: '游泳馆' }],
      advertisersList: [],
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
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
      }
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          // if (this.roleIds.length === 0) {
          //   this.$message({
          //     message: '角色不能为空',
          //     type: 'warning'
          //   })
          // } else {
          this.loading = true
          const _this = this
          if (this.isAdd) {
            this.doAdd()
          } else this.doEdit()
          // }
        } else {
          return false
        }
      })
    },
    doAdd() {
      addCoupon(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '添加成功',
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
    doEdit() {
      updateCoupon(this.form).then(res => {
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
      this.$refs['form'].resetFields()
      this.deptId = null
      this.jobId = null
      this.roleIds = []
      this.form = { username: '', email: '', enabled: 'false', roles: [], job: { id: '' }, dept: { id: '' }, phone: null }
    },
    getRoles() {
      getAll().then(res => {
        this.roles = res
      }).catch(err => {
        console.log(err.response.data.message)
      })
    },
    getJobs(id) {
      getAllJob(id).then(res => {
        this.jobs = res.content
      }).catch(err => {
        console.log(err.response.data.message)
      })
    },
    getDepts() {
      getDepts({ enabled: true }).then(res => {
        this.depts = res.content
      })
    },
    isvalidPhone(str) {
      const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
      return reg.test(str)
    },
    selectFun(node, instanceId) {
      this.getJobs(node.id)
    },
    getRoleLevel() {
      getLevel().then(res => {
        this.level = res.level
      }).catch(err => {
        console.log(err.response.data.message)
      })
    }, handleRemove(file) {
      console.log(file)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleDownload(file) {
      console.log(file)
    }
  }
}
</script>

<style scoped>

</style>
