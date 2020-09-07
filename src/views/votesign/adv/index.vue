<template>
  <div class="app-container">
    <!--form 组件-->
    <eForm ref="form" :is-add="isAdd" :dicts="dicts"/>
    <el-row :gutter="20">
      <!--部门数据-->
      <!--<el-col :xs="9" :sm="6" :md="4" :lg="4" :xl="4">-->
      <!--<div class="head-container">-->
      <!--<el-input v-model="deptName" clearable placeholder="输入部门名称搜索" prefix-icon="el-icon-search" style="width: 100%;" class="filter-item" @input="getDeptDatas"/>-->
      <!--</div>-->
      <!--<el-tree :data="depts" :props="defaultProps" :expand-on-click-node="false" default-expand-all @node-click="handleNodeClick"/>-->
      <!--</el-col>-->
      <!--用户数据-->
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <!--工具栏-->
        <div class="head-container">
          <!-- 搜索 -->
          <el-input v-model="query.title" clearable placeholder="输入标题" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
          <el-select v-model="query.enabled" clearable placeholder="下发系统" class="filter-item" style="width: 200px" @change="toQuery">
            <el-option v-for="item in addressOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
          </el-select>
          <el-select v-model="query.enabled" clearable placeholder="状态" class="filter-item" style="width: 120px" @change="toQuery">
            <el-option v-for="item in enabledTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
          </el-select>
          <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
          <!-- 新增 -->
          <div v-permission="['ADMIN','USER_ALL','USER_CREATE']" style="display: inline-block;margin: 0px 2px;">
            <el-button
              class="filter-item"
              size="mini"
              type="primary"
              icon="el-icon-plus"
              @click="add">新增</el-button>
          </div>
          <!-- 导出 -->
          <div style="display: inline-block;">
            <el-button
              v-permission="['ADMIN','USER_ALL','USER_SELECT']"
              :loading="downloadLoading"
              size="mini"
              class="filter-item"
              type="warning"
              icon="el-icon-download"
              @click="download">导出</el-button>
          </div>
        </div>
        <!--表格渲染-->
        <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
          <el-table-column prop="adTitle" label="广告名称"/>
          <el-table-column prop="adTypes" label="广告类型"/>
          <el-table-column prop="adAddress" label="下发地址">
            <template slot-scope="scope">
              <span>{{ parseAddress(scope.row.adAddress) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="voteStarttime" label="展示图片">
          </el-table-column>
          <el-table-column prop="adDetails" label="广告描述"/>
          <el-table-column prop="advertisersName" label="关联商家"/>
          <el-table-column prop="adCreatetime" label="创建日期"/>
          <el-table-column prop="adPageviews" label="广告浏览量"/>
          <el-table-column prop="adHits" label="广告点击量"/>
          <el-table-column prop="adUptime" label="开始时间"/>
          <el-table-column prop="adDowntime" label="结束时间"/>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <span>{{ parseAdStatus(scope.row.adStatus) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="adStatus" label="审核状态"/>
          <el-table-column prop="adRemark" label="备注"/>
          <el-table-column v-if="checkPermission(['ADMIN','USER_ALL','USER_EDIT','USER_DELETE'])" label="操作" width="125" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button v-permission="['ADMIN','USER_ALL','USER_EDIT']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
              <el-popover
                v-permission="['ADMIN','USER_ALL','USER_DELETE']"
                :ref="scope.row.voteId"
                placement="top"
                width="180">
                <p>确定删除本条数据吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="$refs[scope.row.voteId].doClose()">取消</el-button>
                  <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.voteId)">确定</el-button>
                </div>
                <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini"/>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
        <!--分页组件-->
        <el-pagination
          :total="total"
          :current-page="page + 1"
          style="margin-top: 8px;"
          layout="total, prev, pager, next, sizes"
          @size-change="sizeChange"
          @current-change="pageChange"/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import initDict from '@/mixins/initDict'
import { del, downloadUser } from '@/api/user'
import { getDepts } from '@/api/dept'
import { deleteVote, getAdvertisers } from '@/api/java'
import { parseTime, downloadFile } from '@/utils/index'
import eForm from './form'
export default {
  name: 'User',
  components: { eForm },
  mixins: [initData, initDict],
  data() {
    return {
      height: document.documentElement.clientHeight - 180 + 'px;', isAdd: false,
      advertisersList: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      downloadLoading: false,
      addressOptions: [
        { key: '0', display_name: '全部' },
        { key: '1', display_name: 'APP' },
        { key: '2', display_name: '公众号' }
      ],
      enabledTypeOptions: [
        { key: '0', display_name: '全部' },
        { key: '1', display_name: '未审核' },
        { key: '2', display_name: '已审核' }
      ]
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
      this.getAdvertisers()
      // 加载数据字典
    })
  },
  mounted: function() {
    const that = this
    window.onresize = function temp() {
      that.height = document.documentElement.clientHeight - 180 + 'px;'
    }
  },
  methods: {
    parseTime,
    checkPermission,
    getAdvertisers() {
      getAdvertisers().then(res => {
        debugger
        this.advertisersList = res.data.content
      })
    },
    parseAddress(address) {
      if (address == '0') {
        return '全部'
      }
      if (address == '1') {
        return '汇生活'
      }
      if (address == '2') {
        return ' '
      }
    },
    parseAdStatus(status) { // 1：新建，2：已审核，3：上架，4：下架
      if (status == '1') {
        return '新建'
      }
      if (status == '2') {
        return '已审核'
      }
      if (status == '3') {
        return '上架'
      }
      if (status == '4') {
        return '下架'
      }
    },
    beforeInit() {
      this.url = 'aaa/ad/getAd'
      const sort = 'id,desc'
      const query = this.query
      const blurry = query.blurry
      const enabled = query.enabled
      this.params = { number: this.page, size: this.size, status: 0, sort: sort }
      if (blurry) { this.params['blurry'] = blurry }
      if (enabled !== '' && enabled !== null) { this.params['enabled'] = enabled }
      return true
    },
    subDelete(id) {
      this.delLoading = true
      const para = new FormData()
      para.append('voteId', id)
      deleteVote(para).then(res => {
        this.delLoading = false
        this.$refs[id].doClose()
        this.dleChangePage()
        this.init()
        this.$notify({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.delLoading = false
        this.$refs[id].doClose()
        console.log(err.response.data.message)
      })
    },
    getDeptDatas() {
      const sort = 'id,desc'
      const params = { sort: sort }
      if (this.deptName) { params['name'] = this.deptName }
      getDepts(params).then(res => {
        this.depts = res.content
      })
    },
    handleNodeClick(data) {
      if (data.pid === 0) {
        this.deptId = null
      } else {
        this.deptId = data.id
      }
      this.init()
    },
    add() {
      this.isAdd = true
      this.$refs.form.dialog = true
      this.$refs.form.advertisersList = this.advertisersList
    },
    // 导出
    download() {
      this.downloadLoading = true
      downloadUser().then(result => {
        downloadFile(result, '用户列表', 'xlsx')
        this.downloadLoading = false
      }).catch(() => {
        this.downloadLoading = false
      })
    },
    // 数据转换
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'createTime' || j === 'lastPasswordResetTime') {
          return parseTime(v[j])
        } else if (j === 'enabled') {
          return parseTime(v[j]) ? '启用' : '禁用'
        } else {
          return v[j]
        }
      }))
    },
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      _this.form = {
        adId: data.adId,
        adTitle: data.adTitle,
        adTypes: data.adTypes,
        advertisersId: data.advertisersId,
        adAddress: data.adAddress,
        adUptime: data.adUptime,
        adDowntime: data.adDowntime,
        adRemark: data.adRemark
      }
      _this.advertisersList = this.advertisersList
      _this.dialog = true
    }
  }
}
</script>

<style scoped>
</style>
