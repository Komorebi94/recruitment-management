// src/services/interviewService.js
import { getDB } from '@/utils/dbService'
import { nanoid } from 'nanoid'

const INTERVIEW_STORE = 'interviews'

/**
 * 创建面试邀请
 */
export async function createInterview (data) {
    console.log('创建面试邀请:', data);
    const db = await getDB()
    const interview = {
        id: nanoid(), // 随机 ID
        jobId: data.jobId,
        applicantEmail: data.applicantEmail,
        time: data.time,
        type: data.type || '线上',
        notes: data.notes || '',
        createdAt: new Date().toISOString()
    }
    await db.add(INTERVIEW_STORE, interview)
    return interview
}


export const getAllInterviews = async () => {
  const db = await getDB();
  return await db.getAll(INTERVIEW_STORE);
};

export const getInterviewsByJobId = async (jobId) => {
  const db = await getDB();
  return await db.getAllFromIndex(INTERVIEW_STORE, "jobId", IDBKeyRange.only(jobId));
};