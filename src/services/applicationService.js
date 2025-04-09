import { saveItem, getAllByIndex } from '@/utils/dbService'

export const submitApplication = async (application) => {
    return await saveItem('applications', application)
}

export const getApplicationsByEmail = async (email) => {
    return await getAllByIndex('applications', 'applicantEmail', email)
}
