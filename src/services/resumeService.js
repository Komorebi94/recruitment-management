// @/services/resumeService.js
import { getDB } from '@/utils/dbService'

const storeName = 'resumes'

/**
 * 获取简历（根据 userId）
 * @param {string} userId
 * @returns {object|null}
 */
export const getResumeByUserId = async (userId) => {
    const db = await getDB()
    return await db.getFromIndex('resumes', 'userId', userId);
}

/**
 * 保存简历（新增或更新）
 * @param {object} resume
 */
export const saveResume = async (resume) => {
    const db = await getDB()
    // 拷贝对象，去除 Proxy 或 Vue 的响应式包装
    const plainResume = JSON.parse(JSON.stringify(resume))
    return await db.put(storeName, plainResume)
}

/**
 * 更新简历（必须存在）
 * @param {string} userId
 * @param {object} updatedFields
 */
export const updateResumeByUserId = async (userId, updatedFields) => {
    const db = await getDB()
    const existing = await db.get(storeName, userId)
    console.log('existing', existing)
    const id = new Date().toISOString();
    if (!existing) {
        await saveResume({ userId, id, ...updatedFields })
        return;
    }

    const updated = {
        ...existing,
        ...updatedFields,
        updatedAt: new Date().toISOString()
    }

    await db.put(storeName, updated)
    return updated
}

/**
 * 删除简历
 * @param {string} email
 */
export const deleteResumeByEmail = async (email) => {
    const db = await getDB()
    return await db.delete(storeName, email)
}
