<template>
    <div class="resume-preview">
        <h2>简历详情</h2>

        <section class="section">
            <el-descriptions :column="2" border>
                <el-descriptions-item label="姓名">{{
                    resume.name
                }}</el-descriptions-item>
                <el-descriptions-item label="性别">{{
                    resume.gender
                }}</el-descriptions-item>
                <el-descriptions-item label="年龄">{{
                    resume.age
                }}</el-descriptions-item>
                <el-descriptions-item label="邮箱">{{
                    resume.email
                }}</el-descriptions-item>
                <el-descriptions-item label="电话">{{
                    resume.phone
                }}</el-descriptions-item>
                <el-descriptions-item label="所在地">{{
                    resume.location
                }}</el-descriptions-item>
                <el-descriptions-item label="期望职位">{{
                    resume.expectPosition
                }}</el-descriptions-item>
                <el-descriptions-item label="期望薪资">{{
                    resume.expectSalary
                }}</el-descriptions-item>
            </el-descriptions>
        </section>

        <section class="section">
            <h3>自我评价</h3>
            <el-card>{{ resume.introduction }}</el-card>
        </section>

        <section class="section">
            <h3>技能标签</h3>
            <div>
                <el-tag
                    v-for="(skill, index) in resume.skills"
                    :key="index"
                    type="success"
                    class="tag"
                >
                    {{ skill }}
                </el-tag>
            </div>
        </section>

        <section class="section">
            <h3>教育经历</h3>
            <el-timeline>
                <el-timeline-item
                    v-for="(edu, index) in resume.educationExperiences"
                    :key="index"
                    :timestamp="`${edu.dateRange[0]} 至 ${edu.dateRange[1]}`"
                >
                    <p>
                        <strong>{{ edu.school }}</strong> - {{ edu.major }} ({{
                            edu.degree
                        }})
                    </p>
                </el-timeline-item>
            </el-timeline>
        </section>

        <section class="section">
            <h3>项目经历</h3>
            <el-timeline>
                <el-timeline-item
                    v-for="(project, index) in resume.projectExperiences"
                    :key="index"
                    :timestamp="`${project.dateRange[0]} 至 ${project.dateRange[1]}`"
                >
                    <p>
                        <strong>{{ project.name }}</strong> - {{ project.role }}
                    </p>
                    <p>{{ project.description }}</p>
                </el-timeline-item>
            </el-timeline>
        </section>

        <section class="section">
            <h3>工作经历</h3>
            <el-timeline>
                <el-timeline-item
                    v-for="(work, index) in resume.workExperiences"
                    :key="index"
                    :timestamp="`${work.dateRange[0]} 至 ${work.dateRange[1]}`"
                >
                    <p>
                        <strong>{{ work.company }}</strong> -
                        {{ work.position }}
                    </p>
                    <p>{{ work.description }}</p>
                </el-timeline-item>
            </el-timeline>
        </section>

        <div class="action-buttons">
            <el-button type="primary" @click="inviteInterview"
                >邀请面试</el-button
            >
            <el-button type="danger" @click="rejectApplication">拒绝</el-button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { getResumeByUserId } from "@/services/resumeService";
import { updateApplicationStatus } from "@/services/applicationService";
import { createInterview } from "@/services/interviewService";

const route = useRoute();
const router = useRouter();

const { userId, applicationId, jobId, email } = route.query;
const resume = ref({});

onMounted(async () => {
    if (userId) {
        resume.value = await getResumeByUserId(userId);
        console.log(resume.value);
    }
});

const inviteInterview = async () => {
    try {
        await ElMessageBox.confirm(
            `确定邀请该用户（${resume.value.name}）进行面试吗？`,
            "邀请面试",
            {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "info",
            }
        );
        await updateApplicationStatus(applicationId, "accepted");

        await createInterview({
            jobId,
            applicantEmail: email,
            time: new Date().toISOString(),
        });

        ElMessage.success("已邀请面试");
        router.back();
    } catch (err) {
        if (err !== "cancel") {
            ElMessage.error("邀请失败");
            console.error("邀请面试错误：", err);
        }
    }
};

const rejectApplication = async () => {
    try {
        await ElMessageBox.confirm(`确定拒绝该用户的投递吗？`, "拒绝投递", {
            confirmButtonText: "拒绝",
            cancelButtonText: "取消",
            type: "warning",
        });
        await updateApplicationStatus(applicationId, "rejected");
        ElMessage.success("已拒绝该申请");
        router.back();
    } catch (err) {
        if (err !== "cancel") {
            ElMessage.error("操作失败");
        }
    }
};
</script>

<style scoped lang="scss">
.resume-preview {
    max-width: 960px;
    margin: 0 auto;
    padding: 20px;

    .section {
        margin-bottom: 30px;
    }

    .tag {
        margin: 5px 5px 0 0;
    }

    .action-buttons {
        display: flex;
        justify-content: center;
        gap: 20px;
        margin-top: 40px;
    }
}
</style>
