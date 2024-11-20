/// <reference types="vite/client" />
/// <reference types="@vue/runtime-core" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'vue-router' {
  import type { RouteRecordRaw, NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
  export type { RouteRecordRaw, NavigationGuardNext, RouteLocationNormalized }
  export * from 'vue-router'
}

declare module 'element-plus'
declare module '@element-plus/icons-vue' 