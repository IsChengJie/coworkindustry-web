import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import type { UserConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // 根据当前工作目录中的 `mode` 加载 .env 文件
  const env = loadEnv(mode, process.cwd(), '')  
  
  return {
    plugins: [
      vue(),
      // 自动导入 API
      AutoImport({
        imports: ['vue', 'vue-router', 'pinia'],
        dts: 'src/auto-imports.d.ts',
        resolvers: [ElementPlusResolver()],
      }),
      // 自动导入组件
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
    base: './',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    build: {
      // 启用 CSS 代码分割
      cssCodeSplit: true,
      // 启用源码映射
      sourcemap: mode === 'development',
      // 构建配置
      rollupOptions: {
        output: {
          manualChunks: (id: string) => {
            if (id.includes('node_modules')) {
              if (id.includes('vue') || id.includes('vue-router') || id.includes('pinia')) {
                return 'vue-vendor'
              }
              if (id.includes('element-plus')) {
                return 'element-plus'
              }
              return 'vendors'
            }
          },
          // 自定义 chunk 文件名格式
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        },
      },
      // 设置块大小警告的限制
      chunkSizeWarningLimit: 1000,
    },
    // 开发服务器配置
    server: {
      port: 3000,
      open: true,
      cors: true,
      proxy: {
        // 配置代理
        '/api': {
          target: env.VITE_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    // 预览配置
    preview: {
      port: 8082,
      open: true,
      cors: true,
    },
    // CSS 配置
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/styles/variables.scss";`
        }
      }
    },
    // 优化依赖预构建
    optimizeDeps: {
      include: ['vue', 'vue-router', 'pinia', 'element-plus'],
    }
  } as UserConfig
}) 