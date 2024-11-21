<template>
  <div class="settings-section">
    <div class="section-header">
      <div class="header-title">
        <h2>Resource Management</h2>
        <p class="section-description">Manage resources in your spaces</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="showAddResourceDialog">
          <el-icon><Plus /></el-icon>Add Resource
        </el-button>
      </div>
    </div>

    <!-- 资源列表 -->
    <el-table :data="resources" style="width: 100%; margin-top: 20px">
      <el-table-column prop="name" label="Resource Name" min-width="150" />
      <el-table-column prop="category" label="Category" width="120" />
      <el-table-column prop="space" label="Space" min-width="150" />
      <el-table-column prop="status" label="Status" width="120" align="center">
        <template #default="scope">
          <el-tag :type="scope.row.status === 'available' ? 'success' : 'warning'">
            {{ scope.row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Actions" width="120" fixed="right">
        <!-- ... 操作按钮 ... -->
      </el-table-column>
    </el-table>
  </div>
</template> 