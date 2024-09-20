import { create } from 'zustand'

export type Attribute = {
  id: string
  name: string
  type: "text" | "number" | "date"
}

export type Item = {
  id: string
  [key: string]: string | number | Date
}

export type Tab = {
  id: string
  name: string
  attributes: Attribute[]
  items: Item[]
}

type Store = {
  tabs: Tab[]
  activeTabId: string | null
  addTab: (name: string) => void
  setActiveTab: (id: string) => void
  addAttribute: (tabId: string, attribute: Omit<Attribute, 'id'>) => void
  deleteAttribute: (tabId: string, attributeId: string) => void
  addItem: (tabId: string, item: Omit<Item, 'id'>) => void
  updateItem: (tabId: string, item: Item) => void
  deleteItem: (tabId: string, itemId: string) => void
}

export const useStore = create<Store>((set) => ({
  tabs: [],
  activeTabId: null,
  addTab: (name) => set((state) => {
    const newTab: Tab = { id: Date.now().toString(), name, attributes: [], items: [] }
    return { tabs: [...state.tabs, newTab], activeTabId: newTab.id }
  }),
  setActiveTab: (id) => set({ activeTabId: id }),
  addAttribute: (tabId, attribute) => set((state) => ({
    tabs: state.tabs.map(tab => 
      tab.id === tabId 
        ? { ...tab, attributes: [...tab.attributes, { ...attribute, id: Date.now().toString() }] }
        : tab
    )
  })),
  deleteAttribute: (tabId, attributeId) => set((state) => ({
    tabs: state.tabs.map(tab => 
      tab.id === tabId 
        ? { 
            ...tab, 
            attributes: tab.attributes.filter(attr => attr.id !== attributeId),
            items: tab.items.map(item => {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { [attributeId]: _, ...rest } = item
              return rest as Item
            })
          }
        : tab
    )
  })),
  addItem: (tabId, item) => set((state) => ({
    tabs: state.tabs.map(tab => 
      tab.id === tabId 
        ? { ...tab, items: [...tab.items, { ...item, id: Date.now().toString() }] }
        : tab
    )
  })),
  updateItem: (tabId, updatedItem) => set((state) => ({
    tabs: state.tabs.map(tab => 
      tab.id === tabId 
        ? { ...tab, items: tab.items.map(item => item.id === updatedItem.id ? updatedItem : item) }
        : tab
    )
  })),
  deleteItem: (tabId, itemId) => set((state) => ({
    tabs: state.tabs.map(tab => 
      tab.id === tabId 
        ? { ...tab, items: tab.items.filter(item => item.id !== itemId) }
        : tab
    )
  })),
}))