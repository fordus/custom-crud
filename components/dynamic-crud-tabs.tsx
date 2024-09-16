"use client"

import { useState } from "react"
import { useStore, Attribute, Item } from "./store"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusIcon, XIcon, Edit2Icon, Trash2Icon } from "lucide-react"

function Sidebar() {
  const { tabs, addTab, addAttribute, activeTabId } = useStore()
  const [newTabName, setNewTabName] = useState("")
  const [newAttributeName, setNewAttributeName] = useState("")
  const [newAttributeType, setNewAttributeType] = useState<"text" | "number" | "date">("text")

  const handleAddTab = () => {
    if (newTabName) {
      addTab(newTabName)
      setNewTabName("")
    }
  }

  const handleAddAttribute = () => {
    if (newAttributeName && activeTabId) {
      addAttribute(activeTabId, { name: newAttributeName, type: newAttributeType })
      setNewAttributeName("")
      setNewAttributeType("text")
    }
  }

  return (
    <Card className="w-64 h-full">
      <CardHeader>
        <CardTitle>Navigation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            placeholder="New tab name"
            value={newTabName}
            onChange={(e) => setNewTabName(e.target.value)}
          />
          <Button onClick={handleAddTab} className="w-full">
            <PlusIcon className="mr-2 h-4 w-4" /> Add Tab
          </Button>
        </div>
        {activeTabId && (
          <div className="space-y-2">
            <Input
              placeholder="New attribute name"
              value={newAttributeName}
              onChange={(e) => setNewAttributeName(e.target.value)}
            />
            <select
              value={newAttributeType}
              onChange={(e) => setNewAttributeType(e.target.value as "text" | "number" | "date")}
              className="w-full border rounded px-2 py-1"
            >
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="date">Date</option>
            </select>
            <Button onClick={handleAddAttribute} className="w-full">
              <PlusIcon className="mr-2 h-4 w-4" /> Add Attribute
            </Button>
          </div>
        )}
        <div className="space-y-2">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={tab.id === activeTabId ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => useStore.getState().setActiveTab(tab.id)}
            >
              {tab.name}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function CrudComponent({ tabId }: { tabId: string }) {
  const { tabs, addItem, updateItem, deleteItem, deleteAttribute } = useStore()
  const tab = tabs.find((t) => t.id === tabId)
  const [newItem, setNewItem] = useState<Record<string, string>>({})
  const [editingItem, setEditingItem] = useState<Item | null>(null)

  if (!tab) return null

  const handleAddItem = () => {
    addItem(tabId, newItem)
    setNewItem({})
  }

  const handleUpdateItem = () => {
    if (editingItem) {
      updateItem(tabId, editingItem)
      setEditingItem(null)
    }
  }

  const handleDeleteItem = (itemId: string) => {
    deleteItem(tabId, itemId)
  }

  const handleDeleteAttribute = (attributeId: string) => {
    deleteAttribute(tabId, attributeId)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {tab.attributes.map((attr) => (
          <div key={attr.id} className="flex items-center space-x-1 bg-gray-100 rounded px-2 py-1">
            <span>{attr.name}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDeleteAttribute(attr.id)}
              className="h-4 w-4"
            >
              <XIcon className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
      <div className="flex space-x-2">
        {tab.attributes.map((attr) => (
          <Input
            key={attr.id}
            placeholder={attr.name}
            type={attr.type}
            value={newItem[attr.id] || ""}
            onChange={(e) => setNewItem({ ...newItem, [attr.id]: e.target.value })}
          />
        ))}
        <Button onClick={handleAddItem}>Add Item</Button>
      </div>
      <table className="w-full border-collapse border">
        <thead>
          <tr>
            {tab.attributes.map((attr) => (
              <th key={attr.id} className="border p-2">
                {attr.name}
              </th>
            ))}
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tab.items.map((item) => (
            <tr key={item.id}>
              {tab.attributes.map((attr) => (
                <td key={attr.id} className="border p-2">
                  {editingItem && editingItem.id === item.id ? (
                    <Input
                      type={attr.type}
                      value={editingItem[attr.id] || ""}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, [attr.id]: e.target.value })
                      }
                    />
                  ) : (
                    item[attr.id]
                  )}
                </td>
              ))}
              <td className="border p-2">
                {editingItem && editingItem.id === item.id ? (
                  <Button onClick={handleUpdateItem}>Save</Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button onClick={() => setEditingItem(item)}>
                      <Edit2Icon className="h-4 w-4" />
                    </Button>
                    <Button onClick={() => handleDeleteItem(item.id)}>
                      <Trash2Icon className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function DynamicCrudTabsComponent() {
  const { tabs, activeTabId } = useStore()

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-4 overflow-auto">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Dynamic CRUD Tabs</h1>
          {tabs.length > 0 ? (
            <Tabs value={activeTabId || undefined} onValueChange={(id) => useStore.getState().setActiveTab(id)}>
              <TabsList>
                {tabs.map((tab) => (
                  <TabsTrigger key={tab.id} value={tab.id}>
                    {tab.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              {tabs.map((tab) => (
                <TabsContent key={tab.id} value={tab.id}>
                  <CrudComponent tabId={tab.id} />
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <p>No tabs created yet. Use the sidebar to create a new tab.</p>
          )}
        </div>
      </div>
    </div>
  )
}