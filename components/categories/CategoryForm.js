'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from '@/components/ui/dialog'
import { toast } from 'sonner'

const PASTEL_COLORS = [
  { name: 'Rojo', value: '#FFB3BA' },
  { name: 'Amarillo', value: '#FFFFBA' },
  { name: 'Naranja', value: '#FFDFBA' },
  { name: 'Verde', value: '#BAFFC9' },
  { name: 'Azul', value: '#BAE1FF' },
  { name: 'Morado', value: '#E0BBE4' },
  { name: 'Rosado', value: '#FFD1DC' },
  { name: 'Celeste', value: '#C7CEEA' },
  { name: 'Azul Cielo', value: '#09f' },
]

const CategoryForm = ({ open, onOpenChange, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    color: initialData?.color || '#006239'
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name) {
      toast.error('El nombre de la categoría es obligatorio')
      return
    }
    
    setLoading(true)
    
    try {
      await onSubmit(formData)
      onOpenChange(false)
      setFormData({ name: '', description: '', color: '#006239' })
    } catch (error) {
      console.error('Error al guardar categoría:', error)
      toast.error('Error al guardar la categoría')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? 'Editar Categoría' : 'Crear Categoría'}</DialogTitle>
          <DialogDescription>
            {initialData ? 'Modifica los detalles de la categoría' : 'Crea una nueva categoría para organizar tus gastos'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ej: Alimentación"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción (Opcional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descripción de la categoría..."
              rows={3}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label>Color (Opcional)</Label>
            <div className="grid grid-cols-5 gap-2">
              {PASTEL_COLORS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  className={`h-10 rounded-md border-2 transition-all hover:scale-110 ${
                    formData.color === color.value ? 'border-primary ring-2 ring-primary' : 'border-border'
                  }`}
                  style={{ backgroundColor: color.value }}
                  onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                  disabled={loading}
                  title={color.name}
                />
              ))}
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <Input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                className="w-20 h-10"
                disabled={loading}
              />
              <span className="text-sm text-muted-foreground">{formData.color}</span>
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

export default CategoryForm
