<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="房间id room_id" prop="roomId">
      <el-input v-model="dataForm.roomId" placeholder="房间id room_id"></el-input>
    </el-form-item>
    <el-form-item label="建筑面积 bldarea" prop="floorArea">
      <el-input v-model="dataForm.floorArea" placeholder="建筑面积 bldarea"></el-input>
    </el-form-item>
    <el-form-item label="套内面积 tnarea" prop="insideFloorArea">
      <el-input v-model="dataForm.insideFloorArea" placeholder="套内面积 tnarea"></el-input>
    </el-form-item>
    <el-form-item label="建筑单价 price" prop="floorAreaPrice">
      <el-input v-model="dataForm.floorAreaPrice" placeholder="建筑单价 price"></el-input>
    </el-form-item>
    <el-form-item label="套内单价 tnprice" prop="insideFloorAreaPrice">
      <el-input v-model="dataForm.insideFloorAreaPrice" placeholder="套内单价 tnprice"></el-input>
    </el-form-item>
    <el-form-item label="标准总价 total" prop="totalPrices">
      <el-input v-model="dataForm.totalPrices" placeholder="标准总价 total"></el-input>
    </el-form-item>
    <el-form-item label="计价模式：按建筑面积，按套内面积" prop="calMode">
      <el-input v-model="dataForm.calMode" placeholder="计价模式：按建筑面积，按套内面积"></el-input>
    </el-form-item>
    <el-form-item label="付款方式" prop="payForm">
      <el-input v-model="dataForm.payForm" placeholder="付款方式"></el-input>
    </el-form-item>
    <el-form-item label="折扣" prop="discount">
      <el-input v-model="dataForm.discount" placeholder="折扣"></el-input>
    </el-form-item>
    <el-form-item label="折扣后建筑单价 price" prop="floorAreaPriceDs">
      <el-input v-model="dataForm.floorAreaPriceDs" placeholder="折扣后建筑单价 price"></el-input>
    </el-form-item>
    <el-form-item label="折扣后套内单价 tnprice" prop="insideFloorAreaPriceDs">
      <el-input v-model="dataForm.insideFloorAreaPriceDs" placeholder="折扣后套内单价 tnprice"></el-input>
    </el-form-item>
    <el-form-item label="折扣后总价 total" prop="totalPricesDs">
      <el-input v-model="dataForm.totalPricesDs" placeholder="折扣后总价 total"></el-input>
    </el-form-item>
    <el-form-item label="按揭银行 ajbank" prop="mortgateBank">
      <el-input v-model="dataForm.mortgateBank" placeholder="按揭银行 ajbank"></el-input>
    </el-form-item>
    <el-form-item label="按揭金额 ajtotal" prop="mortgateTotal">
      <el-input v-model="dataForm.mortgateTotal" placeholder="按揭金额 ajtotal"></el-input>
    </el-form-item>
    <el-form-item label="按揭年限 ajyear" prop="mortgateYear">
      <el-input v-model="dataForm.mortgateYear" placeholder="按揭年限 ajyear"></el-input>
    </el-form-item>
    <el-form-item label="公积金银行" prop="hfBank">
      <el-input v-model="dataForm.hfBank" placeholder="公积金银行"></el-input>
    </el-form-item>
    <el-form-item label="公积金总额" prop="hfTotal">
      <el-input v-model="dataForm.hfTotal" placeholder="公积金总额"></el-input>
    </el-form-item>
    <el-form-item label="公积金年限" prop="hfYear">
      <el-input v-model="dataForm.hfYear" placeholder="公积金年限"></el-input>
    </el-form-item>
    <el-form-item label="是否有效" prop="isValid">
      <el-input v-model="dataForm.isValid" placeholder="是否有效"></el-input>
    </el-form-item>
    <el-form-item label="订单类型" prop="type">
      <el-input v-model="dataForm.type" placeholder="订单类型"></el-input>
    </el-form-item>
    <el-form-item label="房间guid" prop="roomGuid">
      <el-input v-model="dataForm.roomGuid" placeholder="房间guid"></el-input>
    </el-form-item>
    <el-form-item label="生成时间" prop="createdTime">
      <el-input v-model="dataForm.createdTime" placeholder="生成时间"></el-input>
    </el-form-item>
    <el-form-item label="订单guid" prop="guid">
      <el-input v-model="dataForm.guid" placeholder="订单guid"></el-input>
    </el-form-item>
    <el-form-item label="0：资料已收齐，1：资料未收齐" prop="dataPrepared">
      <el-input v-model="dataForm.dataPrepared" placeholder="0：资料已收齐，1：资料未收齐"></el-input>
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
          roomId: '',
          floorArea: '',
          insideFloorArea: '',
          floorAreaPrice: '',
          insideFloorAreaPrice: '',
          totalPrices: '',
          calMode: '',
          payForm: '',
          discount: '',
          floorAreaPriceDs: '',
          insideFloorAreaPriceDs: '',
          totalPricesDs: '',
          mortgateBank: '',
          mortgateTotal: '',
          mortgateYear: '',
          hfBank: '',
          hfTotal: '',
          hfYear: '',
          isValid: '',
          type: '',
          roomGuid: '',
          createdTime: '',
          guid: '',
          dataPrepared: ''
        },
        dataRule: {
          roomId: [
            { required: true, message: '房间id room_id不能为空', trigger: 'blur' }
          ],
          floorArea: [
            { required: true, message: '建筑面积 bldarea不能为空', trigger: 'blur' }
          ],
          insideFloorArea: [
            { required: true, message: '套内面积 tnarea不能为空', trigger: 'blur' }
          ],
          floorAreaPrice: [
            { required: true, message: '建筑单价 price不能为空', trigger: 'blur' }
          ],
          insideFloorAreaPrice: [
            { required: true, message: '套内单价 tnprice不能为空', trigger: 'blur' }
          ],
          totalPrices: [
            { required: true, message: '标准总价 total不能为空', trigger: 'blur' }
          ],
          calMode: [
            { required: true, message: '计价模式：按建筑面积，按套内面积不能为空', trigger: 'blur' }
          ],
          payForm: [
            { required: true, message: '付款方式', trigger: 'blur' }
          ],
          discount: [
            { required: true, message: '折扣不能为空', trigger: 'blur' }
          ],
          floorAreaPriceDs: [
            { required: true, message: '折扣后建筑单价 price不能为空', trigger: 'blur' }
          ],
          insideFloorAreaPriceDs: [
            { required: true, message: '折扣后套内单价 tnprice不能为空', trigger: 'blur' }
          ],
          totalPricesDs: [
            { required: true, message: '折扣后总价 total不能为空', trigger: 'blur' }
          ],
          mortgateBank: [
            { required: true, message: '按揭银行 ajbank不能为空', trigger: 'blur' }
          ],
          mortgateTotal: [
            { required: true, message: '按揭金额 ajtotal不能为空', trigger: 'blur' }
          ],
          mortgateYear: [
            { required: true, message: '按揭年限 ajyear不能为空', trigger: 'blur' }
          ],
          hfBank: [
            { required: true, message: '公积金银行不能为空', trigger: 'blur' }
          ],
          hfTotal: [
            { required: true, message: '公积金总额不能为空', trigger: 'blur' }
          ],
          hfYear: [
            { required: true, message: '公积金年限不能为空', trigger: 'blur' }
          ],
          isValid: [
            { required: true, message: '是否有效不能为空', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '订单类型', trigger: 'blur' }
          ],
          roomGuid: [
            { required: true, message: '房间guid不能为空', trigger: 'blur' }
          ],
          createdTime: [
            { required: true, message: '生成时间不能为空', trigger: 'blur' }
          ],
          guid: [
            { required: true, message: '订单guid不能为空', trigger: 'blur' }
          ],
          dataPrepared: [
            { required: true, message: '0：资料已收齐，1：资料未收齐不能为空', trigger: 'blur' }
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
              url: this.$http.adornUrl(`/busi/busiorder/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.roomId = data.busiOrder.roomId
                this.dataForm.floorArea = data.busiOrder.floorArea
                this.dataForm.insideFloorArea = data.busiOrder.insideFloorArea
                this.dataForm.floorAreaPrice = data.busiOrder.floorAreaPrice
                this.dataForm.insideFloorAreaPrice = data.busiOrder.insideFloorAreaPrice
                this.dataForm.totalPrices = data.busiOrder.totalPrices
                this.dataForm.calMode = data.busiOrder.calMode
                this.dataForm.payForm = data.busiOrder.payForm
                this.dataForm.discount = data.busiOrder.discount
                this.dataForm.floorAreaPriceDs = data.busiOrder.floorAreaPriceDs
                this.dataForm.insideFloorAreaPriceDs = data.busiOrder.insideFloorAreaPriceDs
                this.dataForm.totalPricesDs = data.busiOrder.totalPricesDs
                this.dataForm.mortgateBank = data.busiOrder.mortgateBank
                this.dataForm.mortgateTotal = data.busiOrder.mortgateTotal
                this.dataForm.mortgateYear = data.busiOrder.mortgateYear
                this.dataForm.hfBank = data.busiOrder.hfBank
                this.dataForm.hfTotal = data.busiOrder.hfTotal
                this.dataForm.hfYear = data.busiOrder.hfYear
                this.dataForm.isValid = data.busiOrder.isValid
                this.dataForm.type = data.busiOrder.type
                this.dataForm.roomGuid = data.busiOrder.roomGuid
                this.dataForm.createdTime = data.busiOrder.createdTime
                this.dataForm.guid = data.busiOrder.guid
                this.dataForm.dataPrepared = data.busiOrder.dataPrepared
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
              url: this.$http.adornUrl(`/busi/busiorder/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'roomId': this.dataForm.roomId,
                'floorArea': this.dataForm.floorArea,
                'insideFloorArea': this.dataForm.insideFloorArea,
                'floorAreaPrice': this.dataForm.floorAreaPrice,
                'insideFloorAreaPrice': this.dataForm.insideFloorAreaPrice,
                'totalPrices': this.dataForm.totalPrices,
                'calMode': this.dataForm.calMode,
                'payForm': this.dataForm.payForm,
                'discount': this.dataForm.discount,
                'floorAreaPriceDs': this.dataForm.floorAreaPriceDs,
                'insideFloorAreaPriceDs': this.dataForm.insideFloorAreaPriceDs,
                'totalPricesDs': this.dataForm.totalPricesDs,
                'mortgateBank': this.dataForm.mortgateBank,
                'mortgateTotal': this.dataForm.mortgateTotal,
                'mortgateYear': this.dataForm.mortgateYear,
                'hfBank': this.dataForm.hfBank,
                'hfTotal': this.dataForm.hfTotal,
                'hfYear': this.dataForm.hfYear,
                'isValid': this.dataForm.isValid,
                'type': this.dataForm.type,
                'roomGuid': this.dataForm.roomGuid,
                'createdTime': this.dataForm.createdTime,
                'guid': this.dataForm.guid,
                'dataPrepared': this.dataForm.dataPrepared
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
