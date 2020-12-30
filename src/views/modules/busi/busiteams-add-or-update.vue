<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="" prop="teamName">
      <el-input v-model="dataForm.teamName" placeholder="团队名称"></el-input>
    </el-form-item>
    <el-form-item>
      <el-select v-model="dataForm.area" clearable placeholder="区域">
        <el-option
          v-for="item in areas"
          :key="item.value"
          :label="item.value"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <!--<el-form-item label="" prop="projectId">-->
      <!--<el-input v-model="dataForm.projectId" placeholder=""></el-input>-->
    <!--</el-form-item>-->
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
        areas: [],
        visible: false,
        dataForm: {
          id: 0,
          teamName: '',
          projectId: '',
          area: ''
        },
        dataRule: {
          teamName: [
            { required: true, message: '名称不能为空', trigger: 'blur' },
            { required: true, area: '区域不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    activated () {
      this.getArea()
    },
    methods: {
      getArea() {
        this.$http({
          url: this.$http.adornUrl("/busi/syssetup/listByKey?key=区域"),
          method: "get",
          params: {},
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.areas = data.list
          }
        });
      },
      init (id) {
        this.dataForm = {
          id: 0,
          teamName: '',
          projectId: '',
          area: ''
        }
        this.getArea()
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/busi/busiteams/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.teamName = data.busiTeams.teamName
                this.dataForm.projectId = data.busiTeams.projectId
                this.dataForm.area = data.busiTeams.area
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
              url: this.$http.adornUrl(`/busi/busiteams/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'teamName': this.dataForm.teamName,
                'area': this.dataForm.area
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
