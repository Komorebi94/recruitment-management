<template>
    <div class="job-detail-container" v-loading="loading">
        <el-card shadow="never" class="job-card">
            <div class="header">
                <h2>{{ job.title }}</h2>
                <el-tag v-if="job.status === 'closed'" type="danger"
                    >已关闭</el-tag
                >
            </div>

            <div class="meta">
                <div>
                    <el-icon><Location /></el-icon> {{ job.location }}
                </div>
                <div>
                    <el-icon><User /></el-icon> {{ job.department }}
                </div>
                <div>
                    <el-icon><Clock /></el-icon> {{ job.createdAt }}
                </div>
            </div>

            <el-divider />

            <div class="info-grid">
                <div><strong>岗位类型：</strong>{{ job.jobType }}</div>
                <div><strong>学历要求：</strong>{{ job.education }}</div>
                <div><strong>经验要求：</strong>{{ job.experience }}</div>
                <div><strong>薪资待遇：</strong>{{ job.salary }}</div>
            </div>

            <div class="section">
                <h4>岗位职责</h4>
                <p>{{ job.description }}</p>
            </div>

            <div class="section">
                <h4>岗位要求</h4>
                <p>{{ job.requirement }}</p>
            </div>
            <!-- 管理员不显示投递按钮 -->
            <div v-if="!isAdmin" class="actions">
                <el-button
                    type="primary"
                    :disabled="hasApplied"
                    @click="handleApply"
                >
                    {{ hasApplied ? "已投递" : "立即投递" }}
                </el-button>
                <!-- <el-button
                    :type="isFavorited ? 'danger' : 'info'"
                    @click="toggleFavorite"
                >
                    {{ isFavorited ? "已收藏" : "收藏职位" }}
                </el-button> -->
            </div>
        </el-card>
        <!-- 管理员：显示投递记录 -->
        <div v-if="isAdmin && applications.length" class="applications-section">
            <h3 style="margin-bottom: 10px;">该职位的投递记录</h3>
            <el-table :data="applications" border style="width: 100%">
                <el-table-column prop="applicantName" label="投递人姓名" />
                <el-table-column prop="applicantEmail" label="投递人邮箱" />
                <el-table-column prop="appliedAt" label="投递时间" />
                <el-table-column prop="status" label="状态">
                    <template #default="{ row }">
                        <el-tag
                            :type="
                                row.status === 'pending'
                                    ? 'warning'
                                    : row.status === 'accepted'
                                    ? 'success'
                                    : 'danger'
                            "
                        >
                            {{
                                row.status === "pending"
                                    ? "待处理"
                                    : row.status === "accepted"
                                    ? "已接受"
                                    : "已拒绝"
                            }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="240">
                    <template #default="{ row }">
                        <el-button
                            @click="checkResume(row.userId, row.id, row.jobId, row.applicantEmail)"
                            >查看简历</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getJobById } from "@/services/jobService";
import {
    applyForJob,
    isJobApplied,
    getApplicationsByJobId,
    updateApplicationStatus,
} from "@/services/applicationService";
import { isJobFavorited, toggleFavoriteJob } from "@/services/favoriteService";
import { ElMessage } from "element-plus";
import { Clock, User, Location } from "@element-plus/icons-vue";
import { useUserStore } from "@/stores/user";

const router = useRouter();
const route = useRoute();
const jobId = route.params.id;
const userStore = useUserStore();

const job = ref({});
const applications = ref([]);
const loading = ref(true);
const hasApplied = ref(false);
const isFavorited = ref(false);
const currentUser = userStore.getUser();
const isAdmin = computed(() => currentUser?.email === "admin@gmail.com");

onMounted(async () => {
    try {
        console.log('获取职位:', jobId);
        job.value = await getJobById(jobId);

        if (isAdmin.value) {
            applications.value = await getApplicationsByJobId(jobId);
            console.log('获取投递记录:', applications.value);
        } else {
            hasApplied.value = await isJobApplied(
                jobId,
                currentUser.userId
            );
            // isFavorited.value = await isJobFavorited(
            //     jobId,
            //     currentUser.value.email
            // );
        }
    } catch (err) {
        ElMessage.error("加载职位失败");
    } finally {
        loading.value = false;
    }
});

const handleApply = async () => {
    await applyForJob(jobId, currentUser.userId, currentUser.email, currentUser.username);
    ElMessage.success("投递成功");
    hasApplied.value = true;
};

const toggleFavorite = async () => {
    isFavorited.value = await toggleFavoriteJob(jobId, currentUser.email);
};

const checkResume = async (userId, applicationId, jobId, email) => {
    router.push({ path: "/admin/resume-preview", query: { userId, applicationId, jobId, email } });
};

const formatDate = (str) => new Date(str).toLocaleDateString();
</script>

<style scoped lang="scss">
.job-detail-container {
    padding: 20px;
}
.job-card {
    padding: 30px;
    background-color: #fff;
    border-radius: 8px;
}
.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.meta {
    margin-top: 10px;
    font-size: 14px;
    color: #666;
    display: flex;
    gap: 20px;
    .el-icon {
        margin-right: 2px;
        position: relative;
        top: 2px;
    }
}
.info-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
    margin: 20px 0;
}
.section {
    margin-top: 30px;
}
.actions {
    margin-top: 30px;
    display: flex;
    gap: 20px;
}
.applications-section {
    margin-top: 20px;
}
</style>
