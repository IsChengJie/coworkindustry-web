<template>
  <div class="settings-section">
    <div class="agreements-header">
      <div class="header-left">
        <h2>协议库</h2>
        <p class="subtitle">管理访客和员工需要签署的所有协议</p>
      </div>
      <div class="agreements-actions">
        <el-input
          v-model="searchQuery"
          placeholder="搜索协议"
          class="search-input"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-button type="primary" @click="handleAddAgreement">
          <el-icon><Plus /></el-icon>添加新协议
        </el-button>
      </div>
    </div>

    <el-table
      :data="filteredAgreements"
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column prop="name" label="协议名称" min-width="250">
        <template #default="{ row }">
          <div class="agreement-name">
            <span class="name">{{ row.name }}</span>
            <div class="tags">
              <el-tag 
                v-if="row.isDefault" 
                size="small" 
                type="success"
                class="default-tag"
              >
                默认
              </el-tag>
              <el-tag 
                v-if="row.isRequired" 
                size="small" 
                type="warning"
                class="required-tag"
              >
                必填
              </el-tag>
            </div>
          </div>
          <div class="agreement-desc">{{ row.description }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="language" label="语言" width="120">
        <template #default="{ row }">
          <el-tag size="small" effect="plain">{{ row.language }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="applicableTo" label="适用对象" width="120">
        <template #default="{ row }">
          <el-tag 
            size="small" 
            :type="row.applicableTo === 'visitor' ? 'warning' : 'success'"
          >
            {{ row.applicableTo === 'visitor' ? '访客' : '员工' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="最后修改" width="200">
        <template #default="{ row }">
          <div class="last-modified">
            <span>{{ row.updatedAt }}</span>
            <span class="modifier">{{ row.modifiedBy }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-switch
            v-model="row.status"
            :active-value="'active'"
            :inactive-value="'inactive'"
            @change="handleStatusChange(row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" fixed="right">
        <template #default="{ row }">
          <el-dropdown trigger="click">
            <el-button link type="primary">
              操作<el-icon class="el-icon--right"><ArrowDown /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleEdit(row)">
                  <el-icon><Edit /></el-icon>编辑
                </el-dropdown-item>
                <el-dropdown-item @click="handlePreview(row)">
                  <el-icon><View /></el-icon>预览
                </el-dropdown-item>
                <el-dropdown-item @click="handleDuplicate(row)">
                  <el-icon><Copy /></el-icon>复制
                </el-dropdown-item>
                <el-dropdown-item 
                  v-if="!row.isDefault"
                  @click="handleSetDefault(row)"
                >
                  <el-icon><Star /></el-icon>设为默认
                </el-dropdown-item>
                <el-dropdown-item 
                  divided 
                  @click="handleDelete(row)"
                >
                  <el-icon><Delete /></el-icon>删除
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
// 这里可以保留原有的逻辑，但可以注释掉所有的功能实现
</script>

<style scoped>
.agreements-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.subtitle {
  color: #909399;
  font-size: 14px;
  margin: 0;
}

.agreements-actions {
  display: flex;
  gap: 16px;
}

.search-input {
  width: 300px;
}

.agreement-name {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.agreement-desc {
  font-size: 13px;
  color: #909399;
}

.tags {
  display: flex;
  gap: 8px;
}

.last-modified {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.modifier {
  font-size: 12px;
  color: #909399;
}

.preview-content {
  padding: 20px;
}

.preview-desc {
  color: #909399;
  margin-bottom: 20px;
}

.preview-body {
  white-space: pre-wrap;
  line-height: 1.6;
}

:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
}

:deep(.el-icon) {
  margin-right: 4px;
}
</style> 