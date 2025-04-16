import { getDB } from '@/utils/dbService'

// 注册功能
export const registerUser = async (user) => {
    const db = await getDB();
    const tx = db.transaction('users', 'readwrite');
    const store = tx.objectStore('users');
    const index = store.index('email'); // 使用 email 索引

    try {
        // 检查用户是否已注册
        const existingUser = await index.get(user.email);
        console.log('existingUser', existingUser)
        if (existingUser) {
            throw new Error('该邮箱已被注册');
        }

        // 注册新用户
        const addTx = db.transaction('users', 'readwrite');
        const addStore = addTx.objectStore('users');
        await addStore.add(user);  // 添加新用户

        await addTx.complete; // 确保事务完成
    } catch (error) {
        console.error('注册失败:', error);
        throw error;
    }

    return user;
};

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
