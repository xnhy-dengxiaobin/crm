<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="客户名称" prop="name">
      <el-input v-model="dataForm.name" placeholder="客户名称"></el-input>
    </el-form-item>
    <el-form-item label="性别" prop="sex">
      <el-input v-model="dataForm.sex" placeholder="性别"></el-input>
    </el-form-item>
    <el-form-item label="手机" prop="mobile">
      <el-input v-model="dataForm.mobile" placeholder="手机"></el-input>
    </el-form-item>
    <el-form-item label="手机1" prop="mobile1">
      <el-input v-model="dataForm.mobile1" placeholder="手机1"></el-input>
    </el-form-item>
    <el-form-item label="手机2" prop="mobile2">
      <el-input v-model="dataForm.mobile2" placeholder="手机2"></el-input>
    </el-form-item>
    <el-form-item label="手机3" prop="mobile3">
      <el-input v-model="dataForm.mobile3" placeholder="手机3"></el-input>
    </el-form-item>
    <el-form-item label="意向楼ID" prop="projectId">
      <el-input v-model="dataForm.projectId" placeholder="意向楼ID"></el-input>
    </el-form-item>
    <el-form-item label="中介销售ID" prop="userId">
      <el-input v-model="dataForm.userId" placeholder="中介销售ID"></el-input>
    </el-form-item>
    <el-form-item label="状态" prop="status">
      <el-input v-model="dataForm.status" placeholder="状态"></el-input>
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
          name: '',
          sex: '',
          mobile: '',
          mobile1: '',
          mobile2: '',
          mobile3: '',
          projectId: '',
          userId: '',
          status: ''
        },
        dataRule: {
          name: [
            { required: true, message: '客户名称不能为空', trigger: 'blur' }
          ],
          sex: [
            { required: true, message: '性别不能为空', trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: '手机不能为空', trigger: 'blur' }
          ],
          mobile1: [
            { required: true, message: '手机1不能为空', trigger: 'blur' }
          ],
          mobile2: [
            { required: true, message: '手机2不能为空', trigger: 'blur' }
          ],
          mobile3: [
            { required: true, message: '手机3不能为空', trigger: 'blur' }
          ],
          projectId: [
            { required: true, message: '意向楼ID不能为空', trigger: 'blur' }
          ],
          userId: [
            { required: true, message: '中介销售ID不能为空', trigger: 'blur' }
          ],
          status: [
            { required: true, message: '状态不能为空', trigger: 'blur' }
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
              url: this.$http.adornUrl(`/busi/prepare/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.name = data.prepare.name
                this.dataForm.sex = data.prepare.sex
                this.dataForm.mobile = data.prepare.mobile
                this.dataForm.mobile1 = data.prepare.mobile1
                this.dataForm.mobile2 = data.prepare.mobile2
                this.dataForm.mobile3 = data.prepare.mobile3
                this.dataForm.projectId = data.prepare.projectId
                this.dataForm.userId = data.prepare.userId
                this.dataForm.status = data.prepare.status
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
              url: this.$http.adornUrl(`/busi/prepare/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'name': this.dataForm.name,
                'sex': this.dataForm.sex,
                'mobile': this.dataForm.mobile,
                'mobile1': this.dataForm.mobile1,
                'mobile2': this.dataForm.mobile2,
                'mobile3': this.dataForm.mobile3,
                'projectId': this.dataForm.projectId,
                'userId': this.dataForm.userId,
                'status': this.dataForm.status
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
