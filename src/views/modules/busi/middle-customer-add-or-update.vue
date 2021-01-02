<template>
  <el-dialog
    :title="subtype ? '有效并分配' : !dataForm.id ? '新增' : '修改'"
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
      <el-form-item label="客户名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="客户名称"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-radio-group v-model="dataForm.sex">
          <el-radio label="男">男</el-radio>
          <el-radio label="女">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="dataForm.mobile" placeholder="手机"></el-input>
      </el-form-item>
      <el-form-item label="手机1" prop="mobile1" v-if="subtype != 10">
        <el-input v-model="dataForm.mobile1" placeholder="手机1"></el-input>
      </el-form-item>
      <el-form-item label="手机2" prop="mobile2" v-if="subtype != 10">
        <el-input v-model="dataForm.mobile2" placeholder="手机2"></el-input>
      </el-form-item>
      <el-form-item label="手机3" prop="mobile3" v-if="subtype != 10">
        <el-input v-model="dataForm.mobile3" placeholder="手机3"></el-input>
      </el-form-item>
      <el-form-item label="意向项目" prop="projectId">
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
      <el-form-item label="经纪人" prop="userName">
        <el-input
          v-model="dataForm.userName"
          placeholder="经纪人"
          :disabled="subtype === 10"
        ></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="dataForm.status">
          <el-radio label="0" :disabled="subtype === 10">待确认</el-radio>
          <el-radio label="-10" :disabled="subtype === 10">拒收无效</el-radio>
          <el-radio label="-20" :disabled="subtype === 10">手工无效</el-radio>
          <el-radio label="-30" :disabled="subtype === 10">过期无效</el-radio>
          <el-radio label="10" :disabled="subtype === 10">有效</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="顾问" prop="matchUserName">
        <el-select
          style="width: 100%"
          v-model="dataForm.matchUserId"
          @change="handleMatchNameSelect"
          filterable
          placeholder="请选择顾问姓名"
        >
          <el-option
            v-for="user in users"
            :key="user.userId"
            :label="user.name"
            :value="user.userId"
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
      users: [],
      subtype: 0,
      dataForm: {
        id: 0,
        name: "",
        sex: "男",
        mobile: "",
        mobile1: "",
        mobile2: "",
        mobile3: "",
        userId: "",
        userName: "",
        status: "",
        projectId: null,
        matchUserName: "",
      },
      dataRule: {
        name: [
          { required: true, message: "客户名称不能为空", trigger: "blur" },
        ],
        sex: [{ required: true, message: "性别不能为空", trigger: "blur" }],
        mobile: [{ required: true, message: "手机不能为空", trigger: "blur" }],
        mobile1: [
          { required: true, message: "手机1不能为空", trigger: "blur" },
        ],
        mobile2: [
          { required: true, message: "手机2不能为空", trigger: "blur" },
        ],
        mobile3: [
          { required: true, message: "手机3不能为空", trigger: "blur" },
        ],
        projectId: [
          { required: true, message: "意向楼ID不能为空", trigger: "blur" },
        ],
        userId: [
          { required: true, message: "中介销售ID不能为空", trigger: "blur" },
        ],
        status: [{ required: true, message: "状态不能为空", trigger: "blur" }],
      },
      projects: [],
    };
  },
  methods: {
    init(id, subtype) {
      this.dataForm.id = id || 0;
      this.subtype = subtype;
      this.visible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`/busi/prepare/info/${this.dataForm.id}`),
            method: "get",
            params: this.$http.adornParams(),
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.name = data.prepare.name;
              this.dataForm.sex = data.prepare.sex;
              this.dataForm.mobile = data.prepare.mobile;
              this.dataForm.mobile1 = data.prepare.mobile1;
              this.dataForm.mobile2 = data.prepare.mobile2;
              this.dataForm.mobile3 = data.prepare.mobile3;
              this.dataForm.projectId = data.prepare.projectId;
              this.dataForm.userId = data.prepare.userId;
              this.dataForm.userName = data.prepare.userName;
              this.dataForm.matchUserId = data.prepare.matchUserId;
              this.dataForm.matchUserName = data.prepare.matchUserName;
              this.dataForm.status = data.prepare.status;
              if (subtype === 10) {
                this.dataForm.status = "10";
              }
            }
          });
        }
      });
      this.queryProjects();
      this.queryMatchType();
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(
              `/busi/prepare/${!this.dataForm.id ? "save" : "update"}`
            ),
            method: "post",
            data: this.$http.adornData({
              id: this.dataForm.id || undefined,
              name: this.dataForm.name,
              sex: this.dataForm.sex,
              mobile: this.dataForm.mobile,
              mobile1: this.dataForm.mobile1,
              mobile2: this.dataForm.mobile2,
              mobile3: this.dataForm.mobile3,
              projectId: this.dataForm.projectId,
              userId: this.dataForm.userId,
              userName: this.dataForm.userName,
              status: this.dataForm.status,
              matchUserId: this.dataForm.matchUserId,
              matchUserName: this.dataForm.matchUserName,
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
        page: 1,
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
    queryMatchType() {
      this.$http.get("/sys/user/list", {
        page: 1,
        limit: 1000,
        success: (data) => {
          this.users = data.page.list;
        },
      });
    },
    listMatchType(queryString, cb) {
      let results = this.users.filter((p) => {
        if (!queryString) {
          return true;
        }
        return p.name.indexOf(queryString) >= 0;
      });
      cb(results);
    },
    async handleMatchNameSelect(item) {
      let o = await this.users.find((it) => {
        return it.userId === item;
      });
      console.log("OOOO" + o);
      this.dataForm.matchUserName = o ? o.name : "";
    },
  },
};
</script>
