import { defineStore } from 'pinia'
import { useLocationStore } from './location'
import type { Device, Location } from '@/types'

interface DeviceState {
  devices: Device[]
  loading: boolean
  error: string | null
}

export const useDeviceStore = defineStore({
  id: 'device',
  state: (): DeviceState => ({
    devices: [
      {
        id: '1',
        deviceName: 'Reception iPad',
        deviceId: '2mkkqw',
        locationId: '1',
        locationName: 'Head Office',
        appVersion: '1.0.0',
        serialNumber: 'IPAD2023001',
        model: 'iPad Pro 11-inch',
        osVersion: 'iPadOS 17.2',
        batteryLevel: 85,
        isOnline: true,
        lastActivity: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    loading: false,
    error: null
  }),

  getters: {
    getDevicesByLocation: (state) => (locationId: string) => {
      return state.devices.filter(device => device.locationId === locationId)
    },
    getDeviceById: (state) => (id: string) => {
      return state.devices.find(device => device.id === id)
    },
    getDeviceByDeviceId: (state) => (deviceId: string) => {
      return state.devices.find(device => device.deviceId === deviceId)
    }
  },

  actions: {
    async fetchDevices(locationId?: string) {
      try {
        this.loading = true
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 500))
        
        if (locationId) {
          return this.devices.filter(device => device.locationId === locationId)
        }
        return this.devices
      } finally {
        this.loading = false
      }
    },

    async addDevice(device: Omit<Device, 'id' | 'isOnline' | 'createdAt' | 'updatedAt'>) {
      try {
        // 获取位置信息
        const locationStore = useLocationStore()
        const location = locationStore.getLocationById(device.locationId)
        if (!location) {
          throw new Error('Location not found')
        }

        // 模拟新设备数据
        const newDevice: Device = {
          id: Date.now().toString(),
          ...device,
          locationName: location.name,
          // 模拟设备信息
          serialNumber: `DEV${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
          model: 'iPad Pro 11-inch',
          osVersion: 'iPadOS 17.2',
          appVersion: '1.0.0',
          batteryLevel: Math.floor(Math.random() * 30) + 70, // 70-100之间的随机数
          isOnline: true,
          lastActivity: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }

        this.devices.unshift(newDevice)

        // 更新位置的设备数量
        await locationStore.updateLocation(device.locationId, {
          devices: (location.devices || 0) + 1
        })

        return newDevice
      } catch (error) {
        console.error('Add device error:', error)
        throw error
      }
    },

    async updateDevice(id: string, updates: Partial<Device>) {
      try {
        this.loading = true
        const index = this.devices.findIndex(device => device.id === id)
        if (index === -1) return null

        // 如果更新了设备名称，检查是否重复
        if (updates.deviceName && updates.deviceName !== this.devices[index].deviceName) {
          const deviceWithSameName = this.devices.find(d => 
            d.deviceName === updates.deviceName && d.id !== id
          )
          if (deviceWithSameName) {
            throw new Error('Device name already exists')
          }
        }

        // 如果更改了位置，需要更新两个位置的设备数量
        if (updates.locationId && updates.locationId !== this.devices[index].locationId) {
          const locationStore = useLocationStore()
          const oldLocation = locationStore.getLocationById(this.devices[index].locationId)
          const newLocation = locationStore.getLocationById(updates.locationId)

          if (!newLocation) {
            throw new Error('New location not found')
          }

          if (oldLocation) {
            await locationStore.updateLocation(oldLocation.id, {
              devices: Math.max(0, (oldLocation.devices || 1) - 1)
            })
          }

          await locationStore.updateLocation(newLocation.id, {
            devices: (newLocation.devices || 0) + 1
          })

          updates.locationName = newLocation.name
        }

        this.devices[index] = {
          ...this.devices[index],
          ...updates,
          updatedAt: new Date().toISOString()
        }

        return this.devices[index]
      } finally {
        this.loading = false
      }
    },

    async deleteDevice(id: string) {
      try {
        this.loading = true
        const device = this.devices.find(d => d.id === id)
        if (!device) return false

        // 更新位置的设备数量
        const locationStore = useLocationStore()
        const location = locationStore.getLocationById(device.locationId)
        if (location) {
          await locationStore.updateLocation(device.locationId, {
            devices: Math.max(0, (location.devices || 1) - 1)
          })
        }

        this.devices = this.devices.filter(d => d.id !== id)
        return true
      } finally {
        this.loading = false
      }
    },

    // 更新设备状态（模拟设备上报信息）
    async updateDeviceStatus(deviceId: string, status: {
      isOnline: boolean
      batteryLevel?: number
      appVersion?: string
      serialNumber?: string
      model?: string
      osVersion?: string
    }) {
      const device = this.getDeviceByDeviceId(deviceId)
      if (!device) return null

      return this.updateDevice(device.id, {
        ...status,
        lastActivity: new Date().toISOString()
      })
    }
  }
}) 