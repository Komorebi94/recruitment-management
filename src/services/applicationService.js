import { getDB } from '@/utils/dbService'
import { getJobsByCreator } from './jobService'
const APPLICATION_STORE = 'applications';
export const applyForJob = async (jobId, userId, email, name) => {
    const db = await getDB()
    const application = {
        id: Date.now().toString(),
        userId,
        jobId,
        applicantEmail: email,
        applicantName: name,
        status: "pending",
        appliedAt: new Date().toISOString()
    };
    try {
        await db.add("applications", application);
        return true;
    } catch (error) {
        console.error("投递失败", error);
        throw new Error("无法投递该职位");
    }
}

export const isJobApplied = async (jobId, userId) => {
    console.log('isJobApplied', jobId, userId)
    const db = await getDB()
    const index = db.transaction(APPLICATION_STORE).store.index('jobId')
    const all = await index.getAll(IDBKeyRange.only(jobId))
    console.log('isJobApplied', all)
    return all.some(a => a.userId === userId)
}

// 获取指定职位的所有投递
export async function getApplicationsByCreator (email) {
    const db = await getDB()
    const jobs = await getJobsByCreator(email)
    const jobIds = jobs.map(job => job.id)
    const all = await db.getAll(APPLICATION_STORE)
    return all.filter(app => jobIds.includes(app.jobId))
}

// 更新投递状态
export async function updateApplicationStatus (applicationId, status) {
    const db = await getDB()
    const application = await db.get(APPLICATION_STORE, applicationId)
    if (!application) throw new Error('未找到投递记录')
    application.status = status
    application.updatedAt = new Date().toISOString()
    await db.put(APPLICATION_STORE, application)
    return application
}

export const getApplicationsByJobId = async (jobId) => {
    const db = await getDB()
    const tx = db.transaction(APPLICATION_STORE, 'readonly')
    const store = tx.store
    const index = store.index('jobId')
    const result = await index.getAll(IDBKeyRange.only(jobId))
    await tx.done
    return result
}

