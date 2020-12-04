<template>
  <el-dialog
    :title="!dataForm.id ? '分配' : '分配'"
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
      <el-form-item label="置业顾问" size="mini" prop="roleIdList">
        <el-radio-group v-model="dataForm.roleIdList">
          <el-radio
            v-for="role in roleList"
            :key="role.userId"
            :label="role.userId"
            >{{ role.name }}</el-radio
          >
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
      appRoleList: [{appRole: 1, name: '销售经理'}, {appRole: 2, name: '置业顾问'}],
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
    init(id, projectId) {
      this.dataForm.id = id || 0;
      this.$http({
        url: this.$http.adornUrl("/sys/user/salesByProjectId") + "?projectId=" + projectId,
        method: "post",
        params: this.$http.adornParams(),
      })
        .then(({ data }) => {
          this.roleList = data && data.code === 0 ? data.datas : [];
        })
        .then(() => {
          this.visible = true;
          this.$nextTick(() => {
            this.$refs["dataForm"].resetFields();
          });
        });
    },
    // 表单提交
    dataFormSubmit() {
    if (this.dataForm.roleIdList.length < 1) {
      alert("请选择分配的置业顾问");
      return
    }
      this.$http({
        url: this.$http.adornUrl(
          "/busi/manager/busicustomer/share?userIds=" + this.dataForm.roleIdList + "&customerIds=" + this.dataForm.id
        ),
        method: "get",
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
