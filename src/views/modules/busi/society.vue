<template>
  <div class="society">
    <el-form
      :inline="true"
      :model="dataForm"
      @keyup.enter.native="getDataList()"
    >
      <el-form-item>
        <el-input
          v-model="dataForm.name"
          placeholder="客户姓名"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="dataForm.mobilePhone"
          placeholder="客户手机号码"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="dataForm.sourceUserName"
          placeholder="行销"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="dataForm.sourceMobile"
          placeholder="行销手机号码"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button type="primary" @click="addOrUpdateHandle()">添加</el-button>
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
        prop="project_name"
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
        prop="mobile_phone"
        header-align="center"
        align="center"
        label="手机号码"
      >
      </el-table-column>
      <el-table-column
        prop="match_user_name"
        header-align="center"
        align="center"
        width="180"
        label="置业顾问"
      >
      </el-table-column>
      <el-table-column
        prop="source_user_name"
        header-align="center"
        align="center"
        width="180"
        label="行销"
      >
      </el-table-column
      ><el-table-column
        prop="source_mobile"
        header-align="center"
        align="center"
        width="180"
        label="行销电话"
      >
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        width="180"
        label="创建时间"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.create_time | date }}</span>
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
            type="text"
            size="small"
            @click="addOrUpdateHandle(scope.row.id)"
            >修改</el-button
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
      :total="totalItems"
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
import moment from "moment";
import DataUtil from "../../../utils/data-util";
import AddOrUpdate from "./society-add-or-update";
export default {
  data() {
    return {
      actionId: "society",
      menuId: "society",
      dataUtil: null,
      dataForm: {
        name: null,
        mobilePhone: null,
        sourceUserName: null,
        sourceMobile: null,
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      totalItems: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
    };
  },
  components: {
    AddOrUpdate,
  },
  mounted() {
    this.getDataList();
    this.queryMiddleType();
  },
  methods: {
    // 获取数据列表
    getDataList() {
      if (this.dataForm.createTimes && this.dataForm.createTimes.length > 0) {
        this.dataForm.start = this.dataForm.createTimes[0];
        this.dataForm.start = moment(this.dataForm.start).format("YYYY-MM-DD");
        if (this.dataForm.createTimes.length > 1) {
          this.dataForm.end = this.dataForm.createTimes[1];
          this.dataForm.end = moment(this.dataForm.end).format("YYYY-MM-DD");
        }
      }
      this.dataUtil.exec({
        steps: [{ type: "grv", name: "society/SocietyStep" }],
        dataParam: {
          page: this.pageIndex,
          limit: this.pageSize,
          name: this.dataForm.name,
          mobilePhone: this.dataForm.mobilePhone,
          sourceUserName: this.dataForm.sourceUserName,
          sourceMobile: this.dataForm.sourceMobile,
        },
        success: (res) => {
          if (res && res.code) {
            this.dataList = res.data.page.list;
            this.totalItems = res.data.page.totalItems;
          } else {
            this.dataList = [];
            this.totalPage = 0;
          }
          this.dataListLoading = false;
        },
        error: (err) => {
          console.log(err);
        },
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
  created() {
    this.dataUtil = new DataUtil(this);
  },
};
</script>
