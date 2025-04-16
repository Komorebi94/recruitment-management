<template>
    <div class="user-profile">
        <el-card class="profile-card">
            <div class="header">
                <el-avatar :size="80" :src="userInfo.avatar || defaultAvatar" />
                <div class="info">
                    <h2>{{ userInfo.name || "未填写姓名" }}</h2>
                    <p>{{ userInfo.email }}</p>
                </div>
            </div>

            <el-divider content-position="left">基本信息</el-divider>
            <el-descriptions :column="2" border>
                <el-descriptions-item label="性别">{{
                    userInfo.gender || "未填写"
                }}</el-descriptions-item>
                <el-descriptions-item label="年龄">{{
                    userInfo.age || "未填写"
                }}</el-descriptions-item>
                <el-descriptions-item label="联系电话">{{
                    userInfo.phone || "未填写"
                }}</el-descriptions-item>
                <el-descriptions-item label="现居地">{{
                    userInfo.location || "未填写"
                }}</el-descriptions-item>
                <el-descriptions-item label="期望职位">{{
                    userInfo.expectPosition || "未填写"
                }}</el-descriptions-item>
                <el-descriptions-item label="期望薪资">{{
                    userInfo.expectSalary || "未填写"
                }}</el-descriptions-item>
            </el-descriptions>

            <el-divider content-position="left">教育经历</el-divider>
            <el-timeline>
                <el-timeline-item
                    v-for="(edu, index) in userInfo.educationExperiences"
                    :key="index"
                    :timestamp="edu.timeRange"
                >
                    <p>
                        <strong>{{ edu.school }}</strong> - {{ edu.major }}
                    </p>
                    <p>{{ edu.education || "学历未知" }}</p>
                </el-timeline-item>
            </el-timeline>

            <el-divider content-position="left">项目经历</el-divider>
            <el-collapse accordion>
                <el-collapse-item
                    v-for="(proj, index) in userInfo.projectExperiences"
                    :key="index"
                    :title="proj.projectName"
                >
                    <p><strong>时间：</strong>{{ proj.timeRange }}</p>
                    <p><strong>角色：</strong>{{ proj.role }}</p>
                    <p><strong>描述：</strong>{{ proj.description }}</p>
                </el-collapse-item>
            </el-collapse>

            <el-divider content-position="left">工作经历</el-divider>
            <el-timeline>
                <el-timeline-item
                    v-for="(job, index) in userInfo.workExperiences"
                    :key="index"
                    :timestamp="job.timeRange"
                >
                    <p>
                        <strong>{{ job.company }}</strong> - {{ job.position }}
                    </p>
                    <p>{{ job.description }}</p>
                </el-timeline-item>
            </el-timeline>

            <el-divider content-position="left">技能</el-divider>
            <div class="skills">
                <el-tag
                    v-for="(skill, index) in userInfo.skills"
                    :key="index"
                    type="success"
                    effect="light"
                    class="tag"
                >
                    {{ skill }}
                </el-tag>
                <p v-if="!userInfo.skills?.length">未填写技能</p>
            </div>

            <el-divider content-position="left">自我评价</el-divider>
            <el-empty
                v-if="!userInfo.introduction"
                description="未填写自我评价"
            />
            <el-card v-else class="introduction-card">
                {{ userInfo.introduction }}
            </el-card>
        </el-card>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getResumeByEmail } from "@/services/resumeService";
import { useUserStore } from "@/stores/user";
// import defaultAvatar from "@/assets/avatar.png";

const userStore = useUserStore();
const userInfo = ref({});

onMounted(async () => {
    const email = userStore.getUser()?.email;
    if (email) {
        const resume = await getResumeByEmail(email);
        userInfo.value = resume || {};
    }
});
</script>

<style lang="scss" scoped>
.user-profile {
    display: flex;
    justify-content: center;
    padding: 40px;

    .profile-card {
        width: 100%;
        max-width: 900px;

        .header {
            display: flex;
            align-items: center;
            margin-bottom: 20px;

            .info {
                margin-left: 20px;

                h2 {
                    margin: 0;
                }

                p {
                    color: #888;
                    margin-top: 4px;
                }
            }
        }

        .skills {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 10px;

            .tag {
                margin-bottom: 8px;
            }
        }

        .introduction-card {
            background: #f9f9f9;
            padding: 12px;
            font-size: 14px;
            color: #555;
        }
    }
}
</style>
