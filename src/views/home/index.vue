<template>
    <div class="job-list-page">
        <el-card class="search-bar">
            <el-input
                v-model="searchKeyword"
                placeholder="请输入职位关键词"
                clearable
                @input="handleSearch"
            >
                <template #prefix>
                    <el-icon><Search /></el-icon>
                </template>
            </el-input>
        </el-card>

        <div class="card-grid">
            <div v-if="jobs.length === 0 && !loading" class="empty">
                暂无职位
            </div>
            <el-card
                v-for="job in jobs"
                :key="job.id"
                class="job-card"
                shadow="hover"
            >
                <h3 class="title">{{ job.title }}</h3>
                <p class="desc">{{ job.description }}</p>
                <div class="meta">
                    <span>发布人：{{ job.creatorEmail }}</span>
                    <span>{{ formatDate(job.createdAt) }}</span>
                </div>
            </el-card>
        </div>

        <div class="pagination">
            <el-pagination
                background
                layout="prev, pager, next"
                :total="total"
                :page-size="pageSize"
                :current-page="currentPage"
                @current-change="handlePageChange"
            />
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { Search } from "@element-plus/icons-vue";
import { searchJobs } from "@/services/jobService";

const jobs = ref([]);
const total = ref(0);
const searchKeyword = ref("");
const pageSize = 6;
const currentPage = ref(1);
const loading = ref(false);

const fetchJobs = async () => {
    loading.value = true;
    try {
        const result = await searchJobs(
            searchKeyword.value,
            currentPage.value,
            pageSize
        );
        const allMatches = await searchJobs(searchKeyword.value);

        jobs.value = result;
        total.value = allMatches.length;
    } catch (err) {
        ElMessage.error("加载职位失败");
    } finally {
        loading.value = false;
    }
};

const handlePageChange = (page) => {
    currentPage.value = page;
    fetchJobs();
};

const handleSearch = () => {
    currentPage.value = 1;
    fetchJobs();
};

const formatDate = (date) => {
    return new Date(date).toLocaleString();
};

fetchJobs();
</script>

<style scoped lang="scss">
.job-list-page {
    padding: 20px;

    .search-bar {
        margin-bottom: 20px;
    }

    .card-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 20px;
        min-height: 300px;
    }

    .job-card {
        transition: all 0.3s ease;
        cursor: pointer;

        &:hover {
            transform: translateY(-4px);
            border-color: #409eff;
        }

        .title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 8px;
            color: #333;
        }

        .desc {
            font-size: 14px;
            color: #666;
            margin-bottom: 12px;
        }

        .meta {
            font-size: 12px;
            color: #999;
            display: flex;
            justify-content: space-between;
        }
    }

    .pagination {
        margin-top: 30px;
        text-align: center;
    }

    .empty {
        text-align: center;
        color: #999;
        font-size: 16px;
        grid-column: 1 / -1;
    }
}
</style>
