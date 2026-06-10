import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    title?: string;
    icon?: string;
    order?: number;
    hideInMenu?: boolean;
    keepAlive?: boolean;
    activeMenu?: string;
    requiresAuth?: boolean;
    /** 跳过访问控制（无需登录即可访问，如登录页 / 错误页） */
    ignoreAccess?: boolean;
    /** 页面是否已加载过（由 common 守卫写入，用于首次进入动画 / keepAlive 判断） */
    loaded?: boolean;
  }
}

export {};
