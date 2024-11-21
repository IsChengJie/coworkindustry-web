<template>
  <div class="space-layout">   

    <!-- 顶部导航卡片 -->
    <div class="nav-cards">
      <router-link to="/spaces/bookings" class="nav-card">
        Bookings
      </router-link>
      <router-link to="/spaces/resource-availability" class="nav-card">
        Resource Availability
      </router-link>
    </div>

    <!-- 标题区域 -->
    <div class="page-header">
      <router-view v-slot="{ Component, route }">
        <h1 class="page-title">
          {{ route.name === 'space-bookings' ? 'Bookings at Head Office' : 'Resource Availability' }}
        </h1>
      </router-view>
    </div>

    <!-- 子路由视图 -->
    <router-view></router-view>
  </div>
</template>

<style scoped lang="scss">
.space-layout {
  background-color: #fff;
  min-height: 100%;
}

.page-header {
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;

  .page-title {
    font-size: 20px;
    font-weight: 500;
    color: #1f2937;
    margin: 0;
  }
}

.nav-cards {
  display: flex;
  gap: 0;
  padding: 0;
  border-bottom: 1px solid #f0f0f0;
}

.nav-card {
  padding: 12px 24px;
  color: #6b7280;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;

  &:hover {
    color: #1f2937;
  }

  &.router-link-active {
    color: #1f2937;
    border-bottom-color: #FF5722;
  }
}
</style> 