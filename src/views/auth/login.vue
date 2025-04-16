<template>
    <div class="login-page">
        <el-card class="login-card">
            <h2 class="title">登录</h2>
            <el-form
                ref="formRef"
                :model="form"
                :rules="rules"
                label-width="80px"
            >
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="form.email" placeholder="请输入邮箱" />
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input
                        v-model="form.password"
                        type="password"
                        placeholder="请输入密码"
                    />
                </el-form-item>
                <el-form-item>
                    <el-button
                        type="primary"
                        @click="handleLogin"
                        :loading="loading"
                        >登录</el-button
                    >
                    <el-button type="text" @click="goRegister"
                        >没有账号？注册</el-button
                    >
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { loginUser } from "@/services/loginAndRegisterService";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();

const formRef = ref(null);
const form = ref({
    email: "",
    password: "",
});

const rules = {
    email: [
        { required: true, message: "请输入邮箱", trigger: "blur" },
        {
            type: "email",
            message: "邮箱格式不正确",
            trigger: ["blur", "change"],
        },
    ],
    password: [
        { required: true, message: "请输入密码", trigger: "blur" },
        { min: 6, message: "密码长度不能小于6位", trigger: "blur" },
    ],
};

const loading = ref(false);
const router = useRouter();

const handleLogin = async () => {
    await formRef.value.validate();
    loading.value = true;

    const { email, password } = form.value;

    try {
        const user = await loginUser(email, password);
        // 登录成功后存储用户信息
        localStorage.setItem("user", JSON.stringify(user));
        // 更新 pinia user store
        userStore.setUser(user);

        ElMessage.success("登录成功！");

        // 跳转到个人中心（根据角色跳转）
        if (user.role === "admin") {
            router.push("/admin/post-job"); // 管理员路由
        } else {
            router.push("/user/resume"); // 普通用户路由
        }
    } catch (error) {
        ElMessage.error(error.message);
    } finally {
        loading.value = false;
    }
};

const goRegister = () => {
    router.push("/register");
};
</script>

<style scoped lang="scss">
.login-page {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(to right, #e0f7fa, #fff);

    .login-card {
        width: 400px;
        padding: 40px;
        border-radius: 10px;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);

        .title {
            text-align: center;
            font-size: 22px;
            margin-bottom: 30px;
        }
    }
}
</style>
