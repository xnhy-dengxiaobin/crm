<template>
  <div class="mod-user">
    <el-form
      :inline="true"
      :model="dataForm"
      @keyup.enter.native="getDataList()"
    >
      <el-form-item>
        <el-input
          v-model="dataForm.mobile"
          placeholder="经纪人电话"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="dataForm.middleTypeId"
          filterable
          clearable
          placeholder="请选择渠道身份"
        >
          <el-option
            v-for="middleType in middleTypes"
            :key="middleType.id"
            :label="middleType.name"
            :value="middleType.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="dataForm.createTimes"
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="dataForm.auditStatus"
          clearable
          placeholder="审核状态"
        >
          <el-option label="待审核" value="0"> </el-option>
          <el-option label="未通过" value="-1"> </el-option>
          <el-option label="通过" value="1"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.status" clearable placeholder="禁用状态">
          <el-option label="禁用" value="0"> </el-option>
          <el-option label="正常" value="1"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button
          v-if="isAuth('sys:user:save')"
          type="primary"
          @click="addOrUpdateHandle()"
          >新增</el-button
        >
        <el-dropdown @command="batchOp">
          <el-button type="warning">
            批量操作<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="del">删除</el-dropdown-item>
            <el-dropdown-item command="pass">通过</el-dropdown-item>
            <el-dropdown-item command="reject">不通过</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <!-- <el-button
          v-if="isAuth('sys:user:delete')"
          type="danger"
          @click="deleteHandle()"
          :disabled="dataListSelections.length <= 0"
          >批量删除</el-button
        > -->
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
        header-align="center"
        align="center"
        width="160"
        label="创建时间"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.create_time | date }}</span>
        </template>
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
        width="80"
        label="姓名"
      >
      </el-table-column>
      <el-table-column
        prop="sex"
        header-align="center"
        align="center"
        width="80"
        label="性别"
      >
      </el-table-column>
      <el-table-column
        prop="mobile"
        header-align="center"
        align="center"
        label="电话"
      >
      </el-table-column>
      <el-table-column
        prop="middleTypeName"
        header-align="center"
        align="center"
        label="身份信息"
      >
      </el-table-column>
      <el-table-column
        prop="mobile"
        header-align="center"
        align="center"
        label="审核状态"
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.auditStatus === -1" size="small" type="danger"
            >未通过</el-tag
          >
          <el-tag v-else-if="scope.row.auditStatus === 1" size="small"
            >通过</el-tag
          >
          <el-tag v-else size="small">待审核</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        label="禁用状态"
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 0" size="small" type="danger"
            >禁用</el-tag
          >
          <el-tag v-else size="small">正常</el-tag>
        </template>
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
            v-if="isAuth('sys:user:update')"
            type="text"
            size="small"
            @click="addOrUpdateHandle(scope.row.userId)"
            >修改</el-button
          >
          <el-button
            v-if="isAuth('sys:user:delete')"
            type="text"
            size="small"
            @click="deleteHandle(scope.row.userId)"
            >删除</el-button
          >
          <el-button
            v-if="isAuth('sys:user:audit')"
            type="text"
            size="small"
            @click="auditHandle(scope.row.userId, 1)"
            >通过</el-button
          >
          <el-button
            v-if="isAuth('sys:user:audit')"
            type="text"
            size="small"
            @click="auditHandle(scope.row.userId, -1)"
            >不通过</el-button
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
  </div>
</template>

<script>
import AddOrUpdate from "./middleman-add-or-update";
import moment from "moment";
export default {
  data() {
    return {
      dataForm: {
        mobile: "",
        middleTypeId: null,
        createTimes: [],
        start: null,
        end: null,
        auditStatus: null,
        status: null,
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      middleTypes: [],
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
    };
  },
  components: {
    AddOrUpdate,
  },
  activated() {
    this.getDataList();
    this.queryMiddleType();
  },
  methods: {
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      if (this.dataForm.createTimes && this.dataForm.createTimes.length > 0) {
        this.dataForm.start = this.dataForm.createTimes[0];
        this.dataForm.start = moment(this.dataForm.start).format("YYYY-MM-DD");
        if (this.dataForm.createTimes.length > 1) {
          this.dataForm.end = this.dataForm.createTimes[0];
          this.dataForm.end = moment(this.dataForm.end).format("YYYY-MM-DD");
        }
      }
      this.$http({
        url: this.$http.adornUrl("/sys/user/listMiddleMan"),
        method: "get",
        params: this.$http.adornParams({
          page: this.pageIndex,
          limit: this.pageSize,
          mobile: this.dataForm.mobile,
          middleTypeId: this.dataForm.middleTypeId,
          start: this.dataForm.start,
          end: this.dataForm.end,
          status: this.dataForm.status,
          auditStatus: this.dataForm.auditStatus,
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
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id);
      });
    },
    // 删除
    deleteHandle(id) {
      var userIds = id
        ? [id]
        : this.dataListSelections.map((item) => {
            return item.userId;
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
    // 删除
    auditHandle(id, auditStatus) {
      var userIds = id
        ? [id]
        : this.dataListSelections.map((item) => {
            return item.userId;
          });
      this.$confirm(
        `确定对[id=${userIds.join(",")}]进行[${id ? "审核" : "批量审核"}]操作?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.$http({
            url: this.$http.adornUrl("/sys/user/auditMiddleMan"),
            method: "post",
            data: this.$http.adornData(
              { userIds: userIds, auditStatus: auditStatus },
              false
            ),
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "审核成功",
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
    batchOp(command) {
      switch (command) {
        case "del":
          this.deleteHandle();
          break;
        case "pass":
          this.auditHandle(null, 1);
          break;
        default:
          this.auditHandle(null, -1);
          break;
      }
    },
    queryMiddleType() {
      this.$http.get("/busi/middletype/list", {
        page: 1,
        limit: 1000,
        success: (data) => {
          this.middleTypes = data.page.list;
        },
      });
    },
    listMiddleType(queryString, cb) {
      let results = this.middleTypes.filter((p) => {
        if (!queryString) {
          return true;
        }
        return p.name.indexOf(queryString) >= 0;
      });
      cb(results);
    },
    handleSelect(item) {
      this.dataForm.middleTypeId = item.id;
      this.dataForm.middleTypeName = item.name;
    },
  },
};
</script>
