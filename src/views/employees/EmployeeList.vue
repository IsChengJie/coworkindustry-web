<template>
  <div class="employee-list">
    <h2>Employee Management</h2>
    <!-- Toolbar -->
    <div class="toolbar">
      <el-input
        v-model="searchQuery"
        placeholder="Search employees..."
        class="search-input"
        clearable
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      
      <el-button type="primary" @click="handleAddEmployee">
        <el-icon><Plus /></el-icon>Add Employee
      </el-button>
    </div>

    <!-- Employee Table -->
    <el-table
      :data="filteredEmployees"
      style="width: 100%"
      :loading="loading"
    >
      <el-table-column prop="name" label="Name" />
      <el-table-column prop="email" label="Email" />
      <el-table-column prop="department" label="Department" />
      <el-table-column prop="position" label="Position" />
      <el-table-column prop="phone" label="Phone" />
      <el-table-column prop="status" label="Status">
        <template #default="{ row }">
          <el-tag :type="row.status === 'active' ? 'success' : 'info'">
            {{ row.status === 'active' ? 'Active' : 'Inactive' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Actions" width="150">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="handleEditEmployee(row)">
            Edit
          </el-button>
          <el-button type="danger" size="small" @click="handleDeleteEmployee(row)">
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Pagination -->
    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { Search, Plus } from '@element-plus/icons-vue'
import type { Employee } from '@/types/employee'

const loading = ref(false)
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

// Mock employee data
const employees = ref<Employee[]>([
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    department: 'Engineering',
    position: 'Software Engineer',
    phone: '123-456-7890',
    status: 'active'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    department: 'Marketing',
    position: 'Marketing Manager',
    phone: '987-654-3210',
    status: 'inactive'
  }
])

// Filtered employee list
const filteredEmployees = computed(() => {
  return employees.value.filter(employee => {
    return (
      employee.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  })
})

// Handle add employee
const handleAddEmployee = () => {
  // TODO: Implement add employee functionality
}

// Handle edit employee
const handleEditEmployee = (employee: Employee) => {
  // TODO: Implement edit employee functionality
}

// Handle delete employee
const handleDeleteEmployee = async (employee: Employee) => {
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to delete ${employee.name}?`,
      'Warning',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }
    )
    
    // TODO: Implement delete employee functionality
    ElMessage.success('Employee deleted successfully')
    
  } catch {
    // User cancelled
  }
}

// Handle pagination
const handleSizeChange = (val: number) => {
  pageSize.value = val
  // TODO: Reload data
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  // TODO: Reload data
}
</script>

<style scoped>
.employee-list {
  padding: 20px;
}

.toolbar {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
}

.search-input {
  width: 300px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style> 