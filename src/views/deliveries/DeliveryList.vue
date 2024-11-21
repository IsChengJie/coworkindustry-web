<template>
  <div class="delivery-list">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>Deliveries</span>
          <el-button type="primary">Add Delivery</el-button>
        </div>
      </template>
      
      <el-table :data="deliveries" style="width: 100%">
        <el-table-column prop="trackingNumber" label="Tracking #" />
        <el-table-column prop="recipient" label="Recipient" />
        <el-table-column prop="status" label="Status">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="arrivedAt" label="Arrived At" />
        <el-table-column label="Operations">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">Edit</el-button>
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.row)"
            >Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Delivery {
  id: number
  trackingNumber: string
  recipient: string
  status: 'pending' | 'delivered' | 'picked_up'
  arrivedAt: string
}

const deliveries = ref<Delivery[]>([
  {
    id: 1,
    trackingNumber: 'TRK001',
    recipient: 'John Doe',
    status: 'pending',
    arrivedAt: '2024-02-20 10:30'
  },
  {
    id: 2,
    trackingNumber: 'TRK002',
    recipient: 'Jane Smith',
    status: 'delivered',
    arrivedAt: '2024-02-20 14:15'
  }
])

function getStatusType(status: string) {
  const types = {
    pending: 'warning',
    delivered: 'success',
    picked_up: 'info'
  }
  return types[status as keyof typeof types] || 'info'
}

const handleEdit = (row: Delivery) => {
  console.log('Edit', row)
}

const handleDelete = (row: Delivery) => {
  console.log('Delete', row)
}
</script>

<style scoped lang="scss">
.delivery-list {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.box-card {
  width: 100%;
  margin-bottom: 20px;
}

:deep(.el-tag) {
  text-transform: capitalize;
}
</style> 