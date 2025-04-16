<template>
    <div class="resume-container">
        <!-- 基本信息模块 -->
        <ResumeSection
            title="基本信息"
            :is-editing="editing.basicInfo"
            @edit="editing.basicInfo = true"
        >
            <template #view>
                <div class="base-info">姓名：{{ resume.name }}</div>
                <div class="base-info">邮箱：{{ resume.email }}</div>
                <div class="base-info">电话：{{ resume.phone }}</div>
                <div class="base-info">性别：{{ resume.gender }}</div>
                <div class="base-info">年龄：{{ resume.age }}</div>
                <div class="base-info">所在地：{{ resume.location }}</div>
                <div class="base-info">期望职位：{{ resume.expectPosition }}</div>
                <div class="base-info">期望薪资：{{ resume.expectSalary }}</div>
            </template>
            <template #form>
                <el-form :model="formData" label-width="80px">
                    <div class="half-form">
                        <el-form-item prop="name" label="姓名"
                            ><el-input v-model="formData.name"
                        /></el-form-item>
                    </div>
                    <div class="half-form">
                        <el-form-item prop="email" label="邮箱"
                            ><el-input v-model="formData.email"
                        /></el-form-item>
                    </div>
                    <div class="half-form">
                        <el-form-item prop="phone" label="电话"
                            ><el-input v-model="formData.phone"
                        /></el-form-item>
                    </div>
                    <div class="half-form">
                        <el-form-item prop="gender" label="性别">
                            <el-select
                                v-model="formData.gender"
                                placeholder="请选择"
                            >
                                <el-option label="男" value="男" />
                                <el-option label="女" value="女" />
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="half-form">
                        <el-form-item prop="age" label="年龄"
                            ><el-input v-model="formData.age"
                        /></el-form-item>
                    </div>
                    <div class="half-form">
                        <el-form-item prop="location" label="地址"
                            ><el-input v-model="formData.location"
                        /></el-form-item>
                    </div>
                    <div class="half-form">
                        <el-form-item prop="expectPosition" label="期望职位"
                            ><el-input v-model="formData.expectPosition"
                        /></el-form-item>
                    </div>
                    <div class="half-form">
                        <el-form-item prop="expectSalary" label="期望薪资"
                            ><el-input v-model="formData.expectSalary"
                        /></el-form-item>
                    </div>
                </el-form>
                <el-button type="primary" @click="saveSection('basicInfo')"
                    >保存</el-button
                >
            </template>
        </ResumeSection>

        <!-- 教育经历模块 -->
        <ResumeSection
            title="教育经历"
            :is-editing="editing.education"
            @edit="editing.education = true"
        >
            <template #view>
                <div
                    v-for="(edu, idx) in resume.educationExperiences"
                    :key="idx"
                    class="block"
                >
                    <div>
                        {{ edu.school }} / {{ edu.major }} / {{ edu.degree }}
                    </div>
                    <div>{{ edu.dateRange[0] }} 至 {{ edu.dateRange[1] }}</div>
                </div>
            </template>
            <template #form>
                <el-form
                    v-for="(item, index) in formData.educationExperiences"
                    :key="index"
                    label-width="80px"
                    class="block-form"
                >
                    <div class="common-item">
                        <div class="common-item-left">
                            <div class="half-form">
                            <el-form-item label="学校：">
                                <el-input
                                    v-model="item.school"
                                    placeholder="学校"
                                />
                            </el-form-item>
                        </div>
                        <div class="half-form">
                            <el-form-item label="专业：">
                                <el-input
                                    v-model="item.major"
                                    placeholder="专业"
                                />
                            </el-form-item>
                        </div>
                        <div class="half-form">
                            <el-form-item label="学历：">
                                <el-input
                                    v-model="item.degree"
                                    placeholder="学历"
                                />
                            </el-form-item>
                        </div>
                        <div class="half-form">
                            <el-form-item label="时间：">
                                <el-date-picker
                                    v-model="item.dateRange"
                                    type="daterange"
                                    value-format="YYYY-MM-DD"
                                    start-placeholder="开始时间"
                                    end-placeholder="结束时间"
                                />
                            </el-form-item>
                        </div>
                        </div>
                        <div class="common-item-right"><el-icon 
                            @click="removeEducation(index)" color="red"><CloseBold /></el-icon></div>
                    </div>
                </el-form>
                <el-button @click="addEducation">添加教育</el-button>
                <el-button type="primary" @click="saveSection('education')"
                    >保存</el-button
                >
            </template>
        </ResumeSection>

        <!-- 项目经历模块 -->
        <ResumeSection
            title="项目经历"
            :is-editing="editing.projects"
            @edit="editing.projects = true"
        >
            <template #view>
                <div
                    v-for="(proj, idx) in resume.projectExperiences"
                    :key="idx"
                    class="block"
                >
                    <p>{{ proj.name }} / {{ proj.role }}</p>
                    <p>{{ proj.dateRange[0] }} 至 {{ proj.dateRange[1] }}</p>
                    <p>{{ proj.description }}</p>
                </div>
            </template>
            <template #form>
                <el-form
                    v-for="(item, index) in formData.projectExperiences"
                    :key="index"
                    label-width="120px"
                    class="block-form"
                >
                    <div class="common-item">
                        <div class="common-item-left">
                            <div class="half-form">
                                <el-form-item label="项目名称：">
                                    <el-input v-model="item.name" placeholder="项目名称" />
                                </el-form-item>
                            </div>
                            <div class="half-form">
                                <el-form-item label="角色：">
                                    <el-input v-model="item.role" placeholder="角色" />
                                </el-form-item>
                            </div>
                            <div class="">
                                <el-form-item label="描述：">
                                    <el-input
                                        type="textarea"
                                        v-model="item.description"
                                        placeholder="描述"
                                    />
                                </el-form-item>
                            </div>
                            <div class="half-form">
                                <el-form-item label="时间：">
                                    <el-date-picker
                                        v-model="item.dateRange"
                                        type="daterange"
                                        value-format="YYYY-MM-DD"
                                        start-placeholder="开始时间"
                                        end-placeholder="结束时间"
                                    />
                                </el-form-item>
                            </div>
                        </div>
                        <div class="common-item-right">
                            <el-icon @click="removeProject(index)" color="red"
                                ><CloseBold
                            /></el-icon>
                        </div>
                    </div>
                </el-form>
                <el-button @click="addProject">添加项目</el-button>
                <el-button type="primary" @click="saveSection('projects')"
                    >保存</el-button
                >
            </template>
        </ResumeSection>

        <!-- 工作经历模块 -->
        <ResumeSection
            title="工作经历"
            :is-editing="editing.works"
            @edit="editing.works = true"
        >
            <template #view>
                <div
                    v-for="(work, idx) in resume.workExperiences"
                    :key="idx"
                    class="block"
                >
                    <p>{{ work.company }} / {{ work.position }}</p>
                    <p>{{ work.dateRange[0] }} 至 {{ work.dateRange[1] }}</p>
                    <p>{{ work.description }}</p>
                </div>
            </template>
            <template #form>
                <el-form
                    v-for="(item, index) in formData.workExperiences"
                    :key="index"
                    label-width="80px"
                    class="block-form"
                >
                    <div class="common-item">
                        <div class="common-item-left">
                            <div class="half-form">
                                <el-form-item label="公司">
                                    <el-input v-model="item.company" placeholder="公司" />
                                </el-form-item>
                            </div>
                            <div class="half-form">
                                <el-form-item label="职位">
                                    <el-input v-model="item.position" placeholder="职位" />
                                </el-form-item>
                            </div>
                            <div >
                                <el-form-item label="描述">
                                    <el-input
                                        type="textarea"
                                        v-model="item.description"
                                        placeholder="描述"
                                    />
                                </el-form-item>
                            </div>
                            <div class="half-form">
                                <el-form-item label="时间">
                                    <el-date-picker
                                        v-model="item.dateRange"
                                        type="daterange"
                                        value-format="YYYY-MM-DD"
                                        start-placeholder="开始时间"
                                        end-placeholder="结束时间"
                                    />
                                </el-form-item>
                            </div>
                        </div>
                        <div class="common-item-right">
                            <el-icon @click="removeWork(index)" color="red"
                                ><CloseBold
                            /></el-icon>
                        </div>
                    </div>
                </el-form>
                <el-button @click="addWork">添加工作</el-button>
                <el-button type="primary" @click="saveSection('works')"
                    >保存</el-button
                >
            </template>
        </ResumeSection>

        <!-- 自我评价模块 -->
        <ResumeSection
            title="自我评价"
            :is-editing="editing.intro"
            @edit="editing.intro = true"
        >
            <template #view>
                <p>{{ resume.introduction }}</p>
            </template>
            <template #form>
                <el-input
                    type="textarea"
                    v-model="formData.introduction"
                    rows="4"
                    placeholder="自我评价"
                />
                <el-button style="margin-top: 20px;" type="primary" @click="saveSection('intro')"
                    >保存</el-button
                >
            </template>
        </ResumeSection>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useUserStore } from "@/stores/user";
