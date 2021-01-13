<template>
  <div class="mod-user">
    <el-form
      :inline="true"
      :model="dataForm"
      @keyup.enter.native="getDataList()"
    >
      <el-form-item>
        <el-date-picker
          v-model="dataForm.createTimes"
          type="daterange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      @selection-change="selectionChangeHandle"
      style="width: 100%"
    >
      <el-table-column type="index" width="50" label="序号"> </el-table-column>
      <el-table-column header-align="center" align="center" label="渠道身份">
        <template slot-scope="scope">
          <span>{{ scope.row.middle_type_name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="received"
        header-align="center"
        align="center"
        label="已接收"
      >
      </el-table-column>
      <el-table-column
        prop="rejected"
        header-align="center"
        align="center"
        label="已拒收"
      >
      </el-table-column>
      <el-table-column
        prop="auditing"
        header-align="center"
        align="center"
        label="未审核"
      >
      </el-table-column>
      <el-table-column
        prop="cnt"
        header-align="center"
        align="center"
        label="全部"
      >
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import moment from "moment";
import DataUtil from "../../../utils/data-util";
export default {
  data() {
    return {
      actionId: "report",
      menuId: "report",
      dataUtil: null,
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
            text: "本周",
            onClick(picker) {
              const end = moment();
              const start = moment().day(1);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "本月",
            onClick(picker) {
              const end = moment();
              const year = end.year();
              const month = end.month();
              const start = moment().year(year).month(month).date(1);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "今年",
            onClick(picker) {
              const y = moment().year();
              const firstOfYear = moment().year(y).month(0).date(1);
              const end = new Date();
              const start = firstOfYear;
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "上周",
            onClick(picker) {
              const end = moment().day(0);
              const start = moment().day(-6);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "上月",
            onClick(picker) {
              const y = moment().year();
              const m = moment().month();
              const firstOfMonth = moment().year(y).month(m).date(1);
              const end = firstOfMonth.subtract(1, "days");
              const year = end.year();
              const month = end.month();
              const start = moment().year(year).month(month).date(1);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "去年",
            onClick(picker) {
              const y = moment().year();
              const firstOfYear = moment().year(y).month(0).date(0);
              const end = firstOfYear;
              const start = moment()
                .year(y)
                .month(0)
                .date(1)
                .subtract(1, "years");
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
    };
  },
  components: {},
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
        steps: [{ type: "grv", name: "report/MiddleManStep" }],
        dataParam: {
          start: this.dataForm.start,
          end: this.dataForm.end,
        },
        success: (res) => {
          console.log(res);
          this.dataList = res.data.list;
          this.dataListLoading = false;
        },
        error: (err) => {
          console.log(err);
        },
      });
      /* this.$http({
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
      }); */
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
