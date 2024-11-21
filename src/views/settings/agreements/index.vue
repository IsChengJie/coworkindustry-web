<template>
  <div class="agreements-container">
    <div class="header-wrapper">
      <div>
        <h2 class="page-title">Agreement Library</h2>
        <p class="page-desc">Manage company-wide agreements, set default agreements for visitor check-in process</p>
      </div>
    </div>

    <div class="search-bar">
      <div class="search-wrapper">
        <el-input
          v-model="searchQuery"
          placeholder="Search agreements"
          class="search-input"
        >
          <template #prefix>
            <el-icon class="search-icon"><Search /></el-icon>
          </template>
        </el-input>
      </div>
      <div class="button-wrapper">
        <el-button type="primary" class="add-button" @click="handleAddNew">Add New</el-button>
      </div>
    </div>

    <div class="agreements-grid">
      <template v-if="filteredAgreements.length > 0">
        <div 
          v-for="agreement in filteredAgreements" 
          :key="agreement.id"
          class="agreement-card"
          @click="handleEdit(agreement)"
        >
          <div class="agreement-icon">
            <span class="icon-text">T</span>
          </div>
          <div class="agreement-content">
            <div class="agreement-header">
              <h3 class="agreement-title">{{ agreement.title }}</h3>
              <el-tag 
                v-if="agreement.isDefault" 
                size="small" 
                type="success"
                class="default-tag"
              >
                Default
              </el-tag>
            </div>
            <p class="agreement-type">{{ agreement.type === '文本' ? 'Text' : 'PDF' }}</p>
            <p class="agreement-update">Last updated {{ agreement.updateDate }}</p>
          </div>
        </div>
      </template>
      <div v-else class="empty-state">
        <el-empty description="No data available" />
      </div>
    </div>

    <el-drawer
      v-model="drawerVisible"
      :title="isEdit ? 'Edit Document' : 'New Document'"
      direction="rtl"
      :size="712"
      :destroy-on-close="true"
      :before-close="handleClose"
      custom-class="agreement-drawer"
    >
      <template #header>
        <div class="drawer-header">
          <span class="drawer-title">{{ isEdit ? 'Edit Document' : 'New Document' }}</span>
        </div>
      </template>
      <div class="drawer-content">
        <el-form 
          ref="formRef"
          :model="newAgreement"
          :rules="rules"
          label-position="top"
        >
          <div class="form-item">
            <div class="form-label">Document Type</div>
            <div class="doc-type-options">
              <el-radio-group v-model="newAgreement.type">
                <el-radio label="text">Text</el-radio>
                <el-radio label="pdf">PDF</el-radio>
              </el-radio-group>
            </div>
          </div>

          <el-form-item 
            label="Document Title" 
            prop="title"
            :rules="[{ required: true, message: 'Please enter document title', trigger: 'blur' }]"
          >
            <el-input 
              v-model="newAgreement.title"
              placeholder="Enter document title"
            />
          </el-form-item>

          <el-form-item 
            label="Content" 
            prop="content"
            :rules="[{ required: true, message: 'Please enter document content', trigger: 'blur' }]"
            class="editor-form-item"
          >
            <div class="editor-wrapper">
              <Toolbar
                class="editor-toolbar"
                :editor="editorRef"
                :defaultConfig="toolbarConfig"
                :mode="mode"
              />
              <Editor
                class="editor-content"
                v-model="newAgreement.content"
                :defaultConfig="editorConfig"
                :mode="mode"
                @onCreated="handleCreated"
                @onChange="handleChange"
              />
            </div>
          </el-form-item>
        </el-form>

        <div class="drawer-footer">
          <el-button type="primary" @click="handleSubmit" :loading="loading">
            {{ isEdit ? 'Save' : 'Add Document' }}
          </el-button>
        </div>
      </div>
    </el-drawer>

    <el-dialog
      v-model="confirmDialogVisible"
      title="Confirm Changes"
      width="400px"
      align-center
    >
      <span class="dialog-content">You have unsaved changes. Are you sure you want to leave?</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="confirmDialogVisible = false">Keep Editing</el-button>
          <el-button type="primary" @click="confirmCancel">Leave</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog
      v-model="defaultDialogVisible"
      title="Set as Default"
      width="400px"
      align-center
    >
      <span class="dialog-content">Would you like to set this agreement as default for visitor check-in?</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleSkipDefault">Not Now</el-button>
          <el-button type="primary" @click="confirmSetDefault">Set as Default</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, shallowRef, onBeforeUnmount, watch, computed } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'

