<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="报备id" prop="preparedId">
      <el-input v-model="dataForm.preparedId" placeholder="报备id"></el-input>
    </el-form-item>
    <el-form-item label="客户id" prop="customerId">
      <el-input v-model="dataForm.customerId" placeholder="客户id"></el-input>
    </el-form-item>
    <el-form-item label="状态：中文" prop="status">
      <el-input v-model="dataForm.status" placeholder="状态：中文"></el-input>
    </el-form-item>
    <el-form-item label="状态的另一种叫法" prop="title">
      <el-input v-model="dataForm.title" placeholder="状态的另一种叫法"></el-input>
    </el-form-item>
    <el-form-item label="说明1" prop="memo1">
      <el-input v-model="dataForm.memo1" placeholder="说明1"></el-input>
    </el-form-item>
    <el-form-item label="说明2" prop="memo2">
      <el-input v-model="dataForm.memo2" placeholder="说明2"></el-input>
    </el-form-item>
    <el-form-item label="说明3" prop="memo3">
      <el-input v-model="dataForm.memo3" placeholder="说明3"></el-input>
    </el-form-item>
    <el-form-item label="说明4" prop="memo4">
      <el-input v-model="dataForm.memo4" placeholder="说明4"></el-input>
    </el-form-item>
    <el-form-item label="说明5" prop="memo5">
      <el-input v-model="dataForm.memo5" placeholder="说明5"></el-input>
    </el-form-item>
    <el-form-item label="日志生成时间" prop="foundTime">
      <el-input v-model="dataForm.foundTime" placeholder="日志生成时间"></el-input>
    </el-form-item>
    <el-form-item label="操作人id" prop="userId">
      <el-input v-model="dataForm.userId" placeholder="操作人id"></el-input>
    </el-form-item>
    <el-form-item label="操作人姓名" prop="userName">
      <el-input v-model="dataForm.userName" placeholder="操作人姓名"></el-input>
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
          preparedId: '',
          customerId: '',
          status: '',
          title: '',
          memo1: '',
          memo2: '',
          memo3: '',
          memo4: '',
          memo5: '',
          foundTime: '',
          userId: '',
          userName: ''
        },
        dataRule: {
          preparedId: [
            { required: true, message: '报备id不能为空', trigger: 'blur' }
          ],
          customerId: [
            { required: true, message: '客户id不能为空', trigger: 'blur' }
          ],
          status: [
            { required: true, message: '状态：中文不能为空', trigger: 'blur' }
          ],
          title: [
            { required: true, message: '状态的另一种叫法不能为空', trigger: 'blur' }
          ],
          memo1: [
            { required: true, message: '说明1不能为空', trigger: 'blur' }
          ],
          memo2: [
            { required: true, message: '说明2不能为空', trigger: 'blur' }
          ],
          memo3: [
            { required: true, message: '说明3不能为空', trigger: 'blur' }
          ],
          memo4: [
            { required: true, message: '说明4不能为空', trigger: 'blur' }
          ],
          memo5: [
            { required: true, message: '说明5不能为空', trigger: 'blur' }
          ],
          foundTime: [
            { required: true, message: '日志生成时间不能为空', trigger: 'blur' }
          ],
          userId: [
            { required: true, message: '操作人id不能为空', trigger: 'blur' }
          ],
          userName: [
            { required: true, message: '操作人姓名不能为空', trigger: 'blur' }
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
              url: this.$http.adornUrl(`/busi/customerstatuslog/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.preparedId = data.customerStatusLog.preparedId
                this.dataForm.customerId = data.customerStatusLog.customerId
                this.dataForm.status = data.customerStatusLog.status
                this.dataForm.title = data.customerStatusLog.title
                this.dataForm.memo1 = data.customerStatusLog.memo1
                this.dataForm.memo2 = data.customerStatusLog.memo2
                this.dataForm.memo3 = data.customerStatusLog.memo3
                this.dataForm.memo4 = data.customerStatusLog.memo4
                this.dataForm.memo5 = data.customerStatusLog.memo5
                this.dataForm.foundTime = data.customerStatusLog.foundTime
                this.dataForm.userId = data.customerStatusLog.userId
                this.dataForm.userName = data.customerStatusLog.userName
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
              url: this.$http.adornUrl(`/busi/customerstatuslog/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'preparedId': this.dataForm.preparedId,
                'customerId': this.dataForm.customerId,
                'status': this.dataForm.status,
                'title': this.dataForm.title,
                'memo1': this.dataForm.memo1,
                'memo2': this.dataForm.memo2,
                'memo3': this.dataForm.memo3,
                'memo4': this.dataForm.memo4,
                'memo5': this.dataForm.memo5,
                'foundTime': this.dataForm.foundTime,
                'userId': this.dataForm.userId,
                'userName': this.dataForm.userName
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
