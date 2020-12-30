<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <!--<el-button v-if="isAuth('busi:busiteams:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>-->
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      :expand-row-keys="currentExpandRow"
      row-key="id"
      @expand-change="toExpand"
      style="width: 100%;">
      <el-table-column type="expand">
        <template slot-scope="props">
          <p style="font-size: 18px;margin-bottom: 0px;margin-top: 0px;">团队成员：</p>
          <el-table
            class="bg"
            v-loading="loading"
            :data="props.row.innerList"
            :row-class-name="tableRowClassName"
            style="width: 100% ;color: cornflowerblue; background: #f0f9eb;">
            <el-table-column
              prop="username"
              header-align="center"
              align="center"
              label="用户名"
            >
            </el-table-column>
            <el-table-column
              prop="name"
              header-align="center"
              align="center"
              label="姓名"
            >
            </el-table-column>
            <el-table-column
              prop="teamName"
              header-align="center"
              align="center"
              label="团队名称"
            >
            </el-table-column>
            <el-table-column
              prop="email"
              header-align="center"
              align="center"
              label="邮箱"
            >
            </el-table-column>
            <el-table-column
              prop="mobile"
              header-align="center"
              align="center"
              label="手机号"
            >
            </el-table-column>
            <el-table-column
              fixed="right"
              header-align="center"
              align="center"
              width="150"
              label="操作"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  @click="delBidingUse(scope.row.userId, scope.row.teamId)"
                >解除绑定</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button  type="primary" style="float: right" @click="toAddUser(props.row.id)">添加成员</el-button>
        </template>
      </el-table-column>
      <!--<el-table-column-->
        <!--type="selection"-->
        <!--header-align="center"-->
        <!--align="center"-->
        <!--width="50">-->
      <!--</el-table-column>-->
      <el-table-column
        prop="id"
        header-align="center"
        align="center"
        label="团队编号">
      </el-table-column>
      <el-table-column
        prop="teamName"
        header-align="center"
        align="center"
        label="团队名称">
      </el-table-column>
      <el-table-column
        prop="area"
        header-align="center"
        align="center"
        label="区域">
      </el-table-column>
      <!--<el-table-column-->
        <!--prop="projectId"-->
        <!--header-align="center"-->
        <!--align="center"-->
        <!--label="">-->
      <!--</el-table-column>-->
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
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
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <!-- Table -->
    <el-dialog title="添加团队成员" :visible.sync="dialogTableVisible">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-input v-model="dataForm.key" placeholder="参数名" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">查询</el-button>
          <el-button  type="primary" style="float: right" @click="doAddUser()">确认添加</el-button>
          <!--<el-button v-if="isAuth('busi:busiteams:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>-->
        </el-form-item>
      </el-form>
      <el-table :data="userSelectList"
                v-loading="selectUserLoading"
                @selection-change="addUserSelectionChangeHandle">
        <el-table-column
          type="selection"
          header-align="center"
          align="center"
          width="50"
        >
        </el-table-column>
        <el-table-column
          prop="username"
          header-align="center"
          align="center"
          label="用户名"
        >
        </el-table-column>
        <el-table-column
          prop="name"
          header-align="center"
          align="center"
          label="姓名"
        >
        </el-table-column>
        <el-table-column
          prop="teamName"
          header-align="center"
          align="center"
          label="团队名称"
        >

          <template slot-scope="scope">
            <p v-if="scope.row.teamId">{{scope.row.teamName}}</p>
            <p v-else style="color: #5daf34">无团队</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="email"
          header-align="center"
          align="center"
          label="邮箱"
        >
        </el-table-column>
        <el-table-column
          prop="mobile"
          header-align="center"
          align="center"
          label="手机号"
        >
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
  import AddOrUpdate from './busiteams-add-or-update'
  export default {
    data () {
      return {
        selectProjectId: "",
        dataForm: {
          key: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addUserListSelections: [],
        addOrUpdateVisible: false,
        currentExpandRow: [],
        loading: false,
        selectUserLoading: false,
        userSelectList: [],
        dialogTableVisible: false,
        dialogFormVisible: false,
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        formLabelWidth: '120px'
      }
    },
    components: {
      AddOrUpdate
    },
    activated () {
      this.getDataList()
    },
    methods: {
      tableRowClassName ({ row, rowIndex }) {
        if ((rowIndex + 1) % 2 === 0) {
          return 'double';
        } else {
          return 'single';
        }
      },
      delBidingUse(userId, teamId) {
        this.$confirm(`确定解除绑定`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl(`/busi/busiteams/delBidingUse/` + userId),
            method: 'post',
            data: {}
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.queryBindList({id: teamId})
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      },
      doAddUser() {
        console.log(this.addUserListSelections)
        var ids = this.addUserListSelections.map(item => {
          return item.userId
        })
        this.$http({
          url: this.$http.adornUrl(`/busi/busiteams/bidingUser`),
          method: 'post',
          data: this.$http.adornData({
            'ids': ids,
            'teamId': this.selectProjectId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.queryBindList({id: this.selectProjectId})

                this.dialogTableVisible = false
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      toAddUser(teamId) {
        this.selectProjectId = teamId
        this.dialogTableVisible = true
        this.selectUserLoading = true
        var $this = this
        this.$http({
          url: this.$http.adornUrl('/busi/busiteams/userListSelect'),
          method: 'get',
          params: this.$http.adornParams({
            'teamId': teamId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            $this.userSelectList = data.list
          } else {
            // row.userList = []
          }
          $this.selectUserLoading = false
        })
      },
      async toExpand(row) {
        this.queryBindList(row)
      },
      queryBindList(row) {
        const currentID = this.currentExpandRow[0] ? this.currentExpandRow[0] : ''
        if (currentID === row.id) {
          this.currentExpandRow = []
          return
        }
        let currentIndex = 0
        this.dataList.some((item, index) => {
          if (item.id === row.id) {
            currentIndex = index
            return true
          }
        })
        const groupID = row.id
        this.currentExpandRow = [groupID] // 控制展开行
        this.loading = true;
        this.$http({
          url: this.$http.adornUrl('/busi/busiteams/userList'),
          method: 'get',
          params: this.$http.adornParams({
            'teamId': row.id
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$set(this.dataList[currentIndex], 'innerList', data.list)
          } else {
            // row.userList = []
          }
          this.loading = false
        })
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/busi/busiteams/list'),
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
      addUserSelectionChangeHandle (val) {
        this.addUserListSelections = val
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
            url: this.$http.adornUrl('/busi/busiteams/delete'),
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
