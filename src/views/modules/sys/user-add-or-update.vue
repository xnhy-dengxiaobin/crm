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
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="dataForm.userName" placeholder="登录帐号"></el-input>
      </el-form-item>
      <el-form-item
        label="密码"
        prop="password"
        :class="{ 'is-required': !dataForm.id }"
      >
        <el-input
          v-model="dataForm.password"
          type="password"
          placeholder="密码"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="确认密码"
        prop="comfirmPassword"
        :class="{ 'is-required': !dataForm.id }"
      >
        <el-input
          v-model="dataForm.comfirmPassword"
          type="password"
          placeholder="确认密码"
        ></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="dataForm.name" placeholder="姓名"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="dataForm.email" placeholder="邮箱"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="dataForm.mobile" placeholder="手机号"></el-input>
      </el-form-item>

      <el-form-item label="关联项目" prop="projectIds">
        <el-select
          style="width: 100%"
          v-model="dataForm.projectIds"
          filterable
          multiple
          placeholder="请选择项目名称"
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
      <el-form-item label="头像" prop="path">
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
      <el-form-item label="APP角色" size="mini" prop="appRole">
        <el-radio-group v-model="dataForm.appRole">
          <el-radio
            v-for="role in appRoleList"
            :key="role.appRole"
            :label="role.appRole"
            >{{ role.name }}</el-radio
          >
        </el-radio-group>
      </el-form-item>
      <el-form-item label="角色" size="mini" prop="roleIdList">
        <el-checkbox-group v-model="dataForm.roleIdList">
          <el-checkbox
            v-for="role in roleList"
            :key="role.roleId"
            :label="role.roleId"
            >{{ role.roleName }}</el-checkbox
          >
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="状态" size="mini" prop="status">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="0">禁用</el-radio>
          <el-radio :label="1">正常</el-radio>
        </el-radio-group>
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
import { isEmail, isMobile } from "@/utils/validate";
export default {
  data() {
    var validatePassword = (rule, value, callback) => {
      if (!this.dataForm.id && !/\S/.test(value)) {
        callback(new Error("密码不能为空"));
      } else {
        callback();
      }
    };
    var validateComfirmPassword = (rule, value, callback) => {
      if (!this.dataForm.id && !/\S/.test(value)) {
        callback(new Error("确认密码不能为空"));
      } else if (this.dataForm.password !== value) {
        callback(new Error("确认密码与密码输入不一致"));
      } else {
        callback();
      }
    };
    var validateEmail = (rule, value, callback) => {
      if (!isEmail(value)) {
        callback(new Error("邮箱格式错误"));
      } else {
        callback();
      }
    };
    var validateMobile = (rule, value, callback) => {
      if (!isMobile(value)) {
        callback(new Error("手机号格式错误"));
      } else {
        callback();
      }
    };
    var validateName = (rule, value, callback) => {
      if (!this.dataForm.name && !/\S/.test(value)) {
        callback(new Error("姓名不能为空"));
      } else {
        callback();
      }
    };
    return {
      visible: false,
      roleList: [],
      appRoleList: [
        { appRole: 1, name: "销售经理" },
        { appRole: 2, name: "置业顾问" },
      ],
      dataForm: {
        id: 0,
        userName: "",
        password: "",
        comfirmPassword: "",
        salt: "",
        name: "",
        email: "",
        mobile: "",
        appRole: 0,
        projectIds: [],
        roleIdList: [],
        status: 1,
        head: "",
      },
      dataRule: {
        userName: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
        ],
        password: [{ validator: validatePassword, trigger: "blur" }],
        comfirmPassword: [
          { validator: validateComfirmPassword, trigger: "blur" },
        ],
        name: [
          { required: true, message: "姓名不能为空", trigger: "blur" },
          { validator: validateName, trigger: "blur" },
        ],
        email: [
          { required: true, message: "邮箱不能为空", trigger: "blur" },
          { validator: validateEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "手机号不能为空", trigger: "blur" },
          { validator: validateMobile, trigger: "blur" },
        ],
      },
      projects: [],
      headers: { token: Vue.cookie.get("token"), withCredentials: true },
      data: { dirId: "user" },
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
      this.$http({
        url: this.$http.adornUrl("/sys/role/select"),
        method: "get",
        params: this.$http.adornParams(),
      })
        .then(({ data }) => {
          this.roleList = data && data.code === 0 ? data.list : [];
        })
        .then(() => {
          this.visible = true;
          this.$nextTick(() => {
            this.$refs["dataForm"].resetFields();
          });
        })
        .then(() => {
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/sys/user/info/${this.dataForm.id}`),
              method: "get",
              params: this.$http.adornParams(),
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.dataForm.userName = data.user.username;
                this.dataForm.salt = data.user.salt;
                this.dataForm.name = data.user.name;
                this.dataForm.email = data.user.email;
                this.dataForm.mobile = data.user.mobile;
                this.dataForm.roleIdList = data.user.roleIdList;
                this.dataForm.status = data.user.status;
                this.dataForm.head = data.user.head;
                this.dataForm.appRole = data.user.appRole;
                if (this.dataForm.head) {
                  this.files = [
                    {
                      name: this.dataForm.name,
                      url: `${window.SITE_CONFIG.baseUrl}/busi/houselayout/downloadFP/${this.dataForm.head}`,
                    },
                  ];
                }
                this.dataForm.projectIds = data.user.projectIds;
              }
            });
          } else {
            this.files = [];
          }
        });
      this.queryProjects();
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(
              `/sys/user/${!this.dataForm.id ? "save" : "update"}`
            ),
            method: "post",
            data: this.$http.adornData({
              userId: this.dataForm.id || undefined,
              username: this.dataForm.userName,
              password: this.dataForm.password,
              salt: this.dataForm.salt,
              name: this.dataForm.name,
              email: this.dataForm.email,
              mobile: this.dataForm.mobile,
              status: this.dataForm.status,
              roleIdList: this.dataForm.roleIdList,
              head: this.dataForm.head,
              appRole: this.dataForm.appRole,
              projectIds: this.dataForm.projectIds,
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
      this.$http.get("/busi/busiproject/listParent", {
        userId: 0,
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
    handleSelect(item) {
      this.dataForm.projectId = item.id;
      this.dataForm.projectName = item.name;
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
      this.dataForm.head = response.files[0];
    },
  },
};
</script>
