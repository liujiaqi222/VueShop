<template>
  <div>
    <!-- 🍞面板屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 🪧卡片视图区域 -->
    <el-card>
      <div>
        <!-- 搜索区域 -->
        <el-row :gutter="20">
          <!-- span总数为24 -->
          <el-col :xs="{ span: 24 }" :sm="{ span: 12 }">
            <el-input
              placeholder="请输入内容"
              class="input"
              v-model="queryInfo.query"
              clearable
              @clear="getUserList"
              @keyup.enter="getUserList"
            >
              <template #append>
                <el-button
                  icon="el-icon-search"
                  @click="getUserList"
                ></el-button>
              </template>
            </el-input>
          </el-col>
          <el-col :xs="{ span: 24 }" :sm="{ span: 4 }">
            <el-button type="primary" @click="dialogVisible = true"
              >添加用户</el-button
            >
          </el-col>
        </el-row>
      </div>
      <!-- 用户列表区域 -->
      <el-table :data="userList" stripe style="width: 100%" border>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="username" label="姓名😎"> </el-table-column>
        <el-table-column prop="email" label="邮箱📭"> </el-table-column>
        <el-table-column prop="mobile" label="电话📱"> </el-table-column>
        <el-table-column prop="role_name" label="角色🧐"> </el-table-column>
        <el-table-column label="状态👌">
          <template #default="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="userStateChanged(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作🤷‍♀️" width="180px">
          <template #default="scope">
            <!-- 修改 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              size="mini"
              @click="removeUserById(scope.row.id)"
            ></el-button>
            <!-- 分配角色 -->
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
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户的对话框组件 -->
    <el-dialog
      title="添加用户"
      v-model="dialogVisible"
      :width="mobile ? '80%' : '50%'"
      @close="diaglogClose"
    >
      <!-- 对话框内容主体区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="myForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 修改用户的对话框 -->
    <el-dialog
      title="提示"
      v-model="editDialogVisible"
      :width="mobile ? '80%' : '50%'"
      @close="editDialogClose"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="myEditForm"
        label-width="70px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserInfo">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>


<script setup>
import { ElMessage, ElMessageBox } from "element-plus";
import { getCurrentInstance, onBeforeMount, ref, reactive, inject } from "vue";
const internalInstance = getCurrentInstance(); //记得引入getCurrentInstance
const axios = internalInstance.appContext.config.globalProperties.$http;

// 判断手机屏幕
import checkScreen from "../../hooks/checkScreenSize.js";
const mobile = checkScreen();

// 获取用户信息
// ================================
// 获取用户列表的参数对象 pagenum 当前在第几页 pagesize:显示的条数
const queryInfo = reactive({ query: "", pagenum: 1, pagesize: 2 });
// 用户信息
let userList = ref([]);
let total = ref(0);
async function getUserList() {
  const { data } = await axios.get("users", {
    params: queryInfo,
  });
  if (data.meta.status !== 200)
    return ElMessage({
      showClose: true,
      message: "数据获取失败",
      type: "error",
    });

  userList.value = data.data.users;
  total.value = data.data.total;
}
onBeforeMount(getUserList);

// 监听Switch开关状态的变化 保存用户状态的变化
// ==============================
// 发送put请求 请求路径：users/:uId/state/:type
async function userStateChanged(userInfo) {
  const { data } = await axios.put(
    `users/${userInfo.id}/state/${userInfo.mg_state}`
  );
  // 如果登录状态修改成功
  if (data.meta.status !== 200) {
    // 因为没有修改成功，所以立刻将状态改回去
    userInfo.mg_state = !userInfo.mg_state;
    return ElMessage({
      showClose: true,
      message: "修改用户状态失败",
      type: "error",
    });
  }
  ElMessage({
    showClose: true,
    message: "修改用户状态成功",
    type: "success",
  });
}

// 实现分页效果
// ========================
//监听pagesize改变的事件 处理每页显示的条数变化
function handleSizeChange(newSize) {
  console.log(newSize);
  queryInfo.pagesize = newSize;
  // 重新发起请求
  getUserList();
}
// 监听页码的变化
function handleCurrentChange(newPage) {
  queryInfo.pagenum = newPage;
  getUserList();
}

