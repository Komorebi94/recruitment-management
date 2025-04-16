<template>
    <div class="admin-layout">
        <!-- 侧边栏 -->
        <div class="sidebar">
            <el-menu
                :default-active="activeMenu"
                router
                class="el-menu-vertical-demo"
                background-color="#001529"
                text-color="#fff"
                active-text-color="#ffd04b"
                :collapse="isCollapse"
                @open="handleOpen"
                @close="handleClose"
            >
                <el-menu-item index="/admin/post-job">
                    <el-icon><DocumentAdd /></el-icon>
                    <span>职位发布</span>
                </el-menu-item>
                <el-menu-item index="/admin/job-list">
                    <el-icon><List /></el-icon>
                    <span>发布列表</span>
                </el-menu-item>
                <el-menu-item index="/admin/interviews">
                    <el-icon><DocumentChecked /></el-icon>
                    <span>面试列表</span>
                </el-menu-item>
                <!-- <el-menu-item index="/admin/drafts">
                    <el-icon><Document /></el-icon>
                    <span>草稿箱</span>
                </el-menu-item> -->
                <!-- <el-menu-item index="/admin/applications">
                    <el-icon><DocumentChecked /></el-icon>
                    <span>投递列表</span>
                </el-menu-item> -->
            </el-menu>
            <span class="toggle-button" @click="isCollapse = !isCollapse">
                <el-icon v-if="!isCollapse"><ArrowLeft /></el-icon>
                <el-icon v-else><ArrowRight /></el-icon>
            </span>
        </div>

        <!-- 主内容 -->
        <div class="main-content"><router-view /></div>
    </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import {
    DocumentAdd,
    List,
    Document,
    DocumentChecked,
    ArrowLeft,
    ArrowRight
} from "@element-plus/icons-vue";
import { ref } from "vue";

const isCollapse = ref(false);

const handleOpen = () => {
    console.log("handleOpen");
};

const handleClose = () => {
    console.log("handleClose");
};

const route = useRoute();
const activeMenu = route.path;
</script>

<style lang="scss" scoped>
.admin-layout {
    width: 100%;
    height: 100%;
    display: flex;
    .sidebar {
        position: relative;
        padding-top: 30px;
        background-color: #001529;
        .el-menu {
            border-right: 1px solid #001529;
        }
        .toggle-button {
            position: absolute;
            top: 20px;
            right: 20px;
            transform: translateY(-50%);
            width: 20px;
            height: 20px;
            border-radius: 50%;
            cursor: pointer;
            border: 1px solid #ccc;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
        }
    }

    .main-content {
        flex: 1;
        padding: 20px;
        background-color: #f0f2f5;
        height: calc(100vh - 60px);
        overflow-y: auto;
    }
}

.header {
    background-color: #f5f5f5;
    padding-left: 20px;
    font-size: 18px;
    line-height: 60px;
    border-bottom: 1px solid #ddd;
}
</style>
