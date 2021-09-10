<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 登录表单区域 -->
      <el-form
        ref="loginFormRef"
        label-width="80px"
        :model="loginForm"
        :rules="loginFormRules"
      >
        <!-- 用户名 -->
        <el-form-item label="用户名" class="info" prop="username">
          <el-input
            suffix-icon="iconfont icon-user"
            v-model="loginForm.username"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item label="密码" class="info" prop="password">
          <el-input
            suffix-icon="iconfont icon-3702mima"
            v-model="loginForm.password"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { ElMessage } from "element-plus";

export default {
  name: "login",
  data() {
    return {
      //这是登录表单的数据绑定的对象
      loginForm: {
        username: "admin",
        password: "123456",
      },
      //   表单的验证规则
      loginFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 1,
            max: 10,
            message: "长度在 1 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 18, message: "长度在 6到 18 个字符", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    //   重置表单
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields();
    },
    login() {
      //   拿到表单预验证的结果
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return;
        // 预验证成功，发起ajax请求
        let { data } = await this.$http.post("/login", this.loginForm);
        // 如果status为200，则验证通过
        if (data.meta.status !== 200) {
          return ElMessage({
            showClose: true,
            message: "用户名或密码错误，请重新输入",
            type: "error",
          });
        }

        ElMessage({
          showClose: true,
          message: "登录成功",
          type: "success",
        });
        // 1. 将登录成功之后的`token`，保存到客户端的 `sessionStorag`中
        window.sessionStorage.setItem("token", data.data.token);
        // 2. 通过编程式导航跳转到后台主页，路由地址是`/home`。
        this.$router.push("/home/users");
      });
    },
  },
};
</script>

<style lang='css'>
.login_container {
  background-color: #264a6b;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login_box {
  width: 90%;
  max-width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  display: flex;
  justify-content: center;
  position: relative;
}
.login_box .avatar_box {
  position: absolute;
  top: -75px;
  box-sizing: border-box;
  background-color: transparent;
  height: 130px;
  padding-top: 20px;
  width: 130px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 1px 3px 6px rgba(0, 0, 0, 0.1), -2px -3px 6px rgba(0, 0, 0, 0.1);
}
.login_box .avatar_box img {
  width: 80%;
  height: auto;
}

.el-form {
  box-sizing: border-box;
  bottom: 0;
  position: absolute;
  width: 100%;
  padding: 0 20px;
}

.btns {
  float: right;
}

.info label {
  color: #555;
  font-size: 18px;
}
</style>
