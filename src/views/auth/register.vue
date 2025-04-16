<template>
    <div class="register-page">
        <el-card class="register-card">
            <h2 class="title">注册</h2>
            <el-form
                ref="formRef"
                :model="form"
                :rules="rules"
                label-width="80px"
            >
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="form.username" placeholder="请输入用户名" />
                </el-form-item>
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
                <el-form-item label="确认密码" prop="confirmPassword">
                    <el-input
                        v-model="form.confirmPassword"
                        type="password"
                        placeholder="请确认密码"
                    />
                </el-form-item>
                <el-form-item>
                    <el-button
                        type="primary"
                        @click="handleRegister"
                        :loading="loading"
                        >注册</el-button
                    >
                    <el-button type="text" @click="goLogin"
                        >已有账号？登录</el-button
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
import { v4 as uuidv4 } from 'uuid';
import { registerUser } from "@/services/loginAndRegisterService";

const formRef = ref(null);
const form = ref({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
});

// 校验确认密码是否一致
const checkConfirmPassword = (rule, value, callback) => {
    if (value === form.value.password) {
        callback();
    } else {
        callback(new Error("两次密码输入不一致"));
    }
};
const rules = {
    username: [
        { required: true, message: "请输入用户名", trigger: "blur" },
    ],
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
    confirmPassword: [
        { required: true, message: "请确认密码", trigger: "blur" },
        { validator: checkConfirmPassword, trigger: "blur" },
    ],
};


const loading = ref(false);
const router = useRouter();

const handleRegister = async () => {
    await formRef.value.validate();
    loading.value = true;

    const user = {
        userId: uuidv4(),
        email: form.value.email,
        password: form.value.password,
        confirmPassword: form.value.confirmPassword,
        username: form.value.username,
        role: form.value.email === "admin@gmail.com" ? "admin" : "user", // 默认是求职者
        createdAt: new Date().toISOString(),
    };

    try {
        await registerUser(user);
        ElMessage.success("注册成功！");
        loading.value = false;
        router.push("/login");
    } catch (error) {
        ElMessage.error(error.message);
        loading.value = false;
    }
};

const goLogin = () => {
    router.push("/login");
};
</script>

<style scoped lang="scss">
.register-page {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(to right, #e0f7fa, #fff);

    .register-card {
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
