'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from '@/components/ui/select'
import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { getDaysInMonth, getCurrentMonth, getCurrentYear, getMonthName } from '@/lib/utils/dates'

const NONE_BUDGET_VALUE = '__none__'

const ExpenseForm = ({ open, onOpenChange, onSubmit, categories, paymentMethods, budgets, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    day: '',
    month: getCurrentMonth().toString(),
    year: getCurrentYear().toString(),
    category_id: '',
    payment_method_id: '',
    budget_id: '',
    description: ''
  })
  const [loading, setLoading] = useState(false)
  const [daysInMonth, setDaysInMonth] = useState(31)

  useEffect(() => {
    if (initialData) {
      const date = new Date(initialData.expense_date)
      setFormData({
        name: initialData.name || '',
        amount: initialData.amount || '',
        day: date.getDate().toString(),
        month: (date.getMonth() + 1).toString(),
        year: date.getFullYear().toString(),
        category_id: initialData.category_id || '',
        payment_method_id: initialData.payment_method_id || '',
        budget_id: initialData.budget_id || NONE_BUDGET_VALUE,
        description: initialData.description || ''
      })
    } else {
      // Resetear al cerrar
      if (!open) {
        setFormData({
          name: '',
          amount: '',
          day: '',
          month: getCurrentMonth().toString(),
          year: getCurrentYear().toString(),
          category_id: '',
          payment_method_id: '',
          budget_id: '',
          description: ''
        })
      }
    }
  }, [initialData, open])

  useEffect(() => {
    const days = getDaysInMonth(parseInt(formData.month), parseInt(formData.year))
    setDaysInMonth(days)
    // Si el día actual es mayor que los días del mes, ajustar
    if (parseInt(formData.day) > days) {
      setFormData(prev => ({ ...prev, day: days.toString() }))
    }
  }, [formData.month, formData.year])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.amount || !formData.day) {
      toast.error('Por favor completa los campos obligatorios')
      return
    }
    
    setLoading(true)
    
    try {
      const expense_date = `${formData.year}-${formData.month.padStart(2, '0')}-${formData.day.padStart(2, '0')}`
      
      const expenseData = {
        name: formData.name,
        amount: parseFloat(formData.amount),
        expense_date,
        category_id: formData.category_id || null,
        payment_method_id: formData.payment_method_id || null,
        budget_id: formData.budget_id && formData.budget_id !== NONE_BUDGET_VALUE ? formData.budget_id : null,
        description: formData.description || null
      }
      
      await onSubmit(expenseData)
      onOpenChange(false)
    } catch (error) {
      console.error('Error al guardar gasto:', error)
      toast.error('Error al guardar el gasto')
    } finally {
      setLoading(false)
    }
  }

  const currentMonthBudgets = budgets?.filter(b => 
    b.month === parseInt(formData.month) && b.year === parseInt(formData.year)
  ) || []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Editar Gasto' : 'Registrar Gasto'}</DialogTitle>
          <DialogDescription>
            {initialData ? 'Modifica los detalles del gasto' : 'Completa los detalles del nuevo gasto'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Gasto *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ej: Supermercado"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Monto *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="0.00"
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Fecha *</Label>
            <div className="grid grid-cols-3 gap-2">
              <Select
                value={formData.day}
                onValueChange={(value) => setFormData(prev => ({ ...prev, day: value }))}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Día" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
                    <SelectItem key={day} value={day.toString()}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select
                value={formData.month}
                onValueChange={(value) => setFormData(prev => ({ ...prev, month: value }))}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Mes" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <SelectItem key={month} value={month.toString()}>
                      {getMonthName(month)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select
                value={formData.year}
                onValueChange={(value) => setFormData(prev => ({ ...prev, year: value }))}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Año" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 10 }, (_, i) => getCurrentYear() - 5 + i).map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Método de Pago</Label>
              <Select
                value={formData.payment_method_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, payment_method_id: value }))}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un método" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods?.map((method) => (
                    <SelectItem key={method.id} value={method.id}>
                      {method.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {currentMonthBudgets.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="budget">Asociar a Presupuesto (Opcional)</Label>
              <Select
                value={formData.budget_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, budget_id: value }))}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un presupuesto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE_BUDGET_VALUE}>Ninguno</SelectItem>
                  {currentMonthBudgets.map((budget) => (
                    <SelectItem key={budget.id} value={budget.id}>
                      {budget.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">Descripción (Opcional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Agrega notas o detalles adicionales..."
              rows={3}
              disabled={loading}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ExpenseForm
