import { defineStore } from 'pinia'
import { PiniaPluginContext } from 'pinia'

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

interface LocationState {
  locations: Location[]
  loading: boolean
  error: string | null
}

export const useLocationStore = defineStore({
  id: 'location',
  state: (): LocationState => ({
    locations: [
      {
        id: '1',
        name: 'Head Office',
        address: '上海市浦东新区xx路xx号',
        devices: 1,
        openTime: '09:00',
        closeTime: '18:00',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    loading: false,
    error: null
  }),

  getters: {
    getLocationById: (state) => (id: string) => {
      return state.locations.find(loc => loc.id === id)
    }
  },

  actions: {
    async fetchLocations() {
      return this.locations
    },

    async addLocation(location: Omit<Location, 'id' | 'devices'>) {
      const newLocation: Location = {
        id: Date.now().toString(),
        ...location,
        devices: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      this.locations.unshift(newLocation)
      return newLocation
    },

    async updateLocation(id: string, updates: Partial<Location>) {
      const index = this.locations.findIndex(loc => loc.id === id)
      if (index !== -1) {
        this.locations[index] = {
          ...this.locations[index],
          ...updates,
          updatedAt: new Date().toISOString()
        }
        return this.locations[index]
      }
      return null
    },

    async deleteLocation(id: string) {
      this.locations = this.locations.filter(loc => loc.id !== id)
      return true
    }
  }
}) 