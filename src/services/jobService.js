import { saveItem, deleteItem, getItem, getAllByIndex, searchItems } from '@/utils/dbService'

export const publishJob = async (job) => {
    return await saveItem('jobs', job)
}

export const deleteJob = async (id) => {
    return await deleteItem('jobs', id)
}

export const getJobsByStatus = async (status) => {
    return await getAllByIndex('jobs', 'status', status)
}

export const searchJobs = async (keyword, page = 1, pageSize = 20) => {
    return await searchItems('jobs', {
        query: keyword,
        currentPage: page,
        pageSize
    })
}
