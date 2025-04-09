<template>
    <el-container class="admin-layout">
        <!-- 侧边栏 -->
        <el-aside width="200px" class="sidebar">
            <el-menu
                :default-active="activeMenu"
                router
                class="el-menu-vertical-demo"
                background-color="#001529"
                text-color="#fff"
                active-text-color="#ffd04b"
            >
                <el-menu-item index="/admin/post-job">
                    <el-icon><DocumentAdd /></el-icon>
                    <span>职位发布</span>
                </el-menu-item>
                <el-menu-item index="/admin/job-list">
                    <el-icon><List /></el-icon>
                    <span>发布列表</span>
                </el-menu-item>
                <el-menu-item index="/admin/drafts">
                    <el-icon><Document /></el-icon>
                    <span>草稿箱</span>
                </el-menu-item>
                <el-menu-item index="/admin/applications">
                    <el-icon><DocumentChecked /></el-icon>
                    <span>投递列表</span>
                </el-menu-item>
            </el-menu>
        </el-aside>

        <!-- 主内容 -->
        <el-container>
            <el-header class="header">招聘后台管理系统</el-header>
            <el-main class="main-content">
                <router-view />
            </el-main>
        </el-container>
    </el-container>
</template>

<script setup>
import { useRoute } from "vue-router";
import {
    DocumentAdd,
    List,
    Document,
    DocumentChecked,
} from "@element-plus/icons-vue";

const route = useRoute();
const activeMenu = route.path;
</script>

<style lang="scss" scoped>
.admin-layout {
    height: 100vh;
}

.sidebar {
    background-color: #001529;
}

.header {
    background-color: #f5f5f5;
    padding-left: 20px;
    font-size: 18px;
    line-height: 60px;
    border-bottom: 1px solid #ddd;
}

.main-content {
    padding: 20px;
    background-color: #f0f2f5;
    height: calc(100vh - 60px);
    overflow-y: auto;
}
</style>
