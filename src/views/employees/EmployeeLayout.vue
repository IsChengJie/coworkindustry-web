<template>
  <div class="employee-layout">
    <el-tabs v-model="activeTab" @tab-click="handleTabClick" class="nav-tabs">
      <el-tab-pane label="时间线" name="timeline"></el-tab-pane>
      <el-tab-pane label="名录" name="directory"></el-tab-pane>
      <el-tab-pane label="档案" name="archives"></el-tab-pane>
    </el-tabs>

    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 根据当前路由设置初始激活的标签
const activeTab = ref(route.name === 'employee-profile' ? 'archives' : 
                     route.name === 'employee-directory' ? 'directory' : 'timeline')

const handleTabClick = (tab: any) => {
  switch (tab.props.name) {
    case 'timeline':
      router.push({ name: 'employee-timeline' })
      break
    case 'directory':
      router.push({ name: 'employee-directory' })
      break
    case 'archives':
      router.push({ name: 'employee-archives' })
      break
  }
}
</script>

<style scoped lang="scss">
.employee-layout {
  padding: 20px;
  background-color: #fff;
}

.nav-tabs {
  margin-bottom: 24px;

  :deep(.el-tabs__nav) {
    border-radius: 4px;
  }

  :deep(.el-tabs__item) {
    height: 40px;
    line-height: 40px;
    padding: 0 24px;
    font-size: 14px;
  }
}
</style> 