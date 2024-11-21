<template>
  <div class="visitor-list">
    <div class="toolbar">
      <el-input
        v-model="searchQuery"
        placeholder="搜索访客"
        @input="handleSearch"
        style="width: 200px"
      ></el-input>
      <el-date-picker
        v-model="selectedDate"
        type="date"
        placeholder="选择日期"
        @change="handleDateChange"
      ></el-date-picker>
    </div>

    <el-table :data="visitors" style="width: 100%">
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="phone" label="电话"></el-table-column>
      <el-table-column prop="check_in_time" label="签到时间">
        <template #default="{ row }">
          {{ new Date(row.check_in_time).toLocaleString() }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template #default="{ row }">
          <el-tag :type="row.status === 'checked_in' ? 'success' : 'info'">
            {{ row.status === 'checked_in' ? '在访' : '已离开' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button
            v-if="row.status === 'checked_in'"
            @click="handleCheckOut(row.id)"
            type="primary"
            size="small"
          >
            签出
          </el-button>
          <el-button
            @click="handleDelete(row.id)"
            type="danger"
            size="small"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { 
  getVisitors, 
  searchVisitors, 
  getVisitorsByDate,
  checkOutVisitor,
  deleteVisitor 
} from '@/api/visitorService'
import { ElMessage, ElMessageBox } from 'element-plus'

const visitors = ref([])
const searchQuery = ref('')
const selectedDate = ref('')

// 获取访客列表
const fetchVisitors = async () => {
  try {
    const data = await getVisitors()
    visitors.value = data
  } catch (error) {
    ElMessage.error('获取访客列表失败：' + error.message)
  }
}

// 搜索访客
const handleSearch = async () => {
  if (!searchQuery.value) {
    await fetchVisitors()
    return
  }
  try {
    const data = await searchVisitors(searchQuery.value)
    visitors.value = data
  } catch (error) {
    ElMessage.error('搜索失败：' + error.message)
  }
}

// 按日期筛选
const handleDateChange = async () => {
  if (!selectedDate.value) {
    await fetchVisitors()
    return
  }
  try {
    const date = selectedDate.value.toISOString().split('T')[0]
    const data = await getVisitorsByDate(date)
    visitors.value = data
  } catch (error) {
    ElMessage.error('筛选失败：' + error.message)
  }
}

// 访客签出
const handleCheckOut = async (id: string) => {
  try {
    await checkOutVisitor(id)
    ElMessage.success('签出成功')
    await fetchVisitors()
  } catch (error) {
    ElMessage.error('签出失败：' + error.message)
  }
}

// 删除访客记录
const handleDelete = async (id: string) => {
  try {
    await ElMessageBox.confirm('确定要删除该访客记录吗？', '提示', {
      type: 'warning'
    })
    await deleteVisitor(id)
    ElMessage.success('删除成功')
    await fetchVisitors()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败：' + error.message)
    }
  }
}

onMounted(fetchVisitors)
</script> 