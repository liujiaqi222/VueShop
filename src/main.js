import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'element-plus/lib/theme-chalk/index.css'
// 导入全局样式
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入axios
import axios from 'axios';

const app = createApp(App)

axios.defaults.baseURL = 'https://lianghj.top:8888/api/private/v1/';
// 全局挂载axios
app.config.globalProperties.$http = axios;

// 添加请求拦截器
axios.interceptors.request.use(config => {
    // 为请求头对象，添加token验证的authorization 字段
    config.headers.Authorization = window.sessionStorage.getItem('token');
    return config;
})

app.use(router).mount('#app')


// 导入element 组件
import { ElForm, ElFormItem, ElInput, ElButton, ElHeader, ElAside, ElContainer, ElMain, ElMenu, ElSubmenu, ElMenuItem,ElRadioGroup,ElRadioButton,ElBreadcrumb,ElBreadcrumbItem,ElCard,ElRow,ElCol,ElTableColumn,ElTable,ElSwitch, ElTooltip,ElPagination, ElDialog, ElTag} from 'element-plus';

const components = [ElForm, ElFormItem, ElInput, ElButton, ElContainer, ElHeader, ElAside, ElMain, ElMenu, ElSubmenu, ElMenuItem,ElRadioGroup,ElRadioButton,ElBreadcrumb,ElBreadcrumbItem,ElCard,ElRow,ElCol,ElTableColumn,ElTable,ElSwitch,ElTooltip,ElPagination,ElDialog,ElTag];

components.forEach(component => {
    app.component(component.name, component);
})