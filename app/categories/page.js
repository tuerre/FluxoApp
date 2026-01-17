'use client'

import { toast } from 'sonner'
import { Plus, Tags } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import AppLayout from '@/components/layout/AppLayout'
import CategoryCard from '@/components/categories/CategoryCard'
import CategoryForm from '@/components/categories/CategoryForm'
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/lib/supabase/categories'

export default function CategoriesPage() {
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState([])
  const [formOpen, setFormOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)

  useEffect(() => {
    loadCategories()
  }, [])

  useEffect(() => {
    document.title = 'Fluxo App | Categorías'
  }, [])

  const loadCategories = async () => {
    try {
      setLoading(true)
      const data = await getCategories()
      setCategories(data)
    } catch (error) {
      console.error('Error al cargar categorías:', error)
      toast.error('Error al cargar las categorías')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (categoryData) => {
    try {
      await createCategory(categoryData)
      toast.success('Categoría creada exitosamente')
      await loadCategories()
    } catch (error) {
      console.error('Error al crear categoría:', error)
      if (error.message.includes('duplicate')) {
        toast.error('Ya existe una categoría con ese nombre')
      } else {
        toast.error('Error al crear la categoría')
      }
      throw error
    }
  }

  const handleUpdate = async (categoryData) => {
    try {
      await updateCategory(editingCategory.id, categoryData)
      toast.success('Categoría actualizada exitosamente')
      setEditingCategory(null)
      await loadCategories()
    } catch (error) {
      console.error('Error al actualizar categoría:', error)
      toast.error('Error al actualizar la categoría')
      throw error
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta categoría? Los gastos asociados perderán su categoría.')) return

    try {
      await deleteCategory(id)
      toast.success('Categoría eliminada exitosamente')
      await loadCategories()
    } catch (error) {
      console.error('Error al eliminar categoría:', error)
      toast.error('Error al eliminar la categoría')
    }
  }

  const handleEdit = (category) => {
    setEditingCategory(category)
    setFormOpen(true)
  }

  const handleFormClose = () => {
    setFormOpen(false)
    setEditingCategory(null)
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando categorías...</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Categorías</h1>
            <p className="text-muted-foreground">Organiza tus gastos por categorías</p>
          </div>
          <Button onClick={() => setFormOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Crear Categoría
          </Button>
        </div>

        {/* Categories Grid */}
        {categories.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-lg border border-border">
            <Tags className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No hay categorías creadas</h3>
            <p className="text-muted-foreground mb-4">
              Crea categorías para organizar mejor tus gastos
            </p>
            <Button onClick={() => setFormOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Crear Categoría
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Category Form */}
      <CategoryForm
        open={formOpen}
        onOpenChange={handleFormClose}
        onSubmit={editingCategory ? handleUpdate : handleCreate}
        initialData={editingCategory}
      />
    </AppLayout>
  )
}
