import { createApp } from 'vue';
import App from './App.vue';
import './styles/tailwind.css';
import './styles/index.less';
import router, { setupRouter } from './router';
import { pinia } from './store';
import { useAppStore } from './store/modules/app';
import { setupAccessDirective } from './directives/access';

const app = createApp(App);

app.use(pinia);
setupAccessDirective(app);

const appStore = useAppStore(pinia);
appStore.bootstrap();

setupRouter(app);
router.isReady().finally(() => {
  appStore.setBooting(false);
});
app.mount('#app');
