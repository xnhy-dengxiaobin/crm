<template>
  <div class="mod-config">
    <el-form
      :inline="true"
      :model="dataForm"
      @keyup.enter.native="getDataList()"
    >
      <el-form-item>
        <el-input
          v-model="dataForm.mobile"
          placeholder="手机号"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.status" clearable placeholder="状态">
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
        <el-button @click="getDataList()">查询</el-button>
        <!-- <el-button
          v-if="isAuth('busi:prepare:save')"
          type="primary"
          @click="addOrUpdateHandle()"
          >新增</el-button
        > -->
        <el-dropdown @command="batchOp">
          <el-button type="warning">
            批量操作<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-if="isAuth('busi:prepare:check')" command="pass"
              >有效</el-dropdown-item
            >
            <el-dropdown-item
              v-if="isAuth('busi:prepare:check')"
              command="reject"
              >无效</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
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
      <el-table-column label="接收时间" header-align="center" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createdTime | date }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="userName"
        header-align="center"
        align="center"
        label="经纪人"
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
        v-if="dataForm.status === '0' || dataForm.status === '10'"
        prop=""
        header-align="center"
        align="center"
        label="预约看房时间"
      >
      </el-table-column>
      <el-table-column
        v-if="dataForm.status === '0' || dataForm.status === '10'"
        header-align="center"
        align="center"
        label="客户意向"
      >
        <template slot-scope="scope">
          <span>{{
            scope.row.projectNames
              ? scope.row.projectNames
              : scope.row.projectName
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="dataForm.status === 0 || dataForm.status === 10"
        prop=""
        header-align="center"
        align="center"
        label="认知途径"
      >
      </el-table-column
      ><el-table-column
        v-if="dataForm.status === '0' || dataForm.status === '10'"
        prop=""
        header-align="center"
        align="center"
        label="客户描述"
      >
      </el-table-column>
      <el-table-column
        v-if="dataForm.status === 10"
        prop=""
        header-align="center"
        align="center"
        label="确认时间"
      >
      </el-table-column>
      <el-table-column
        v-if="dataForm.status === '10'"
        prop=""
        header-align="center"
        align="center"
        label="确认人"
      >
      </el-table-column>
      <el-table-column
        v-if="dataForm.status === '20'"
        prop="matchUserName"
        header-align="center"
        align="center"
        label="业务员"
      >
      </el-table-column>
      <el-table-column
        v-if="dataForm.status === '20'"
        prop=""
        header-align="center"
        align="center"
        label="分配时间"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.matchUserTime | date }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="dataForm.status === '20'"
        prop="assigner"
        header-align="center"
        align="center"
        label="分配人"
      >
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        label="状态"
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 0" size="small">待确认</el-tag>
          <el-tag
            v-else-if="scope.row.status === -10"
            size="small"
            type="danger"
            >拒收无效</el-tag
          >
          <el-tag
            v-else-if="scope.row.status === -20"
            size="small"
            type="danger"
            >手工无效</el-tag
          >
          <el-tag
            v-else-if="scope.row.status === -30"
            size="small"
            type="danger"
            >过期无效</el-tag
          >
          <el-tag v-else-if="scope.row.status === 10" size="small" type="danger"
            >有效</el-tag
          >
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
            v-if="isAuth('busi:prepare:check') && scope.row.status != 10"
            type="text"
            size="small"
            @click="check(scope.row.id, 10)"
            >有效</el-button
          >
          <el-button
            v-if="isAuth('busi:prepare:update') && scope.row.status === 10"
            type="text"
            size="small"
            @click="addOrUpdateHandle(scope.row.id, 10)"
            >分配</el-button
          >
          <el-button
            v-if="isAuth('busi:prepare:check') && scope.row.status === 10"
            type="text"
            size="small"
            @click="check(scope.row.id, -20)"
            >无效</el-button
          >
          <el-button
            v-if="isAuth('busi:prepare:update') && scope.row.status != 10"
            type="text"
            size="small"
            @click="addOrUpdateHandle(scope.row.id, 10)"
            >有效并分配</el-button
          >
          <!-- <el-button
            v-if="isAuth('busi:prepare:delete')"
            type="text"
            size="small"
            @click="deleteHandle(scope.row.id)"
            >删除</el-button
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
export default {
  data() {
    return {
      dataForm: {
        name: "",
        status: "0",
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      subtype: 0,
    };
  },
  components: {
    AddOrUpdate,
  },
  activated() {
    this.getDataList();
  },
  methods: {
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      this.$http({
        url: this.$http.adornUrl("/busi/prepare/listPage4Admin"),
        method: "post",
        data: this.$http.adornData({
          page: this.pageIndex,
          limit: this.pageSize,
          mobile: this.dataForm.mobile,
          prepareStatus: this.dataForm.status,
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
    check(id, status) {
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
        }]操作?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.$http({
            url: this.$http.adornUrl("/busi/prepare/check"),
            method: "post",
            data: this.$http.adornData({
              ids: ids,
              status: status,
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
    // 新增 / 修改
    addOrUpdateHandle(id, subtype) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id, subtype);
      });
    },
    batchOp(command) {
      switch (command) {
        case "pass":
          this.check("", 10);
          break;
        default:
          this.check("", -20);
          break;
      }
    },
    // 删除
    deleteHandle(id) {
      var ids = id
        ? [id]
        : this.dataListSelections.map((item) => {
            return item.id;
          });
      this.$confirm(
        `确定对[id=${ids.join(",")}]进行[${id ? "删除" : "批量删除"}]操作?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        this.$http({
          url: this.$http.adornUrl("/busi/prepare/delete"),
          method: "post",
          data: this.$http.adornData(ids, false),
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
      });
    },
  },
};
</script>
