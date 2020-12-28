<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="昵称" prop="nickName">
      <el-input v-model="dataForm.nickName" placeholder="昵称"></el-input>
    </el-form-item>
    <el-form-item label="fileid" prop="fileid">
      <el-input v-model="dataForm.fileid" placeholder="fileid"></el-input>
    </el-form-item>
    <el-form-item label="类型" prop="contenttype">
      <el-input v-model="dataForm.contenttype" placeholder="类型"></el-input>
    </el-form-item>
    <el-form-item label="文件名称" prop="filename">
      <el-input v-model="dataForm.filename" placeholder="文件名称"></el-input>
    </el-form-item>
    <el-form-item label="路径" prop="dirId">
      <el-input v-model="dataForm.dirId" placeholder="路径"></el-input>
    </el-form-item>
    <el-form-item label="url" prop="url">
      <el-input v-model="dataForm.url" placeholder="url"></el-input>
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
          unionId: 0,
          nickName: '',
          fileid: '',
          contenttype: '',
          filename: '',
          dirId: '',
          url: ''
        },
        dataRule: {
          nickName: [
            { required: true, message: '昵称不能为空', trigger: 'blur' }
          ],
          fileid: [
            { required: true, message: 'fileid不能为空', trigger: 'blur' }
          ],
          contenttype: [
            { required: true, message: '类型不能为空', trigger: 'blur' }
          ],
          filename: [
            { required: true, message: '文件名称不能为空', trigger: 'blur' }
          ],
          dirId: [
            { required: true, message: '路径不能为空', trigger: 'blur' }
          ],
          url: [
            { required: true, message: 'url不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.unionId = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.unionId) {
            this.$http({
              url: this.$http.adornUrl(`/busi/wxuserqr/info/${this.dataForm.unionId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.nickName = data.wxuserQr.nickName
                this.dataForm.fileid = data.wxuserQr.fileid
                this.dataForm.contenttype = data.wxuserQr.contenttype
                this.dataForm.filename = data.wxuserQr.filename
                this.dataForm.dirId = data.wxuserQr.dirId
                this.dataForm.url = data.wxuserQr.url
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
              url: this.$http.adornUrl(`/busi/wxuserqr/${!this.dataForm.unionId ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'unionId': this.dataForm.unionId || undefined,
                'nickName': this.dataForm.nickName,
                'fileid': this.dataForm.fileid,
                'contenttype': this.dataForm.contenttype,
                'filename': this.dataForm.filename,
                'dirId': this.dataForm.dirId,
                'url': this.dataForm.url
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
