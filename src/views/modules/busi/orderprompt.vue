<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="search()">
      <el-form-item>
        <el-input v-model="dataForm.condition" placeholder="名称/电话" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="search()">查询</el-button>
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
        prop="customerInfo"
        header-align="center"
        align="center"
        label="客户">
      </el-table-column>
      <el-table-column
        prop="orderId"
        header-align="center"
        align="center"
        label="订单ID">
      </el-table-column>
      <el-table-column
        prop="floorArea"
        header-align="center"
        align="center"
        label="面积">
      </el-table-column>
      <el-table-column
        prop="totalPricesDs"
        header-align="center"
        align="center"
        label="总价">
      </el-table-column>
      <el-table-column
        prop="payForm"
        header-align="center"
        align="center"
        label="付款方式">
      </el-table-column>
      <el-table-column
        prop="type"
        header-align="center"
        align="center"
        label="类型">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="complete(scope.row.orderId)">资料收齐</el-button>
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
    <!-- 弹窗, 新增 / 修改
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>-->
  </div>
</template>

<script>
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
        dataForm: {
          condition: '',
          matchUserId: '',
          followDate: [],
          addDate: [],
          checkTypes: []
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        sales: [],
        followTypes: []
      }
    },
    components: {

    },
    activated () {
      this.getDataList()
      this.getSalesAll()
      this.getType()
    },
    methods: {
      empty() {
        this.dataForm = {
          condition: '',
          matchUserId: '',
          followDate: [],
          addDate: [],
          checkTypes: []
        }
        this.getDataList()
      },
      getType() {
        this.$http({
          url: this.$http.adornUrl("/busi/syssetup/listByKey?key=跟进方式"),
          method: "get",
          params: {},
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.followTypes = data.list
          }
        });
      },
      getSalesAll() {
        this.$http({
          url: this.$http.adornUrl("/sys/user/salesAll"),
          method: "get",
          params: {},
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.sales = data.list;
          }
        });
      },
      search() {
        this.getDataList();
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.dataForm.page = this.pageIndex
        this.dataForm.limit = this.pageSize
        this.$http({
          url: this.$http.adornUrl('/busi/busiorder/dataPreparedList'),
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
      // 删除
      complete (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定[id=${ids.join(',')}][${id ? '资料已收齐' : '资料已收齐'}]?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/busi/busiorder/complete'),
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
