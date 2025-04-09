<template>
    <el-container class="app-container">
        <!-- 顶部导航 -->
        <el-header class="header">
            <div class="logo" @click="goToHome">招聘管理系统</div>
            <div class="nav">
                <el-button v-if="!user" type="primary" @click="goToLogin"
                    >登录 / 注册</el-button
                >
                <el-dropdown v-else>
                    <el-button type="primary">
                        个人中心 <el-icon><arrow-down /></el-icon>
                    </el-button>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item @click="goToProfile"
                                >个人资料</el-dropdown-item
                            >
                            <el-dropdown-item @click="logout"
                                >退出登录</el-dropdown-item
                            >
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </el-header>

        <!-- 页面内容 -->
        <el-main class="main-content">
            <router-view />
        </el-main>

        <!-- 底部 -->
        <el-footer class="footer">
            <p>© 2025 招聘管理系统. All Rights Reserved.</p>
        </el-footer>
    </el-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useUserStore } from "@/store/user";
import { useRouter } from "vue-router";
import { ArrowDown } from "@element-plus/icons-vue";

const userStore = useUserStore();
const router = useRouter();
const user = ref(userStore.user);

const goToHome = () => router.push("/");
const goToLogin = () => router.push("/login");
const goToProfile = () => router.push("/profile");

const logout = () => {
    userStore.logout();
    user.value = null;
    router.push("/");
};
</script>
<style scoped>
.app-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 30px;
    background: #409eff;
    color: white;
}

.logo {
    font-size: 20px;
    font-weight: bold;
    cursor: pointer;
}

.main-content {
    flex: 1;
    padding: 0;
}

/* 过渡动画 */
.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: all 0.5s ease;
}

.fade-slide-enter-from {
    opacity: 0;
    transform: translateY(-20px);
}

.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(20px);
}

.footer {
    text-align: center;
    padding: 20px;
    background: #303133;
    color: white;
}
</style>
