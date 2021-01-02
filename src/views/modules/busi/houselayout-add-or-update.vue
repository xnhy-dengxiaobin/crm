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
      <el-form-item label="项目" prop="projectName">
        <el-autocomplete
          popper-class="my-autocomplete"
          v-model="dataForm.projectName"
          :fetch-suggestions="listProject"
          placeholder="请输入项目名称"
          @select="handleSelect"
        >
          <i
            class="el-icon-edit el-input__icon"
            slot="suffix"
            @click="handleIconClick"
          >
          </i>
          <template slot-scope="{ item }">
            <div class="name">{{ item.id }}</div>
            <span class="addr">{{ item.name }}</span>
          </template>
        </el-autocomplete>
      </el-form-item>
      <el-form-item label="图片名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="图片名称"></el-input>
      </el-form-item>
      <el-form-item label="图片说明" prop="memo">
        <el-input
          type="textarea"
          :rows="2"
          v-model="dataForm.memo"
          placeholder="图片说明"
        ></el-input>
      </el-form-item>
      <el-form-item label="图片" prop="path">
        <el-upload
          :with-credentials="true"
          :headers="headers"
          name="uploads"
          :data="data"
          :action="uploadUrl"
          list-type="picture-card"
          :auto-upload="true"
          :limit="1"
          :on-success="hanldeSuccess"
          :file-list="files"
        >
          <i slot="default" class="el-icon-plus"></i>
          <div slot="file" slot-scope="{ file }">
            <img
              class="el-upload-list__item-thumbnail"
              :src="file.url"
              alt=""
            />
            <span class="el-upload-list__item-actions">
              <span
                class="el-upload-list__item-preview"
                @click="handlePictureCardPreview(file)"
              >
                <i class="el-icon-zoom-in"></i>
              </span>
              <span
                v-if="!disabled"
                class="el-upload-list__item-delete"
                @click="handleDownload(file)"
              >
                <i class="el-icon-download"></i>
              </span>
              <span
                v-if="!disabled"
                class="el-upload-list__item-delete"
                @click="handleRemove(file)"
              >
                <i class="el-icon-delete"></i>
              </span>
            </span>
          </div>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Vue from "vue";
export default {
  data() {
    return {
      visible: false,
      dataForm: {
        id: 0,
        projectId: "",
        projectName: "",
        name: "",
        memo: "",
        path: "",
      },
      dataRule: {
        projectId: [
          { required: true, message: "项目id不能为空", trigger: "blur" },
        ],
        name: [
          { required: true, message: "图片名称不能为空", trigger: "blur" },
        ],
        memo: [
          { required: true, message: "图片说明不能为空", trigger: "blur" },
        ],
        path: [
          { required: true, message: "图片路径不能为空", trigger: "blur" },
        ],
      },
      projects: [],
      headers: { token: Vue.cookie.get("token"), withCredentials: true },
      data: { dirId: "houseLayout" },
      files: [],
      uploadUrl: `${window.SITE_CONFIG.baseUrl}/busi/houselayout/upload`,
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
    };
  },
  methods: {
    init(id) {
      this.dataForm.id = id || 0;
      this.visible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
        this.files = [];
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(
              `/busi/houselayout/info/${this.dataForm.id}`
            ),
            method: "get",
            params: this.$http.adornParams(),
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.projectId = data.houseLayout.projectId;
              this.dataForm.projectName = data.houseLayout.projectName;
              this.dataForm.name = data.houseLayout.name;
              this.dataForm.memo = data.houseLayout.memo;
              this.dataForm.path = data.houseLayout.path;
              this.files = [
                {
                  name: this.dataForm.name,
                  url: `${window.SITE_CONFIG.baseUrl}/busi/houselayout/downloadFP/${this.dataForm.path}`,
                },
              ];
            }
          });
        }
        this.queryProjects();
      });
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(
              `/busi/houselayout/${!this.dataForm.id ? "save" : "update"}`
            ),
            method: "post",
            data: this.$http.adornData({
              id: this.dataForm.id || undefined,
              projectId: this.dataForm.projectId,
              name: this.dataForm.name,
              memo: this.dataForm.memo,
              path: this.dataForm.path,
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
    queryProjects() {
      this.$http.get("/busi/busiproject/list", {
        page: 1,
        limit: 1000,
        success: (data) => {
          this.projects = data.page.list;
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
    handleSelect(item) {
      this.dataForm.projectId = item.id;
      this.dataForm.projectName = item.name;
    },
    handleIconClick(ev) {
      console.log(ev);
    },
    // 文件上传相关
    handleRemove(file) {
      console.log(file);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleDownload(file) {
      console.log(file);
    },
    hanldeSuccess(response, file, fileList) {
      this.dataForm.path = response.files[0];
    },
  },
  mounted() {
    this.queryProjects();
  },
};
</script>
<style lang="scss">
.el-autocomplete {
  width: 100%;
}
</style>