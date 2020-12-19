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
      <el-form-item label="名称" prop="keyN">
        <el-input v-model="dataForm.keyN" placeholder="key"></el-input>
      </el-form-item>
      <el-form-item label="值" prop="value">
        <el-input v-model="dataForm.value" placeholder="value"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input v-model="dataForm.sort" placeholder="排序"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-input v-model="dataForm.status" placeholder="0：弃用"></el-input>
      </el-form-item>
      <el-form-item label="上级" prop="parentId">
        <el-input v-model="dataForm.parentId" placeholder="上级"></el-input>
      </el-form-item>
      <el-form-item label="树形路径" prop="tree">
        <el-input v-model="dataForm.tree" placeholder="树形路径"></el-input>
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
        keyN: "",
        value: "",
        sort: "",
        status: "",
        parentId: "",
        tree: "",
      },
      dataRule: {
        keyN: [{ required: true, message: "key不能为空", trigger: "blur" }],
        value: [{ required: true, message: "value不能为空", trigger: "blur" }],
        sort: [{ required: true, message: "排序不能为空", trigger: "blur" }],
        status: [
          { required: true, message: "0：弃用不能为空", trigger: "blur" },
        ],
        parentId: [
          { required: true, message: "上级不能为空", trigger: "blur" },
        ],
        tree: [
          {
            required: true,
            message: "从顶级到目前级别的id-路径不能为空",
            trigger: "blur",
          },
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
            url: this.$http.adornUrl(`/sys/setup/info/${this.dataForm.id}`),
            method: "get",
            params: this.$http.adornParams(),
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.keyN = data.setup.keyN;
              this.dataForm.value = data.setup.value;
              this.dataForm.sort = data.setup.sort;
              this.dataForm.status = data.setup.status;
              this.dataForm.parentId = data.setup.parentId;
              this.dataForm.tree = data.setup.tree;
            }
          });
        }
      });
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(
              `/sys/setup/${!this.dataForm.id ? "save" : "update"}`
            ),
            method: "post",
            data: this.$http.adornData({
              id: this.dataForm.id || undefined,
              keyN: this.dataForm.keyN,
              value: this.dataForm.value,
              sort: this.dataForm.sort,
              status: this.dataForm.status,
              parentId: this.dataForm.parentId,
              tree: this.dataForm.tree,
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
