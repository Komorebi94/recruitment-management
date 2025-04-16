import { openDB } from 'idb'

const DB_NAME = 'recruitmentDB'
const DB_VERSION = 1
let dbInstance = null

// 初始化数据库
export const initDB = async () => {
    if (dbInstance) return dbInstance;

    dbInstance = await openDB(DB_NAME, DB_VERSION, {
        upgrade (db) {
            // users 表
            if (!db.objectStoreNames.contains('users')) {
                const store = db.createObjectStore('users', { keyPath: 'email' });
                // 创建唯一索引，用 email 作为索引，因为 email 是主键
                store.createIndex('email', 'email', { unique: true });
                // ✅ 插入管理员账号
                store.transaction.oncomplete = () => {
                    const userStore = db.transaction("users", "readwrite").objectStore("users");
                    userStore.add({
                        userId: "admin",
                        email: "admin@gmail.com",
                        password: "psd@admin",
                        username: "管理员",
                        role: "admin",
                        createdAt: new Date().toISOString()
                    });
                    userStore.add({
                        userId: "test_user_001",
                        email: "test_user_001@gmail.com",
                        password: "psd@test_user_001",
                        username: "测试用户1",
                        role: "user",
                        createdAt: new Date().toISOString()
                    });
                };
            }

            // jobs 表
            if (!db.objectStoreNames.contains('jobs')) {
                const store = db.createObjectStore('jobs', { keyPath: 'id' });
                store.createIndex('creatorEmail', 'creatorEmail');
                store.createIndex('status', 'status');
            }

            // applications 表
            if (!db.objectStoreNames.contains('applications')) {
                const store = db.createObjectStore('applications', { keyPath: 'id' });
                store.createIndex('jobId', 'jobId');
                store.createIndex('userId', 'userId');
                store.createIndex('applicantEmail', 'applicantEmail');
            }

            // drafts 表
            if (!db.objectStoreNames.contains('drafts')) {
                const store = db.createObjectStore('drafts', { keyPath: 'id' });
                store.createIndex('creatorEmail', 'creatorEmail');
                store.createIndex('status', 'status');
            }
            // dbService upgrade 中
            if (!db.objectStoreNames.contains('resumes')) {
                const store = db.createObjectStore('resumes', { keyPath: 'id' })
                store.createIndex('userId', 'userId', { unique: true }) // 一人一份简历
            }
            if (!db.objectStoreNames.contains('favorites')) {
                const store = db.createObjectStore('favorites', { keyPath: 'id' }) // id 推荐使用 jobId_email 拼接
                store.createIndex('jobId', 'jobId')
                store.createIndex('email', 'email')
            }
            if (!db.objectStoreNames.contains('interviews')) {
                const store = db.createObjectStore('interviews', { keyPath: 'id' })
                store.createIndex('jobId', 'jobId')
                store.createIndex('applicantEmail', 'applicantEmail')
            }
        }
    });

    return dbInstance;
}


// 获取数据库实例
export const getDB = async () => {
    if (!dbInstance) {
        dbInstance = await initDB()
    }
    return dbInstance
}

// 添加或更新数据
export const saveItem = async (storeName, item) => {
    const db = await getDB()
    return await db.put(storeName, item)
}

// 获取单条数据（根据主键）
export const getItem = async (storeName, key) => {
    const db = await getDB()
    return await db.get(storeName, key)
}

// 获取全部数据
export const getAllItems = async (storeName) => {
    const db = await getDB()
    return await db.getAll(storeName)
}

// 通过索引查数据（如邮箱查用户）
export const getItemByIndex = async (storeName, indexName, indexValue) => {
    const db = await getDB()
    const tx = db.transaction(storeName, 'readonly')
    const store = tx.objectStore(storeName)
    const index = store.index(indexName)
    return await index.get(indexValue)
}

// 通过索引查所有数据（如邮箱查所有职位）
export const getAllByIndex = async (storeName, indexName, indexValue) => {
    const db = await getDB()
    const tx = db.transaction(storeName, 'readonly')
    const store = tx.objectStore(storeName)
    const index = store.index(indexName)
    return await index.getAll(indexValue)
}

// 删除数据
export const deleteItem = async (storeName, key) => {
    const db = await getDB()
    return await db.delete(storeName, key)
}
// 获取全部并支持分页与模糊搜索（仅适用于较小数据量）
export const searchItems = async (storeName, options = {}) => {
    const db = await getDB()
    const tx = db.transaction(storeName, 'readonly')
    const store = tx.objectStore(storeName)

    const all = await store.getAll()
    let result = all

    // 模糊搜索（title、description）
    if (options.query) {
        const keyword = options.query.toLowerCase()
        result = result.filter(item =>
            (item.title && item.title.toLowerCase().includes(keyword)) ||
            (item.description && item.description.toLowerCase().includes(keyword))
        )
    }

    // 分页
    if (options.pageSize && options.currentPage) {
        const start = (options.currentPage - 1) * options.pageSize
        const end = start + options.pageSize
        result = result.slice(start, end)
    }

    return result
}