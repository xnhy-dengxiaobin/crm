<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="客户ID" prop="customerId">
      <el-input v-model="dataForm.customerId" placeholder="客户ID"></el-input>
    </el-form-item>
    <el-form-item label="跟进方式" prop="mode">
      <el-input v-model="dataForm.mode" placeholder="跟进方式"></el-input>
    </el-form-item>
    <el-form-item label="意向级别" prop="grade">
      <el-input v-model="dataForm.grade" placeholder="意向级别"></el-input>
    </el-form-item>
    <el-form-item label="跟进内容" prop="content">
      <el-input v-model="dataForm.content" placeholder="跟进内容"></el-input>
    </el-form-item>
    <el-form-item label="下次跟进时间" prop="nextDate">
      <el-input v-model="dataForm.nextDate" placeholder="下次跟进时间"></el-input>
    </el-form-item>
    <el-form-item label="创建时间" prop="createTime">
      <el-input v-model="dataForm.createTime" placeholder="创建时间"></el-input>
    </el-form-item>
    <el-form-item label="跟进人" prop="createName">
      <el-input v-model="dataForm.createName" placeholder="跟进人"></el-input>
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: 0,
          customerId: '',
          mode: '',
          grade: '',
          content: '',
          nextDate: '',
          createTime: '',
          createName: ''
        },
        dataRule: {
          customerId: [
            { required: true, message: '客户ID不能为空', trigger: 'blur' }
          ],
          mode: [
            { required: true, message: '跟进方式不能为空', trigger: 'blur' }
          ],
          grade: [
            { required: true, message: '意向级别不能为空', trigger: 'blur' }
          ],
          content: [
            { required: true, message: '跟进内容不能为空', trigger: 'blur' }
          ],
          nextDate: [
            { required: true, message: '下次跟进时间不能为空', trigger: 'blur' }
          ],
          createTime: [
            { required: true, message: '创建时间不能为空', trigger: 'blur' }
          ],
          createName: [
            { required: true, message: '跟进人不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/busi/busicustomerfollow/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.customerId = data.busiCustomerFollow.customerId
                this.dataForm.mode = data.busiCustomerFollow.mode
                this.dataForm.grade = data.busiCustomerFollow.grade
                this.dataForm.content = data.busiCustomerFollow.content
                this.dataForm.nextDate = data.busiCustomerFollow.nextDate
                this.dataForm.createTime = data.busiCustomerFollow.createTime
                this.dataForm.createName = data.busiCustomerFollow.createName
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/busi/busicustomerfollow/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'customerId': this.dataForm.customerId,
                'mode': this.dataForm.mode,
                'grade': this.dataForm.grade,
                'content': this.dataForm.content,
                'nextDate': this.dataForm.nextDate,
                'createTime': this.dataForm.createTime,
                'createName': this.dataForm.createName
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      }
    }
  }
</script>
