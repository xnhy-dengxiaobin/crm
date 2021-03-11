<template>
  <div class="mod-user">
    <el-form :inline="true"
             :model="dataForm"
             @keyup.enter.native="getDataList()">
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
        <el-button @click="getDataList()">查询</el-button>
        <el-button type="primary"
                   @click="download()">下载</el-button>
        <el-button type="danger"
                   @click="deleteHandle()">删除</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList"
              border
              @selection-change="selectionChangeHandle"
              style="width: 100%">
      <el-table-column type="selection"
                       header-align="center"
                       align="center"
                       width="50">
      </el-table-column>
      <el-table-column type="index"
                       width="50"
                       label="序号"> </el-table-column>
      <el-table-column header-align="center"
                       align="center"
                       label="文件名称">
        <template slot-scope="scope">
          <span>{{ scope.row.filename }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createtime"
                       header-align="center"
                       align="center"
                       label="生成时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createtime }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="filesize"
                       header-align="center"
                       align="center"
                       label="文件大小">
        <template slot-scope="scope">
          <span>{{ scope.row.filesize / 1024 }}kb</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right"
                       header-align="center"
                       align="center"
                       width="150"
                       label="操作">
        <template slot-scope="scope">
          <el-button type="text"
                     size="small"
                     @click="download(scope.row)">下载</el-button>
          <el-button type="text"
                     size="small"
                     @click="deleteHandle(scope.row.id, scope.row.projectId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle"
                   @current-change="currentChangeHandle"
                   :current-page="pageIndex"
                   :page-sizes="[10, 20, 50, 100]"
                   :page-size="pageSize"
                   :total="total"
                   layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>

    <form style="display:none;"
          :action="downloadController"
          ref="frm">
      <input name="fileId"
             v-model="fileId"
             id="fileId">
    </form>
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
      fileId: '',
      downloadController: `${window.SITE_CONFIG["baseUrl2"]}/file/download`,
      dataForm: {
        createTimes: [],
        start: null,
        end: null,
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      total: 0,
      dataListLoading: false,
      dataListSelections: [],
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
    this.getDataList();
  },
  methods: {
    // 获取数据列表
    getDataList () {
      if (this.dataForm.createTimes && this.dataForm.createTimes.length > 0) {
        this.dataForm.start = this.dataForm.createTimes[0];
        this.dataForm.start = moment(this.dataForm.start).format("YYYY-MM-DD");
        if (this.dataForm.createTimes.length > 1) {
          this.dataForm.end = this.dataForm.createTimes[1];
          this.dataForm.end = moment(this.dataForm.end).format("YYYY-MM-DD");
        }
      }
      this.dataUtil.exec({
        steps: [{ type: "grv", name: "export/DownloadStep" }],
        dataParam: {
          page: this.pageIndex,
          limit: this.pageSize,
          start: this.dataForm.start,
          end: this.dataForm.end,
          op: 'query'
        },
        success: (res) => {
          console.log(res);
          this.dataList = res.data.page.list;
          this.totalPage = res.data.page.totalPage;
          this.total = res.data.page.total;
          this.dataListLoading = false;
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
    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val;
    },
    // 删除
    deleteHandle (id) {
      var fileIds = id
        ? [id]
        : this.dataListSelections.map((item) => {
          return item.fileid;
        });
      this.$confirm(
        `确定对[id=${fileIds.join(",")}]进行[${id ? "删除" : "批量删除"}]操作?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.dataUtil.exec({
            steps: [{ type: "grv", name: "export/DownloadStep" }],
            dataParam: {
              fileIds: fileIds,
              op: 'remove'
            },
            success: (res) => {
              if (res && res.code) {
                this.$message({
                  message: "操作成功",
                  type: "success",
                  duration: 1500,
                  onClose: () => {
                    this.getDataList();
                  },
                });
              } else {
                this.$message.error(res.message);
              }
            },
            error: (err) => {
              console.log(err);
            },
          });
        })
        .catch(() => { });
    },
    // 删除
    download (file) {
      const files = file
        ? [file]
        : this.dataListSelections;
      if (!files || files.length <= 0) {
        this.$message.error("请选择要下载的文件");
        return;
      }
      if (files && files.length > 1) {
        this.$message.error("一次只能下载一个文件");
        return;
      }
      this.$confirm(
        `确定下载${files[0].filename}?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.fileId = files[0].filenamealias;
          this.$nextTick(() => {
            this.$refs["frm"].submit();
          })
        })
    },
  },
  created () {
    this.dataUtil = new DataUtil(this);
  },
};
</script>
