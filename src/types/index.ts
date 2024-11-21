import type { FormInstance as ElFormInstance } from 'element-plus/es/components/form'
import type { LocationIcon } from '@element-plus/icons-vue'

// 重新导出类型
export type FormInstance = ElFormInstance
export type LocationIconType = typeof LocationIcon

// 设备相关类型
export interface Device {
  id: string
  deviceName: string
  deviceId: string
  locationId: string
  locationName?: string
  appVersion?: string
  serialNumber?: string
  model?: string
  osVersion?: string
  batteryLevel?: number
  isOnline: boolean
  lastActivity?: string
  createdAt?: string
  updatedAt?: string
}

// 位置相关类型
export interface Location {
  id: string
  name: string
  address: string
  devices: number
  openTime: string
  closeTime: string
  createdAt?: string
  updatedAt?: string
}

// 空间相关类型
export interface Space {
  id: string
  name: string
  locationId: string
  locationName: string
  resourceCount: number
  createdAt?: string
  updatedAt?: string
} 