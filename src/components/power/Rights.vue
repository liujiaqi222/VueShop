<template>
  <div>
    <!-- 🍞面板屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 🪧卡片视图区域 -->
    <el-card>
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="authName" label="权限名称"> </el-table-column>
        <el-table-column prop="path" label="路径"> </el-table-column>
        <el-table-column label="权限等级">
          <template #default="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'"
              >二级</el-tag
            >
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance } from "vue";
import { ElMessage } from "element-plus";

const axios = getCurrentInstance().appContext.config.globalProperties.$http;

let rightsList = ref([]);

async function getRightsList() {
  let { data } = await axios.get("rights/list");
  if (data.meta.status !== 200) {
    return ElMessage({
      showClose: true,
      message: "数据获取失败",
      type: "error",
    });
  }
  rightsList.value = data.data;
}
getRightsList();
</script>

<style scoped>
</style>