import { getResumeByUserId, updateResumeByUserId } from "@/services/resumeService";
import ResumeSection from "./resumeBlock.vue";
import { ElMessageBox, ElMessage } from "element-plus";
import {
    CloseBold,
} from "@element-plus/icons-vue";
import { mockResume } from "@/mock/resume-mock";

const userStore = useUserStore();
const userId = userStore.getUser().userId;
const resume = reactive({
    name: "",
    email: "",
    phone: "",
    gender: "",
    age: "",
    location: "",
    expectPosition: "",
    expectSalary: "",
    skills: [],
    introduction: "",
    educationExperiences: [],
    projectExperiences: [],
    workExperiences: [],
});

const formData = reactive({
    name: "",
    email: "",
    phone: "",
    gender: "",
    age: "",
    location: "",
    expectPosition: "",
    expectSalary: "",
    skills: [],
    introduction: "",
    educationExperiences: [
        {
            school: "",
            major: "",
            degree: "",
            dateRange: [],
        },
    ],
    projectExperiences: [
        {
            name: "",
            role: "",
            description: "",
            dateRange: [],
        },
    ],
    workExperiences: [
        {
            company: "",
            position: "",
            description: "",
            dateRange: [],
        },
    ],
});
const editing = reactive({
    basicInfo: false,
    education: false,
    projects: false,
    works: false,
    intro: false,
});

