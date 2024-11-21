import { defineStore } from 'pinia'
import { useLocationStore } from './location'

export interface Space {
  id: string
  name: string
  locationId: string
  locationName: string
  resourceCount: number
  createdAt?: string
  updatedAt?: string
}

interface SpaceState {
  spaces: Space[]
  loading: boolean
  error: string | null
}

export const useSpaceStore = defineStore({
  id: 'space',
  state: (): SpaceState => ({
    spaces: [
      {
        id: '1',
        name: '会议室',
        locationId: '1',
        locationName: 'Head Office',
        resourceCount: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        name: 'dwsf',
        locationId: '1',
        locationName: 'Head Office',
        resourceCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    loading: false,
    error: null
  }),

  getters: {
    getSpaceById: (state) => (id: string) => {
      return state.spaces.find(space => space.id === id)
    },
    getSpacesByLocation: (state) => (locationId: string) => {
      return state.spaces.filter(space => space.locationId === locationId)
    }
  },

  actions: {
    async fetchSpaces() {
      return this.spaces
    },

    async addSpace(space: Omit<Space, 'id' | 'createdAt' | 'updatedAt'>) {
      const newSpace: Space = {
        id: Date.now().toString(),
        ...space,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      this.spaces.unshift(newSpace)
      return newSpace
    },

    async updateSpace(id: string, updates: Partial<Space>) {
      const index = this.spaces.findIndex(space => space.id === id)
      if (index !== -1) {
        // 如果更新了位置，需要获取新的位置名称
        if (updates.locationId) {
          const locationStore = useLocationStore()
          const location = locationStore.getLocationById(updates.locationId)
          if (location) {
            updates.locationName = location.name
          }
        }

        this.spaces[index] = {
          ...this.spaces[index],
          ...updates,
          updatedAt: new Date().toISOString()
        }
        return this.spaces[index]
      }
      return null
    },

    async deleteSpace(id: string) {
      this.spaces = this.spaces.filter(space => space.id !== id)
      return true
    }
  }
}) 