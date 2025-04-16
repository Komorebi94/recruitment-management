<template>
    <div class="job-publish-container">
        <el-form
            ref="formRef"
            :model="form"
            :rules="rules"
            label-width="100px"
            class="job-form"
            size="large"
        >
            <el-form-item label="职位名称" prop="title">
                <el-input v-model="form.title" :disabled="readOnly" placeholder="请输入职位名称" />
            </el-form-item>

            <el-form-item label="公司名称" prop="company">
                <el-input v-model="form.company" :disabled="readOnly" placeholder="请输入公司名称" />
            </el-form-item>

            <el-form-item label="所属部门" prop="department">
                <el-input
                    v-model="form.department"
                    :disabled="readOnly"
                    placeholder="请输入所属部门"
                />
            </el-form-item>

            <el-form-item label="工作地点" prop="location">
                <el-input
                    v-model="form.location"
                    :disabled="readOnly"
                    placeholder="请输入城市名称，如：上海、远程等"
                />
            </el-form-item>

            <el-form-item label="薪资范围" prop="salary">
                <el-input v-model="form.salary" :disabled="readOnly" placeholder="如：10k-20k" />
            </el-form-item>

            <el-form-item label="工作性质" prop="jobType">
                <el-select v-model="form.jobType" :disabled="readOnly" placeholder="请选择">
                    <el-option label="全职" value="全职" />
                    <el-option label="兼职" value="兼职" />
                    <el-option label="实习" value="实习" />
                </el-select>
            </el-form-item>

            <el-form-item label="学历要求" prop="education">
                <el-select v-model="form.education" :disabled="readOnly" placeholder="请选择">
                    <el-option label="不限" value="不限" />
                    <el-option label="大专" value="大专" />
                    <el-option label="本科" value="本科" />
                    <el-option label="硕士" value="硕士" />
                    <el-option label="博士" value="博士" />
                </el-select>
            </el-form-item>

            <el-form-item label="工作经验" prop="experience">
                <el-select v-model="form.experience" :disabled="readOnly" placeholder="请选择">
                    <el-option label="不限" value="不限" />
                    <el-option label="1-3年" value="1-3年" />
                    <el-option label="3-5年" value="3-5年" />
                    <el-option label="5年以上" value="5年以上" />
                </el-select>
            </el-form-item>

            <el-form-item label="职位描述" prop="description">
                <el-input
                    type="textarea"
                    v-model="form.description"
                    :disabled="readOnly"
                    rows="4"
                    placeholder="请输入职位职责和内容"
                />
            </el-form-item>

            <el-form-item label="任职资格" prop="requirement">
                <el-input
                    type="textarea"
                    v-model="form.requirement"
                    :disabled="readOnly"
                    rows="4"
                    placeholder="请输入候选人需要满足的条件"
                />
            </el-form-item>

            <el-form-item class="form-actions" v-if="!readOnly">
                <el-button type="primary" @click="handleSubmit">{{ isEdit ? '更新职位' : '发布职位' }}</el-button>
                <el-button v-if="!isEdit" @click="handleSaveDraft">保存为草稿</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/stores/user";
import { addJob, addDraft, getJobById, updateJob } from "@/services/jobService";

const formRef = ref(null);
const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

const isEdit = ref(!!route.query.edit);
const readOnly = ref(!!route.query.jobId && !isEdit.value);

const { jobId } = route.query;

const form = ref({
    title: "",
    company: "",
    department: "",
    location: "",
    salary: "",
    jobType: "",
    education: "",
    experience: "",
    description: "",
    requirement: "",
});

const rules = {
    title: [{ required: true, message: "请输入职位名称", trigger: "blur" }],
    company: [{ required: true, message: "请输入公司名称", trigger: "blur" }],
    department: [
        { required: true, message: "请输入所属部门", trigger: "blur" },
    ],
    location: [{ required: true, message: "请输入工作地点", trigger: "blur" }],
    salary: [{ required: true, message: "请输入薪资范围", trigger: "blur" }],
    jobType: [{ required: true, message: "请选择工作性质", trigger: "change" }],
    education: [
        { required: true, message: "请选择学历要求", trigger: "change" },
    ],
    experience: [
        { required: true, message: "请选择工作经验", trigger: "change" },
    ],
    description: [
        { required: true, message: "请输入职位描述", trigger: "blur" },
    ],
    requirement: [
        { required: true, message: "请输入任职资格", trigger: "blur" },
    ],
};

onMounted(async () => {
    if (jobId) {
        const job = await getJobById(jobId);
        if (job) {
            form.value = { ...job };
        }
    }
});

const handleSubmit = async () => {
    await formRef.value.validate();
    if (isEdit.value) {
        await updateJob(jobId, {
            ...form.value,
            updatedAt: new Date().toISOString(),
        });
        ElMessage.success("职位更新成功");
        router.push("/admin/job-list");
        return;
    }
    const job = {
        ...form.value,
        id: Date.now().toString(),
        creatorEmail: userStore.email,
        status: "published",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    await addJob(job);
    ElMessage.success("职位发布成功");
    router.push("/admin/job-list");
};


const handleSaveDraft = async () => {
    await formRef.value.validate();
    const draft = {
        ...form.value,
        id: Date.now().toString(),
        creatorEmail: userStore.email,
        status: "draft",
        createdAt: new Date().toISOString(),
    };

    await addDraft(draft);
    ElMessage.success("草稿保存成功");
};
</script>

<style scoped lang="scss">
.job-publish-container {
    max-width: 700px;
    margin: 20px auto;
}

.job-form {
    .form-actions {
        text-align: right;
    }

    .el-form-item {
        margin-bottom: 20px;
    }
}
</style>
