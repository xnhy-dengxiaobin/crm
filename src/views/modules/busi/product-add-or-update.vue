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

      <el-form-item
        label="名称"
        prop="name"
      >
        <el-input
          v-model="dataForm.name"
          placeholder="名称"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="上级项目"
        prop="parentId"
      >
          <el-select v-model="dataForm.parentId" filterable >
            <el-option :value="parent.id" :label="parent.name" v-for="parent in parents">{{ parent.name }}</el-option>
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
        type: 1,
        parents: [],
        name: "",
        parentId: "",
        parentName: "",
        url: "",
        perms: "",
        orderNum: 0,
      },
      dataRule: {
        name: [
          { required: true, message: "项目名称不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.$http({
        url: this.$http.adornUrl(
          `/busi/busiproject/listParent`
        ),
        method: "post"
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.parents = data.list;
        } else {
          // this.$message.error(data.msg);
        }
      });
  },
  methods: {
    init(id) {
      this.dataForm.id = id || 0;
      // 修改
      this.$http({
        url: this.$http.adornUrl(`/busi/busiproject/info/${this.dataForm.id}`),
        method: "get",
        params: this.$http.adornParams(),
      }).then(({ data }) => {
        this.visible = true;
        this.$refs["dataForm"].resetFields();
        if (data && data.busiProject && data.code === 0) {
          this.dataForm.id = data.busiProject.id;
          this.dataForm.name = data.busiProject.name;
          this.dataForm.parentId = data.busiProject.parentId;
        }
      });
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(
              `/busi/busiproject/${!this.dataForm.id ? "save" : "update"}`
            ),
            method: "post",
            data: this.$http.adornData({
              id: this.dataForm.id || undefined,
              name: this.dataForm.name,
              parentId: this.dataForm.parentId
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

<style lang="scss">
.mod-menu {
  .menu-list__input,
  .icon-list__input {
    > .el-input__inner {
      cursor: pointer;
    }
  }
  &__icon-popover {
    width: 458px;
    overflow: hidden;
  }
  &__icon-inner {
    width: 478px;
    max-height: 258px;
    overflow-x: hidden;
    overflow-y: auto;
  }
  &__icon-list {
    width: 458px;
    padding: 0;
    margin: -8px 0 0 -8px;
    > .el-button {
      padding: 8px;
      margin: 8px 0 0 8px;
      > span {
        display: inline-block;
        vertical-align: middle;
        width: 18px;
        height: 18px;
        font-size: 18px;
      }
    }
  }
  .icon-list__tips {
    font-size: 18px;
    text-align: center;
    color: #e6a23c;
    cursor: pointer;
  }
}
</style>