// 添加用户对话框功能
// ============================
let dialogVisible = ref(false); // 控制对话框的显示与隐藏
let addForm = reactive({
  username: "",
  password: "",
  email: "",
  mobile: "",
}); // 表单数据

// 邮箱验证规则
const checkEmail = (rules, value, callback) => {
  const refEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
  // 校验成功
  if (refEmail.test(value)) return callback();
  callback(new Error("请输入合法的邮箱"));
};
// 手机号验证规则
const checkMobile = (rules, value, callback) => {
  const refMobile =
    /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
  // 校验成功
  if (refMobile.test(value)) return callback();
  callback(new Error("请输入合法的手机号码"));
};

//表单验证规则
let addFormRules = reactive({
  username: [
    { required: true, message: "请输入用户名称", trigger: "blur" },
    { min: 3, max: 10, message: "用户名长度在 3~10 个字符", trigger: "blur" },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, max: 16, message: "用户名长度在 6~16 个字符", trigger: "blur" },
  ],
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    { validator: checkEmail, trigger: "blur" },
  ],
  mobile: [
    { required: true, message: "请输入手机号", trigger: "blur" },
    { validator: checkMobile, trigger: "blur" },
  ],
});

// 对话框关闭，重置表单
const myForm = ref(null);
function diaglogClose() {
  myForm.value.resetFields();
}

// 添加用户功能
//========================
function addUser() {
  myForm.value.validate(async (valid) => {
    if (!valid)
      return ElMessage({
        showClose: true,
        message: "请填写合法的信息",
        type: "error",
      });
    // 发起请求
    let { data } = await axios.post("users", addForm);
    if (data.meta.status !== 201) {
      return ElMessage({
        showClose: true,
        message: "添加用户失败，请稍后再试",
        type: "error",
      });
    }
    ElMessage({
      showClose: true,
      message: "添加用户成功",
      type: "success",
    });
    // 关闭对话框
    dialogVisible.value = false;
    // 刷新用户列表
    getUserList();
  });
}

// 展示编辑用户的对话框
let editDialogVisible = ref(false);
let editForm = ref({});
let editFormRules = reactive({
  email: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { validator: checkEmail, trigger: "blur" },
  ],
  mobile: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { validator: checkMobile, trigger: "blur" },
  ],
});
async function showEditDialog(id) {
  editDialogVisible.value = true;
  const { data } = await axios.get("users/" + id);
  if (data.meta.status !== 200)
    return ElMessage({
      showClose: true,
      message: "查询用户信息失败",
      type: "error",
    });
  editForm.value = data.data;
}

let myEditForm = ref(null);
// 监听修改用户对话框的关闭的事件
function editDialogClose() {
  myEditForm.value.resetFields();
}

// 修改用户信息并提交
function editUserInfo() {
  myEditForm.value.validate(async (valid) => {
    if (!valid)
      return ElMessage({
        showClose: true,
        message: "请填写合法的信息",
        type: "error",
      });
    let { data } = await axios.put("users/" + editForm.value.id, {
      email: editForm.value.email,
      mobile: editForm.value.mobile,
    });
    if (data.meta.status !== 200) {
      return ElMessage({
        showClose: true,
        message: "更新用户信息失败",
        type: "error",
      });
    }
    // 关闭对话框
    editDialogVisible.value = false;
    ElMessage({
      showClose: true,
      message: "更新用户信息成功",
      type: "success",
    });
    // 刷新用户列表
    getUserList();
  });
}

// 删除用户
async function removeUserById(id) {
  // 弹窗提示用户
  const confirmResult = await ElMessageBox.confirm(
    "此操作将永久删除该用户, 是否继续?",
    "提示",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }
  ).catch((err) =>
    ElMessage({
      showClose: true,
      message: "取消删除",
      type: "info",
    })
  );
  // 如果用户确认删除
  if (confirmResult === "confirm") {
    let { data } = await axios.delete("users/" + id);
    if (data.meta.status !== 200)
      return ElMessage({
        showClose: true,
        message: "删除用户失败",
        type: "error",
      });

    ElMessage({
      showClose: true,
      message: "删除用户成功",
      type: "success",
    });
    // 刷新用户列表
    getUserList();
  }
}
</script>


<style scoped>
.el-col {
  margin: 10px 0;
}
.el-table {
  margin-top: 15px;
  font-size: 12px;
}

.el-form {
  margin: 0;
  position: relative;
}
</style>