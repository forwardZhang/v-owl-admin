import { createApp } from 'vue';
import { createPinia } from 'pinia';
import Antd from 'antdv-next';
import 'antdv-next/dist/reset.css';
import App from './App.vue';
import './styles/index.less';
import router from './router';

// 引入本地 monorepo 包测试
import { sayHello } from '@owl/utils';
import { componentName } from '@owl/components';

console.log(sayHello(), componentName);

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(Antd);
app.use(router);
app.mount('#app');
