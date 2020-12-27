<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="房间名称" prop="name">
      <el-input v-model="dataForm.name" placeholder="房间名称"></el-input>
    </el-form-item>
    <el-form-item label="户型" prop="houseType">
      <el-input v-model="dataForm.houseType" placeholder="户型"></el-input>
    </el-form-item>
    <el-form-item label="房间结构" prop="houseStructure">
      <el-input v-model="dataForm.houseStructure" placeholder="房间结构"></el-input>
    </el-form-item>
    <el-form-item label="楼层" prop="floor">
      <el-input v-model="dataForm.floor" placeholder="楼层"></el-input>
    </el-form-item>
    <el-form-item label="朝向" prop="orientation">
      <el-input v-model="dataForm.orientation" placeholder="朝向"></el-input>
    </el-form-item>
    <el-form-item label="建筑面积" prop="floorArea">
      <el-input v-model="dataForm.floorArea" placeholder="建筑面积"></el-input>
    </el-form-item>
    <el-form-item label="套内面积" prop="insideFloorArea">
      <el-input v-model="dataForm.insideFloorArea" placeholder="套内面积"></el-input>
    </el-form-item>
    <el-form-item label="建筑单价" prop="floorAreaPrice">
      <el-input v-model="dataForm.floorAreaPrice" placeholder="建筑单价"></el-input>
    </el-form-item>
    <el-form-item label="套内单价" prop="insideFloorAreaPrice">
      <el-input v-model="dataForm.insideFloorAreaPrice" placeholder="套内单价"></el-input>
    </el-form-item>
    <el-form-item label="标准总价" prop="totalPrices">
      <el-input v-model="dataForm.totalPrices" placeholder="标准总价"></el-input>
    </el-form-item>
    <el-form-item label="状态" prop="status">
      <el-input v-model="dataForm.status" placeholder="状态"></el-input>
    </el-form-item>
    <el-form-item label="项目id" prop="projectId">
      <el-input v-model="dataForm.projectId" placeholder="项目id"></el-input>
    </el-form-item>
    <el-form-item label="创建时间" prop="createTime">
      <el-input v-model="dataForm.createTime" placeholder="创建时间"></el-input>
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
          houseType: '',
          houseStructure: '',
          floor: '',
          orientation: '',
          floorArea: '',
          insideFloorArea: '',
          floorAreaPrice: '',
          insideFloorAreaPrice: '',
          totalPrices: '',
          status: '',
          projectId: '',
          createTime: ''
        },
        dataRule: {
          name: [
            { required: true, message: '房间名称不能为空', trigger: 'blur' }
          ],
          houseType: [
            { required: true, message: '户型不能为空', trigger: 'blur' }
          ],
          houseStructure: [
            { required: true, message: '房间结构不能为空', trigger: 'blur' }
          ],
          floor: [
            { required: true, message: '楼层不能为空', trigger: 'blur' }
          ],
          orientation: [
            { required: true, message: '朝向不能为空', trigger: 'blur' }
          ],
          floorArea: [
            { required: true, message: '建筑面积不能为空', trigger: 'blur' }
          ],
          insideFloorArea: [
            { required: true, message: '套内面积不能为空', trigger: 'blur' }
          ],
          floorAreaPrice: [
            { required: true, message: '建筑单价不能为空', trigger: 'blur' }
          ],
          insideFloorAreaPrice: [
            { required: true, message: '套内单价不能为空', trigger: 'blur' }
          ],
          totalPrices: [
            { required: true, message: '标准总价不能为空', trigger: 'blur' }
          ],
          status: [
            { required: true, message: '状态不能为空', trigger: 'blur' }
          ],
          projectId: [
            { required: true, message: '项目id不能为空', trigger: 'blur' }
          ],
          createTime: [
            { required: true, message: '创建时间不能为空', trigger: 'blur' }
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
              url: this.$http.adornUrl(`/busi/busihouse/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.name = data.busiHouse.name
                this.dataForm.houseType = data.busiHouse.houseType
                this.dataForm.houseStructure = data.busiHouse.houseStructure
                this.dataForm.floor = data.busiHouse.floor
                this.dataForm.orientation = data.busiHouse.orientation
                this.dataForm.floorArea = data.busiHouse.floorArea
                this.dataForm.insideFloorArea = data.busiHouse.insideFloorArea
                this.dataForm.floorAreaPrice = data.busiHouse.floorAreaPrice
                this.dataForm.insideFloorAreaPrice = data.busiHouse.insideFloorAreaPrice
                this.dataForm.totalPrices = data.busiHouse.totalPrices
                this.dataForm.status = data.busiHouse.status
                this.dataForm.projectId = data.busiHouse.projectId
                this.dataForm.createTime = data.busiHouse.createTime
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
              url: this.$http.adornUrl(`/busi/busihouse/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'name': this.dataForm.name,
                'houseType': this.dataForm.houseType,
                'houseStructure': this.dataForm.houseStructure,
                'floor': this.dataForm.floor,
                'orientation': this.dataForm.orientation,
                'floorArea': this.dataForm.floorArea,
                'insideFloorArea': this.dataForm.insideFloorArea,
                'floorAreaPrice': this.dataForm.floorAreaPrice,
                'insideFloorAreaPrice': this.dataForm.insideFloorAreaPrice,
                'totalPrices': this.dataForm.totalPrices,
                'status': this.dataForm.status,
                'projectId': this.dataForm.projectId,
                'createTime': this.dataForm.createTime
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
