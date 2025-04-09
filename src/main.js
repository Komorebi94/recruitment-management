import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import './style.css';
import dbPlugin from './plugins/dbPlugin'

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(ElementPlus);
app.use(dbPlugin) // 注册数据库插件
app.mount('#app');
