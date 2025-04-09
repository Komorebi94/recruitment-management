import { getDB } from '@/utils/dbService'

// 注册功能
export const registerUser = async (user) => {
    const db = await getDB()
    const tx = db.transaction('users', 'readonly')
    const store = tx.objectStore('users')
    const index = store.index('email')

    // 检查邮箱是否已注册
    const existingUser = await index.get(user.email)

    if (existingUser) {
        throw new Error('该邮箱已被注册')
    }

    // 没有重复的用户，继续注册
    const addTx = db.transaction('users', 'readwrite')
    const addStore = addTx.objectStore('users')
    await addStore.add(user)

    return user
}

// 登录功能
export const loginUser = async (email, password) => {
    const db = await getDB()
    const tx = db.transaction('users', 'readonly')
    const store = tx.objectStore('users')
    const index = store.index('email')

    const matchedUser = await index.get(email)

    if (!matchedUser) {
        throw new Error('该用户不存在')
    }

    if (matchedUser.password !== password) {
        throw new Error('密码错误')
    }

    return matchedUser
}
