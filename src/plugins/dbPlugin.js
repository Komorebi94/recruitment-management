import {
    initDB,
    getItem,
    saveItem,
    getAllItems,
    getItemByIndex,
    getAllByIndex,
    deleteItem,
    searchItems
} from '@/utils/dbService'

export default {
    install: async (app) => {
        await initDB()
        app.config.globalProperties.$db = {
            getItem,
            saveItem,
            getAllItems,
            getItemByIndex,
            getAllByIndex,
            deleteItem,
            searchItems
        }
    }
}
