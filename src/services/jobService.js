// src/services/jobService.js

import { getDB } from '@/utils/dbService'

const JOB_STORE = 'jobs'
const DRAFT_STORE = 'drafts'

/**
 * 添加职位（发布）
 */
export const addJob = async (job) => {
    try {
        const db = await getDB()
        const tx = db.transaction(JOB_STORE, 'readwrite')
        const store = tx.objectStore(JOB_STORE)
        await store.add(job)
        await tx.done
        console.log('添加职位成功')
    } catch (error) {
        console.error('添加职位失败:', error)
        throw error
    }
}

/**
 * 添加草稿
 */
export const addDraft = async (job) => {
    try {
        const db = await getDB()
        const tx = db.transaction(DRAFT_STORE, 'readwrite')
        const store = tx.objectStore(DRAFT_STORE)
        await store.add(job)
        await tx.done
        console.log('添加草稿成功')
    } catch (error) {
        console.error('添加草稿失败:', error)
        throw error
    }
}

/**
 * 获取所有职位
 */
export const getAllJobs = async () => {
    try {
        const db = await getDB()
        return await db.getAll(JOB_STORE)
    } catch (error) {
        console.error('获取所有职位失败:', error)
        throw error
    }
}

/**
 * 通过jobId 获取职位
 */
export const getJobById = async (jobId) => {
    console.log('获取职位:', jobId);
    try {
        const db = await getDB()
        return await db.get(JOB_STORE, jobId)
    } catch (error) {
        console.error('获取职位失败:', error)
        throw error
    }
}

/**
 * 通过 jobId 更新职位
 * @param {string} jobId - 职位 ID
 * @param {Object} job - 更新后的职位数据
 */
export const updateJob = async (jobId, job) => {
    console.log('更新职位:', jobId, job);
    try {
        const db = await getDB(); // 获取数据库实例
        const tx = db.transaction(JOB_STORE, 'readwrite'); // 开启事务，使用写操作
        const store = tx.objectStore(JOB_STORE); // 获取职位对象存储

        // 使用 put 更新职位，第二个参数是 key（jobId），这时传入的 key 是可选的，因为我们已经设置了 jobId
        await store.put(job);

        // 等待事务完成
        await tx.done;
        console.log('职位更新成功');
    } catch (error) {
        console.error('更新职位失败:', error);
        throw error;
    }
}

/**
 * 通过jobId 删除职位
 */
export const deleteJob = async (jobId) => {
    console.log('删除职位:', jobId);
    try {
        const db = await getDB();
        const tx = db.transaction(JOB_STORE, 'readwrite');
        const store = tx.objectStore(JOB_STORE);
        await store.delete(jobId);
        await tx.done;
        console.log('删除成功');
    } catch (error) {
        console.error('删除失败:', error);
        throw error;
    }
}

/**
 * 获取某用户发布的职位
 */
export const getJobsByEmail = async (email) => {
    try {
        const db = await getDB()
        return await db.getAllFromIndex(JOB_STORE, 'creatorEmail', email)
    } catch (error) {
        console.error('获取职位失败:', error)
        throw error
    }
}

/**
 * 获取某用户的草稿列表
 */
export const getAllDrafts = async (email) => {
    try {
        const db = await getDB()
        return await db.getAll(DRAFT_STORE)
    } catch (error) {
        console.error('获取所有草稿失败:', error)
        throw error
    }
}

/**
 * 通过jobId 删除草稿
 */
export const deleteDraft = async (jobId) => {
    console.log('删除草稿:', jobId);
    try {
        const db = await getDB();
        const tx = db.transaction(DRAFT_STORE, 'readwrite');
        const store = tx.objectStore(DRAFT_STORE);
        await store.delete(jobId);
        await tx.done;
        console.log('删除成功');
    } catch (error) {
        console.error('删除失败:', error);
        throw error;
    }
}

/**
 * 根据关键字搜索职位（模糊 title、description）
 */
export const searchJobs = async (keyword) => {
    try {
        const db = await getDB()
        const allJobs = await db.getAll(JOB_STORE)
        return allJobs.filter(job =>
            job.title.toLowerCase().includes(keyword.toLowerCase()) ||
            job.description.toLowerCase().includes(keyword.toLowerCase())
        )
    } catch (error) {
        console.error('搜索职位失败:', error)
        throw error
    }
}

/**
 * 分页获取职位
 */
export const getJobsPaged = async (page = 1, pageSize = 10) => {
    try {
        const db = await getDB()
        const allJobs = await db.getAll(JOB_STORE)
        const start = (page - 1) * pageSize
        const end = start + pageSize
        return {
            list: allJobs.slice(start, end),
            total: allJobs.length
        }
    } catch (error) {
        console.error('分页获取职位失败:', error)
        throw error
    }
}

export async function getJobsByCreator(email) {
    const db = await getDB()
    const jobs = await db.getAllFromIndex(JOB_STORE, 'creatorEmail', email)
    return jobs
  }