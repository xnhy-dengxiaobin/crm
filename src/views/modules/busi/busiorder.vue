<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.house" placeholder="房间名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        生成日期：
        <el-date-picker
          v-model="dataForm.createdDate"
          type="daterange"
          align="right"
          unlink-panels
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="search()">查询</el-button>
        <!--<el-button v-if="isAuth('busi:busiorder:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>-->
        <!--<el-button v-if="isAuth('busi:busiorder:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>-->
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        width="130"
        prop="name"
        header-align="center"
        align="center"
        label="房间">
      </el-table-column>
      <el-table-column
        width="140"
        prop="customerInfo"
        header-align="center"
        align="center"
        label="客户">
      </el-table-column>
      <!--<el-table-column-->
        <!--prop="insideFloorArea"-->
        <!--header-align="center"-->
        <!--align="center"-->
        <!--label="套内面积">-->
      <!--</el-table-column>-->
      <!--<el-table-column-->
        <!--prop="floorAreaPrice"-->
        <!--header-align="center"-->
        <!--align="center"-->
        <!--label="建筑单价">-->
      <!--</el-table-column>-->
      <!--<el-table-column-->
        <!--prop="insideFloorAreaPrice"-->
        <!--header-align="center"-->
        <!--align="center"-->
        <!--label="套内单价">-->
      <!--</el-table-column>-->
      <!--<el-table-column-->
        <!--prop="totalPrices"-->
        <!--header-align="center"-->
        <!--align="center"-->
        <!--label="标准总价">-->
      <!--</el-table-column>-->
      <el-table-column
        prop="calMode"
        header-align="center"
        align="center"
        label="计价模式">
      </el-table-column>
      <el-table-column
        prop="payForm"
        header-align="center"
        align="center"
        label="付款方式">
      </el-table-column>
      <el-table-column
        prop="discount"
        header-align="center"
        align="center"
        label="折扣">
      </el-table-column>
      <el-table-column
        prop="floorAreaPriceDs"
        header-align="center"
        align="center"
        label="建筑单价">
      </el-table-column>
      <el-table-column
        prop="insideFloorAreaPriceDs"
        header-align="center"
        align="center"
        label="套内单价">
      </el-table-column>
      <el-table-column
        prop="totalPricesDs"
        header-align="center"
        align="center"
        label="总价">
      </el-table-column>
      <!--<el-table-column-->
        <!--prop="mortgateBank"-->
        <!--header-align="center"-->
        <!--align="center"-->
        <!--label="按揭银行">-->
      <!--</el-table-column>-->
      <!--<el-table-column-->
        <!--prop="mortgateTotal"-->
        <!--header-align="center"-->
        <!--align="center"-->
        <!--label="按揭金额">-->
      <!--</el-table-column>-->
      <!--<el-table-column-->
        <!--prop="mortgateYear"-->
        <!--header-align="center"-->
        <!--align="center"-->
        <!--label="按揭年限">-->
      <!--</el-table-column>-->
      <!--<el-table-column-->
        <!--prop="hfBank"-->
        <!--header-align="center"-->
        <!--align="center"-->
        <!--label="公积金银行">-->
      <!--</el-table-column>-->
      <!--<el-table-column-->
        <!--prop="hfTotal"-->
        <!--header-align="center"-->
        <!--align="center"-->
        <!--label="公积金总额">-->
      <!--</el-table-column>-->
      <!--<el-table-column-->
        <!--prop="hfYear"-->
        <!--header-align="center"-->
        <!--align="center"-->
        <!--label="公积金年限">-->
      <!--</el-table-column>-->
      <el-table-column
        prop="isValid"
        header-align="center"
        align="center"
        label="是否有效">
        <template slot-scope="scope">
          {{scope.row.isValid == 1? '有效': '无效'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="type"
        header-align="center"
        align="center"
        label="订单类型">
      </el-table-column>
      <!--<el-table-column-->
        <!--prop="roomGuid"-->
        <!--header-align="center"-->
        <!--align="center"-->
        <!--label="房间guid">-->
      <!--</el-table-column>-->
      <el-table-column
        prop="createdTime"
        header-align="center"
        align="center"
        label="生成时间">
      </el-table-column>
      <!--<el-table-column-->
        <!--prop="guid"-->
        <!--header-align="center"-->
        <!--align="center"-->
        <!--label="订单guid">-->
      <!--</el-table-column>-->
      <!--<el-table-column-->
        <!--prop="dataPrepared"-->
        <!--header-align="center"-->
        <!--align="center"-->
        <!--label="0：资料已收齐，1：资料未收齐">-->
      <!--</el-table-column>-->
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="toRelevance(scope.row.id)" v-if="!scope.row.customerInfo">关联客户</el-button>
          <el-button type="text" size="small" @click="toRelevance(scope.row.id)" v-if="scope.row.customerInfo">重新关联</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <el-dialog title="绑定关系客户" :visible.sync="relevanceDialog">
      <div style="margin-bottom: 15px;">
        <el-input style="width: 50%" v-model="mobilePhone" placeholder="完整手机号" clearable></el-input>
        <el-button @click="doQueryUser()">查询</el-button>
      </div>
      <div v-for="(item, index) in customerListSelections" :key="index" style="font-size: 20px;">
          客户名称：{{item.name}}-客户手机：{{item.mobilePhone}} <i class="el-icon-remove-outline" style="color:red" @click="toDel(index)"></i>
      </div>
      <p></p>
      <el-table
        :data="customerList"
        border
        v-loading="customerListLoading"
        style="width: 100%;">
        <el-table-column
          prop="name"
          header-align="center"
          align="center"
          label="客户名称">
        </el-table-column>
        <el-table-column
          prop="mobilePhone"
          header-align="center"
          align="center"
          label="手机号">
        </el-table-column>
        <el-table-column
          fixed="right"
          header-align="center"
          align="center"
          width="150"
          label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="xuanzhe(scope.row)">关联客户</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: center; margin-top: 28px;"><el-button  type="primary" @click="doRelevance" style="">保存</el-button></div>
    </el-dialog>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './busiorder-add-or-update'
  export default {
    data () {
      return {
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        mobilePhone: '',
        relevanceDialog: false,
        dataForm: {
          condition: '',
          house: '',
          createdDate: []
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        customerListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        customerListSelections: [],
        customerList: [],
        selectId: ''
      }
    },
    components: {
      AddOrUpdate
    },
    activated () {
      this.getDataList()
    },
    methods: {
      search() {
        this.getDataList();
      },
      doRelevance() {
        var paramList = []
        for (var index in this.customerListSelections) {
          paramList.push(this.customerListSelections[index].id)
        }
        this.$confirm(`确定绑定操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/busi/busiorder/relevance'),
            method: 'post',
            data: this.$http.adornData({
              orderId: this.selectId,
              customerList: paramList
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.customerListSelections = []
                  this.customerList = []
                  this.selectId = ''
                  this.getDataList()
                  this.relevanceDialog = false
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      },
      toDel(index) {
        this.customerListSelections.splice(index, 1);
      },
      xuanzhe (row) {
        var isExist = false
        for (var index in this.customerListSelections) {
          if (this.customerListSelections[index].id === row.id) {
            isExist = true
            break
          }
        }
        if (isExist) {
          this.$message.error('已选择此用户')
          return
        }
        this.customerListSelections.push(row)
      },
      doQueryUser() {
        if (this.mobilePhone.length !== 11) {
          this.$message.error("请输入完整手机号！")
          return
        }
        this.customerListLoading = true
        this.$http({
          url: this.$http.adornUrl('/busi/busicustomer/listByPhone'),
          method: 'post',
          data: this.$http.adornData({
            'mobilePhone': this.mobilePhone
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.customerList = data.customers
          } else {
            this.customerList = []
          }
          this.customerListLoading = false
        })
      },
      toRelevance(id) {
        this.selectId = id
        this.relevanceDialog = true;
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.dataForm.page = this.pageIndex
        this.dataForm.limit = this.pageSize
        this.$http({
          url: this.$http.adornUrl('/busi/busiorder/list'),
          method: 'post',
          data: this.$http.adornData(this.dataForm)
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.totalPage = data.page.totalCount
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 删除
      deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/busi/busiorder/delete'),
            method: 'post',
            data: this.$http.adornData(ids, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      }
    }
  }
</script>
