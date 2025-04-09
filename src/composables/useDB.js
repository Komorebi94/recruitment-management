import { getCurrentInstance } from 'vue'

export const useDB = () => {
    const { proxy } = getCurrentInstance()
    return proxy?.$db
}
