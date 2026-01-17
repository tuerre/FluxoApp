'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
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
import { getCurrentMonth, getCurrentYear, getMonthName } from '@/lib/utils/dates'

const BudgetForm = ({ open, onOpenChange, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    amount: initialData?.amount || '',
    month: initialData?.month?.toString() || getCurrentMonth().toString(),
    year: initialData?.year?.toString() || getCurrentYear().toString()
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.amount) {
      toast.error('Por favor completa los campos obligatorios')
      return
    }
    
    setLoading(true)
    
    try {
      const budgetData = {
        name: formData.name,
        amount: parseFloat(formData.amount),
        month: parseInt(formData.month),
        year: parseInt(formData.year)
      }
      
      await onSubmit(budgetData)
      onOpenChange(false)
      setFormData({
        name: '',
        amount: '',
        month: getCurrentMonth().toString(),
        year: getCurrentYear().toString()
      })
    } catch (error) {
      console.error('Error al guardar presupuesto:', error)
      toast.error('Error al guardar el presupuesto')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? 'Editar Presupuesto' : 'Crear Presupuesto'}</DialogTitle>
          <DialogDescription>
            {initialData ? 'Modifica los detalles del presupuesto' : 'Crea un nuevo presupuesto mensual'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ej: Presupuesto General"
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="month">Mes *</Label>
              <Select
                value={formData.month}
                onValueChange={(value) => setFormData(prev => ({ ...prev, month: value }))}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona mes" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <SelectItem key={month} value={month.toString()}>
                      {getMonthName(month)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="year">Año *</Label>
              <Select
                value={formData.year}
                onValueChange={(value) => setFormData(prev => ({ ...prev, year: value }))}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona año" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 5 }, (_, i) => getCurrentYear() - 1 + i).map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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

export default BudgetForm
