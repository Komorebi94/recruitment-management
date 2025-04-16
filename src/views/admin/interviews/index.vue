<template>
    <div class="interview-list">
        <h2>面试邀请记录</h2>
        <el-table :data="interviews" v-loading="loading" style="width: 100%">
            <el-table-column prop="jobTitle" label="职位名称" width="180" />
            <el-table-column prop="applicantEmail" label="应聘者邮箱" />
            <el-table-column prop="time" label="面试时间">
                <template #default="{ row }">
                    {{ formatDate(row.time) }}
                </template>
            </el-table-column>
            <el-table-column prop="type" label="面试类型" width="100" />
            <el-table-column prop="notes" label="备注" />
        </el-table>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getAllInterviews } from "@/services/interviewService";
import { getJobById } from "@/services/jobService"; // 用于补全职位标题

const interviews = ref([]);
const loading = ref(false);

const formatDate = (str) => new Date(str).toLocaleString();

onMounted(async () => {
    loading.value = true;
    const data = await getAllInterviews();
    console.log('获取面试记录:', data);

    // 补全职位名称
    for (const item of data) {
        const job = await getJobById(item.jobId);
        item.jobTitle = job?.title || "未知职位";
    }

    interviews.value = data;
    loading.value = false;
});
</script>

<style scoped>
.interview-list {
    max-width: 900px;
    margin: 30px auto;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
}
</style>
