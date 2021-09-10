<template>
  <el-container>
    <!-- 头部区域 -->
    <el-header>
      <div>
        <div class="logo"><img src="../assets/logo.png" alt="" /></div>
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout" :size="mobile ? 'mini' : 'medium'"
        >退出登录</el-button
      >
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '70px' : '200px'">
        <div id="collapseControl">
          <button @click="isCollapse = !isCollapse" v-if="!mobile">
            <d-arrow-left
              style="width: 2em; height: 2em"
              v-show="!isCollapse"
            />
            <d-arrow-right
              style="width: 2em; height: 2em"
              v-show="isCollapse"
            />
          </button>
        </div>
        <el-menu
          :collapse="isCollapse"
          unique-opened
          :collapse-transition="false"
          :router="true"
          :default-active="$route.path"
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="index + ''"
            v-for="(menu, index) in menuList"
            :key="menu.id"
          >
            <template #title>
              <i :class="iconsObj[menu.id]"></i>
              <span>{{ menu.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/home/' + submenu.path"
              v-for="submenu in menu.children"
              :key="submenu.id"
            >
              <template #title>
                <i class="el-icon-menu"></i>
                <span>{{ submenu.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { getCurrentInstance, onBeforeMount, ref, defineComponent } from "vue";
import { DArrowLeft, DArrowRight } from "@element-plus/icons";

export default defineComponent({
  components: {
    DArrowLeft,
    DArrowRight,
  },
  setup() {
    let isCollapse = ref(false);
    let mobile = ref(null);
    // 判断是否为手机屏幕
    function checkScreenSize() {
      if (window.innerWidth <= 768) {
        mobile.value = true;
        isCollapse.value = true;
      } else {
        mobile.value = false;
      }
    }
    // 一开始就要调用一下函数
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    let menuList = ref([]);
    // 定义图标对象
    const iconsObj = {
      125: "iconfont icon-user",
      103: "iconfont icon-tijikongjian",
      101: "iconfont icon-shangpin",
      102: "iconfont icon-danju",
      145: "iconfont icon-baobiao",
    };
    const router = useRouter();
    function logout() {
      // 清空token
      window.sessionStorage.removeItem("token");
      // 重新导航到登录页
      router.push("/login");
    }
    // 获取菜单的数据
    onBeforeMount(async () => {
      const internalInstance = getCurrentInstance();
      const axios = internalInstance.appContext.config.globalProperties.$http;
      let { data } = await axios.get("menus");
      // 如果没有获取到数据，弹框提示用户
      if (data.meta.status !== 200)
        return ElMessage({
          showClose: true,
          message: "获取不到菜单数据",
          type: "error",
        });
      menuList.value = data.data;
    });

    return { logout, menuList, iconsObj, isCollapse, mobile };
  },
});
</script>

<style scoped>
.el-container {
  height: 100%;
}
.el-header {
  background-color: #14213d;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.el-header > div {
  display: flex;
  justify-content: center;
  align-items: center;
}

.el-header > div span {
  color: white;
  margin-left: 20px;
  font-size: 1.2rem;
}
.el-header .logo {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background-color: transparent;
  box-shadow: 0px 4px 5px rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
}

.el-header .logo img {
  width: 60%;
  height: auto;
}

.el-aside {
  background-color: #fff;
}

.el-menu {
  box-sizing: border-box;
  border: none;
}
#collapseControl {
  display: flex;
  justify-content: flex-end;
  color: #e5e5e5;
}

#collapseControl button {
  cursor: pointer;
  border: none;
  background-color: transparent;
  border-radius: 4px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  margin-right: 18px;
  z-index: 999;
}

.el-main {
  background-color: #e5e5e5;
}

.iconfont {
  margin-right: 8px;
}
</style>