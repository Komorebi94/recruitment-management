import { getDB } from "@/utils/dbService";
export const isJobFavorited = async (jobId, email) => {
  try {
    const db = await getDB()
    const tx = db.transaction('favorites', 'readonly')
    const store = tx.objectStore('favorites')
    const allFavorites = await store.getAll()
    return allFavorites.some(item => item.jobId === jobId && item.email === email)
  } catch (err) {
    console.error('检查收藏状态失败：', err)
    return false
  }
}


export const toggleFavoriteJob = async (jobId, email) => {
    const db = await getDB()
    let favorites = await db.get('favorites', email) || []
    if (favorites.includes(jobId)) {
        favorites = favorites.filter(id => id !== jobId)
    } else {
        favorites.push(jobId)
    }
    await db.put('favorites', favorites, email)
    return favorites.includes(jobId)
}
