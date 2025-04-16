<template>
    <div class="drafts-page">
        <!-- 职位列表 -->
        <el-row :gutter="20" class="job-list">
            <el-col
                :xs="24"
                :sm="12"
                :md="8"
                v-for="job in drafts"
                :key="job.id"
            >
                <el-card class="job-card" shadow="hover">
                    <!-- 点击标题跳转到职位详情页面 -->
                    <div class="title" @click="goToJobDetail(job.id)">
                        {{ job.title }}
                    </div>
                    <div class="info">
                        <span>{{ job.department }}</span> ·
                        <span>{{ job.location }}</span> ·
                        <span>{{ job.salary }}</span>
                    </div>
                    <div class="desc">{{ job.description }}</div>

                    <!-- 编辑和删除按钮 -->
                    <div class="actions">
                        <el-button size="small" @click="editJob(job.id)"
                            >编辑</el-button
                        >
                        <el-button
                            size="small"
                            type="danger"
                            @click="deleteDraftFn(job.id)"
                        >
                            删除
                        </el-button>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getAllDrafts, deleteDraft } from "@/services/jobService";
import { ElMessageBox, ElMessage } from "element-plus";
import { useRouter } from "vue-router";

const router = useRouter();

const drafts = ref([]);

function deleteDraftFn(jobId) {
    ElMessageBox.confirm("确定要删除该草稿吗？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
    })
        .then(async () => {
            await deleteDraft(jobId);
            ElMessage.success("删除成功");
            // 去掉已删除的草稿
            drafts.value = drafts.value.filter((draft) => draft.id !== jobId);
        })
        .catch(() => {
            ElMessage.info("已取消删除");
        });
}

function goToJobDetail(jobId) {
    router.push({ path: "/admin/post-job", query: { jobId } });
}

function editJob(jobId) {
    router.push({ path: "/admin/post-job", query: { jobId, edit: true } });
}

onMounted(async () => {
    drafts.value = await getAllDrafts();
});
</script>

<style lang="scss" scoped>
.drafts-page {
    .job-card {
        margin-bottom: 20px;
        position: relative; /* 添加相对定位，以便绝对定位按钮 */

        .title {
            font-weight: bold;
            font-size: 18px;
            margin-bottom: 8px;
            cursor: pointer; /* 添加鼠标指针 */
        }

        .info {
            color: #666;
            margin-bottom: 8px;
            font-size: 14px;
        }

        .desc {
            color: #333;
            font-size: 14px;
            max-height: 40px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        /* 编辑和删除按钮的样式 */
        .actions {
            position: absolute; /* 使用绝对定位 */
            top: 20px;
            right: 10px;
            display: flex;
            gap: 10px;
        }
    }
}
</style>
