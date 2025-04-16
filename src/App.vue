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
                        {{ user.username }} <el-icon><arrow-down /></el-icon>
                    </el-button>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item v-if="user.email !== 'admin@gmail.com'" @click="goToProfile"
                                >个人信息</el-dropdown-item
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
        <el-main class="app-main">
            <router-view />
        </el-main>

        <!-- 底部 -->
        <el-footer class="footer">
            <p>© 2025 招聘管理系统. All Rights Reserved.</p>
        </el-footer>
    </el-container>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";
import { ArrowDown } from "@element-plus/icons-vue";

const userStore = useUserStore();
const router = useRouter();
const user = ref(userStore.getUser());

// 监听 userStore 中用户信息的变化
watch(
    () => userStore.getUser(),
    (newUser) => {
        user.value = newUser;
        console.log("userStore", newUser);
    }
);

const goToHome = () => router.push("/");
const goToLogin = () => router.push("/login");
const goToProfile = () => {
    // 根据判断登录的user是否是管理员，判断跳转到哪个页面
    if (user.value.email === "admin@gmail.com") {
        router.push("/admin");
    } else {
        router.push("/user/resume");
    }
};

const logout = () => {
    // 更新 pinia user store
    userStore.setUser(null);
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

.app-main {
    width: 100%;
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
