<template>
  
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="stat-card">
          <template #header>
            <div class="card-header">
              <span>今日访客</span>
            </div>
          </template>
          <div class="stat-value">{{ stats.todayVisitors }}</div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="stat-card">
          <template #header>
            <div class="card-header">
              <span>在场访客</span>
            </div>
          </template>
          <div class="stat-value">{{ stats.currentVisitors }}</div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="stat-card">
          <template #header>
            <div class="card-header">
              <span>本月访客</span>
            </div>
          </template>
          <div class="stat-value">{{ stats.monthlyVisitors }}</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 快捷操作区 -->
    <el-row :gutter="20" class="quick-actions">
      <el-col :span="12">
        <el-card class="action-card">
          <el-button type="primary" size="large" @click="handleNewVisitor">
            <el-icon><Plus /></el-icon>新访客登记
          </el-button>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="action-card">
          <el-button type="success" size="large" @click="handleNewEmployee">
            <el-icon><Plus /></el-icon>添加员工
          </el-button>
        </el-card>
      </el-col>
    </el-row>

    <!-- 最近访客列表 -->
    <el-card class="recent-visitors">
      <template #header>
        <div class="card-header">
          <span>最近访客</span>
          <el-button type="text" @click="viewAllVisitors">查看全部</el-button>
        </div>
      </template>
      <el-table :data="recentVisitors" stripe>
        <el-table-column prop="name" label="访客姓名" />
        <el-table-column prop="company" label="公司" />
        <el-table-column prop="host" label="接待人" />
        <el-table-column prop="checkIn" label="签到时间" />
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="row.status === '在场' ? 'success' : 'info'">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Plus } from '@element-plus/icons-vue'

const router = useRouter()

// 模拟数据
const stats = reactive({
  todayVisitors: 15,
  currentVisitors: 5,
  monthlyVisitors: 342
})

const recentVisitors = ref([
  {
    name: '张三',
    company: '科技有限公司',
    host: '李四',
    checkIn: '2024-01-21 09:30',
    status: '在场'
  },
  {
    name: '王五',
    company: '贸易有限公司',
    host: '赵六',
    checkIn: '2024-01-21 10:15',
    status: '已离开'
  }
])

const handleNewVisitor = () => {
  router.push('/visitors/signin')
}

const handleNewEmployee = () => {
  router.push('/employees/new')
}

const viewAllVisitors = () => {
  router.push('/visitors')
}
</script>

<style scoped>
.dashboard .el-row {
  margin-bottom: 20px;
}

.stat-card {
  height: 160px;
}

.stat-card .card-header {
  font-weight: 500;
}

.stat-value {
  font-size: 36px;
  font-weight: 600;
  color: #409EFF;
  text-align: center;
  margin-top: 20px;
}

.quick-actions .action-card {
  text-align: center;
  padding: 20px;
}

.quick-actions .el-button {
  width: 100%;
  height: 50px;
  font-size: 16px;
}

.recent-visitors .card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-table {
  margin-top: 10px;
}
</style> 