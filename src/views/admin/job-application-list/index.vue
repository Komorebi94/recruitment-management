<!-- AdminApplications.vue -->
<template>
    <div class="admin-applications">
        <el-card v-for="item in applications" :key="item.id" class="app-card">
            <div class="top">
                <div>
                    <strong>职位：</strong>{{ item.jobTitle }}<br />
                    <strong>投递人：</strong>{{ item.applicantEmail }}
                </div>
                <el-tag :type="statusMap[item.status]">{{
                    statusText(item.status)
                }}</el-tag>
            </div>
            <div class="bottom">
                <p>
                    <strong>简历：</strong>{{ item.resume.name || "匿名简历" }}
                </p>
                <el-button-group>
                    <el-button
                        size="small"
                        type="primary"
                        @click="inviteInterview(item)"
                        :disabled="item.status !== 'pending'"
                        >邀请面试</el-button
                    >
                    <el-button
                        size="small"
                        type="danger"
                        @click="rejectApplication(item)"
                        :disabled="item.status !== 'pending'"
                        >拒绝</el-button
                    >
                </el-button-group>
            </div>
        </el-card>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { createInterview } from "@/services/interviewService";
import { updateApplicationStatus, getApplicationsByCreator } from "@/services/applicationService";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/stores/user";

const applications = ref([]);
const userStore = useUserStore();
const currentUser = userStore.getUser();

const statusMap = {
    pending: "warning",
    accepted: "success",
    rejected: "danger",
};

const statusText = (status) => {
    if (status === "pending") return "待处理";
    if (status === "accepted") return "已邀请";
    if (status === "rejected") return "已拒绝";
    return "未知";
};

onMounted(async () => {
    const rawApps = await getApplicationsByCreator(currentUser.email);
    // 为了显示职位 title，我们这里补全 jobTitle 字段
    const jobMap = {};
    rawApps.forEach((app) => {
        if (!jobMap[app.jobId]) {
            jobMap[app.jobId] = app.jobTitle || "未知职位";
        }
    });
    applications.value = rawApps.map((app) => ({
        ...app,
        jobTitle: jobMap[app.jobId] || "未知职位",
    }));
});

const inviteInterview = async (app) => {
    console.log('邀请面试:', app);
    await createInterview({
        jobId: app.jobId,
        applicantEmail: app.applicantEmail,
        time: new Date().toISOString(),
        type: "线上",
        notes: "自动邀请",
    });
    await updateApplicationStatus(app.id, "accepted");
    ElMessage.success("已发送面试邀请");
    app.status = "accepted";
};

const rejectApplication = async (app) => {
    await updateApplicationStatus(app.id, "rejected");
    ElMessage.warning("已拒绝投递");
    app.status = "rejected";
};
</script>

<style scoped lang="scss">
.admin-applications {
    max-width: 800px;
    margin: 20px auto;
}
.app-card {
    margin-bottom: 16px;
    .top {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
    }
}
</style>
