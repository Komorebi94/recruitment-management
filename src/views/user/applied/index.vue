<template>
    <div class="application-records" :class="{ empty: !records.length }">
        <el-card v-for="item in records" :key="item.id" class="record-card">
            <div class="job-title" @click="goToJob(item.jobId)">{{ item.jobTitle }}</div>
            <div class="company">公司：{{ item.company }}</div>
            <div class="location">地点：{{ item.location }}</div>
            <div class="apply-time">投递时间：{{ formatDate(item.appliedAt) }}</div>
            <el-tag style="margin-top: 8px;" :type="statusMap[item.status]">{{
                statusText(item.status)
            }}</el-tag>
        </el-card>
        <el-empty v-if="!records.length" description="暂无投递记录" />
    </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { ElMessage } from "element-plus";
import { getDB } from "@/utils/dbService";
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";

const router = useRouter();
const userStore = useUserStore();
const records = ref([]);

const statusMap = {
    pending: "info", // 待处理
    reviewed: "primary", // 已查看
    accepted: "success", // 已通过
    rejected: "danger", // 已拒绝
};

const statusText = (status) => {
    switch (status) {
        case "pending":
            return "待处理";
        case "reviewed":
            return "已查看";
        case "accepted":
            return "已通过";
        case "rejected":
            return "已拒绝";
        default:
            return "未知状态";
    }
};

const fetchApplications = async () => {
    try {
        const db = await getDB();

        // 查询当前用户的投递记录
        const appStore = db
            .transaction("applications", "readonly")
            .objectStore("applications");
        const appIndex = appStore.index("applicantEmail");
        const applicationList = await appIndex.getAll(
            userStore.getUser().email
        );

        // 查询每个职位详情，并组合成完整记录
        const jobStore = db.transaction("jobs", "readonly").objectStore("jobs");
        const combined = await Promise.all(
            applicationList.map(async (app) => {
                const job = await jobStore.get(app.jobId);
                return {
                    ...app,
                    jobTitle: job?.title || "职位已删除",
                    company: job?.department || "未知部门",
                    location: job?.location || "未知地点",
                    jobInfo: job || {},
                };
            })
        );

        records.value = combined;
        console.log("records", records.value);
    } catch (err) {
        ElMessage.error("加载投递记录失败");
        console.error(err);
    }
};

const goToJob = (jobId) => {
    router.push(`/job/${jobId}`);
};

const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleString();
};

onMounted(fetchApplications);
</script>

<style scoped lang="scss">
.application-records {
    padding: 16px;
    display: flex;
    flex-wrap: wrap;
    &.empty {
        justify-content: center;
    }
}

.record-card {
    margin-bottom: 20px;
    border-radius: 8px;
    margin: 10px;
    min-width: calc(33% - 20px);
    .job-title {
        cursor: pointer;
        color: #409eff;
        font-size: 18px;
        font-weight: bold;
    }

    .company,
    .location,
    .apply-time {
        color: #666;
        font-size: 14px;
        margin-top: 8px;
    }
}
</style>
