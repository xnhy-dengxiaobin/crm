<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="80px"
    >
      <el-form-item label="名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="名称"></el-input>
      </el-form-item>
      <el-form-item label="上级身份" prop="parentId">
        <el-select
          style="width: 100%"
          v-model="dataForm.parentId"
          filterable
          placeholder="请选择上级身份"
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
      <el-form-item label="所属项目" prop="projectId">
        <el-select
          style="width: 100%"
          v-model="dataForm.projectId"
          filterable
          placeholder="请选择项目名称"
        >
          <el-option
            v-for="project in projects"
            :key="project.id"
            :label="project.name"
            :value="project.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      dataForm: {
        id: 0,
        name: "",
        type: 1,
        status: 1,
        parentId: null,
        projectId: null,
      },
      middleTypes: [],
      projects: [],
      dataRule: {
        name: [{ required: true, message: "名称不能为空", trigger: "blur" }],
        type: [{ required: true, message: "类型不能为空", trigger: "blur" }],
        status: [{ required: true, message: "状态不能为空", trigger: "blur" }],
        projectId: [
          { required: true, message: "所属项目不能为空", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    init(id) {
      this.dataForm.id = id || 0;
      this.visible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(
              `/busi/middletype/info/${this.dataForm.id}`
            ),
            method: "get",
            params: this.$http.adornParams(),
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.name = data.middleType.name;
              this.dataForm.type = data.middleType.type;
              this.dataForm.status = data.middleType.status;
              this.dataForm.parentId = data.middleType.parentId;
              this.dataForm.projectId = data.middleType.projectId;
            }
          });
        }
        this.queryMiddleType();
        this.queryProjects();
      });
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
    queryProjects() {
      this.$http.get("/busi/busiproject/listParent", {
        page: 1,
        limit: 1000,
        success: (data) => {
          this.projects = data.list;
        },
      });
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(
              `/busi/middletype/${!this.dataForm.id ? "save" : "update"}`
            ),
            method: "post",
            data: this.$http.adornData({
              id: this.dataForm.id || undefined,
              name: this.dataForm.name,
              type: this.dataForm.type,
              status: this.dataForm.status,
              parentId: this.dataForm.parentId,
              projectId: this.dataForm.projectId,
            }),
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.visible = false;
                  this.$emit("refreshDataList");
                },
              });
            } else {
              this.$message.error(data.msg);
            }
          });
        }
      });
    },
  },
};
</script>
