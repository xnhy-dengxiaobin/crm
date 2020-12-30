<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <!--<el-input v-model="dataForm.key" placeholder="参数名" clearable></el-input>-->
      <el-form-item>
        <el-select v-model="dataForm.projectId"
                   @change="selectProject()" clearable placeholder="项目">
          <el-option
            v-for="item in projectList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.dong"  @change="selectDong()"
                   clearable placeholder="楼栋">
          <el-option
            v-for="item in dongList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-select v-model="dataForm.unit"
                   clearable placeholder="单元">
          <el-option
            v-for="item in unitList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.control"
                   clearable placeholder="是否预销控">
          <el-option
            v-for="item in controlList"
            :key="item.value"
            :label="item.name"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="search()">查询</el-button>
        <el-button v-if="isAuth('busi:busihouse:save')" type="primary" @click="toControl()">批量预销控</el-button>
        <el-button v-if="isAuth('busi:busihouse:save')" type="dark" @click="doCancel()">批量取消预销控</el-button>
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
        prop="name"
        header-align="center"
        align="center"
        label="房间名称">
      </el-table-column>
      <el-table-column
        prop="unit"
        header-align="center"
        align="center"
        label="单元">
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
          <span :style="colorStatus(scope.row)">
            <p v-if="scope.row.status == '1' && scope.row.control !== 1">待售</p>
            <p v-if="scope.row.status == '10' || scope.row.control === 1">销控</p>
            <p v-if="scope.row.status == '20'">认购</p>
            <p v-if="scope.row.status == '30'">签约</p>
          </span>
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
          <!--<el-button type="text" size="small" @click="" v-if="scope.row.status == '1'" @click="toControl(scope.row)">设置销控</el-button>-->
          <!--<el-button style="color: red" type="text" size="small" v-if="scope.row.status == '10'" @click="doCancel(scope.row)">取消销控</el-button>-->
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
      <el-button type="primary" @click="doPlControl(1)">确定</el-button>
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
          projectId: '',
          dong: '',
          unit: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        row: {},
        logs: [],
        projectList: [],
        dongList: [],
        unitList: [],
        controlList: [
          {value: 1, name: '销控中'},
          {value: 0, name: '未销控'}
        ]
      }
    },
    components: {
      AddOrUpdate
    },
    activated () {
      this.getDataList()
      this.queryProject()
    },
    methods: {
      colorStatus(item) {
        if (item.status === '10' || item.control === 1) {
          return 'color: #1976d2'
        }
        if (item.status === '1') {
          return 'color: #dadada;'
        }
        if (item.status === '20') {
          return 'color: #f44336'
        }
        if (item.status === '30') {
          return 'color: violet'
        }
      },
      selectDong() {
        this.dataForm.unit = ''
        this.$http({
          url: this.$http.adornUrl('/busi/busihouse/unitListByGroupId/' + this.dataForm.dong),
          method: 'get',
          params: {}
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.unitList = data.list
          } else {
            this.unitList = []
          }
        })
      },
      selectProject() {
        console.log("========")
        this.dataForm.dong = ''
        this.$http({
          url: this.$http.adornUrl("/busi/busihousegroup/listAdminByProjectId/" + this.dataForm.projectId),
          method: 'get',
          params: {}
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dongList = data.list
          } else {
            this.dongList = []
          }
        })
      },
      queryProject() {
        this.$http({
          url: this.$http.adornUrl('/busi/busiproject/listParent'),
          method: 'get',
          params: {}
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.projectList = data.list
          } else {
            this.projectList = []
          }
        })
      },
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
      doCancel() {
        console.log("====")
        this.remark = ''
        this.houseIds = []
        var i = true
        var ms = null;
        var s = false;
        for (var index in this.dataListSelections) {
          if (this.dataListSelections[index].control === 1) {
            this.houseIds.push(this.dataListSelections[index].id)
          } else {
            if (this.dataListSelections[index].status === '10') {
              s = true
            }
            ms = this.dataListSelections[index]
            i = false
            break
          }
        }
        if (!i) {
          if (s) {
            this.$message.error(ms.name + "此房源为ERP销控无法取消")
          } else {
            this.$message.error(ms.name + "此房源无需取消销控")
          }
          return
        }
        this.$confirm(`确认取消销控?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.doPlControl(0)
        })
      },
      doPlControl(status) {
        this.$http({
          url: this.$http.adornUrl(`/busi/busicontrollog/save`),
          method: 'post',
          data: this.$http.adornData({
            'houseIds': this.houseIds,
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
      toControl() {
        console.log("====")
        this.houseIds = []
        var i = true
        var ms = null;
        for (var index in this.dataListSelections) {
          if (this.dataListSelections[index].status === '1' && this.dataListSelections[index].control !== 1) {
            this.houseIds.push(this.dataListSelections[index].id)
          } else {
            ms = this.dataListSelections[index]
            i = false
            break
          }
        }
        if (!i) {
          this.$message.error(ms.name + "此房源已是与销控状态")
          return
        }
        this.controlDialogVisible = true;
      },
      search() {
        this.pageIndex = 1
        this.getDataList();
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.dataForm.page = this.pageIndex
        this.dataForm.limit = this.pageSize
        this.$http({
          url: this.$http.adornUrl('/busi/busihouse/list'),
          method: 'get',
          params: this.$http.adornParams(this.dataForm)
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
