<template>
    <div class="space-list">
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>Spaces</span>
            <el-button type="primary">Add Space</el-button>
          </div>
        </template>
        
        <el-table :data="spaces" style="width: 100%">
          <el-table-column prop="name" label="Name" />
          <el-table-column prop="type" label="Type" />
          <el-table-column prop="capacity" label="Capacity" />
          <el-table-column prop="status" label="Status" />
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
  
  interface Space {
    id: number
    name: string
    type: string
    capacity: number
    status: string
  }
  
  const spaces = ref<Space[]>([
    {
      id: 1,
      name: 'Meeting Room A',
      type: 'Meeting Room',
      capacity: 10,
      status: 'Available'
    },
    {
      id: 2,
      name: 'Office Space B',
      type: 'Office',
      capacity: 4,
      status: 'Occupied'
    }
  ])
  
  const handleEdit = (row: Space) => {
    console.log('Edit', row)
  }
  
  const handleDelete = (row: Space) => {
    console.log('Delete', row)
  }
  </script>
  
  <style scoped lang="scss">
  .space-list {
    padding: 16px; /* 调整间距 */
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .box-card {
    width: 100%;
    margin-bottom: 16px; /* 调整间距 */
  }
  </style>