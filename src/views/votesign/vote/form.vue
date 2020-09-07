<template>
  <el-dialog
    :visible.sync="dialog"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="cancel"
    :title="isAdd ? '新增投票' : '编辑投票'"
    append-to-body
    width="1300px">
    <el-dialog :visible.sync="optionDialog" :close-on-click-modal="false" :before-close="optionCancel" title="编辑描述" append-to-body width="570px">
      <el-form ref="optionForm" :inline="true" :model="form" :rules="rules" size="small" label-width="66px">
        <el-form-item prop="username">
          <quill-editor
            ref="myQuillEditor"
            v-model="option.optionsDetail"
            :options="editorOption"
            @blur="onEditorBlur($event)"
            @focus="onEditorFocus($event)"
            @change="onEditorChange($event)"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="optionCancel">取消</el-button>
        <el-button :loading="loading" type="primary" @click="optionDdoSubmit">确认</el-button>
      </div>
    </el-dialog>
    <el-row>
      <el-col :span="7">
        <div style="width:300px;height: 600px;background:url('../../src/assets/image/ios.png') ;background-size: cover;">
          <el-row style=" margin-bottom: 80px;"/>
          <el-row style=" margin-bottom: 20px;">
            <div style="text-align: center;width: 300px">标题</div>
          </el-row>
          <el-row>
            <div style="width: 250px;height: 100px;margin-left: 24px">
              <el-image src="https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg"/>
            </div>
          </el-row>

        </div>

      </el-col>
      <el-col :span="1">
        <el-divider direction="vertical" style="height: 300px"/>
      </el-col>
      <el-col :span="16">
        <el-tabs v-model="activeName">
          <el-tab-pane label="投票介绍" name="first">
            <el-form ref="form1" :model="form" :rules="rules" size="small" label-width="90px">
              <el-row>
                <el-col :span="10">
                  <el-form-item label="标题名称" prop="voteTitle">
                    <el-input v-model="form.voteTitle"/>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label="下发系统" prop="voteAddress">
                    <el-select v-model="form.voteAddress" placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"/>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="10">
                  <el-form-item label="投票频次" prop="voteFrequency">
                    <el-input v-model.number="form.voteFrequency"/>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label="活动时间" prop="startAndEndTime">
                    <el-date-picker
                      v-model="form.startAndEndTime"
                      type="datetimerange"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-form-item label="活动正文" prop="" style="height: 400px">
                  <quill-editor
                    ref="myQuillEditor"
                    v-model="form.voteDetails"
                    :options="editorOption"
                    @blur="onEditorBlur($event)"
                    @focus="onEditorFocus($event)"
                    @change="onEditorChange($event)"/>
                </el-form-item>
              </el-row>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="模板设置" name="second">
            <el-form ref="form2" :inline="true" :model="form" :rules="rules" size="small" label-width="120px">
              <el-row>
                <el-form-item label="主题设置" prop="username">
                  <el-radio-group v-model="radio2" size="small">
                    <el-radio label="1" border>默认主题</el-radio>
                    <el-radio label="2" border>国庆主题</el-radio>
                    <el-radio label="3" border>周年庆典</el-radio>
                    <el-radio label="4" border>中秋主题</el-radio>
                    <el-radio label="5" border>春节主题</el-radio>
                    <el-radio label="6" border>年度评选</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-row>
              <el-row>
                <!--<el-form-item label="配色方案" prop="enabled">-->
                <!--<el-button-->
                <!--type="primary"-->
                <!--style="background-color: rgba(24, 144, 255, 0.847058823529412);border-color: rgba(24, 144, 255, 0.847058823529412)">-->
                <!--&nbsp;-->
                <!--</el-button>-->
                <!--<el-button-->
                <!--type="success"-->
                <!--style="background-color: rgba(255, 118, 126, 1);border-color: rgba(255, 118, 126, 1)">-->
                <!--&nbsp;-->
                <!--</el-button>-->
                <!--<el-button-->
                <!--type="info"-->
                <!--style="background-color: rgba(248, 191, 0, 1);border-color: rgba(248, 191, 0, 1)">&nbsp;-->
                <!--</el-button>-->
                <!--<el-button-->
                <!--type="warning"-->
                <!--style="background-color: rgba(0, 176, 5, 1);border-color: rgba(0, 176, 5, 1)">&nbsp;-->
                <!--</el-button>-->
                <!--<el-button-->
                <!--type="danger"-->
                <!--style="background-color: rgba(207, 35, 47, 1);border-color: rgba(207, 35, 47, 1)">&nbsp;-->
                <!--</el-button>-->
                <!--<el-button-->
                <!--type="danger"-->
                <!--style="background-color: rgba(154, 178, 255, 1);border-color: rgba(154, 178, 255, 1)">-->
                <!--&nbsp;-->
                <!--</el-button>-->
                <!--<el-button-->
                <!--type="danger"-->
                <!--style="background-color: rgba(66, 207, 226, 1);border-color: rgba(66, 207, 226, 1)">&nbsp;-->
                <!--</el-button>-->
                <!--<el-button-->
                <!--type="danger"-->
                <!--style="background-color: rgba(215, 215, 215, 1);border-color: rgba(215, 215, 215, 1)">-->
                <!--&nbsp;-->
                <!--</el-button>-->
                <!--</el-form-item>-->
                <el-form-item label="自定义背景颜色" prop="voteColors">
                  <el-color-picker v-model="form.voteColors" style="width: 200px"/>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="排序方式" prop="voteSort">
                  <el-radio-group v-model="form.voteSort" size="small">
                    <el-radio label="1" border>编号从高到低</el-radio>
                    <el-radio label="2" border>票数从高到低</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="投票次数" prop="voteRule">
                  <el-input-number v-model="form.voteRule" :min="1" :max="10" label="描述文字"/>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="限定投票" prop="limitStatus">
                  <el-radio-group v-model="form.limitStatus" size="small">
                    <el-radio label="1" border>开启</el-radio>
                    <el-radio label="2" border>关闭</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-row>
              <span style="color: #FF7B7B;margin-left:100px">关闭限定投票，如果现在你有3票,那么3票可以全部投给同一个选手。开启限定投票,3票就要投给3个不同的选手</span>
              <el-row>
                <el-form-item label="显示方式" prop="showStatus">
                  <el-radio-group v-model="form.showStatus" size="small">
                    <el-radio label="1" border>双牌显示</el-radio>
                    <el-radio label="2" border>单排显示</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="背景皮肤">
                  <el-radio-group v-model="radio2" size="small">
                    <el-radio label="1" border>选择背景</el-radio>
                    <el-radio label="2" border>上传背景</el-radio>
                    <el-radio label="3" border>清除背景</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="背景音乐">
                  <el-dropdown size="small" split-button>
                    中等尺寸
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item>黄金糕</el-dropdown-item>
                      <el-dropdown-item>狮子头</el-dropdown-item>
                      <el-dropdown-item>螺蛳粉</el-dropdown-item>
                      <el-dropdown-item>双皮奶</el-dropdown-item>
                      <el-dropdown-item>蚵仔煎</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-form-item>
                <el-form-item label="自定义音乐">
                  <el-input v-model="form.email"/>
                </el-form-item>
              </el-row>
              <el-divider/>
              <el-row>
                <H3>页头设置</H3>
              </el-row>
              <!--<el-row>-->
              <!--<span style="color: rgba(0, 0, 0, 0.4);font-size: 14px;text-align: left;margin-left: 30px;">*图片建议大小宽度720px高度自定义, 图片必须小于3M</span>-->
              <!--</el-row>-->
              <el-row>
                <div style="width: 300px;height: 200px;margin-left: 34px;">
                  <el-image src="https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg"/>
                </div>
              </el-row>
              <el-row>
                <div style="padding-top: 10px;padding-left: 33px;">
                  <el-upload
                    :show-file-list="false"
                    :file-list="fileList"
                    class="upload-demo"
                    action="https://jsonplaceholder.typicode.com/posts/">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">图片建议大小宽度720px高度自定义, 图片必须小于3M</div>
                  </el-upload>
                </div>

              </el-row>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="选项添加" name="third">
            <el-form ref="form3" :model="form" :rules="rules" size="small" label-width="90px">
              <el-row>
                <h3 style="float: left ">当前选手{{ optionList.length }}个</h3> <el-button
                  style="margin-left:20px;margin-block-start: 1em;
    margin-block-end: 1em;"
                  size="mini"
                  type="primary"
                  @click="addOption">添加</el-button>
              </el-row>
              <div v-for="(item,index) in optionList" style="margin-bottom: 10px;">
                <el-row>
                  <el-col :span="15">
                    <el-row >
                      <el-form-item :label="'选项'+(optionList.length - ((index)))">
                        <el-input/>
                      </el-form-item>
                    </el-row>
                    <el-row style="margin-left: 50px;margin-bottom: 20px">
                      <el-button size="small" @click="optionDialog = true">编辑描述</el-button>
                      <el-button type="" size="small">上传多图</el-button>
                      <el-button type="" size="small">上传封面</el-button>
                      <el-button type="" size="small">上传视频</el-button>
                      <el-button type="danger" plain size="small">删除选项</el-button>
                    </el-row>
                  </el-col>
                  <el-col :span="9">
                    <div style="width: 110px;height: 110px;margin-left: 10px;">
                      <el-image src="https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg"/>
                    </div>
                  </el-col>
                </el-row>

                <!--<el-divider/>-->
              </div>
              <el-pagination
                :total="total"
                :current-page="page + 1"
                style="margin-top: 8px;"
                layout="total, prev, pager, next"
                @size-change="sizeChange"
                @current-change="pageChange"/>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>