const searchQuery = ref('')
const drawerVisible = ref(false)
const editorRef = shallowRef()
const formRef = ref()
const loading = ref(false)

// 编辑器配置
const mode = 'default'
const newAgreement = ref({
  type: 'text',
  title: '',
  content: ''
})

const toolbarConfig = {
  excludeKeys: [
    'uploadImage',
    'uploadVideo',
    'insertTable',
    'group-video',
    'group-image',
  ]
}

const editorConfig = {
  placeholder: 'Start typing or paste content here',
  autoFocus: false,
  MENU_CONF: {}
}

// 表单验证则
const rules = {
  title: [
    { required: true, message: 'Please enter document title', trigger: 'blur' },
    { min: 2, max: 50, message: 'Title length should be 2 to 50 characters', trigger: 'blur' }
  ],
  content: [
    { required: true, message: 'Please enter document content', trigger: 'blur' }
  ]
}

// 编辑器回调函数
const handleCreated = (editor: any) => {
  editorRef.value = editor
}

const handleChange = (editor: any) => {
  newAgreement.value.content = editor.getHtml()
}

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

// 添加确认对话框的控制变量
const confirmDialogVisible = ref(false)

// 添加表单是否被修改的标记
const isFormModified = ref(false)

// 监听表单内容变化
watch(
  () => ({ ...newAgreement.value }),
  () => {
    if (drawerVisible.value) {
      isFormModified.value = true
    }
  },
  { deep: true }
)

// 处理抽屉关闭前的确认
const handleClose = (done: () => void) => {
  if (isFormModified.value) {
    confirmDialogVisible.value = true
  } else {
    done()
  }
}

// 确认取消修改
const confirmCancel = () => {
  confirmDialogVisible.value = false
  drawerVisible.value = false
  resetForm()
  isFormModified.value = false
}

// 新增编辑状态控制
const isEdit = ref(false)
const currentId = ref<number | null>(null)

// 处理新增按钮点击
const handleAddNew = () => {
  drawerVisible.value = true
  isFormModified.value = false // 重置修改标记
  newAgreement.value = {
    type: 'text',
    title: '',
    content: ''
  }
}

// 处理编辑
const handleEdit = (agreement: any) => {
  isEdit.value = true
  currentId.value = agreement.id
  newAgreement.value = {
    type: agreement.type === '文本' ? 'text' : 'pdf',
    title: agreement.title,
    content: agreement.content || '',
    isDefault: agreement.isDefault
  }
  drawerVisible.value = true
  isFormModified.value = false
}

// 统一提交处理
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    loading.value = true
    await formRef.value.validate()
    
    const docData = {
      id: isEdit.value ? currentId.value : Date.now(),
      title: newAgreement.value.title,
      type: newAgreement.value.type === 'text' ? '文本' : 'PDF',
      content: newAgreement.value.content,
      updateDate: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      isDefault: false
    }
    
    // 保存数据
    if (isEdit.value) {
      const index = agreements.value.findIndex(item => item.id === currentId.value)
      if (index !== -1) {
        // 如果当前编辑的是默认协议，保持其默认状态
        if (agreements.value[index].isDefault) {
          docData.isDefault = true
          defaultDialogVisible.value = false // 不显示设置默认协议的弹窗
          drawerVisible.value = false
          isFormModified.value = false
          resetForm()
          loading.value = false
          agreements.value[index] = { ...agreements.value[index], ...docData }
          ElMessage.success('Document updated successfully')
          return
        }
        agreements.value[index] = { ...agreements.value[index], ...docData }
      }
    } else {
      agreements.value.unshift(docData)
    }

    // 如果不是默认协议，则显示设置默认协议的确认弹窗
    defaultDialogVisible.value = true
    
  } catch (error) {
    console.error('Validation failed:', error)
    ElMessage.error('Please fill in all required fields')
    loading.value = false
  }
}

