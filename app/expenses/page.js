'use client'

import { useEffect, useState } from 'react'
import AppLayout from '@/components/layout/AppLayout'
import StatsCard from '@/components/dashboard/StatsCard'
import ExpenseForm from '@/components/expenses/ExpenseForm'
import ExpenseFilters from '@/components/expenses/ExpenseFilters'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getExpenses, createExpense, updateExpense, deleteExpense } from '@/lib/supabase/expenses'
import { getCategories } from '@/lib/supabase/categories'
import { getPaymentMethods } from '@/lib/supabase/payment-methods'
import { getBudgets } from '@/lib/supabase/budgets'
import { getUserSettings } from '@/lib/supabase/settings'
import { formatCurrency } from '@/lib/utils/currency'
import { formatDate } from '@/lib/utils/dates'
import { Wallet, TrendingUp, Plus, Upload, MoreVertical, Edit, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

export default function ExpensesPage() {
  const [loading, setLoading] = useState(true)
  const [expenses, setExpenses] = useState([])
  const [filteredExpenses, setFilteredExpenses] = useState([])
  const [categories, setCategories] = useState([])
  const [paymentMethods, setPaymentMethods] = useState([])
  const [budgets, setBudgets] = useState([])
  const [currency, setCurrency] = useState('DOP')
  const [formOpen, setFormOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const [activeFilters, setActiveFilters] = useState({})

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    document.title = 'Fluxo App | Mis Gastos'
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [expensesData, categoriesData, paymentMethodsData, budgetsData, settings] = await Promise.all([
        getExpenses(),
        getCategories(),
        getPaymentMethods(),
        getBudgets(),
        getUserSettings()
      ])

      setExpenses(expensesData)
      setFilteredExpenses(expensesData)
      setCategories(categoriesData)
      setPaymentMethods(paymentMethodsData)
      setBudgets(budgetsData)
      setCurrency(settings.currency)
    } catch (error) {
      console.error('Error al cargar datos:', error)
      toast.error('Error al cargar los datos')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateExpense = async (expenseData) => {
    try {
      await createExpense(expenseData)
      toast.success('Gasto creado exitosamente')
      await loadData()
    } catch (error) {
      console.error('Error al crear gasto:', error)
      throw error
    }
  }

  const handleUpdateExpense = async (expenseData) => {
    try {
      await updateExpense(editingExpense.id, expenseData)
      toast.success('Gasto actualizado exitosamente')
      setEditingExpense(null)
      await loadData()
    } catch (error) {
      console.error('Error al actualizar gasto:', error)
      throw error
    }
  }

  const handleDeleteExpense = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este gasto?')) return

    try {
      await deleteExpense(id)
      toast.success('Gasto eliminado exitosamente')
      await loadData()
    } catch (error) {
      console.error('Error al eliminar gasto:', error)
      toast.error('Error al eliminar el gasto')
    }
  }

  const handleFilter = async (filters) => {
    setActiveFilters(filters)
    try {
      const filtered = await getExpenses(filters)
      setFilteredExpenses(filtered)
    } catch (error) {
      console.error('Error al filtrar gastos:', error)
      toast.error('Error al aplicar filtros')
    }
  }

  const handleEdit = (expense) => {
    setEditingExpense(expense)
    setFormOpen(true)
  }

  const handleFormClose = () => {
    setFormOpen(false)
    setEditingExpense(null)
  }

  const totalSpent = filteredExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0)

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando gastos...</p>
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
            <h1 className="text-3xl font-bold mb-2">Gastos</h1>
            <p className="text-muted-foreground">Gestiona y controla todos tus gastos</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatsCard
            title="Total Gastado"
            value={formatCurrency(totalSpent, currency)}
            subtitle={Object.keys(activeFilters).length > 0 ? 'Con filtros aplicados' : 'Todos los gastos'}
            icon={Wallet}
          />
          <StatsCard
            title="Transacciones"
            value={filteredExpenses.length}
            subtitle="Total de gastos"
            icon={TrendingUp}
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={() => setFormOpen(true)} className="flex-1 sm:flex-none">
            <Plus className="w-4 h-4 mr-2" />
            Registrar Gasto
          </Button>
          <Button variant="outline" className="flex-1 sm:flex-none">
            <Upload className="w-4 h-4 mr-2" />
            Importar Gastos
          </Button>
        </div>

        {/* Filters */}
        <ExpenseFilters
          onFilter={handleFilter}
          categories={categories}
          paymentMethods={paymentMethods}
        />

        {/* Expenses List */}
        <div className="space-y-3">
          {filteredExpenses.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-lg border border-border">
              <Wallet className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No hay gastos registrados</h3>
              <p className="text-muted-foreground mb-4">
                {Object.keys(activeFilters).length > 0
                  ? 'No se encontraron gastos con los filtros aplicados'
                  : 'Comienza registrando tu primer gasto'}
              </p>
              {Object.keys(activeFilters).length === 0 && (
                <Button onClick={() => setFormOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Registrar Primer Gasto
                </Button>
              )}
            </div>
          ) : (
            filteredExpenses.map((expense) => (
              <div
                key={expense.id}
                className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: expense.category?.color || '#006239' }}
                    >
                      <span className="text-black upperlower font-bold text-lg">
                        {expense.category?.name?.charAt(0).toUpperCase() || 'G'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-normal text-lg">{expense.name}</h3>
                          <p className="text-2xl font-medium text-primary">
                            {formatCurrency(expense.amount, currency)}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">
                          {formatDate(expense.expense_date)}
                        </Badge>
                        {expense.category && (
                          <Badge
                            style={{
                              backgroundColor: 'transparent',
                              color: expense.category.color,
                              borderColor: expense.category.color
                            }}
                          >
                            {expense.category.name}
                          </Badge>
                        )}
                        {expense.payment_method && (
                          <Badge variant="secondary">
                            {expense.payment_method.name}
                          </Badge>
                        )}
                      </div>
                      {expense.description && (
                        <p className="text-sm text-muted-foreground mt-2">
                          {expense.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="flex-shrink-0">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(expense)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteExpense(expense.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Expense Form */}
      <ExpenseForm
        open={formOpen}
        onOpenChange={handleFormClose}
        onSubmit={editingExpense ? handleUpdateExpense : handleCreateExpense}
        categories={categories}
        paymentMethods={paymentMethods}
        budgets={budgets}
        initialData={editingExpense}
      />
    </AppLayout>
  )
}
