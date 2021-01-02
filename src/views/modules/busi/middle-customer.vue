<template>
  <div class="mod-config">
    <el-form
      :inline="true"
      :model="dataForm"
      @keyup.enter.native="getDataList()"
    >
      <el-form-item>
        <el-select
          style="width: 100%"
          v-model="dataForm.projectId"
          filterable
          placeholder="项目"
        >
          <el-option
            v-for="project in projects"
            :key="project.id"
            :label="project.shortName"
            :value="project.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="dataForm.mobile"
          placeholder="客户手机号"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="dataForm.createdTimes"
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="首次报备时间起"
          end-placeholder="首次报备时间止"
          align="right"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="dataForm.status"
          clearable
          multiple
          placeholder="报备状态"
        >
          <el-option label="待确认" value="0"> </el-option>
          <el-option label="待分配" value="10"> </el-option>
          <el-option label="已分配" value="20"> </el-option>
          <el-option label="无效" value="-1"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="dataForm.busiStatus"
          clearable
          multiple
          placeholder="客户状态"
        >
          <el-option label="报备" value="20"> </el-option>
          <el-option label="到访" value="30"> </el-option>
          <el-option label="认筹" value="40"> </el-option>
          <el-option label="认购" value="50"> </el-option>
          <el-option label="签约" value="60"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          style="width: 100%"
          v-model="dataForm.middleTypeId"
          filterable
          placeholder="渠道身份"
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
        <el-button @click="getDataList()">查询</el-button>
        <el-button
          v-if="isAuth('busi:prepare:update')"
          type="primary"
          @click="refresh()"
          >刷新保护期</el-button
        >
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
        prop="name"
        header-align="center"
        align="center"
        label="首次报备时间"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.createdTime | date }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        label="客户名称"
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
        prop="mobile"
        header-align="center"
        align="center"
        label="手机"
      >
      </el-table-column>
      <el-table-column
        prop="userId"
        header-align="center"
        align="center"
        label="经纪人"
      >
      </el-table-column>
      <el-table-column
        prop="middleTypeName"
        header-align="center"
        align="center"
        label="渠道身份"
      >
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        label="客户状态"
      >
        <template slot-scope="scope">
          {{ scope.row.status | busiStatus }}
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        label="报备状态"
      >
        <template slot-scope="scope">
          {{ scope.row.status | prepareStatus }}
        </template>
      </el-table-column>
      <el-table-column
        prop="matchUserName"
        header-align="center"
        align="center"
        label="顾问"
      >
      </el-table-column>

      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        label="保护期截至"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.expired | date("YYYY-MM-DD") }}</span>
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
            v-if="isAuth('busi:prepare:update')"
            type="text"
            size="small"
            @click="refresh(scope.row.id)"
            >刷新保护期</el-button
          >
          <!-- <el-button
            v-if="isAuth('busi:prepare:join') "
            type="text"
            size="small"
            @click="check(scope.row.id, -20)"
            >关联</el-button
          > -->
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
import AddOrUpdate from "./prepare-add-or-update";
import moment from "moment";
export default {
  data() {
    return {
      dataForm: {
        projectId: null,
        name: "",
        createdTimes: [],
        start: null,
        end: null,
        middleTypeId: null,
        status: null,
        busiStatus: null,
      },
      middleTypes: [],
      projects: [],
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      subtype: 0,
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
    this.queryProjects();
    this.queryMiddleType();
  },
  methods: {
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      if (this.dataForm.createdTimes && this.dataForm.createdTimes.length > 0) {
        this.dataForm.start = this.dataForm.createdTimes[0];
        this.dataForm.start = moment(this.dataForm.start).format("YYYY-MM-DD");
        if (this.dataForm.createdTimes.length > 1) {
          this.dataForm.end = this.dataForm.createdTimes[0];
          this.dataForm.end = moment(this.dataForm.end).format("YYYY-MM-DD");
        }
      }
      this.dataForm.status =
        this.dataForm.status && this.dataForm.status.length > 0
          ? this.dataForm.status
          : null;
      this.dataForm.busiStatus =
        this.dataForm.busiStatus && this.dataForm.busiStatus.length > 0
          ? this.dataForm.busiStatus
          : null;

      this.$http({
        url: this.$http.adornUrl("/busi/prepare/listPage4Admin"),
        method: "post",
        data: this.$http.adornData({
          page: this.pageIndex,
          limit: this.pageSize,
          name: this.dataForm.name,
          projectId: this.dataForm.projectId,
          start: this.dataForm.start,
          end: this.dataForm.end,
          middleTypeId: this.dataForm.middleTypeId,
          status: this.dataForm.status,
          busiStatus: this.dataForm.busiStatus,
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
    queryProjects() {
      this.$http.get("/busi/busiproject/listParent", {
        page: 0,
        limit: 1000,
        success: (data) => {
          this.projects = data.list;
        },
      });
    },
    listProject(queryString, cb) {
      let results = this.projects.filter((p) => {
        if (!queryString) {
          return true;
        }
        return p.name.indexOf(queryString) >= 0;
      });
      cb(results);
    },
    queryMiddleType() {
      this.$http.get("/busi/middletype/list", {
        page: 0,
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
    refresh(id, status) {
      var ids = id
        ? [id]
        : this.dataListSelections.map((item) => {
            return item.id;
          });
      if (!ids || ids.length <= 0) {
        return;
      }
      this.$confirm(
        `确定对[id=${ids.join(",")}]进行[${
          id ? "立即执行" : "批量立即执行"
        }]刷新保护期操作?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.$http({
            url: this.$http.adornUrl("/busi/prepare/refresh"),
            method: "post",
            data: this.$http.adornData({
              ids: ids,
            }),
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
  },
};
</script>
