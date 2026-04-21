import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    title?: string;
    icon?: string;
    order?: number;
    hidden?: boolean;
    keepAlive?: boolean;
    activeMenu?: string;
    requiresAuth?: boolean;
  }
}

export {};
