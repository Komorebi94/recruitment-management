<template>
    <div class="job-list-page">
        <!-- 搜索栏 -->
        <el-card class="search-bar">
            <el-form :inline="true" :model="filters" @submit.native.prevent>
                <el-form-item label="职位名称">
                    <el-input
                        v-model="filters.title"
                        placeholder="输入职位名称"
                        clearable
                    />
                </el-form-item>
                <el-form-item label="工作地点">
                    <el-input
                        v-model="filters.location"
                        placeholder="输入城市或远程"
                        clearable
                    />
                </el-form-item>
                <el-form-item label="所属部门">
                    <el-input
                        v-model="filters.department"
                        placeholder="如：技术部"
                        clearable
                    />
                </el-form-item>
                <el-button type="primary" @click="handleSearch">搜索</el-button>
                <el-button @click="resetFilters">重置</el-button>
            </el-form>
        </el-card>

        <!-- 职位列表 -->
        <el-row :gutter="20" class="job-list">
            <el-col
                :xs="24"
                :sm="12"
                :md="8"
                v-for="job in paginatedJobs"
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
                            @click="deleteJobFn(job.id)"
                        >
                            删除
                        </el-button>
                    </div>
                </el-card>
            </el-col>
        </el-row>

        <!-- 分页 -->
        <div class="pagination">
            <el-pagination
                layout="prev, pager, next"
                :total="filteredJobs.length"
                :page-size="pageSize"
                @current-change="handlePageChange"
                :current-page="currentPage"
            />
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from "vue";
import { useRouter } from "vue-router"; // 导入路由用于跳转
import { ElMessage, ElMessageBox } from "element-plus";
import { getAllJobs, deleteJob } from "@/services/jobService";
import { addMockJobs } from "@/mock/job-list-mock";

const router = useRouter(); // 获取路由实例
const jobs = ref([]);
const filteredJobs = ref([]);
const filters = ref({
    title: "",
    location: "",
    department: "",
});
const pageSize = 12;
const currentPage = ref(1);

onMounted(async () => {
    const allJobs = await getAllJobs();
    jobs.value = allJobs.filter((job) => job.status === "published");

    if (jobs.value.length === 0) {
        await addMockJobs();
        jobs.value = (await getAllJobs()).filter((job) => job.status === "published");
    }

    filteredJobs.value = [...jobs.value];
});

// 搜索功能
const handleSearch = () => {
    filteredJobs.value = jobs.value.filter((job) => {
        const matchTitle = job.title.includes(filters.value.title);
        const matchLocation = job.location.includes(filters.value.location);
        const matchDepartment = job.department.includes(
            filters.value.department
        );
        return matchTitle && matchLocation && matchDepartment;
    });
    currentPage.value = 1;
};

// 重置筛选条件
const resetFilters = () => {
    filters.value = { title: "", location: "", department: "" };
    filteredJobs.value = [...jobs.value];
    currentPage.value = 1;
};

// 处理分页
const handlePageChange = (page) => {
    currentPage.value = page;
};

// 当前页职位数据
const paginatedJobs = computed(() => {
    const start = (currentPage.value - 1) * pageSize;
    return filteredJobs.value.slice(start, start + pageSize);
});

// 跳转到职位详情页面
const goToJobDetail = (jobId) => {
    router.push(`/job/${jobId}`);
};

// 编辑职位
const editJob = (jobId) => {
    // 你可以在这里实现编辑功能，比如跳转到编辑页面
    router.push({ path: "/admin/post-job", query: { jobId, edit:true } });
};

// 删除职位
const deleteJobFn = (jobId) => {
    ElMessageBox.confirm('确定要删除该职位吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(async () => {
        await deleteJob(jobId);
        ElMessage.success('删除成功');
        // 去掉已删除的职位
        jobs.value = jobs.value.filter(job => job.id !== jobId);
        filteredJobs.value = [...jobs.value];
    }).catch(() => {
        ElMessage.info('已取消删除');
    });
};
</script>

<style scoped lang="scss">
.job-list-page {
    padding: 24px;
    max-width: 1200px;
    margin: 0 auto;
}

.search-bar {
    margin-bottom: 20px;
}

.job-list {
    margin-top: 20px;
}

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

.pagination {
    text-align: center;
    margin-top: 20px;
}
</style>
