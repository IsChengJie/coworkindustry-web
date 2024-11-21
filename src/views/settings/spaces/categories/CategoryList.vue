<template>
  <div class="settings-section">
    <div class="section-header">
      <div class="header-title">
        <h2>Resource Categories</h2>
        <p class="section-description">Manage resource categories and types</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="showAddCategoryDialog">
          <el-icon><Plus /></el-icon>Add Category
        </el-button>
      </div>
    </div>

    <!-- 分类列表 -->
    <el-table :data="categories" style="width: 100%; margin-top: 20px">
      <el-table-column prop="name" label="Category Name" min-width="150" />
      <el-table-column prop="description" label="Description" min-width="200" />
      <el-table-column prop="resourceCount" label="Resources" width="120" align="center" />
      <el-table-column label="Actions" width="120" fixed="right">
        <!-- ... 操作按钮 ... -->
      </el-table-column>
    </el-table>
  </div>
</template> 