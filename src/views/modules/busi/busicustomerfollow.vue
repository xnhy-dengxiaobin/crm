<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="search()">
      <el-form-item>
        <el-input v-model="dataForm.condition" placeholder="名称/电话" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.matchUserId" clearable placeholder="置业顾问">
          <el-option
            v-for="item in sales"
            :key="item.userId"
            :label="item.name"
            :value="item.userId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-checkbox-group v-model="dataForm.checkTypes">
          <el-checkbox :label="item.value" v-for="(item, index) in followTypes" :key="index"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <p/>
      <el-form-item>
        客户新增日期：
        <el-date-picker
          v-model="dataForm.addDate"
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
        跟进日期：
        <el-date-picker
          v-model="dataForm.followDate"
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

        <el-button type="info" @click="empty()">清空选项</el-button>
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
        prop="name"
        header-align="center"
        align="center"
        label="名称">
      </el-table-column>
      <el-table-column
        prop="mobilePhone"
        header-align="center"
        align="center"
        label="电话">
      </el-table-column>
      <el-table-column
        prop="mode"
        header-align="center"
        align="center"
        label="跟进方式">
      </el-table-column>
      <el-table-column
        prop="grade"
        header-align="center"
        align="center"
        label="意向级别">
      </el-table-column>
      <el-table-column
        prop="content"
        header-align="center"
        align="center"
        label="跟进内容">
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        label="跟进时间">
      </el-table-column>
      <el-table-column
        prop="createName"
        header-align="center"
        align="center"
        label="跟进人">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
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
  </div>
</template>

<script>
  import AddOrUpdate from './busicustomerfollow-add-or-update'
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
      AddOrUpdate
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
          url: this.$http.adornUrl('/busi/busicustomerfollow/list'),
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
            url: this.$http.adornUrl('/busi/busicustomerfollow/delete'),
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