// 跳过设默认协议
const handleSkipDefault = () => {
  defaultDialogVisible.value = false
  drawerVisible.value = false
  isFormModified.value = false
  resetForm()
  loading.value = false
  ElMessage.success(isEdit.value ? 'Document updated successfully' : 'Document added successfully')
}

// 确认设置默认协议
const confirmSetDefault = () => {
  // 先将所有协议的默认状态设为 false
  agreements.value.forEach(item => {
    item.isDefault = false
  })

  // 设置当前协议为默认
  if (isEdit.value) {
    const index = agreements.value.findIndex(item => item.id === currentId.value)
    if (index !== -1) {
      agreements.value[index].isDefault = true
    }
  } else {
    // 新增的情况，设置第一条为默认
    if (agreements.value.length > 0) {
      agreements.value[0].isDefault = true
    }
  }

  defaultDialogVisible.value = false
  drawerVisible.value = false
  isFormModified.value = false
  resetForm()
  loading.value = false
  ElMessage.success('Set as default agreement successfully')
}

// 重置表单
const resetForm = () => {
  newAgreement.value = {
    type: 'text',
    title: '',
    content: '',
    isDefault: false
  }
  formRef.value?.resetFields()
  isEdit.value = false
  currentId.value = null
}

const agreements = ref([
  {
    id: 1,
    title: 'Head Office',
    type: '文本',
    updateDate: 'November 21, 2024',
    isDefault: true
  },
  {
    id: 2,
    title: 'TextTEXT-Test',
    type: '文本', 
    updateDate: 'November 21, 2024',
    isDefault: false
  }
])

// 添加新的响应式变量
const defaultDialogVisible = ref(false)

// 添加计算属性，实现搜索过滤
const filteredAgreements = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return agreements.value
  
  return agreements.value.filter(agreement => 
    agreement.title.toLowerCase().includes(query)
  )
})

// 监听搜索框输入，自动去除首尾空格
watch(searchQuery, (newVal) => {
  searchQuery.value = newVal.trim()
})
</script>

<style scoped>
.agreements-container {
  padding: 24px;
}

.header-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  color: #1d2129;
}

.page-desc {
  margin: 8px 0 24px;
  font-size: 14px;
  color: #86909c;
}

.search-bar {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 24px;
}

.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  width: 270px;
}

:deep(.el-input__wrapper) {
  padding-left: 12px;
  background-color: #f5f6f7;
  transition: all 0.2s;
  height: 40px;
  line-height: 40px;
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #00b96b !important;
  background-color: #fff;
}

:deep(.el-input__wrapper:hover) {
  background-color: #f2f3f5;
}

:deep(.search-icon) {
  font-size: 18px;
  color: #1d2129;
  margin-right: 4px;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.button-wrapper {
  display: flex;
  gap: 12px;
}

.add-button {
  width: 110px;
  height: 40px;
  background-color: #1BBAE1;
  border-color: #1BBAE1;
  padding: 0;
}

.default-button {
  display: none;
}

.agreements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, 240px);
  gap: 16px;
  padding: 8px;
}