onMounted(async () => {
    const data = await getResumeByUserId(userId);
    if (data) {
        Object.assign(resume, data);
        Object.assign(formData, data);
    } else {
        Object.assign(resume, mockResume);
        Object.assign(formData, mockResume);
        await updateResumeByUserId(userId, mockResume);
    }
});

const saveSection = async (section) => {
    Object.assign(resume, formData);
    // 拆分日期
    resume.educationExperiences?.forEach((e) => {
        if (e.dateRange) {
            e.startTime = e.dateRange[0];
            e.endTime = e.dateRange[1];
        }
    });
    resume.projectExperiences?.forEach((e) => {
        if (e.dateRange) {
            e.startTime = e.dateRange[0];
            e.endTime = e.dateRange[1];
        }
    });
    resume.workExperiences?.forEach((e) => {
        if (e.dateRange) {
            e.startTime = e.dateRange[0];
            e.endTime = e.dateRange[1];
        }
    });

    await updateResumeByUserId(userId, JSON.parse(JSON.stringify(resume)));
    editing[section] = false;
};

const addEducation = () => {
    formData.educationExperiences.push({
        school: "",
        major: "",
        degree: "",
        dateRange: [],
    });
};
const addProject = () => {
    formData.projectExperiences.push({
        name: "",
        role: "",
        description: "",
        dateRange: [],
    });
};
const addWork = () => {
    formData.workExperiences.push({
        company: "",
        position: "",
        description: "",
        dateRange: [],
    });
};

const removeEducation = (index) => {
    if (formData.educationExperiences.length === 1) {
        ElMessage.info('至少需要保留一项教育经历');
        return;
    }
    ElMessageBox.confirm(`确定要删除第 ${index + 1} 项教育经历吗？`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    })
        .then(() => {
            formData.educationExperiences.splice(index, 1);
        })
        .catch(() => {
            ElMessage.info('已取消删除');
        });
};

const removeProject = (index) => {
    ElMessageBox.confirm(`确定要删除第 ${index + 1} 项项目经历吗？`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    })
        .then(() => {
            formData.projectExperiences.splice(index, 1);
        })
        .catch(() => {
            ElMessage.info('已取消删除');
        });
};

const removeWork = (index) => {
    ElMessageBox.confirm(`确定要删除第 ${index + 1} 项工作经历吗？`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    })
        .then(() => {
            formData.workExperiences.splice(index, 1);
        })
        .catch(() => {
            ElMessage.info('已取消删除');
        });
};
</script>

<style scoped lang="scss">
.resume-container {
    max-width: 960px;
    margin: 2px auto;
    padding: 20px;
    background: #fff;
    .base-info {
        display: inline-flex;
        width: 50%;
        align-items: center;
        margin-bottom: 10px;
    }
    .half-form {
        display: inline-flex;
        width: 50%;
        align-items: center;
        margin-bottom: 10px;
        .el-form-item {
            width: 100%;
        }
    }
    .common-item {
        display: flex;
        .common-item-left {
            flex: 1;
        }
        .common-item-right {
            flex-basis: 100px;
            display: flex;
            align-items: center;
            justify-content: center;
            .el-icon {
                cursor: pointer;
                position: relative;
                top: -10px;
            }
        }
    }
}
.block {
    margin-bottom: 15px;
}
.block-form {
    margin-bottom: 20px;
}
</style>
