<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.key" placeholder="参数名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <!--<el-button v-if="isAuth('busi:busihouse:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>-->
        <!--<el-button v-if="isAuth('busi:busihouse:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>-->
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
        prop="projectName"
        header-align="center"
        align="center"
        label="项目名称">
      </el-table-column>
      <el-table-column
        prop="groupName"
        header-align="center"
        align="center"
        label="组名">
      </el-table-column>
      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        label="房间名称">
      </el-table-column>
      <el-table-column
        prop="houseType"
        header-align="center"
        align="center"
        label="户型">
      </el-table-column>
      <el-table-column
        prop="houseStructure"
        header-align="center"
        align="center"
        label="房间结构">
      </el-table-column>
      <el-table-column
        prop="floor"
        header-align="center"
        align="center"
        label="楼层">
      </el-table-column>
      <el-table-column
        prop="orientation"
        header-align="center"
        align="center"
        label="朝向">
      </el-table-column>
      <el-table-column
        prop="floorArea"
        header-align="center"
        align="center"
        label="建筑面积">
      </el-table-column>
      <el-table-column
        prop="insideFloorArea"
        header-align="center"
        align="center"
        label="套内面积">
      </el-table-column>
      <el-table-column
        prop="floorAreaPrice"
        header-align="center"
        align="center"
        label="建筑单价">
      </el-table-column>
      <el-table-column
        prop="insideFloorAreaPrice"
        header-align="center"
        align="center"
        label="套内单价">
      </el-table-column>
      <el-table-column
        prop="totalPrices"
        header-align="center"
        align="center"
        label="标准总价">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="状态">
        <template slot-scope="scope">
          <p v-if="scope.row.status == '1'">待售</p>
          <p v-if="scope.row.status == '10'">销控</p>
          <p v-if="scope.row.status == '20'">认购</p>
          <p v-if="scope.row.status == '30'">签约</p>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        label="创建时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="" @click="queryLogs(scope.row)">销控记录</el-button>
          <el-button type="text" size="small" @click="" v-if="scope.row.status == '1'" @click="toControl(scope.row)">设置销控</el-button>
          <el-button style="color: red" type="text" size="small" v-if="scope.row.status == '10'" @click="doCancel(scope.row)">取消销控</el-button>
          <!--<el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>-->
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
    <el-dialog title="销控说明" :visible.sync="controlDialogVisible">
      <el-input
        type="textarea"
        :rows="5"
        placeholder="请输入说明"
        v-model="remark">
      </el-input>
      <span slot="footer" class="dialog-footer">
      <el-button @click="controlDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="doControl(1)">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="销控记录" :visible.sync="logDialogVisible">
      <el-timeline>
        <el-timeline-item v-for="(item, index) in logs" :key="index" :timestamp="item.createTime" placement="top">
          <el-card>
            <h4>{{item.controlStatus == 1?'设置销控':'取消销控'}}</h4>
            <p>操作人：{{item.createName}} </p>
            <p>原因：{{item.remark}} </p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './busihouse-add-or-update'
  export default {
    data () {
      return {
        remark: "",
        controlDialogVisible: false,
        logDialogVisible: false,
        dataForm: {
          key: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        row: {},
        logs: []
      }
    },
    components: {
      AddOrUpdate
    },
    activated () {
      this.getDataList()
    },
    methods: {
      queryLogs(row) {
        this.logDialogVisible = true
        this.$http({
          url: this.$http.adornUrl('/busi/busicontrollog/listAllByHouseId/' + row.id),
          method: 'get',
          params: {}
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.logs = data.list
          } else {
            this.logs = []
          }
        })
      },
      doCancel(row) {
        this.$confirm(`确认取消销控?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.row = row
          this.doControl(0)
        })
      },
      doControl(status) {
        this.$http({
          url: this.$http.adornUrl(`/busi/busicontrollog/save`),
          method: 'post',
          data: this.$http.adornData({
            'houseId': this.row.id,
            'remark': this.remark,
            'controlStatus': status
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataList()
                this.controlDialogVisible = false
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      toControl(row) {
        this.controlDialogVisible = true;
        this.row = row
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/busi/busihouse/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'key': this.dataForm.key
          })
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
            url: this.$http.adornUrl('/busi/busihouse/delete'),
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