.agreement-card {
  width: 240px;
  height: 259px;
  background: #ffffff;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}

.agreement-icon {
  width: 200px;
  height: 140px;
  background: #e3f5ec;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  transition: all 0.2s;
}

.icon-text {
  font-size: 96px;
  color: #4e5969;
  font-family: "华文楷体", "STKaiti", "楷体", serif;
  font-weight: 300;
  line-height: 1;
  user-select: none;
  letter-spacing: -2px;
}

.agreement-content {
  width: 200px;
  height: 64px;
  text-align: left;
}

.agreement-title {
  margin: 0 0 4px;
  font-size: 16px;
  font-weight: 600;
  color: #1d2129;
  line-height: 24px;
}

.agreement-type {
  margin: 0 0 2px;
  font-size: 14px;
  color: #4e5969;
  line-height: 20px;
}

.agreement-update {
  margin: 0;
  font-size: 13px;
  color: #86909c;
  line-height: 18px;
}

.agreement-card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.agreement-card:hover .agreement-icon {
  background: #e5e7eb;
}

.drawer-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 32px;
}

.editor-form-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  margin-bottom: 0 !important;
}

.editor-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 8px;
  height: calc(100% - 200px);
}

.editor-toolbar {
  border-bottom: 1px solid #dcdfe6;
  background-color: #f5f7fa;
}

.editor-content {
  flex: 1;
  overflow: auto;
  min-height: 100px !important;
}

:deep(.w-e-text-container) {
  height: 100% !important;
}

:deep(.w-e-text-container [data-slate-editor]) {
  padding: 4px 16px !important;
  line-height: 1.6;
  font-size: 14px;
}

:deep(.w-e-text-placeholder) {
  left: 16px !important;
  top: 8px !important;
  padding: 0 !important;
  margin: 0 !important;
  transform: none !important;
  font-size: 14px;
  color: #909399;
  line-height: 1.6;
  height: auto !important;
  display: block;
  pointer-events: none;
}

:deep(.w-e-text-container [contenteditable="true"]) {
  min-height: 100px !important;
  font-size: 14px;
  line-height: 1.6;
  padding-top: 8px !important;
}

:deep(.w-e-toolbar) {
  border-bottom: 1px solid #dcdfe6 !important;
  padding: 8px 12px !important;
}

:deep(.w-e-bar-item) {
  margin-right: 6px !important;
}

:deep(.w-e-bar-item button) {
  padding: 5px !important;
}

.drawer-footer {
  margin-top: 32px;
  padding: 16px 0 0 0;
  display: flex;
  justify-content: flex-end;
  border-top: none;
}

:deep(.el-form-item) {
  margin-bottom: 32px;
}

:deep(.el-form-item__label) {
  padding-bottom: 8px;
  font-weight: 500;
}

:deep(.el-radio) {
  margin-right: 16px;
}

/* 添加确认对话框相关样式 */
.dialog-content {
  font-size: 14px;
  color: #606266;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

:deep(.el-dialog__body) {
  padding: 20px;
  text-align: center;
}

/* 抽屉标题样式 */
.drawer-title {
  font-size: 20px;
  font-weight: 600;
  color: #1d2129;
}

/* 抽屉头部样式 */
.drawer-header {
  padding: 20px 32px;
  border-bottom: 1px solid #e4e7ed;
  margin: 0 -20px;
}

:deep(.el-drawer__header) {
  margin-bottom: 0;
  padding: 0;
}

.form-item {
  margin-bottom: 32px;
}

.form-label {
  margin-bottom: 12px;
  font-weight: 500;
  color: #1d2129;
}

:deep(.w-e-text-container) {
  height: 100% !important;
}

:deep(.w-e-scroll) {
  padding: 0 !important;
}

.agreement-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 4px;
}

.default-tag {
  flex-shrink: 0;
  background-color: #e8f5e9;
  border-color: #e8f5e9;
  color: #00b96b;
  height: 22px;
  padding: 0 8px;
  font-size: 12px;
}

/* 添加自定义抽屉样式 */
:deep(.agreement-drawer) {
  width: 712px !important;
}

:deep(.agreement-drawer .el-drawer__body) {
  height: 614px !important;
  overflow-y: auto;
}

/* 添加空数据状态样式 */
.empty-state {
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 0;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
}

/* 修改空数据状态的图标和文字样式 */
:deep(.el-empty__description) {
  margin-top: 12px;
  font-size: 14px;
  color: #86909c;
}
</style> 