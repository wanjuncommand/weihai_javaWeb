<template>
  <el-dialog :visible.sync="dialog" :close-on-click-modal="false" :before-close="cancel" :title="isAdd ? '新增广告商' : '编辑广告商'" append-to-body width="800px">
    <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="120px">
      <el-row>
        <el-form-item label="广告商名称" prop="advertisersName">
          <el-input v-model="form.advertisersName"/>
        </el-form-item>
        <el-form-item label="营业执照编号" prop="">
          <el-input v-model="form.advertisersLicense"/>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="联系人" prop="advertisersPhone">
          <el-input v-model.number="form.advertisersPerson" />
        </el-form-item>
        <el-form-item label="联系方式" prop="advertisersPhone">
          <el-input v-model="form.advertisersPhone" />
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="联系地址" prop="advertisersAddress">
          <el-input v-model="form.advertisersAddress"/>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="备注" prop="advertisersRemark">
          <el-input v-model="form.advertisersRemark" type="textarea"/>
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

import { addAdvertisers, updateAdvertisers } from '@/api/java'
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
      dialog: false, loading: false, form: { username: '', email: '', enabled: 'false', roles: [], job: { id: '' }, dept: { id: '' }, phone: null },
      roleIds: [], roles: [], depts: [], deptId: null, jobId: null, jobs: [], level: 3,
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
          // if (this.deptId === null || this.deptId === undefined) {
          //   this.$message({
          //     message: '部门不能为空',
          //     type: 'warning'
          //   })
          // } else if (this.jobId === null) {
          //   this.$message({
          //     message: '岗位不能为空',
          //     type: 'warning'
          //   })
          // } else if (this.roleIds.length === 0) {
          //   this.$message({
          //     message: '角色不能为空',
          //     type: 'warning'
          //   })
          // } else {
          //   this.loading = true
          //   this.form.roles = []
          //   const _this = this
          //   this.roleIds.forEach(function(data, index) {
          //     const role = { id: data }
          //     _this.form.roles.push(role)
          //   })
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
      addAdvertisers(this.form).then(res => {
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
      updateAdvertisers(this.form).then(res => {
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
      this.form = { advertisersAddress: '', advertisersAds: '', advertisersId:'', advertisersName:'',advertisersPhone:'',advertisersRemark:''}
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
    }
  }
}
</script>

<style scoped>

</style>