import { add, edit } from '@/api/user'
import { addVote } from '@/api/java'
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
      options: [{
        value: '3',
        label: 'All'
      }, {
        value: '2',
        label: '公众号'
      }, {
        value: '1',
        label: 'APP'
      }],
      content: ``,
      editorOption: {
        theme: 'snow',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'], // toggled buttons
            ['blockquote', 'code-block'], [{ 'header': 1 }, { 'header': 2 }], [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'script': 'sub' }, { 'script': 'super' }], [{ 'indent': '-1' }, { 'indent': '+1' }], [{ 'size': ['small', false, 'large', 'huge'] }],
            [{ 'color': [] }, { 'background': [] }]
          ]
        }
      },
      value1: '',
      dialog: false,
      optionDialog: false,
      option: {},
      loading: false,
      form: {},
      page: 0, size: 3, total: 0,
      activeName: 'first',
      textarea: 'first',
      radio2: '',
      color2: '',
      fileList: [],
      optionList: [{}, {}, {}],
      showOptionList: [],
      rules: {
        voteTitle: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        voteAddress: [
          { required: true, message: '请选择下发系统', trigger: 'blur' }
        ],
        voteFrequency: [
          { required: true, message: '请选择下发频次', trigger: 'blur' }
        ],
        startAndEndTime: [
          { required: true, message: '请输入正确的时间', trigger: 'blur' }
        ],
        voteColors: [
          { required: true, message: '请选择背景颜色', trigger: 'blur' }
        ],
        voteSort: [
          { required: true, message: '请选择排序方式', trigger: 'blur' }
        ],
        voteRule: [
          { required: true, message: '请选择投票次数', trigger: 'blur' }
        ],
        limitStatus: [
          { required: true, message: '请选择限定投票', trigger: 'blur' }
        ],
        showStatus: [
          { required: true, message: '请选择显示方式', trigger: 'blur' }
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
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill
    }
  },
  methods: {
    onEditorReady(editor) { // 准备编辑器
    },
    onEditorBlur() {}, // 失去焦点事件
    onEditorFocus() {}, // 获得焦点事件
    onEditorChange() {}, // 内容改变事件
    saveHtml: function(event) {
      alert(this.content)
    },
    cancel() {
      this.resetForm()
    },
    optionCancel() {
      this.optionResetForm()
    },
    doSubmit() {
      // console.log(this.form.startAndEndTime)
      // return
      // this.form.dept.id = this.deptId
      // this.form.job.id = this.jobId
      this.$refs['form1'].validate((valid) => {
        this.$refs['form2'].validate((valid) => {
          this.$refs['form3'].validate((valid) => {
            debugger
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
              this.loading = true
              this.form.roles = []
              const _this = this
              this.roleIds.forEach(function(data, index) {
                const role = { id: data }
                _this.form.roles.push(role)
              })
              if (this.isAdd) {
                this.doAdd()
              } else {
                this.doEdit()
              }
            // }
            } else {
              return false
            }
          })
        })
      })
    },
    optionDdoSubmit(){

    },
    doAdd() {
      const voteParam = {
        'options': this.peopleList,
        'voteVo': this.form
      }
      addVote(voteParam).then(res => {
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
      edit(this.form).then(res => {
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
      this.form = {
        username: '',
        email: '',
        enabled: 'false',
        roles: [],
        job: { id: '' },
        dept: { id: '' },
        phone: null
      }
    },
    optionResetForm() {
      this.optionDialog = false
      this.$refs['optionForm'].resetFields()
    },
    pageChange(e) {
      this.page = e - 1
    },
    sizeChange(e) {
      this.page = 0
      this.size = e
    },
    addOption() {
      this.optionList.push({})
    }
  }
}
</script>

<style scoped>
  .el-divider--vertical {
    display: inline-block;
    width: 1px;
    height: 45em;
    margin: 0 8px;
    vertical-align: middle;
    position: relative;
  }

  .el-radio--small.is-bordered {
    padding: 8px 5px 0 8px;
    border-radius: 3px;
    height: 32px;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
