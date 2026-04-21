import { createApp } from 'vue';
import 'antdv-next/dist/reset.css';
import App from './App.vue';
import './styles/index.less';
import { setupRouter } from './router';
import { pinia } from './store';
import { useAppStore } from './store/modules/app';

const app = createApp(App);

app.use(pinia);

const appStore = useAppStore(pinia);
appStore.bootstrap();

setupRouter(app);
app.mount('#app');
