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
    DialogTrigger,
    DialogDescription,
  } from '@/components/ui/dialog'
  import { Filter } from 'lucide-react'
  import { getCurrentMonth, getCurrentYear } from '@/lib/utils/dates'
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

  const ExpenseFilters = ({ onFilter, categories, paymentMethods }) => {
    const [open, setOpen] = useState(false)
    const [filters, setFilters] = useState({
      exactDate: '',
      startDate: '',
      endDate: '',
      categoryId: '',
      paymentMethodId: ''
    })

    const handleApplyFilters = () => {
      const activeFilters = {}
      
      if (filters.exactDate) activeFilters.exactDate = filters.exactDate
      if (filters.startDate) activeFilters.startDate = filters.startDate
      if (filters.endDate) activeFilters.endDate = filters.endDate
      if (filters.categoryId) activeFilters.categoryId = filters.categoryId
      if (filters.paymentMethodId) activeFilters.paymentMethodId = filters.paymentMethodId
      
      onFilter(activeFilters)
      setOpen(false)
    }

    const handleClearFilters = () => {
      setFilters({
        exactDate: '',
        startDate: '',
        endDate: '',
        categoryId: '',
        paymentMethodId: ''
      })
      onFilter({})
      setOpen(false)
    }

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Filter className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Filtros y Búsqueda</CardTitle>
                  <CardDescription>Refina tu búsqueda de gastos</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Parámetros de Búsqueda</DialogTitle>
            <DialogDescription>
              Aplica filtros para encontrar gastos específicos
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="exactDate">Fecha Exacta</Label>
              <Input
                id="exactDate"
                type="date"
                value={filters.exactDate}
                onChange={(e) => setFilters(prev => ({ ...prev, exactDate: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Rango de Fechas</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="startDate" className="text-xs">Desde</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate" className="text-xs">Hasta</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              <Select
                value={filters.categoryId}
                onValueChange={(value) => setFilters(prev => ({ ...prev, categoryId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas las categorías" />
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
                value={filters.paymentMethodId}
                onValueChange={(value) => setFilters(prev => ({ ...prev, paymentMethodId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los métodos" />
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
          <DialogFooter className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClearFilters}
            >
              Limpiar
            </Button>
            <Button onClick={handleApplyFilters}>
              Aplicar Filtros
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  export default ExpenseFilters
