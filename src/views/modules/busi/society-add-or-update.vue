<template>
  <el-dialog
    :title="dataForm.id ? '新增' : '修改'"
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
        <el-autocomplete
          :disabled="!isAdd"
          v-model="dataForm.name"
          :fetch-suggestions="queryCustomer"
          placeholder="请输入内容"
          @select="handleSelect"
          value-key="name"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="行销" prop="sourceUserName">
        <el-input
          v-model="dataForm.sourceUserName"
          placeholder="行销"
        ></el-input>
      </el-form-item>
      <el-form-item label="行销手机号码" prop="sourceMobile">
        <el-input
          v-model="dataForm.sourceMobile"
          placeholder="行销手机号码"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import DataUtil from "../../../utils/data-util";
export default {
  data() {
    return {
      actionId: "society",
      menuId: "society",
      dataUtil: null,
      visible: false,
      users: [],
      isAdd: true,
      dataForm: {
        id: 0,
        name: "",
        sourceUserName: "",
        sourceMobile: "",
      },
      dataRule: {
        name: [{ required: true, message: "客户不能为空", trigger: "blur" }],
        sourceUserName: [
          { required: true, message: "行销名称不能为空", trigger: "blur" },
        ],
        sourceMobile: [
          { required: true, message: "行销手机不能为空", trigger: "blur" },
        ],
      },
      projects: [],
    };
  },
  methods: {
    init(id, subtype) {
      this.dataForm.id = id || 0;
      this.visible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
        if (this.dataForm.id) {
          this.isAdd = false;
          this.dataUtil.exec({
            steps: [{ type: "grv", name: "society/SocietyStep" }],
            dataParam: {
              op: "get",
              id: this.dataForm.id,
            },
            success: (res) => {
              if (res && res.code) {
                this.dataForm.name = res.data.name;
                this.dataForm.sourceUserName = res.data.source_user_name;
                this.dataForm.sourceMobile = res.data.source_user_mobile;
              } else {
                this.dataForm.name = "";
                this.dataForm.sourceUserName = "";
                this.dataForm.sourceMobile = "";
              }
              this.dataListLoading = false;
            },
            error: (err) => {
              console.log(err);
            },
          });
        } else {
          this.isAdd = true;
        }
      });
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          this.dataUtil.exec({
            steps: [{ type: "grv", name: "society/SocietyStep" }],
            dataParam: {
              op: "save",
              cus: this.dataForm,
            },
            success: (res) => {
              if (res && res.code) {
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
                this.$message.error(res.msg);
              }
              this.dataListLoading = false;
            },
            error: (err) => {
              console.log(err);
            },
          });
        }
      });
    },
    queryCustomer(name, cb) {
      if (!name) {
        return;
      }
      var customers = [];

      this.dataUtil.exec({
        steps: [{ type: "grv", name: "society/SocietyStep" }],
        dataParam: {
          op: "queryCustomer",
          name: name,
        },
        success: (res) => {
          if (res && res.code) {
            this.customers = res.data.customers;
          } else {
            this.customers = [];
          }
          cb(this.customers);
        },
        error: (err) => {
          console.log(err);
        },
      });
    },
    async handleSelect(item) {
      this.dataForm.id = item ? item.id : null;
    },
  },
  created() {
    this.dataUtil = new DataUtil(this);
  },
};
</script>
