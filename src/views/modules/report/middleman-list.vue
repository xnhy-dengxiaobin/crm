<template>
  <div class="middleman-list">
    <el-form class="condition"
             :inline="true"
             :model="dataForm"
             @keyup.enter.native="query()">
      <el-form-item>
        <el-date-picker v-model="dataForm.createTimes"
                        type="daterange"
                        :picker-options="pickerOptions"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        align="right">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="query()">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="content">
      <div class="item">
        <div class="title">报备数</div>
        <el-table :data="dataList"
                  border
                  @selection-change="selectionChangeHandle"
                  style="width: 100%">
          <el-table-column type="index"
                           width="50"
                           label="序号">
          </el-table-column>
          <el-table-column header-align="center"
                           align="center"
                           label="经纪人名称">
            <template slot-scope="scope">
              <span>{{ scope.row.user_name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="mobile"
                           header-align="center"
                           align="center"
                           label="经纪人电话">
          </el-table-column>
          <el-table-column prop="cnt"
                           header-align="center"
                           align="center"
                           label="报备数">
          </el-table-column>
        </el-table>
        <el-pagination @size-change="sizeChangeHandle"
                       @current-change="currentChangeHandle"
                       :current-page="pageIndex"
                       :page-sizes="[10, 20, 50, 100]"
                       :page-size="pageSize"
                       :total="totalPage"
                       layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </div>
      <div class="item">
        <div class="title">成功报备数</div>
        <el-table :data="dataList1"
                  border
                  style="width: 100%">
          <el-table-column header-align="center"
                           align="center"
                           label="经纪人名称">
            <template slot-scope="scope">
              <span>{{ scope.row.user_name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="mobile"
                           header-align="center"
                           align="center"
                           label="经纪人电话">
          </el-table-column>
          <el-table-column prop="cnt"
                           header-align="center"
                           align="center"
                           label="成功数">
          </el-table-column>
        </el-table>
        <el-pagination @size-change="sizeChangeHandle1"
                       @current-change="currentChangeHandle1"
                       :current-page="pageIndex1"
                       :page-sizes="[10, 20, 50, 100]"
                       :page-size="pageSize"
                       :total="totalPage1"
                       layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </div>
      <div class="item">
        <div class="title">到访数</div>
        <el-table :data="dataList2"
                  border
                  style="width: 100%">
          <el-table-column header-align="center"
                           align="center"
                           label="经纪人名称">
            <template slot-scope="scope">
              <span>{{ scope.row.user_name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="mobile"
                           header-align="center"
                           align="center"
                           label="经纪人电话">
          </el-table-column>
          <el-table-column prop="cnt"
                           header-align="center"
                           align="center"
                           label="到访数">
          </el-table-column>
        </el-table>
        <el-pagination @size-change="sizeChangeHandle2"
                       @current-change="currentChangeHandle2"
                       :current-page="pageIndex2"
                       :page-sizes="[10, 20, 50, 100]"
                       :page-size="pageSize"
                       :total="totalPage2"
                       layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </div>
      <div class="item">
        <div class="title">认购数</div>
        <el-table :data="dataList3"
                  border
                  style="width: 100%">
          <el-table-column header-align="center"
                           align="center"
                           label="经纪人名称">
            <template slot-scope="scope">
              <span>{{ scope.row.user_name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="mobile"
                           header-align="center"
                           align="center"
                           label="经纪人电话">
          </el-table-column>
          <el-table-column prop="cnt"
                           header-align="center"
                           align="center"
                           label="认购数">
          </el-table-column>
        </el-table>
        <el-pagination @size-change="sizeChangeHandle3"
                       @current-change="currentChangeHandle3"
                       :current-page="pageIndex3"
                       :page-sizes="[10, 20, 50, 100]"
                       :page-size="pageSize"
                       :total="totalPage3"
                       layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </div>
      <div class="item">
        <div class="title">签约数</div>
        <el-table :data="dataList4"
                  border
                  style="width: 100%">
          <el-table-column header-align="center"
                           align="center"
                           label="经纪人名称">
            <template slot-scope="scope">
              <span>{{ scope.row.user_name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="mobile"
                           header-align="center"
                           align="center"
                           label="经纪人电话">
          </el-table-column>
          <el-table-column prop="cnt"
                           header-align="center"
                           align="center"
                           label="签约数">
          </el-table-column>
        </el-table>
        <el-pagination @size-change="sizeChangeHandle4"
                       @current-change="currentChangeHandle4"
                       :current-page="pageIndex4"
                       :page-sizes="[10, 20, 50, 100]"
                       :page-size="pageSize"
                       :total="totalPage4"
                       layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </div>
      <div class="item"></div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import DataUtil from "../../../utils/data-util";
export default {
  data () {
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
      dataList1: [],
      pageIndex1: 1,
      totalPage1: 0,
      dataList2: [],
      pageIndex2: 1,
      totalPage2: 0,
      dataList3: [],
      pageIndex3: 1,
      totalPage3: 0,
      dataList4: [],
      pageIndex4: 1,
      totalPage4: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      middleTypes: [],
      pickerOptions: {
        shortcuts: [
          {
            text: "本周",
            onClick (picker) {
              const end = moment();
              const start = moment().day(1);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "本月",
            onClick (picker) {
              const end = moment();
              const year = end.year();
              const month = end.month();
              const start = moment().year(year).month(month).date(1);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "今年",
            onClick (picker) {
              const y = moment().year();
              const firstOfYear = moment().year(y).month(0).date(1);
              const end = new Date();
              const start = firstOfYear;
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "上周",
            onClick (picker) {
              const end = moment().day(0);
              const start = moment().day(-6);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "上月",
            onClick (picker) {
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
            onClick (picker) {
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
  mounted () {
    this.query();
    this.queryMiddleType();
  },
  methods: {
    query () {
      this.getDataList();
      this.getDataList1();
      this.getDataList2();
      this.getDataList3();
      this.getDataList4();
    },
    processDateRange () {
      if (this.dataForm.createTimes && this.dataForm.createTimes.length > 0) {
        this.dataForm.start = this.dataForm.createTimes[0];
        this.dataForm.start = moment(this.dataForm.start).format("YYYY-MM-DD");
        if (this.dataForm.createTimes.length > 1) {
          this.dataForm.end = this.dataForm.createTimes[1];
          this.dataForm.end = moment(this.dataForm.end).format("YYYY-MM-DD");
        }
      }
    },
    // 获取数据列表
    async getDataList () {
      await this.processDateRange();

      this.dataUtil.exec({
        steps: [{ type: "grv", name: "report/PrepareReportStep" }],
        dataParam: {
          page: this.pageIndex,
          limit: this.pageSize,
          start: this.dataForm.start,
          end: this.dataForm.end,
        },
        success: (res) => {
          if (res && res.code) {
            this.dataList = res.data.page.list;
            this.totalPage = res.data.page.totalPage;
          } else {
            this.dataList = [];
            this.totalPage = 0;
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
    },
    // 获取数据列表
    async getDataList1 () {
      await this.processDateRange();

      this.dataUtil.exec({
        steps: [{ type: "grv", name: "report/PrepareReportStep" }],
        dataParam: {
          page: this.pageIndex1,
          limit: this.pageSize,
          start: this.dataForm.start,
          end: this.dataForm.end,
          status: 10,
        },
        success: (res) => {
          if (res && res.code) {
            this.dataList1 = res.data.page.list;
            this.totalPage1 = res.data.page.totalPage;
          } else {
            this.dataList1 = [];
            this.totalPage1 = 0;
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
    },
    // 获取数据列表
    async getDataList2 () {
      await this.processDateRange();

      this.dataUtil.exec({
        steps: [{ type: "grv", name: "report/PrepareCustomerReportStep" }],
        dataParam: {
          page: this.pageIndex2,
          limit: this.pageSize,
          start: this.dataForm.start,
          end: this.dataForm.end,
          busiStatus: 30,
        },
        success: (res) => {
          if (res && res.code) {
            this.dataList2 = res.data.page.list;
            this.totalPage2 = res.data.page.totalPage;
          } else {
            this.dataList2 = [];
            this.totalPage2 = 0;
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
    },
    // 获取数据列表
    async getDataList3 () {
      await this.processDateRange();

      this.dataUtil.exec({
        steps: [{ type: "grv", name: "report/PrepareCustomerReportStep" }],
        dataParam: {
          page: this.pageIndex3,
          limit: this.pageSize,
          start: this.dataForm.start,
          end: this.dataForm.end,
          busiStatus: 50,
        },
        success: (res) => {
          if (res && res.code) {
            this.dataList3 = res.data.page.list;
            this.totalPage3 = res.data.page.totalPage;
          } else {
            this.dataList3 = [];
            this.totalPage3 = 0;
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
    },
    // 获取数据列表
    async getDataList4 () {
      await this.processDateRange();

      this.dataUtil.exec({
        steps: [{ type: "grv", name: "report/PrepareCustomerReportStep" }],
        dataParam: {
          page: this.pageIndex4,
          limit: this.pageSize,
          start: this.dataForm.start,
          end: this.dataForm.end,
          busiStatus: 60,
        },
        success: (res) => {
          if (res && res.code) {
            this.dataList4 = res.data.page.list;
            this.totalPage4 = res.data.page.totalPage;
          } else {
            this.dataList4 = [];
            this.totalPage4 = 0;
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
    },
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getDataList();
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val;
      this.getDataList();
    },
    // 每页数
    sizeChangeHandle1 (val) {
      this.pageSize = val;
      this.pageIndex1 = 1;
      this.getDataList1();
    },
    // 当前页
    currentChangeHandle1 (val) {
      this.pageIndex1 = val;
      this.getDataList1();
    },
    // 每页数
    sizeChangeHandle2 (val) {
      this.pageSize = val;
      this.pageIndex2 = 1;
      this.getDataList2();
    },
    // 当前页
    currentChangeHandle2 (val) {
      this.pageIndex2 = val;
      this.getDataList2();
    },
    // 每页数
    sizeChangeHandle3 (val) {
      this.pageSize = val;
      this.pageIndex3 = 1;
      this.getDataList3();
    },
    // 当前页
    currentChangeHandle3 (val) {
      this.pageIndex3 = val;
      this.getDataList3();
    },
    // 每页数
    sizeChangeHandle4 (val) {
      this.pageSize = val;
      this.pageIndex4 = 1;
      this.getDataList4();
    },
    // 当前页
    currentChangeHandle4 (val) {
      this.pageIndex4 = val;
      this.getDataList4();
    },
    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val;
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id);
      });
    },
    // 删除
    deleteHandle (id) {
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
        .catch(() => { });
    },
    // 删除
    auditHandle (id, auditStatus) {
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
        .catch(() => { });
    },
    batchOp (command) {
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
    queryMiddleType () {
      this.$http.get("/busi/middletype/list", {
        page: 1,
        limit: 1000,
        success: (data) => {
          this.middleTypes = data.page.list;
        },
      });
    },
    listMiddleType (queryString, cb) {
      let results = this.middleTypes.filter((p) => {
        if (!queryString) {
          return true;
        }
        return p.name.indexOf(queryString) >= 0;
      });
      cb(results);
    },
    handleSelect (item) {
      this.dataForm.middleTypeId = item.id;
      this.dataForm.middleTypeName = item.name;
    },
  },
  created () {
    this.dataUtil = new DataUtil(this);
  },
};
</script>
<style lang="scss">
.middleman-list {
  background: #f1f4f5;
  .condition {
    background: #fff;
  }
  .content {
    display: grid;
    grid-template-rows: repeat(2, 50%);
    grid-template-columns: repeat(3, 33.3%);
    grid-row-gap: 20px;
    grid-column-gap: 20px;
    .item {
      overflow-y: auto;
      .title {
        font-size: 18px;
        font-weight: 500;
        padding: 8px 0 8px 5px;
      }
    }
  }
}
</style>
