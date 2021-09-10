<template>
  <div>
    <!-- 🍞面板屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 🪧卡片视图区域 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col
          ><el-button type="primary" @click="dialogVisible = true"
            >添加角色</el-button
          ></el-col
        >
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="roleList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand" label="点击展开" width="80px">
        </el-table-column>

        <!-- 索引列 -->
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column label="操作" width="180px">
          <template #default="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              size="mini"
              @click="editRoles(scope.row.id)"
            ></el-button>
            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              size="mini"
              @click="deleteRoles(scope.row.id)"
            ></el-button>
            <!-- 分配权限 -->
            <el-tooltip
              effect="light"
              content="分配角色"
              placement="top-start"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                circle
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色的对话框 -->
    <el-dialog
      title="添加角色"
      v-model="dialogVisible"
      :width="mobile ? '80%' : '50%'"
      @close="clearForm"
    >
      <!-- 表单 -->
      <el-form
        :model="addRolesForm"
        :rules="addRolesRules"
        ref="myAddForm"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRoles">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 编辑角色的对话框 -->
    <el-dialog
      title="编辑角色"
      v-model="editDialogVisible"
      :width="mobile ? '80%' : '50%'"
      @close="clearEditForm"
    >
      <!-- 表单 -->
      <el-form
        :model="editRolesForm"
        :rules="editRolesRules"
        ref="myEditForm"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="putEditRoles">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import checkScreen from "../../hooks/checkScreenSize.js";

const axios = getCurrentInstance().appContext.config.globalProperties.$http;

// 检查手机尺寸
const mobile = checkScreen();

// 所有角色列表数据
let roleList = ref([]);
getRolesList();

async function getRolesList() {
  let { data } = await axios.get("roles");
  if (data.meta.status !== 200) {
    return ElMessage({
      showClose: true,
      message: "数据获取失败",
      type: "error",
    });
  }
  roleList.value = data.data;
}

let dialogVisible = ref(false);
let addRolesForm = reactive({});
let addRolesRules = {
  roleName: [
    { required: true, message: "请输入角色名称", trigger: "blur" },
    { min: 2, max: 16, message: "用户名长度在 2~16 个字符", trigger: "blur" },
  ],
};

let myAddForm = ref(null);
function clearForm() {
  myAddForm.value.resetFields();
}
// 添加角色
function addRoles() {
  myAddForm.value.validate(async (valid) => {
    if (!valid) {
      return ElMessage({
        showClose: true,
        message: "请填写合法的信息",
        type: "error",
      });
    }

    let { data } = await axios.post("/roles", addRolesForm);
    if (data.meta.status !== 201) {
      return ElMessage({
        showClose: true,
        message: "添加角色失败",
        type: "error",
      });
    }
    ElMessage({
      showClose: true,
      message: "添加角色成功成功",
      type: "success",
    });
    dialogVisible.value = false;
    getRolesList();
  });
}

// 删除角色
async function deleteRoles(id) {
  let confirmResults = await ElMessageBox.confirm(
    "此操作将永久删除该角色, 是否继续?",
    "提示",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }
  ).catch((err) =>
    ElMessage({
      type: "info",
      message: "已取消删除",
    })
  );

  if (confirmResults === "confirm") {
    const { data } = await axios.delete("roles/" + id);
    if (data.meta.status !== 200) {
      return ElMessage({
        message: "删除角色失败",
        type: "error",
      });
    }
    ElMessage({
      message: "删除角色成功",
      type: "success",
    });
    // 刷新列表
    getRolesList();
  }
}

// 编辑角色
let editRolesRules = {
  roleName: [
    { required: true, message: "请输入角色名称", trigger: "blur" },
    { min: 2, max: 16, message: "用户名长度在 2~16 个字符", trigger: "blur" },
  ],
};
let editDialogVisible = ref(false);
let editRolesForm = ref({});
let myEditForm = ref(null);
function clearEditForm() {
  myEditForm.value.resetFields();
}
async function editRoles(id) {
  editDialogVisible.value = true;
  const { data } = await axios.get("roles/" + id);
  if (data.meta.status !== 200) {
    return ElMessage({
      showClose: true,
      message: "数据获取失败",
      type: "error",
    });
  }
  editRolesForm.value = data.data;
}

async function putEditRoles() {
  myEditForm.value.validate(async (valid) => {
    if (!valid) {
      return ElMessage({
        message: "请填写合法的信息再提交",
        type: "error",
      });
    }
    let { data } = await axios.put("roles/" + editRolesForm.value.roleId, {
      roleName: editRolesForm.value.roleName,
      roleDesc: editRolesForm.value.roleDesc,
    });
    if (data.meta.status !== 200) {
      return ElMessage({
        message: "用户角色修改失败",
        type: "error",
      });
    }
    editDialogVisible.value = false;
    ElMessage({
      message: "用户角色修改成功",
      type: "success",
    });
    getRolesList();
  });
}
</script>

<style scoped>
.el-table {
  margin-top: 15px;
}
.el-form {
  position: relative;
}
</style>