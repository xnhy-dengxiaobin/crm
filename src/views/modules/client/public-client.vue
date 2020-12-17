<template>
  <div class="mod-user">
    <el-form
      :inline="true"
      :model="dataForm"
      @keyup.enter.native="getDataList()"
    >
      <el-form-item>
        <el-input
          v-model="dataForm.keyword"
          placeholder="手机号码"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-radio-group v-model="dataForm.stt">
          <el-radio :label="4">所有客户</el-radio>
          <el-radio :label="3">正常客户</el-radio>
          <el-radio :label="2">公共客户</el-radio>
          <el-radio :label="1">逾期客户</el-radio>
        </el-radio-group>
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
        <el-button @click="search()">查询</el-button>
        <el-button
         type="primary"
         @click="batchAllocation()"
         >批量分配</el-button
        >
        <!--<el-button
          v-if="isAuth('sys:user:save')"
          type="primary"
          @click="addOrUpdateHandle()"
          >新增</el-button
        >-->
        <!-- <el-button
          v-if="isAuth('sys:user:delete')"
          type="danger"
          @click="deleteHandle()"
          :disabled="dataListSelections.length <= 0"
          >批量删除</el-button
        >-->
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%"
    >
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50"
      >
      </el-table-column>
      <el-table-column
        prop="projectName"
        header-align="center"
        align="center"
        label="项目名"
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
        prop="sex"
        header-align="center"
        align="center"
        label="性别"
      >
      </el-table-column>
      <el-table-column
        prop="mobilePhone"
        header-align="center"
        align="center"
        label="手机号码"
      >
      </el-table-column>
      <el-table-column
        prop="purpose"
        header-align="center"
        align="center"
        label="购房用途"
      >
      </el-table-column>
      <el-table-column
        prop="purposeProduct"
        header-align="center"
        align="center"
        label="意向产品"
      >
      </el-table-column>
      <el-table-column
        prop="purposeArea"
        header-align="center"
        align="center"
        label="意向面积"
      >
      </el-table-column>
      <el-table-column
        prop="matchName"
        header-align="center"
        align="center"
        width="180"
        label="当前置业顾问"
      >
      </el-table-column>

      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        width="180"
        label="创建时间"
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
          <!-- <el-button
            type="text"
            size="small"
            @click="addOrUpdateHandle(scope.row.id)"
            >详情</el-button
          >-->
          <!--<el-button
            v-if="isAuth('sys:user:delete')"
            type="text"
            size="small"
            @click="recoveryHandle(scope.row.id)"
            >回收</el-button
          >-->
          <el-button
            v-if="isAuth('sys:user:delete')"
            type="text"
            size="small"
            @click="queryRoamList(scope.row.id)"
          >查看转介</el-button
          >
          <el-button
            v-if="isAuth('sys:user:delete')"
            type="text"
            size="small"
            @click="addOrUpdateHandle(scope.row.id, scope.row.projectId)"
            >分配</el-button
          >
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
      layout="total, sizes, prev, pager, next, jumper"
    >
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshDataList="getDataList"
    ></add-or-update>
    <el-dialog
      title="转介信息"
      :visible.sync="dialogVisible"
      width="30%">
      <div class="block">
        <el-timeline >
          <el-timeline-item
            v-for="(roam, index) in roamList"
            :key="index"
            :timestamp="roam.createTime">
            {{roam.remark}}
          </el-timeline-item>
        </el-timeline>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import AddOrUpdate from "./client-match-user.vue";
export default {
  data() {
    return {
      dataForm: {
        keyword: "",
        stt: 4,
        oldMatchUserId: null
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      sales: [],
      roamList: [],
      reverse: true,
      dialogVisible: false
    };
  },
  components: {
    AddOrUpdate,
  },
  activated() {
    this.getDataList();
    this.getSalesAll();
  },
  methods: {
    queryRoamList(id) {
      this.$http({
        url: this.$http.adornUrl("/busi/busicustomerroam/listByCustomerId?customerId=" + id),
        method: "get",
        params: {},
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.roamList = data.list;
          this.dialogVisible = true;
        }
      });
    },
    search() {
      this.pageIndex = 1;
      this.getDataList();
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
    batchAllocation() {
      console.log(this.dataListSelections)
      var ids = '';
      var isNext = true;
      if (this.dataListSelections.length > 0) {
        for (var index in this.dataListSelections) {
          for (var index2 in this.dataListSelections) {
            if (this.dataListSelections[index].projectId !== this.dataListSelections[index2].projectId) {
              console.log(this.dataListSelections[index].projectId + '====' + this.dataListSelections[index2].projectId)
              isNext = false;
              break
            }
          }
          if (index === '0') {
            ids = this.dataListSelections[index].id;
          } else {
            ids = ids + ',' + this.dataListSelections[index].id;
          }
        }
        if (!isNext) {
          this.$message.error('不同项目客户无法批量分配');
          return
        }
        console.log(ids)
        this.addOrUpdateHandle(ids, this.dataListSelections[0].projectId)
      } else {
        this.$message.error('请选择');
      }
    },
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      console.log(this.dataForm.oldMatchUserId)
      this.$http({
        url: this.$http.adornUrl("/busi/manager/busicustomer/publicList"),
        method: "get",
        params: this.$http.adornParams({
          page: this.pageIndex,
          limit: this.pageSize,
          keyword: this.dataForm.keyword,
          stt: this.dataForm.stt,
          matchUserId: this.dataForm.matchUserId
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list;
          this.totalPage = data.page.totalCount;
        } else {
          this.dataList = [];
          this.totalPage = 0;
        }
        this.dataListLoading = false;
      });
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getDataList();
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val;
      this.getDataList();
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val;
    },
    // 新增 / 修改
    addOrUpdateHandle(id, projectId) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id, projectId);
      });
    },
    // 删除
    deleteHandle(id) {
      var userIds = id
        ? [id]
        : this.dataListSelections.map((item) => {
            return item.id;
          });
      this.$confirm(
        `确定对[id=${userIds.join(",")}]进行[${id ? "删除" : "批量删除"}]操作?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.$http({
            url: this.$http.adornUrl("/sys/user/delete"),
            method: "post",
            data: this.$http.adornData(userIds, false),
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.getDataList();
                },
              });
            } else {
              this.$message.error(data.msg);
            }
          });
        })
        .catch(() => {});
    },
    // 回收
    recoveryHandle(id) {
      var userIds = id
        ? [id]
        : this.dataListSelections.map((item) => {
            return item.id;
          });
      this.$confirm(
        `确定对[id=${userIds.join(",")}]进行[${id ? "回收" : "批量回收"}]操作?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.$http({
            url: this.$http.adornUrl("/busi/manager/busicustomer/recovery"),
            method: "post",
            data: this.$http.adornData(userIds, false),
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.getDataList();
                },
              });
            } else {
              this.$message.error(data.msg);
            }
          });
        })
        .catch(() => {});
    },
    // 分配
    shareHandle(id) {
      this.$http({
        url: this.$http.adornUrl("/sys/user/delete"),
        method: "post",
        data: this.$http.adornData(id, false),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$message({
            message: "操作成功",
            type: "success",
            duration: 1500,
            onClose: () => {
              this.getDataList();
            },
          });
        } else {
          this.$message.error(data.msg);
        }
      });
    },
  },
};
</script>
