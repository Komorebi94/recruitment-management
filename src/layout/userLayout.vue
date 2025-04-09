<template>
    <el-container class="user-layout">
        <!-- 顶部导航栏 -->
        <el-header class="user-header">
            <div class="logo">招聘系统 · 求职者中心</div>
            <div class="user-info">
                <span class="username">{{ userInfo.username }}</span>
                <el-button type="danger" size="small" @click="logout"
                    >退出</el-button
                >
            </div>
        </el-header>

        <!-- 页面主体 -->
        <el-main class="user-main">
            <el-menu
                mode="horizontal"
                :default-active="activeMenu"
                router
                class="user-menu"
                background-color="#fff"
                text-color="#333"
                active-text-color="#409EFF"
            >
                <el-menu-item index="/user/profile">个人信息</el-menu-item>
                <el-menu-item index="/user/resume">简历编辑</el-menu-item>
                <el-menu-item index="/user/applied">投递记录</el-menu-item>
            </el-menu>

            <div class="user-content">
                <router-view />
            </div>
        </el-main>
    </el-container>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";

// 模拟登录信息，实际使用中应从 pinia 或 indexedDB 获取
const userInfo = ref({
    username: localStorage.getItem("user") || "用户",
});

const route = useRoute();
const router = useRouter();
const activeMenu = ref(route.path);

const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    ElMessage.success("已退出登录");
    router.push("/login");
};
</script>

<style lang="scss" scoped>
.user-layout {
    height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: #f5f5f5;
}

.user-header {
    background-color: #ffffff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    height: 60px;
    border-bottom: 1px solid #eee;

    .logo {
        font-weight: bold;
        font-size: 18px;
    }

    .user-info {
        display: flex;
        align-items: center;

        .username {
            margin-right: 12px;
        }
    }
}

.user-main {
    flex: 1;
    padding: 0 20px;

    .user-menu {
        margin: 10px 0;
    }

    .user-content {
        background-color: #fff;
        padding: 20px;
        border-radius: 8px;
        min-height: calc(100vh - 130px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }
}
</style>
