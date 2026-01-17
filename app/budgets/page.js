'use client'

import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import { Plus, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import AppLayout from '@/components/layout/AppLayout'
import BudgetCard from '@/components/budgets/BudgetCard'
import BudgetForm from '@/components/budgets/BudgetForm'
import { getUserSettings } from '@/lib/supabase/settings'
import { getBudgets, createBudget, updateBudget, deleteBudget } from '@/lib/supabase/budgets'

export default function BudgetsPage() {
  const [loading, setLoading] = useState(true)
  const [budgets, setBudgets] = useState([])
  const [currency, setCurrency] = useState('DOP')
  const [formOpen, setFormOpen] = useState(false)
  const [editingBudget, setEditingBudget] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    document.title = 'Fluxo App | Presupuestos'
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [budgetsData, settings] = await Promise.all([
        getBudgets(),
        getUserSettings()
      ])
      setBudgets(budgetsData)
      setCurrency(settings.currency)
    } catch (error) {
      console.error('Error al cargar presupuestos:', error)
      toast.error('Error al cargar los presupuestos')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (budgetData) => {
    try {
      await createBudget(budgetData)
      toast.success('Presupuesto creado exitosamente')
      await loadData()
    } catch (error) {
      console.error('Error al crear presupuesto:', error)
      if (error.message.includes('duplicate')) {
        toast.error('Ya existe un presupuesto con ese nombre para ese mes')
      } else {
        toast.error('Error al crear el presupuesto')
      }
      throw error
    }
  }

  const handleUpdate = async (budgetData) => {
    try {
      await updateBudget(editingBudget.id, budgetData)
      toast.success('Presupuesto actualizado exitosamente')
      setEditingBudget(null)
      await loadData()
    } catch (error) {
      console.error('Error al actualizar presupuesto:', error)
      toast.error('Error al actualizar el presupuesto')
      throw error
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este presupuesto?')) return

    try {
      await deleteBudget(id)
      toast.success('Presupuesto eliminado exitosamente')
      await loadData()
    } catch (error) {
      console.error('Error al eliminar presupuesto:', error)
      toast.error('Error al eliminar el presupuesto')
    }
  }

  const handleEdit = (budget) => {
    setEditingBudget(budget)
    setFormOpen(true)
  }

  const handleFormClose = () => {
    setFormOpen(false)
    setEditingBudget(null)
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando presupuestos...</p>
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
            <h1 className="text-3xl font-bold mb-2">Presupuestos</h1>
            <p className="text-muted-foreground">Controla tus gastos con presupuestos mensuales</p>
          </div>
          <Button onClick={() => setFormOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Crear Presupuesto
          </Button>
        </div>

        {/* Budgets Grid */}
        {budgets.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-lg border border-border">
            <Target className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No hay presupuestos creados</h3>
            <p className="text-muted-foreground mb-4">
              Crea presupuestos mensuales para controlar mejor tus gastos
            </p>
            <Button onClick={() => setFormOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Crear Presupuesto
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {budgets.map((budget) => (
              <BudgetCard
                key={budget.id}
                budget={budget}
                currency={currency}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Budget Form */}
      <BudgetForm
        open={formOpen}
        onOpenChange={handleFormClose}
        onSubmit={editingBudget ? handleUpdate : handleCreate}
        initialData={editingBudget}
      />
    </AppLayout>
  )
}
